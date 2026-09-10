import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar DEFAULT 'bariskode.org' NOT NULL,
      "site_description" varchar,
      "logo_id" integer,
      "favicon_id" integer,
      "github" varchar,
      "twitter" varchar,
      "discord" varchar,
      "youtube" varchar,
      "copyright_text" varchar,
      "footer_tagline" varchar,
      "maintenance_mode" boolean DEFAULT false,
      "maintenance_message" varchar,
      "enable_sandbox" boolean DEFAULT true,
      "ctfd_enabled" boolean DEFAULT true,
      "judge0_api_url" varchar,
      "ctfd_url" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "settings" ADD CONSTRAINT "settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");
    CREATE INDEX "settings_favicon_idx" ON "settings" USING btree ("favicon_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "settings";
  `)
}
