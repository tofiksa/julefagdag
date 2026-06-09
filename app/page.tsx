"use client";

import type { Session } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AgendaList } from "@/components/AgendaList";
import { AppHeader, EventTitle, SpkFooter } from "@/components/AppHeader";
import { EventFeedbackForm } from "@/components/EventFeedbackForm";
import { FeedbackForm } from "@/components/FeedbackForm";
import { InstallPrompt } from "@/components/InstallPrompt";
import { NotificationBanner } from "@/components/NotificationBanner";
import { useEventFeedback } from "@/hooks/useEventFeedback";
import { useFavorites } from "@/hooks/useFavorites";
import { useFeedback } from "@/hooks/useFeedback";
import { useNotifications } from "@/hooks/useNotifications";
import { isEventFeedbackAvailable, isLogisticsSession } from "@/lib/utils";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSession, setFeedbackSession] = useState<Session | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [showEventFeedback, setShowEventFeedback] = useState(false);
  const { favorites, toggleFavorite, removeFavorites } = useFavorites();
  const { hasSubmittedFeedback, markAsSubmitted } = useFeedback();
  const {
    hasSubmittedEventFeedback,
    markAsSubmitted: markEventFeedbackAsSubmitted,
  } = useEventFeedback();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !currentTime ||
      sessions.length === 0
    ) {
      return;
    }

    setShowEventFeedback(
      !hasSubmittedEventFeedback &&
        isEventFeedbackAvailable(sessions, currentTime),
    );
  }, [hasSubmittedEventFeedback, currentTime, sessions]);

  useEffect(() => {
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useNotifications(sessions, currentTime ?? new Date());

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch("/api/sessions", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          throw new Error("Kunne ikke hente sesjoner");
        }
        const data = await response.json();
        setSessions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "En feil oppstod");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();

    const refreshInterval = setInterval(() => {
      fetchSessions();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (sessions.length === 0) return;

    const logisticsIds = sessions
      .filter(isLogisticsSession)
      .map((session) => session.id);
    removeFavorites(logisticsIds);
  }, [sessions, removeFavorites]);

  const handleFeedbackSubmit = async (feedback: {
    sessionId: string;
    useful: boolean;
    learned: boolean;
    explore: boolean;
  }) => {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error("Kunne ikke sende tilbakemelding");
    }

    markAsSubmitted(feedback.sessionId);
  };

  return (
    <div className="spk-page">
      <AppHeader
        title={<EventTitle />}
        actions={
          <>
            <Link href="/qr" className="spk-nav-link" aria-label="QR-kode">
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
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              <span className="hidden sm:inline">QR-kode</span>
            </Link>
            <Link
              href="/favorites"
              className="spk-nav-link"
              aria-label={`Favoritter${favorites.length > 0 ? ` (${favorites.length})` : ""}`}
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill={favorites.length > 0 ? "currentColor" : "none"}
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
              {favorites.length > 0 && (
                <span className="rounded-full bg-spk-gold px-1.5 py-0.5 text-xs font-bold text-spk-navy sm:px-2">
                  {favorites.length}
                </span>
              )}
              <span className="hidden sm:inline">Favoritter</span>
            </Link>
          </>
        }
      />

      <main className="spk-main">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/70">Laster agenda...</div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-spk-red/20 p-4 text-spk-coral">
            {error}
          </div>
        )}

        {!loading && !error && currentTime && (
          <>
            <NotificationBanner sessions={sessions} currentTime={currentTime} />

            <InstallPrompt />

            {showEventFeedback && (
              <div className="mb-6">
                <EventFeedbackForm
                  onSuccess={() => {
                    markEventFeedbackAsSubmitted();
                    setShowEventFeedback(false);
                  }}
                />
              </div>
            )}

            <AgendaList
              sessions={sessions}
              favorites={favorites}
              currentTime={currentTime}
              hasSubmittedFeedback={hasSubmittedFeedback}
              onFavoriteToggle={toggleFavorite}
              onFeedbackClick={(sessionId) => {
                const session = sessions.find((s) => s.id === sessionId);
                if (
                  session &&
                  !isLogisticsSession(session) &&
                  !hasSubmittedFeedback(sessionId)
                ) {
                  setFeedbackSession(session);
                }
              }}
            />
          </>
        )}
      </main>

      <SpkFooter />

      {feedbackSession && (
        <FeedbackForm
          sessionId={feedbackSession.id}
          sessionTitle={feedbackSession.title || "Ingen tittel"}
          onClose={() => setFeedbackSession(null)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
