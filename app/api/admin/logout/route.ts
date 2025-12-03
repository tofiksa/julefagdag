import { NextResponse } from 'next/server'
import { clearAdminAuthCookie } from '@/lib/admin-auth-server'

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  )
  
  // Clear authentication cookie
  clearAdminAuthCookie(response)
  
  return response
}

