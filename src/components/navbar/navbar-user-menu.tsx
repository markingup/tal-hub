'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/auth-provider'
import { User, LogOut, ChevronDown } from 'lucide-react'

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

  if (!user) {
    return null
  }

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
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
