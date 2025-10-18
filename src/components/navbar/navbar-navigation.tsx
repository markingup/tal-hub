'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getNavigationItems } from '@/lib/config/navigation'

/**
 * NavbarNavigation Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Desktop navigation only
 * - Work together: Composes with auth state and routing
 * - Text as interface: Uses navigation config
 * - KISS: Simple link rendering with active states
 */

interface NavbarNavigationProps {
  isAuthenticated: boolean
  className?: string
}

export function NavbarNavigation({ isAuthenticated, className = '' }: NavbarNavigationProps) {
  const pathname = usePathname()
  const items = getNavigationItems(isAuthenticated)

  return (
    <nav className={cn('hidden md:flex items-center space-x-6', className)}>
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-foreground/80',
              isActive 
                ? 'text-foreground' 
                : 'text-foreground/60'
            )}
          >
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
