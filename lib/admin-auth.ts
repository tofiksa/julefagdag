const ADMIN_AUTH_KEY = 'admin_authenticated'

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ADMIN_AUTH_KEY, value ? 'true' : 'false')
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_AUTH_KEY)
}

