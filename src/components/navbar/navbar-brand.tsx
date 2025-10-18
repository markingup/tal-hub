import Link from 'next/link'
import { navigationConfig } from '@/lib/config/navigation'

/**
 * NavbarBrand Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Brand display only
 * - Simple over complex: Clean logo/brand presentation
 * - Work together: Composes with navigation config
 */

interface NavbarBrandProps {
  className?: string
}

export function NavbarBrand({ className = '' }: NavbarBrandProps) {
  return (
    <Link 
      href={navigationConfig.brand.href}
      className={`flex items-center space-x-2 font-bold hover:opacity-80 transition-opacity ${className}`}
    >
      <span className="text-xl">
        {navigationConfig.brand.name}
      </span>
    </Link>
  )
}
