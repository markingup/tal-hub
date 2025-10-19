'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Locale, defaultLocale, getLocaleFromPathname, addLocaleToPathname } from '@/lib/i18n'

interface TranslationMessages {
  [key: string]: string | TranslationMessages | string[]
}

/**
 * I18nProvider Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Language state management only
 * - Work together: Composes with Next.js routing
 * - KISS: Simple language switching with URL persistence
 */

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string | string[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
}

// Load messages dynamically
async function loadMessages(locale: Locale) {
  try {
    const messages = await import(`@/messages/${locale}.json`)
    return messages.default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // Fallback to English
    const fallbackMessages = await import(`@/messages/en.json`)
    return fallbackMessages.default
  }
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [messages, setMessages] = useState<TranslationMessages>({})
  const pathname = usePathname()
  const router = useRouter()

  // Initialize locale from pathname
  useEffect(() => {
    const pathLocale = getLocaleFromPathname(pathname)
    if (pathLocale !== locale) {
      setLocaleState(pathLocale)
    }
  }, [pathname, locale])

  // Load messages when locale changes
  useEffect(() => {
    loadMessages(locale).then(setMessages)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    
    setLocaleState(newLocale)
    
    // Update URL with new locale
    const newPathname = addLocaleToPathname(pathname, newLocale)
    router.push(newPathname)
  }

  const t = (key: string): string | string[] => {
    const keys = key.split('.')
    let value: string | TranslationMessages | string[] = messages
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to key if translation not found
        return key
      }
    }
    
    // Return the value as-is if it's a string or array, otherwise return the key
    if (typeof value === 'string' || Array.isArray(value)) {
      return value
    }
    
    return key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
