"use client";

import type { Session } from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { getSessionMap } from "@/lib/session-maps";
import { cn, formatTimeRange, getSessionStatus } from "@/lib/utils";
import { RoomBadge } from "./SessionCard";
import { SpeakerAvatars } from "./SpeakerAvatars";

interface SessionDetailProps {
  session: Session;
  currentTime?: Date;
  isFavorite?: boolean;
  hasSubmittedFeedback?: boolean;
  onFavoriteToggle?: (sessionId: string) => void;
  onFeedbackClick?: (sessionId: string) => void;
  /** False when opened via deep link — the view then appears without animation. */
  animateIn?: boolean;
  onClose: () => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Full-screen detail view for a session. Slides in from the right; closes
 * via the back button, Escape, or a rightward swipe where the panel follows
 * the finger and dismisses past 35% of the screen width (or on a fast fling).
 */
export function SessionDetail({
  session,
  currentTime = new Date(),
  isFavorite = false,
  hasSubmittedFeedback = false,
  onFavoriteToggle,
  onFeedbackClick,
  animateIn = true,
  onClose,
}: SessionDetailProps) {
  const [entered, setEntered] = useState(!animateIn);
  const [exiting, setExiting] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const startExit = useCallback(() => {
    if (prefersReducedMotion()) {
      onCloseRef.current();
      return;
    }
    setExiting(true);
  }, []);

  const { handlers, offsetX, isDragging } = useSwipeGesture({
    onSwipeRight: startExit,
    threshold: () => window.innerWidth * 0.35,
    enabled: !exiting,
  });

  // Slide in on mount (skipped for deep links), and move focus to the back button.
  useEffect(() => {
    backButtonRef.current?.focus();

    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Lock body scroll while the detail view is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        startExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startExit]);

  const status = getSessionStatus(session, currentTime);
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const sessionMap = getSessionMap(session.title);
  const detailText = session.longDescription || session.description;
  const dragOffset = Math.max(0, offsetX);

  const transform = exiting
    ? "translateX(100%)"
    : isDragging
      ? `translateX(${dragOffset}px)`
      : entered
        ? "translateX(0)"
        : "translateX(100%)";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={session.title || "Sesjonsdetaljer"}
      className={cn(
        "fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-spk-navy",
        "touch-pan-y",
        !isDragging &&
          "transition-transform duration-250 ease-out motion-reduce:transition-none",
      )}
      style={{ transform }}
      onTransitionEnd={(e) => {
        if (exiting && e.propertyName === "transform") {
          onCloseRef.current();
        }
      }}
      {...handlers}
    >
      <header className="spk-header">
        <div className="spk-header-inner justify-start">
          <button
            ref={backButtonRef}
            type="button"
            onClick={startExit}
            className="spk-nav-link"
            aria-label="Tilbake til agendaen"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tilbake
          </button>
        </div>
      </header>

      <main className="spk-main w-full flex-1">
        <article className="rounded-xl border border-spk-navy/10 bg-white p-4 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold spk-text-on-light sm:text-base">
              {formatTimeRange(startTime, endTime)}
            </span>
            {status === "current" && (
              <span className="whitespace-nowrap rounded-full bg-spk-navy px-2 py-0.5 text-xs font-bold text-white">
                Nå
              </span>
            )}
            <RoomBadge room={session.room} onHighlight={false} />
          </div>

          <h1 className="mb-4 break-words text-xl font-black spk-text-on-light sm:text-2xl">
            {session.title || "Ingen tittel"}
          </h1>

          {session.speaker && (
            <div className="mb-4 flex items-center gap-3">
              <SpeakerAvatars speaker={session.speaker} />
              <p className="break-words text-sm spk-text-on-light-muted">
                <span className="font-semibold">Foredragsholder:</span>{" "}
                {session.speaker}
              </p>
            </div>
          )}

          {detailText && (
            <div className="mb-4 space-y-3">
              {detailText.split(/<br\s*\/?>|\n\n/).map(
                (paragraph) =>
                  paragraph.trim() && (
                    <p
                      key={paragraph}
                      className="break-words text-sm leading-relaxed spk-text-on-light-muted sm:text-base"
                    >
                      {paragraph.trim()}
                    </p>
                  ),
              )}
            </div>
          )}

          {session.images.length > 0 && (
            <div className="mb-4 space-y-3">
              {session.images.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt={`Illustrasjon for ${session.title}`}
                  width={1600}
                  height={900}
                  sizes="(min-width: 896px) 56rem, 100vw"
                  className="h-auto w-full rounded-lg border border-spk-navy/10"
                />
              ))}
            </div>
          )}

          {sessionMap && (
            <div className="mb-4 overflow-hidden rounded-lg border border-spk-navy/10">
              <iframe
                src={sessionMap.embedUrl}
                title={`Kart til ${sessionMap.label}`}
                className="h-48 w-full border-0 sm:h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={sessionMap.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-center text-sm font-medium spk-text-on-light underline-offset-2 hover:underline"
              >
                Åpne {sessionMap.label} i Google Maps
              </a>
            </div>
          )}

          {(onFavoriteToggle || onFeedbackClick) && (
            <div className="mt-6 flex flex-col gap-3 border-t border-spk-navy/10 pt-4 sm:flex-row">
              {onFavoriteToggle && (
                <button
                  type="button"
                  onClick={() => onFavoriteToggle(session.id)}
                  className={cn(
                    "flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                    isFavorite
                      ? "border-spk-gold bg-spk-gold/10 spk-text-on-light"
                      : "border-spk-navy/20 spk-text-on-light hover:border-spk-gold hover:bg-spk-gold/10",
                  )}
                >
                  <svg
                    className="h-5 w-5"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {isFavorite
                    ? "Fjern fra favoritter"
                    : "Legg til i favoritter"}
                </button>
              )}

              {onFeedbackClick &&
                status !== "upcoming" &&
                (hasSubmittedFeedback ? (
                  <div className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-spk-gold/40 bg-spk-gold/10 px-4 py-3 text-sm font-medium spk-text-on-light">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">😊</span>
                      Tilbakemelding sendt
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onFeedbackClick(session.id)}
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-spk-navy/20 px-4 py-3 text-sm font-medium spk-text-on-light transition-colors hover:border-spk-gold hover:bg-spk-gold/10"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    Gi tilbakemelding
                  </button>
                ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
