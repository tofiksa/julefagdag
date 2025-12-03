'use client'

import { useState, useEffect, useCallback } from 'react'

const EVENT_FEEDBACK_KEY = 'julefagdag-event-feedback'

function hasSubmittedEventFeedback(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(EVENT_FEEDBACK_KEY) === 'true'
  } catch (error) {
    console.error('Error loading event feedback status:', error)
    return false
  }
}

export function useEventFeedback() {
  // Start with false to avoid hydration mismatch, then check localStorage in useEffect
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setHasSubmitted(hasSubmittedEventFeedback())
  }, [])

  const markAsSubmitted = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(EVENT_FEEDBACK_KEY, 'true')
    setHasSubmitted(true)
  }, [])

  return {
    hasSubmittedEventFeedback: hasSubmitted,
    markAsSubmitted,
  }
}

