import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Session } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SessionStatus = 'upcoming' | 'current' | 'completed'

export function getSessionStatus(session: Session, currentTime: Date = new Date()): SessionStatus {
  const start = new Date(session.startTime)
  const end = new Date(session.endTime)

  if (currentTime < start) {
    return 'upcoming'
  } else if (currentTime >= start && currentTime <= end) {
    return 'current'
  } else {
    return 'completed'
  }
}

export function getMinutesUntilStart(session: Session, currentTime: Date = new Date()): number {
  const start = new Date(session.startTime)
  const diff = start.getTime() - currentTime.getTime()
  return Math.ceil(diff / (1000 * 60))
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('no-NO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`
}

export function sortSessionsByTime(sessions: Session[], currentTime: Date = new Date()): Session[] {
  return [...sessions].sort((a, b) => {
    const aStart = new Date(a.startTime)
    const bStart = new Date(b.startTime)
    
    // Current sessions first
    const aStatus = getSessionStatus(a, currentTime)
    const bStatus = getSessionStatus(b, currentTime)
    
    if (aStatus === 'current' && bStatus !== 'current') return -1
    if (bStatus === 'current' && aStatus !== 'current') return 1
    
    // Then upcoming sessions
    if (aStatus === 'upcoming' && bStatus === 'completed') return -1
    if (bStatus === 'upcoming' && aStatus === 'completed') return 1
    
    // Within same status, sort by start time
    return aStart.getTime() - bStart.getTime()
  })
}

export function groupSessionsByStatus(
  sessions: Session[],
  currentTime: Date = new Date()
): {
  current: Session[]
  upcoming: Session[]
  completed: Session[]
} {
  const current: Session[] = []
  const upcoming: Session[] = []
  const completed: Session[] = []

  for (const session of sessions) {
    const status = getSessionStatus(session, currentTime)
    if (status === 'current') {
      current.push(session)
    } else if (status === 'upcoming') {
      upcoming.push(session)
    } else {
      completed.push(session)
    }
  }

  return { current, upcoming, completed }
}

