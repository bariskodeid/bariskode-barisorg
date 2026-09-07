import type { FieldHook } from 'payload'

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

// Auto-generate `slug` dari field lain (biasanya `title`) kalau slug belum
// diisi manual. Lihat catatan implementasi di docs/04-DATA-MODEL.md.
export const formatSlugHook =
  (fallbackField: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return formatSlug(value)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackValue = data?.[fallbackField]

      if (fallbackValue && typeof fallbackValue === 'string') {
        return formatSlug(fallbackValue)
      }
    }

    return value
  }
