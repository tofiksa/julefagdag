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

interface EventFeedback {
  id: string
  comment: string
  createdAt: Date
}

export default function AdminFeedbackPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SessionFeedbackResult[]>([])
  const [eventFeedbacks, setEventFeedbacks] = useState<EventFeedback[]>([])
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
      fetchEventFeedbacks()
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchResults()
        fetchEventFeedbacks()
      }, 30000)
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

  const fetchEventFeedbacks = async () => {
    try {
      const response = await fetch('/api/event-feedback', {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          logoutAdmin()
          setAuthenticated(false)
          setEventFeedbacks([])
          return
        }
        throw new Error('Kunne ikke hente event-tilbakemeldinger')
      }

      const data = await response.json()
      setEventFeedbacks(data)
    } catch (err) {
      console.error('Error fetching event feedbacks:', err)
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

        {/* Event Feedback Summary Section */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            💬 Tilbakemeldinger til hele arrangementet
          </h2>
          {eventFeedbacks.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              Ingen tilbakemeldinger mottatt ennå
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Totalt antall tilbakemeldinger: <span className="font-semibold">{eventFeedbacks.length}</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {eventFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700"
                  >
                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {feedback.comment}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(feedback.createdAt).toLocaleString('no-NO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Feedback Results */}
        <FeedbackResults results={results} />
      </main>
    </div>
  )
}

