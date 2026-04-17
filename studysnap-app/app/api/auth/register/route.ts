import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { registerUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { name: string; email: string; password: string }
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const user = await registerUser(name, email, password)

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      message: 'Account created successfully',
    })
  } catch (err) {
    const error = err as Error
    if (error.message === 'EMAIL_EXISTS') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    console.error('[Register]', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
