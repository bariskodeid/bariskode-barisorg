import * as migration_20260907_041003_initial_schema from './20260907_041003_initial_schema';
import * as migration_20260907_050457_add_seo_meta_fields from './20260907_050457_add_seo_meta_fields';
import * as migration_20260907_113841_add_certificates_collection from './20260907_113841_add_certificates_collection';
import * as migration_20260907_114625_add_lesson_quiz_fields from './20260907_114625_add_lesson_quiz_fields';

export const migrations = [
  {
    up: migration_20260907_041003_initial_schema.up,
    down: migration_20260907_041003_initial_schema.down,
    name: '20260907_041003_initial_schema',
  },
  {
    up: migration_20260907_050457_add_seo_meta_fields.up,
    down: migration_20260907_050457_add_seo_meta_fields.down,
    name: '20260907_050457_add_seo_meta_fields',
  },
  {
    up: migration_20260907_113841_add_certificates_collection.up,
    down: migration_20260907_113841_add_certificates_collection.down,
    name: '20260907_113841_add_certificates_collection',
  },
  {
    up: migration_20260907_114625_add_lesson_quiz_fields.up,
    down: migration_20260907_114625_add_lesson_quiz_fields.down,
    name: '20260907_114625_add_lesson_quiz_fields'
  },
];
