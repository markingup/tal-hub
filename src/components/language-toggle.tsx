'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useI18n } from '@/components/i18n-provider'
import { Languages, Check } from 'lucide-react'
import { Locale, locales } from '@/lib/i18n'

/**
 * LanguageToggle Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Language switching only
 * - Work together: Composes with i18n provider
 * - KISS: Simple dropdown with language options
 */

interface LanguageToggleProps {
  className?: string
}

const languageLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français'
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { locale, setLocale } = useI18n()

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Languages className="h-4 w-4" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {locales.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLocale(lang)}
              className="flex items-center justify-between"
            >
              <span>{languageLabels[lang]}</span>
              {locale === lang && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
