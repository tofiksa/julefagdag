import type { Session } from '@prisma/client'
import { formatTimeRange, getSessionStatus, cn } from '@/lib/utils'

interface SessionCardProps {
  session: Session
  currentTime?: Date
  isFavorite?: boolean
  onFavoriteToggle?: (sessionId: string) => void
  onFeedbackClick?: (sessionId: string) => void
}

export function SessionCard({
  session,
  currentTime = new Date(),
  isFavorite = false,
  onFavoriteToggle,
  onFeedbackClick,
}: SessionCardProps) {
  const status = getSessionStatus(session, currentTime)
  const startTime = new Date(session.startTime)
  const endTime = new Date(session.endTime)

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all sm:p-4',
        status === 'current'
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : status === 'upcoming'
            ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900',
        'hover:shadow-md'
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg break-words">
              {session.title || 'Ingen tittel'}
            </h3>
            {status === 'current' && (
              <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white whitespace-nowrap">
                Nå
              </span>
            )}
          </div>

          {session.speaker && (
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400 break-words">
              <span className="font-medium">Foredragsholder:</span> {session.speaker}
            </p>
          )}

          <div className="mb-2 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:flex-wrap sm:gap-4">
            <div className="flex-shrink-0">
              <span className="font-medium">Tid:</span> {formatTimeRange(startTime, endTime)}
            </div>
            <div className="flex-shrink-0">
              <span className="font-medium">Rom:</span> {session.room}
            </div>
          </div>

          {session.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{session.description}</p>
          )}
        </div>

        <div className="flex flex-row gap-2 sm:flex-col sm:flex-shrink-0">
          {onFavoriteToggle && (
            <button
              onClick={() => onFavoriteToggle(session.id)}
              className={cn(
                'rounded-full p-2 transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'min-h-[44px] min-w-[44px]',
                isFavorite
                  ? 'text-yellow-500'
                  : 'text-gray-400 hover:text-yellow-500'
              )}
              aria-label={isFavorite ? 'Fjern fra favoritter' : 'Legg til i favoritter'}
            >
              <svg
                className="h-6 w-6"
                fill={isFavorite ? 'currentColor' : 'none'}
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
            </button>
          )}

          {onFeedbackClick && status !== 'upcoming' && (
            <button
              onClick={() => onFeedbackClick(session.id)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                'min-h-[44px]',
                'text-blue-600 border border-blue-200 dark:text-blue-400 dark:border-blue-700',
                'hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600',
                'sm:px-4'
              )}
              aria-label="Gi tilbakemelding"
            >
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="hidden sm:inline">Gi tilbakemelding</span>
                <span className="sm:hidden">Tilbakemelding</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

