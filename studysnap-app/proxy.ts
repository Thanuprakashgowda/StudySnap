import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Initialize NextAuth with edge-compatible config
const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // 1. Allow internal API calls with secret
  const internalSecret = req.headers.get('x-internal-secret')
  if (internalSecret === (process.env.INTERNAL_API_SECRET || 'dev-secret')) {
    return NextResponse.next()
  }

  // 2. Define public paths
  const PUBLIC_PATHS = ['/', '/login', '/signup', '/privacy', '/api/auth']
  const isPublicPath = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/api/auth'))

  // 3. Handle Auth Redirection
  if (!isLoggedIn && !isPublicPath) {
    // API routes → 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Pages → redirect to login
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
