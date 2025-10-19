'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/auth-provider'
import { useI18n } from '@/components/i18n-provider'
import { User, LogOut, ChevronDown, LogIn } from 'lucide-react'
import Link from 'next/link'

/**
 * NavbarUserMenu Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: User menu and auth actions only
 * - Work together: Composes with auth provider
 * - KISS: Simple dropdown with essential actions
 */

interface NavbarUserMenuProps {
  className?: string
}

export function NavbarUserMenu({ className = '' }: NavbarUserMenuProps) {
  const { user, signOut } = useAuth()
  const { t } = useI18n()

  // Show Sign In/Sign Up buttons for unauthenticated users
  if (!user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button variant="ghost" asChild>
          <Link href="/auth/sign-in">
            <LogIn className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">{t('common.signIn')}</span>
          </Link>
        </Button>
        <Button asChild>
          <Link href="/auth/sign-up">
            {t('common.signUp')}
          </Link>
        </Button>
      </div>
    )
  }

  // Show user menu for authenticated users
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline-block truncate max-w-32">
              {user.email}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('common.signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
