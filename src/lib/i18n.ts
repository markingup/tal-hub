/**
 * Internationalization Configuration
 * 
 * Follows UNIX principles:
 * - Single responsibility: Language configuration only
 * - Text as interface: JSON structure for translations
 * - Work together: Composable with components
 * - KISS: Simple language switching
 */

export const locales = ['en', 'fr'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  
  if (isValidLocale(firstSegment)) {
    return firstSegment
  }
  
  return defaultLocale
}

export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  
  if (isValidLocale(firstSegment)) {
    return '/' + segments.slice(2).join('/')
  }
  
  return pathname
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname)
  
  if (locale === defaultLocale) {
    return pathWithoutLocale === '/' ? '/' : pathWithoutLocale
  }
  
  return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
}
