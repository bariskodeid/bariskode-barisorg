import type { Payload } from 'payload'

import type { Course } from '../../src/payload-types'
import type { CourseDef } from './course-def'
import { markdownToLexical } from './markdown-lexical'

type RichText = NonNullable<Course['description']>

// Payload meminta bentuk rich text hasil generate type (index signature), bukan
// SerializedEditorState milik Lexical; struktur runtime-nya sama.
const toRichText = (markdown: string | string[]) => markdownToLexical(markdown) as RichText

export type SeedCourseResult = {
  /** Jumlah dokumen course + module + lesson yang baru dibuat (kategori tidak dihitung). */
  created: number
  /** Jumlah dokumen course + module + lesson yang sudah ada dan di-update. */
  updated: number
  /** Slug lesson milik course ini di DB yang tidak ada lagi di definisi (tidak dihapus). */
  orphanedLessonSlugs: string[]
}

/**
 * Seed idempoten sebuah course: upsert berdasarkan slug (course/lesson) dan (course, order)
 * (module). ID lesson tetap stabil di antara run sehingga `Progress`/`Bookmarks` yang
 * menunjuk lesson tidak putus. Tidak pernah menghapus apa pun dan tidak menyentuh
 * `Courses.status` pada course yang sudah ada.
 */
export async function seedCourse(payload: Payload, def: CourseDef): Promise<SeedCourseResult> {
  let created = 0
  let updated = 0

  const existingCategory = await payload.find({
    collection: 'categories',
    where: { slug: { equals: def.category.slug } },
    limit: 1,
  })
  const category =
    existingCategory.docs[0] ??
    (await payload.create({
      collection: 'categories',
      data: { name: def.category.name, slug: def.category.slug },
    }))

  // Deskripsi kosong = "belum ditulis": field dibiarkan apa adanya (jangan timpa deskripsi
  // yang sudah diisi lewat admin, jangan tulis rich text kosong).
  const description = def.description ? { description: toRichText(def.description) } : {}

  const existingCourse = await payload.find({
    collection: 'courses',
    where: { slug: { equals: def.slug } },
    limit: 1,
  })
  let course = existingCourse.docs[0]
  if (course) {
    // `status` sengaja tidak ikut di-update.
    course = await payload.update({
      collection: 'courses',
      id: course.id,
      data: { title: def.title, category: category.id, level: def.level, ...description },
    })
    updated += 1
  } else {
    course = await payload.create({
      collection: 'courses',
      data: {
        title: def.title,
        slug: def.slug,
        category: category.id,
        level: def.level,
        status: 'published',
        ...description,
      },
    })
    created += 1
  }

  const defLessonSlugs = new Set<string>()

  for (let moduleIndex = 0; moduleIndex < def.modules.length; moduleIndex++) {
    const moduleDef = def.modules[moduleIndex]
    const order = moduleIndex + 1

    const existingModule = await payload.find({
      collection: 'modules',
      where: { and: [{ course: { equals: course.id } }, { order: { equals: order } }] },
      limit: 1,
    })
    let mod = existingModule.docs[0]
    if (mod) {
      mod = await payload.update({
        collection: 'modules',
        id: mod.id,
        data: { title: moduleDef.title },
      })
      updated += 1
    } else {
      mod = await payload.create({
        collection: 'modules',
        data: { title: moduleDef.title, course: course.id, order },
      })
      created += 1
    }

    for (let lessonIndex = 0; lessonIndex < moduleDef.lessons.length; lessonIndex++) {
      const lessonDef = moduleDef.lessons[lessonIndex]
      defLessonSlugs.add(lessonDef.slug)

      const data = {
        title: lessonDef.title,
        module: mod.id,
        order: lessonIndex + 1,
        content: toRichText(lessonDef.content),
        hasSandbox: Boolean(lessonDef.hasSandbox),
        sandboxLanguage: lessonDef.hasSandbox ? def.sandboxLanguage : null,
        sandboxStarterCode: lessonDef.hasSandbox ? (lessonDef.sandboxStarterCode ?? null) : null,
        hasQuiz: Boolean(lessonDef.hasQuiz),
        quizQuestions: lessonDef.hasQuiz ? (lessonDef.quizQuestions ?? []) : [],
      }

      // depth 1 supaya `module` ter-populate (dipakai untuk memastikan lesson ini memang
      // milik course yang sedang di-seed).
      const existingLesson = await payload.find({
        collection: 'lessons',
        where: { slug: { equals: lessonDef.slug } },
        limit: 1,
        depth: 1,
      })
      const lesson = existingLesson.docs[0]
      if (lesson) {
        const owner = typeof lesson.module === 'object' ? lesson.module.course : undefined
        const ownerId = typeof owner === 'object' ? owner.id : owner
        if (ownerId !== course.id) {
          throw new Error(
            `Slug lesson "${lessonDef.slug}" sudah dipakai lesson di course lain (id course ${ownerId}); ` +
              `tidak di-upsert supaya lesson course lain tidak terpindah.`,
          )
        }
        await payload.update({ collection: 'lessons', id: lesson.id, data })
        updated += 1
      } else {
        await payload.create({ collection: 'lessons', data: { ...data, slug: lessonDef.slug } })
        created += 1
      }
    }
  }

  // Sisa di DB yang tidak ada di definisi: dilaporkan, bukan dihapus (menghapus lesson akan
  // memutus Progress/Bookmarks user).
  const courseModules = await payload.find({
    collection: 'modules',
    where: { course: { equals: course.id } },
    limit: 0,
    pagination: false,
  })
  const extraModules = courseModules.docs.filter((m) => m.order > def.modules.length)
  for (const m of extraModules) {
    console.warn(
      `[seed] Module "${m.title}" (order ${m.order}) di course "${def.slug}" tidak ada di definisi; tidak dihapus.`,
    )
  }

  const courseLessons = courseModules.docs.length
    ? await payload.find({
        collection: 'lessons',
        where: { module: { in: courseModules.docs.map((m) => m.id) } },
        limit: 0,
        pagination: false,
      })
    : { docs: [] }
  const orphanedLessonSlugs = courseLessons.docs
    .map((l) => l.slug)
    .filter((slug) => !defLessonSlugs.has(slug))
  for (const slug of orphanedLessonSlugs) {
    console.warn(
      `[seed] Lesson "${slug}" ada di DB (course "${def.slug}") tapi tidak ada di definisi; tidak dihapus.`,
    )
  }

  return { created, updated, orphanedLessonSlugs }
}
