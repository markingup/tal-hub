import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/utils/logger'

/**
 * Middleware for Route Protection
 * 
 * Follows UNIX principles:
 * - Single responsibility: Protect authenticated routes
 * - Simple over complex: Clear path-based protection logic
 * - Text as interface: URL paths as the interface
 * 
 * Features:
 * - Protects /dashboard/* routes
 * - Allows public access to auth routes
 * - Refreshes auth session automatically
 * - Redirects unauthenticated users to sign-in
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/onboarding']
  const authRoutes = ['/auth/sign-in', '/auth/callback']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding')

  // Redirect logic
  if (isProtectedRoute && !user) {
    // Redirect to sign-in if accessing protected route without auth
    const redirectUrl = new URL('/auth/sign-in', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    // Redirect to dashboard if accessing auth routes while authenticated
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Handle onboarding route logic
  if (isOnboardingRoute && user) {
    // Check if user has completed onboarding
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()

      // If profile is complete, redirect to dashboard
      if (profile?.full_name && profile?.phone) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      logger.error('Error checking profile in middleware', error)
      // If there&apos;s an error, allow access to onboarding
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}