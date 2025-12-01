'use client'

import { useState, useEffect, useCallback } from 'react'

const FEEDBACK_KEY = 'julefagdag-feedback'

function getFeedbackFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FEEDBACK_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading feedback:', error)
    return []
  }
}

export function useFeedback() {
  const [submittedSessions, setSubmittedSessions] = useState<string[]>(() =>
    getFeedbackFromStorage()
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = getFeedbackFromStorage()
    setSubmittedSessions(stored)
  }, [])

  const hasSubmittedFeedback = useCallback(
    (sessionId: string) => {
      return submittedSessions.includes(sessionId)
    },
    [submittedSessions]
  )

  const markAsSubmitted = useCallback((sessionId: string) => {
    if (typeof window === 'undefined') return

    const current = getFeedbackFromStorage()
    if (!current.includes(sessionId)) {
      const updated = [...current, sessionId]
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated))
      setSubmittedSessions(updated)
    }
  }, [])

  return {
    hasSubmittedFeedback,
    markAsSubmitted,
  }
}

