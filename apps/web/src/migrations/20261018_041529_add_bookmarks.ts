import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "bookmarks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"lesson_id" integer NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bookmarks_id" integer;
  ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "bookmarks_user_idx" ON "bookmarks" USING btree ("user_id");
  CREATE INDEX "bookmarks_lesson_idx" ON "bookmarks" USING btree ("lesson_id");
  CREATE INDEX "bookmarks_updated_at_idx" ON "bookmarks" USING btree ("updated_at");
  CREATE UNIQUE INDEX "user_lesson_1_idx" ON "bookmarks" USING btree ("user_id","lesson_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookmarks_fk" FOREIGN KEY ("bookmarks_id") REFERENCES "public"."bookmarks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_bookmarks_id_idx" ON "payload_locked_documents_rels" USING btree ("bookmarks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bookmarks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "bookmarks" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bookmarks_fk";
  
  DROP INDEX "payload_locked_documents_rels_bookmarks_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bookmarks_id";`)
}
