'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Session } from '@prisma/client'
import { SessionCard } from '@/components/SessionCard'
import { useFavorites } from '@/hooks/useFavorites'
import { sortSessionsByTime, groupSessionsByStatus } from '@/lib/utils'

export default function FavoritesPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { favorites, toggleFavorite } = useFavorites()

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

  // Filter sessions to only show favorites
  const favoriteSessions = sessions.filter((session) =>
    favorites.includes(session.id)
  )

  const sortedFavorites = sortSessionsByTime(favoriteSessions)
  const { current, upcoming, completed } = groupSessionsByStatus(sortedFavorites)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ⭐ Mine favoritter
            </h1>
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              ← Tilbake til agenda
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600 dark:text-gray-400">Laster favoritter...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {favoriteSessions.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
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
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Ingen favoritter ennå
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Merk foredrag som favoritter for å se dem her
                </p>
                <Link
                  href="/"
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Se agenda
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Current Sessions */}
                {current.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Nå pågår ({current.length})
                    </h2>
                    <div className="space-y-4">
                      {current.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          isFavorite={true}
                          onFavoriteToggle={toggleFavorite}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Upcoming Sessions */}
                {upcoming.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Kommende ({upcoming.length})
                    </h2>
                    <div className="space-y-4">
                      {upcoming.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          isFavorite={true}
                          onFavoriteToggle={toggleFavorite}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Completed Sessions */}
                {completed.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Ferdig ({completed.length})
                    </h2>
                    <div className="space-y-4">
                      {completed.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          isFavorite={true}
                          onFavoriteToggle={toggleFavorite}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

