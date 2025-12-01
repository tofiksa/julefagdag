'use client'

import { useEffect, useState } from 'react'
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
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🌲 SPK Jule-Fagdag 2025
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
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
