'use client'

import { useAuth } from '@/components/auth-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { NavbarBrand } from './navbar-brand'
import { NavbarNavigation } from './navbar-navigation'
import { NavbarUserMenu } from './navbar-user-menu'
import { NavbarMobileMenu } from './navbar-mobile-menu'

/**
 * UniversalNavbar Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Universal navigation across all pages
 * - Work together: Composes focused sub-components
 * - KISS: Centered, clean layout
 * - Rule of Economy: Reusable across public and authenticated pages
 * 
 * Features:
 * - Centered layout with max-width container
 * - Auth-aware navigation items
 * - Responsive mobile menu
 * - Consistent 64px height
 * - Sticky positioning with backdrop blur
 */

interface UniversalNavbarProps {
  className?: string
}

export function UniversalNavbar({ className = '' }: UniversalNavbarProps) {
  const { user } = useAuth()
  const isAuthenticated = !!user

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center">
            <NavbarBrand />
          </div>

          {/* Center: Navigation (Desktop) */}
          <div className="flex-1 flex justify-center">
            <NavbarNavigation isAuthenticated={isAuthenticated} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <NavbarMobileMenu isAuthenticated={isAuthenticated} />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu */}
            <NavbarUserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
