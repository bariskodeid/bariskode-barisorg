import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "lessons_quiz_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"is_correct" boolean DEFAULT false
  );
  
  CREATE TABLE "lessons_quiz_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar
  );
  
  ALTER TABLE "lessons" ADD COLUMN "has_quiz" boolean DEFAULT false;
  ALTER TABLE "lessons_quiz_questions_options" ADD CONSTRAINT "lessons_quiz_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons_quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_quiz_questions" ADD CONSTRAINT "lessons_quiz_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "lessons_quiz_questions_options_order_idx" ON "lessons_quiz_questions_options" USING btree ("_order");
  CREATE INDEX "lessons_quiz_questions_options_parent_id_idx" ON "lessons_quiz_questions_options" USING btree ("_parent_id");
  CREATE INDEX "lessons_quiz_questions_order_idx" ON "lessons_quiz_questions" USING btree ("_order");
  CREATE INDEX "lessons_quiz_questions_parent_id_idx" ON "lessons_quiz_questions" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "lessons_quiz_questions_options" CASCADE;
  DROP TABLE "lessons_quiz_questions" CASCADE;
  ALTER TABLE "lessons" DROP COLUMN "has_quiz";`)
}
