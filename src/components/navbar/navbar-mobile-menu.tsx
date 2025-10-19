'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { getMobileNavigationItems } from '@/lib/config/navigation'
import { useI18n } from '@/components/i18n-provider'
import { Menu } from 'lucide-react'

/**
 * NavbarMobileMenu Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Mobile navigation only
 * - Work together: Composes with auth state and routing
 * - KISS: Simple slide-out menu
 */

interface NavbarMobileMenuProps {
  isAuthenticated: boolean
  className?: string
}

export function NavbarMobileMenu({ isAuthenticated, className = '' }: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const items = getMobileNavigationItems(isAuthenticated)
  const { t } = useI18n()

  return (
    <div className={cn('md:hidden', className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center px-6 border-b">
              <h1 className="text-xl font-semibold">{t('brand.name')}</h1>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                const displayName = item.nameKey ? t(item.nameKey) : item.name
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {displayName}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
