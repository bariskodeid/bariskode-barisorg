import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "lessons" SET "sandbox_language" = LOWER("sandbox_language") WHERE "sandbox_language" IS NOT NULL;
    CREATE TYPE "public"."enum_lessons_sandbox_language" AS ENUM('bash', 'c', 'cpp', 'go', 'java', 'javascript', 'php', 'python', 'ruby', 'rust', 'sql', 'typescript');
    ALTER TABLE "lessons" ALTER COLUMN "sandbox_language" SET DATA TYPE "public"."enum_lessons_sandbox_language" USING "sandbox_language"::"public"."enum_lessons_sandbox_language";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "lessons" ALTER COLUMN "sandbox_language" SET DATA TYPE varchar;
    DROP TYPE "public"."enum_lessons_sandbox_language";
  `)
}
