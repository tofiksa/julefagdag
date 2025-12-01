'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@prisma/client'
import { groupSessionsByStatus, sortSessionsByTime } from '@/lib/utils'
import { SessionCard } from './SessionCard'

interface AgendaListProps {
  sessions: Session[]
  favorites?: string[]
  onFavoriteToggle?: (sessionId: string) => void
  onFeedbackClick?: (sessionId: string) => void
}

export function AgendaList({
  sessions,
  favorites = [],
  onFavoriteToggle,
  onFeedbackClick,
}: AgendaListProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const sortedSessions = sortSessionsByTime(sessions, currentTime)
  const { current, upcoming, completed } = groupSessionsByStatus(sortedSessions, currentTime)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Current Sessions */}
      {current.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-2xl">
            Nå pågår
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {current.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                currentTime={currentTime}
                isFavorite={favorites.includes(session.id)}
                onFavoriteToggle={onFavoriteToggle}
                onFeedbackClick={onFeedbackClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Sessions */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-2xl">
            Kommende
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {upcoming.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                currentTime={currentTime}
                isFavorite={favorites.includes(session.id)}
                onFavoriteToggle={onFavoriteToggle}
                onFeedbackClick={onFeedbackClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed Sessions */}
      {completed.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-2xl">
            Ferdig
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {completed.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                currentTime={currentTime}
                isFavorite={favorites.includes(session.id)}
                onFavoriteToggle={onFavoriteToggle}
                onFeedbackClick={onFeedbackClick}
              />
            ))}
          </div>
        </section>
      )}

      {sessions.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">Ingen sesjoner funnet.</p>
        </div>
      )}
    </div>
  )
}

