import { type NextRequest, type NextResponse } from 'next/server'

const ADMIN_COOKIE_NAME = 'admin_auth'

// Generate a simple token for session management
// In production, use a proper JWT or session token with signature verification
function generateAdminToken(): string {
  // Simple token generation - in production use proper JWT with signature
  const adminPassword = process.env.ADMIN_PASSWORD || 'julefagdag2025'
  // Create a simple hash-based token
  return Buffer.from(`admin_${adminPassword}_${Date.now()}`).toString('base64').slice(0, 32)
}

export function setAdminAuthCookie(response: NextResponse): void {
  const token = generateAdminToken()
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export function verifyAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)
  if (!cookie) {
    return false
  }

  // Verify token exists and is valid
  // In a more secure implementation, you'd verify the token signature
  // For now, we just check that a valid cookie exists
  return cookie.value.length > 0
}

export function clearAdminAuthCookie(response: NextResponse): void {
  response.cookies.delete(ADMIN_COOKIE_NAME)
}

