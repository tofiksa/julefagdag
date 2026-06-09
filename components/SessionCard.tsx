import type { Session } from "@prisma/client";
import {
  cn,
  formatTimeRange,
  getRoomBadgeVariant,
  getSessionStatus,
  getSessionVariant,
  type SessionVariant,
} from "@/lib/utils";

interface SessionCardProps {
  session: Session;
  currentTime?: Date;
  isFavorite?: boolean;
  hasSubmittedFeedback?: boolean;
  index?: number;
  onFavoriteToggle?: (sessionId: string) => void;
  onFeedbackClick?: (sessionId: string) => void;
}

function isHighlightedVariant(variant: SessionVariant): boolean {
  return variant === "highlight-gold" || variant === "highlight-coral";
}

function RoomBadge({
  room,
  onHighlight,
}: {
  room: string;
  onHighlight: boolean;
}) {
  const variant = getRoomBadgeVariant(room);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        onHighlight
          ? "bg-spk-navy text-white"
          : "text-white",
        !onHighlight && variant === "pokalen" && "bg-spk-coral",
        !onHighlight && variant === "scenen" && "bg-spk-navy",
        !onHighlight && variant === "other" && "bg-spk-navy-deep",
      )}
    >
      {room}
    </span>
  );
}

export function SessionCard({
  session,
  currentTime = new Date(),
  isFavorite = false,
  hasSubmittedFeedback = false,
  index = 0,
  onFavoriteToggle,
  onFeedbackClick,
}: SessionCardProps) {
  const status = getSessionStatus(session, currentTime);
  const variant = getSessionVariant(session);
  const highlighted = isHighlightedVariant(variant);
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);

  if (variant === "break") {
    return (
      <div className="rounded-xl bg-spk-navy-deep px-4 py-3 text-center sm:py-4">
        <p className="text-base font-bold text-white sm:text-lg">
          {session.title}
        </p>
        <p className="mt-1 text-sm text-white/90">
          {formatTimeRange(startTime, endTime)}
          {session.description ? ` · ${session.description}` : ""}
        </p>
      </div>
    );
  }

  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-all sm:p-4",
        variant === "highlight-gold" && "spk-card-highlight-gold",
        variant === "highlight-coral" && "spk-card-highlight-coral",
        variant === "default" && isEven && "border-spk-navy/10 bg-spk-cream",
        variant === "default" && !isEven && "border-spk-navy/10 bg-white",
        status === "current" &&
          variant === "default" &&
          "border-spk-gold ring-2 ring-spk-gold/50",
        status === "completed" && variant === "default" && "opacity-70",
        "hover:shadow-md",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "shrink-0 text-sm font-bold sm:text-base",
                highlighted ? "spk-text-on-light" : "text-spk-navy",
              )}
            >
              {formatTimeRange(startTime, endTime)}
            </span>
            {status === "current" && (
              <span className="whitespace-nowrap rounded-full bg-spk-navy px-2 py-0.5 text-xs font-bold text-white">
                Nå
              </span>
            )}
          </div>

          <h3
            className={cn(
              "mb-2 break-words text-base font-bold sm:text-lg",
              highlighted ? "spk-text-on-light" : "text-spk-navy",
            )}
          >
            {session.title || "Ingen tittel"}
          </h3>

          {session.speaker && (
            <p
              className={cn(
                "mb-2 break-words text-sm",
                highlighted ? "spk-text-on-light-muted" : "text-spk-navy/80",
              )}
            >
              <span className="font-semibold">Foredragsholder:</span>{" "}
              {session.speaker}
            </p>
          )}

          <div className="mb-2">
            <RoomBadge room={session.room} onHighlight={highlighted} />
          </div>

          {session.description && (
            <p
              className={cn(
                "break-words text-sm",
                highlighted ? "spk-text-on-light-muted" : "text-spk-navy/80",
              )}
            >
              {session.description}
            </p>
          )}
        </div>

        <div className="flex flex-row gap-2 sm:flex-col sm:shrink-0">
          {onFavoriteToggle && (
            <button
              onClick={() => onFavoriteToggle(session.id)}
              className={cn(
                "min-h-[44px] min-w-[44px] rounded-full p-2 transition-colors",
                highlighted
                  ? "hover:bg-spk-navy/10"
                  : "hover:bg-spk-navy/5",
                isFavorite
                  ? "text-spk-navy"
                  : highlighted
                    ? "text-spk-navy/50 hover:text-spk-navy"
                    : "text-spk-navy/30 hover:text-spk-gold-bright",
              )}
              aria-label={
                isFavorite ? "Fjern fra favoritter" : "Legg til i favoritter"
              }
            >
              <svg
                className="h-6 w-6"
                fill={isFavorite ? "currentColor" : "none"}
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

          {onFeedbackClick && status !== "upcoming" && (
            <>
              {hasSubmittedFeedback ? (
                <div
                  className={cn(
                    "flex min-h-[44px] items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium sm:px-4",
                    highlighted
                      ? "border-spk-navy/25 bg-white/60 spk-text-on-light"
                      : "border-spk-gold/40 bg-spk-gold/10 text-spk-navy",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-base">😊</span>
                    <span className="hidden sm:inline">
                      Tilbakemelding sendt
                    </span>
                    <span className="sm:hidden">Sendt</span>
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => onFeedbackClick(session.id)}
                  className={cn(
                    "min-h-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                    highlighted
                      ? "border-spk-navy/30 bg-white/70 spk-text-on-light hover:bg-white hover:border-spk-navy/50"
                      : "border-spk-navy/20 text-spk-navy hover:border-spk-gold hover:bg-spk-gold/10",
                  )}
                  aria-label="Gi tilbakemelding"
                >
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
