import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Get the token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  })

  const { pathname } = request.nextUrl

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/workers',
    '/clients', 
    '/attendance'
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    // Add return URL for redirecting after login
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and tries to access login page, redirect to dashboard
  if (pathname.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Security headers
  const response = NextResponse.next()

  // Prevent SQL injection attempts in query parameters
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)\b)/i,
    /('|"|;|--|\/\*|\*\/|@@|char|nchar|varchar|nvarchar)/i
  ]

  // Check URL path and search params for SQL injection patterns
  const searchParams = request.nextUrl.search.toLowerCase()

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(pathname) || pattern.test(searchParams)) {
      return new NextResponse('طلب غير صالح', { status: 400 })
    }
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // CSP Header (Content Security Policy)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}