import { cookies } from 'next/headers'

import { LOCALE_COOKIE } from './constants'
import { type Locale, locales } from './dictionaries'

// Dipakai server component (RootLayout & tiap page) untuk baca preferensi
// bahasa dari cookie yang di-set LocaleSwitcher (client). Default 'id'.
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return locales.includes(value as Locale) ? (value as Locale) : 'id'
}
