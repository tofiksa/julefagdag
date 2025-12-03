'use client'

import { useState } from 'react'

interface EventFeedbackFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export function EventFeedbackForm({ onSuccess, onClose }: EventFeedbackFormProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!comment.trim()) {
      setError('Vennligst skriv en kommentar')
      setIsSubmitting(false)
      return
    }

    if (comment.length > 1000) {
      setError('Kommentaren kan ikke være lengre enn 1000 tegn')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/event-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Kunne ikke sende tilbakemelding')
      }

      setIsSuccess(true)
      setComment('')
      
      // Call onSuccess callback after a short delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
        if (onClose) {
          onClose()
        }
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke sende tilbakemelding')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
        <div className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-green-800 dark:text-green-300">
            Takk for tilbakemeldingen!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        💬 Gi tilbakemelding til hele fagdagen
      </h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Vi setter pris på din tilbakemelding! Del gjerne dine tanker om arrangementet.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="event-comment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Din kommentar
          </label>
          <textarea
            id="event-comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              setError(null)
            }}
            rows={4}
            maxLength={1000}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            placeholder="Skriv din tilbakemelding her..."
            required
            disabled={isSubmitting}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{comment.length} / 1000 tegn</span>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Sender...' : 'Send tilbakemelding'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Avbryt
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

