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
  rating: number | null
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
          setEventFeedbacks([])
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
          setResults([])
          setEventFeedbacks([])
          return
        }
        throw new Error('Kunne ikke hente event-tilbakemeldinger')
      }

      const data = await response.json()
      setEventFeedbacks(data)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke hente event-tilbakemeldinger'
      console.error('Error fetching event feedbacks:', err)
      setError(errorMessage)
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
      // Clear client-side authentication and all sensitive data
      logoutAdmin()
      setAuthenticated(false)
      setResults([])
      setEventFeedbacks([])
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
              {/* Statistics */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Totalt antall tilbakemeldinger
                  </div>
                  <div className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {eventFeedbacks.length}
                  </div>
                </div>
                {(() => {
                  const ratings = eventFeedbacks.filter(f => f.rating !== null).map(f => f.rating!)
                  const avgRating = ratings.length > 0 
                    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                    : '0'
                  const ratingCount = ratings.length
                  
                  return (
                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                      <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        Gjennomsnittlig vurdering
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                          {avgRating}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(Number(avgRating))
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                          ({ratingCount} {ratingCount === 1 ? 'vurdering' : 'vurderinger'})
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Rating Distribution */}
              {(() => {
                const ratingCounts = [1, 2, 3, 4, 5].map(star => 
                  eventFeedbacks.filter(f => f.rating === star).length
                )
                const totalRatings = ratingCounts.reduce((a, b) => a + b, 0)
                
                if (totalRatings === 0) return null
                
                return (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
                    <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Vurderingsfordeling
                    </h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star - 1]
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <div className="flex w-20 items-center gap-1">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {star}
                              </span>
                              <svg
                                className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                                <div
                                  className="h-full bg-yellow-400 transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-12 text-right text-sm text-gray-600 dark:text-gray-400">
                              {count} ({Math.round(percentage)}%)
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Individual Feedbacks */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {eventFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {feedback.comment && (
                          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {feedback.comment}
                          </p>
                        )}
                        {feedback.rating && (
                          <div className="mt-2 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= feedback.rating!
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {feedback.rating} / 5
                            </span>
                          </div>
                        )}
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
                    </div>
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

