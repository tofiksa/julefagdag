import { NextRequest, NextResponse } from 'next/server'
import { setAdminAuthCookie } from '@/lib/admin-auth-server'

// Simple password check - in production, use environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'julefagdag2025'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      )
      
      // Set authentication cookie
      setAdminAuthCookie(response)
      
      return response
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error authenticating:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}

