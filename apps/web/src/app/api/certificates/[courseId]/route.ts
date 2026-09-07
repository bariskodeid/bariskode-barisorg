import { renderToBuffer } from '@react-pdf/renderer'
import { NextRequest, NextResponse } from 'next/server'

import { CertificateDocument } from '@/lib/certificate/CertificateDocument'
import { getCourseProgress } from '@/lib/getCourseProgress'
import { getPayload } from '@/lib/payload'
import { checkRateLimit } from '@/lib/rateLimit'

// Lihat docs/18-FEATURE-CERTIFICATES.md. Pola sama seperti /api/progress dan
// /api/sandbox: auth gate, rate limit, overrideAccess:false+user eksplisit
// supaya access control Certificates.ts tetap satu-satunya sumber kebenaran.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { allowed, retryAfterMs } = checkRateLimit(`certificate:${user.id}`, {
    limit: 10,
    windowMs: 60_000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak request, coba lagi sebentar lagi.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    )
  }

  const { courseId: courseIdParam } = await params
  const courseId = Number(courseIdParam)
  if (!Number.isInteger(courseId)) {
    return NextResponse.json({ error: 'courseId tidak valid' }, { status: 400 })
  }

  const course = await payload
    .findByID({ collection: 'courses', id: courseId, overrideAccess: false, user })
    .catch(() => null)
  if (!course) {
    return NextResponse.json({ error: 'Course tidak ditemukan' }, { status: 404 })
  }

  const progress = await getCourseProgress(payload, user, courseId)
  if (progress.percentage < 100) {
    return NextResponse.json({ error: 'Course belum selesai 100%.' }, { status: 403 })
  }

  const existing = await payload.find({
    collection: 'certificates',
    where: { and: [{ user: { equals: user.id } }, { course: { equals: courseId } }] },
    limit: 1,
    overrideAccess: false,
    user,
  })

  const certificate =
    existing.docs[0] ??
    (await payload.create({
      collection: 'certificates',
      data: { user: user.id, course: courseId, issuedAt: new Date().toISOString() },
      overrideAccess: false,
      user,
    }))

  try {
    const buffer = await renderToBuffer(
      CertificateDocument({
        studentName: user.name,
        courseTitle: course.title,
        issuedAt: certificate.issuedAt,
      }),
    )

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sertifikat-${course.slug}.pdf"`,
      },
    })
  } catch (err) {
    payload.logger.error({ err }, '[certificate] gagal render PDF')
    return NextResponse.json({ error: 'Gagal membuat sertifikat, coba lagi.' }, { status: 500 })
  }
}
