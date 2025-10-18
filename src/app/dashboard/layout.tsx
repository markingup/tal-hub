'use client'

import { UniversalNavbar } from '@/components/navbar'

/**
 * Dashboard Layout
 * 
 * Follows UNIX principles:
 * - Single responsibility: Dashboard layout only
 * - Simple over complex: Uses universal navbar
 * - Work together: Composes with universal navigation
 * 
 * Features:
 * - Universal navbar with auth-aware navigation
 * - Clean content area
 * - Responsive design
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <UniversalNavbar />
      
      {/* Main content */}
      <main className="py-6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
