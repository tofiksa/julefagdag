'use client'

import { useEffect, useState } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import type { Session } from '@prisma/client'

interface NotificationBannerProps {
  sessions: Session[]
  currentTime: Date
}

export function NotificationBanner({
  sessions,
  currentTime,
}: NotificationBannerProps) {
  const { favorites } = useFavorites()
  const [upcomingSession, setUpcomingSession] = useState<Session | null>(null)
  const [minutesUntilStart, setMinutesUntilStart] = useState<number | null>(
    null
  )

  useEffect(() => {
    const favoriteSessions = sessions.filter((session) =>
      favorites.includes(session.id)
    )

    // Find the next upcoming favorite session
    let nextSession: Session | null = null
    let minMinutes: number | null = null

    for (const session of favoriteSessions) {
      const startTime = new Date(session.startTime)
      const timeUntilStart = startTime.getTime() - currentTime.getTime()
      const minutesUntilStart = Math.floor(timeUntilStart / (1000 * 60))

      // Only show sessions that start within the next 15 minutes
      if (minutesUntilStart > 0 && minutesUntilStart <= 15) {
        if (minMinutes === null || minutesUntilStart < minMinutes) {
          minMinutes = minutesUntilStart
          nextSession = session
        }
      }
    }

    setUpcomingSession(nextSession)
    setMinutesUntilStart(minMinutes)
  }, [sessions, favorites, currentTime])

  if (!upcomingSession || minutesUntilStart === null) {
    return null
  }

  const minutesText = minutesUntilStart === 1 ? 'minutt' : 'minutter'

  return (
    <div className="mx-auto max-w-4xl px-3 pt-4 sm:px-4 sm:pt-6">
      <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4 dark:border-blue-400 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Kommende favoritt
            </h3>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200 break-words">
              <span className="font-medium">{upcomingSession.title}</span>
            </p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
              {upcomingSession.room} • Starter om {minutesUntilStart}{' '}
              {minutesText}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

