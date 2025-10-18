import type { LucideIcon } from 'lucide-react'
import { 
  LayoutDashboard, 
  FileText, 
  Home, 
  Info, 
  BookOpen, 
  HelpCircle,
  Shield,
  FileText as TermsIcon
} from 'lucide-react'

/**
 * Navigation Configuration
 * 
 * Follows UNIX principles:
 * - Single responsibility: Pure configuration data
 * - Text as interface: JSON structure for routes
 * - Work together: Composable with components
 * - KISS: Simple, readable structure
 */

export interface NavigationItem {
  name: string
  href: string
  icon?: LucideIcon
  requiresAuth?: boolean
  public?: boolean
  mobile?: boolean
  description?: string
}

export interface NavigationConfig {
  brand: {
    name: string
    href: string
    logo?: LucideIcon
  }
  public: NavigationItem[]
  authenticated: NavigationItem[]
  mobile: NavigationItem[]
}

export const navigationConfig: NavigationConfig = {
  brand: {
    name: 'Tal Hub',
    href: '/',
  },
  public: [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      public: true,
      mobile: true,
      description: 'Return to homepage'
    },
    {
      name: 'About',
      href: '/about',
      icon: Info,
      public: true,
      mobile: true,
      description: 'Learn about Tal Hub'
    },
    {
      name: 'Docs',
      href: '/docs',
      icon: BookOpen,
      public: true,
      mobile: true,
      description: 'Documentation and guides'
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      public: true,
      mobile: true,
      description: 'Get help and support'
    }
  ],
  authenticated: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      requiresAuth: true,
      mobile: true,
      description: 'Main dashboard overview'
    },
    {
      name: 'My Cases',
      href: '/dashboard/cases',
      icon: FileText,
      requiresAuth: true,
      mobile: true,
      description: 'View and manage your cases'
    }
  ],
  mobile: [
    {
      name: 'Privacy',
      href: '/privacy',
      icon: Shield,
      public: true,
      mobile: true,
      description: 'Privacy policy'
    },
    {
      name: 'Terms',
      href: '/terms',
      icon: TermsIcon,
      public: true,
      mobile: true,
      description: 'Terms of service'
    }
  ]
}

/**
 * Get navigation items based on authentication state
 */
export function getNavigationItems(isAuthenticated: boolean): NavigationItem[] {
  const items: NavigationItem[] = []
  
  // Always include public items
  items.push(...navigationConfig.public)
  
  // Include authenticated items if user is logged in
  if (isAuthenticated) {
    items.push(...navigationConfig.authenticated)
  }
  
  return items
}

/**
 * Get mobile navigation items
 */
export function getMobileNavigationItems(isAuthenticated: boolean): NavigationItem[] {
  const items: NavigationItem[] = []
  
  // Include all items that are marked for mobile
  items.push(...navigationConfig.public.filter(item => item.mobile))
  
  if (isAuthenticated) {
    items.push(...navigationConfig.authenticated.filter(item => item.mobile))
  }
  
  // Always include mobile-specific items
  items.push(...navigationConfig.mobile)
  
  return items
}

/**
 * Check if a route requires authentication
 */
export function requiresAuth(href: string): boolean {
  return navigationConfig.authenticated.some(item => item.href === href)
}

/**
 * Get all navigation items (for search, etc.)
 */
export function getAllNavigationItems(): NavigationItem[] {
  return [
    ...navigationConfig.public,
    ...navigationConfig.authenticated,
    ...navigationConfig.mobile
  ]
}
