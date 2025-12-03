'use client'

import { useEffect, useState } from 'react'
import { AdminLoginForm } from '@/components/AdminLoginForm'
import { FeedbackResults } from '@/components/FeedbackResults'
import { isAdminAuthenticated, logoutAdmin, setAdminAuthenticated } from '@/lib/admin-auth'

interface Feedback {
  id: string
  useful: boolean
  learned: boolean
  explore: boolean
  createdAt: Date
}

interface FeedbackStatistics {
  totalFeedback: number
  usefulCount: number
  learnedCount: number
  exploreCount: number
  usefulPercentage: number
  learnedPercentage: number
  explorePercentage: number
}

interface Session {
  id: string
  title: string
  speaker: string | null
  room: string
  startTime: Date
  endTime: Date
  description: string | null
  createdAt?: Date
  updatedAt?: Date
}

interface SessionFeedbackResult {
  session: Session
  statistics: FeedbackStatistics
  feedbacks: Feedback[]
}

export default function AdminFeedbackPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SessionFeedbackResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication status on mount
    if (typeof window !== 'undefined') {
      setAuthenticated(isAdminAuthenticated())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch feedback results when authenticated
    if (authenticated) {
      fetchResults()
      // Refresh every 30 seconds
      const interval = setInterval(fetchResults, 30000)
      return () => clearInterval(interval)
    }
  }, [authenticated])

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/feedback/results', {
        cache: 'no-store',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        // If unauthorized, clear authentication and redirect to login
        if (response.status === 401) {
          logoutAdmin()
          setAuthenticated(false)
          setResults([])
          return
        }
        throw new Error('Kunne ikke hente tilbakemeldinger')
      }

      const data = await response.json()
      setResults(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'En feil oppstod')
    }
  }

  const handleLoginSuccess = () => {
    setAuthenticated(true)
    setAdminAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      // Clear server-side cookie
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Error logging out:', err)
    } finally {
      // Clear client-side authentication
      logoutAdmin()
      setAuthenticated(false)
      setResults([])
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Laster...</div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex min-h-screen items-center justify-center">
          <AdminLoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-4xl px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl md:text-2xl">
              📊 Tilbakemeldinger
            </h1>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-4"
            >
              Logg ut
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <FeedbackResults results={results} />
      </main>
    </div>
  )
}

