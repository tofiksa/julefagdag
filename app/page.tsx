'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Session } from '@prisma/client'
import { AgendaList } from '@/components/AgendaList'
import { FeedbackForm } from '@/components/FeedbackForm'
import { useFavorites } from '@/hooks/useFavorites'

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedbackSession, setFeedbackSession] = useState<Session | null>(null)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch('/api/sessions')
        if (!response.ok) {
          throw new Error('Kunne ikke hente sesjoner')
        }
        const data = await response.json()
        setSessions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'En feil oppstod')
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const handleFeedbackSubmit = async (feedback: {
    sessionId: string
    useful: boolean
    learned: boolean
    explore: boolean
  }) => {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    })

    if (!response.ok) {
      throw new Error('Kunne ikke sende tilbakemelding')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-4xl px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl md:text-2xl truncate">
              🌲 SPK Jule-Fagdag 2025
            </h1>
            <Link
              href="/favorites"
              className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 sm:gap-2 sm:px-4 sm:text-sm min-h-[44px] min-w-[44px] sm:min-w-auto"
              aria-label={`Favoritter${favorites.length > 0 ? ` (${favorites.length})` : ''}`}
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill={favorites.length > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              {favorites.length > 0 && (
                <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-medium text-white sm:px-2">
                  {favorites.length}
                </span>
              )}
              <span className="hidden sm:inline">Favoritter</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600 dark:text-gray-400">Laster agenda...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <AgendaList
            sessions={sessions}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
            onFeedbackClick={(sessionId) => {
              const session = sessions.find((s) => s.id === sessionId)
              if (session) {
                setFeedbackSession(session)
              }
            }}
          />
        )}
      </main>

      {feedbackSession && (
        <FeedbackForm
          sessionId={feedbackSession.id}
          sessionTitle={feedbackSession.title || 'Ingen tittel'}
          onClose={() => setFeedbackSession(null)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  )
}
