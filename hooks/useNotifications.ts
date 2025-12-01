'use client'

import { useEffect, useCallback, useRef } from 'react'
import type { Session } from '@prisma/client'
import { useFavorites } from './useFavorites'

const NOTIFICATION_DELAY_MINUTES = 10

interface NotificationData {
  sessionId: string
  title: string
  room: string
  startTime: Date
  minutesUntilStart: number
}

function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('denied')
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve('granted')
  }

  if (Notification.permission === 'denied') {
    return Promise.resolve('denied')
  }

  return Notification.requestPermission()
}

function showNotification(data: NotificationData) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return
  }

  if (Notification.permission !== 'granted') {
    return
  }

  const minutesText = data.minutesUntilStart === 1 ? 'minutt' : 'minutter'
  const body = `${data.room} • Starter om ${data.minutesUntilStart} ${minutesText}`

  // Try to use service worker notification first
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(data.title, {
        body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
        vibrate: [200, 100, 200],
        tag: `session-${data.sessionId}`,
        data: {
          url: '/',
          sessionId: data.sessionId,
        },
        requireInteraction: false,
      })
    })
  } else {
    // Fallback to regular notification
    new Notification(data.title, {
      body,
      icon: '/icon-192.png',
      tag: `session-${data.sessionId}`,
    })
  }
}

function checkUpcomingSessions(
  sessions: Session[],
  favorites: string[],
  currentTime: Date
): NotificationData | null {
  const favoriteSessions = sessions.filter((session) =>
    favorites.includes(session.id)
  )

  for (const session of favoriteSessions) {
    const startTime = new Date(session.startTime)
    const timeUntilStart = startTime.getTime() - currentTime.getTime()
    const minutesUntilStart = Math.floor(timeUntilStart / (1000 * 60))

    // Check if session starts in exactly NOTIFICATION_DELAY_MINUTES minutes
    if (
      minutesUntilStart === NOTIFICATION_DELAY_MINUTES &&
      timeUntilStart > 0
    ) {
      return {
        sessionId: session.id,
        title: session.title || 'Ingen tittel',
        room: session.room,
        startTime,
        minutesUntilStart: NOTIFICATION_DELAY_MINUTES,
      }
    }
  }

  return null
}

export function useNotifications(sessions: Session[], currentTime: Date) {
  const { favorites } = useFavorites()
  const notifiedSessionsRef = useRef<Set<string>>(new Set())
  const permissionRequestedRef = useRef(false)

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!permissionRequestedRef.current) {
      requestNotificationPermission().then((permission) => {
        permissionRequestedRef.current = true
        if (permission === 'granted') {
          console.log('Notification permission granted')
        } else {
          console.log('Notification permission denied or not supported')
        }
      })
    }
  }, [])

  // Check for upcoming sessions and send notifications
  useEffect(() => {
    if (typeof window === 'undefined' || favorites.length === 0) return

    const notificationData = checkUpcomingSessions(sessions, favorites, currentTime)

    if (notificationData) {
      const { sessionId } = notificationData

      // Only send notification if we haven't already notified for this session
      if (!notifiedSessionsRef.current.has(sessionId)) {
        showNotification(notificationData)
        notifiedSessionsRef.current.add(sessionId)
      }
    }

    // Clean up old session IDs from notified set (sessions that have passed)
    const now = currentTime.getTime()
    sessions.forEach((session) => {
      const startTime = new Date(session.startTime).getTime()
      if (startTime < now) {
        notifiedSessionsRef.current.delete(session.id)
      }
    })
  }, [sessions, favorites, currentTime])

  const requestPermission = useCallback(async () => {
    const permission = await requestNotificationPermission()
    permissionRequestedRef.current = true
    return permission
  }, [])

  return {
    requestPermission,
    permission: typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default' as NotificationPermission,
  }
}

