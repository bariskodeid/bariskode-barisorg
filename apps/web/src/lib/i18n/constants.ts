// Dipisah dari getLocale.ts (yang import next/headers, server-only) supaya
// LocaleContext.tsx (client component) bisa pakai nama cookie yang sama
// tanpa menarik next/headers ke client bundle.
export const LOCALE_COOKIE = 'locale'
