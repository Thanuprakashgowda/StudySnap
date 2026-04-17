import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// We define the config separately so it can be used in the edge runtime (middleware)
// Middleware doesn't support the full Prisma adapter, so we omit 'adapter' here.
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-secret',
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || 'dummy-github-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-secret',
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Note: For edge compatibility in middleware, this part won't run during session checks,
        // but it will be used in lib/auth.ts for the actual login.
        return null // Placeholder, actual logic in lib/auth.ts or shared
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublic = ['/', '/login', '/signup', '/privacy'].some(
        path => nextUrl.pathname === path || nextUrl.pathname.startsWith('/api/auth')
      )
      
      if (!isPublic && !isLoggedIn) {
        return false // Redirect to login
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig
