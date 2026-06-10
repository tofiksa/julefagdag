"use client";

import type { Session } from "@prisma/client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { AppHeader, SpkFooter } from "@/components/AppHeader";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SessionCard } from "@/components/SessionCard";
import { SessionDetail } from "@/components/SessionDetail";
import { useFavorites } from "@/hooks/useFavorites";
import { useFeedback } from "@/hooks/useFeedback";
import { useSessionDetailParam } from "@/hooks/useSessionDetailParam";
import {
  groupSessionsByStatus,
  isLogisticsSession,
  sortSessionsByTime,
} from "@/lib/utils";

function FavoritesContent() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [feedbackSession, setFeedbackSession] = useState<Session | null>(null);
  const { favorites, toggleFavorite, removeFavorites } = useFavorites();
  const { hasSubmittedFeedback, markAsSubmitted } = useFeedback();
  const {
    sessionId: detailSessionId,
    openedViaUi,
    open: openDetail,
    close: closeDetail,
  } = useSessionDetailParam();

  useEffect(() => {
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const favoriteSessions = sessions.filter(
    (session) => favorites.includes(session.id) && !isLogisticsSession(session),
  );

  const detailSession =
    sessions.find(
      (session) =>
        session.id === detailSessionId && !isLogisticsSession(session),
    ) ?? null;

  const handleFeedbackClick = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (
      session &&
      !isLogisticsSession(session) &&
      !hasSubmittedFeedback(sessionId)
    ) {
      setFeedbackSession(session);
    }
  };

  const sortedFavorites = sortSessionsByTime(
    favoriteSessions,
    currentTime ?? undefined,
  );
  const { current, upcoming, completed } = groupSessionsByStatus(
    sortedFavorites,
    currentTime ?? undefined,
  );

  const renderGroup = (
    title: string,
    groupSessions: Session[],
    startIndex: number,
  ) => {
    if (groupSessions.length === 0) return null;

    return (
      <section>
        <h2 className="spk-section-bar">
          {title} ({groupSessions.length})
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {groupSessions.map((session, i) => {
            const interactive = !isLogisticsSession(session);

            return (
              <SessionCard
                key={session.id}
                session={session}
                currentTime={currentTime ?? undefined}
                index={startIndex + i}
                isFavorite={true}
                hasSubmittedFeedback={hasSubmittedFeedback(session.id)}
                onFavoriteToggle={interactive ? toggleFavorite : undefined}
                onFeedbackClick={interactive ? handleFeedbackClick : undefined}
                onOpenDetail={interactive ? openDetail : undefined}
              />
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="spk-page">
      <AppHeader
        title={
          <h1 className="truncate text-lg font-black text-white sm:text-xl md:text-2xl">
            ⭐ Mine favoritter
          </h1>
        }
        actions={
          <Link href="/" className="spk-nav-link">
            <span className="hidden sm:inline">← Tilbake til agenda</span>
            <span className="sm:hidden">← Tilbake</span>
          </Link>
        }
      />

      <main className="spk-main">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/70">Laster favoritter...</div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-spk-red/20 p-4 text-spk-coral">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          currentTime &&
          (favoriteSessions.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-spk-gold/20">
                <svg
                  className="h-8 w-8 text-spk-gold-bright"
                  fill="none"
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
              </div>
              <h2 className="mb-2 text-xl font-bold text-white">
                Ingen favoritter ennå
              </h2>
              <p className="mb-6 text-white/70">
                Merk foredrag som favoritter for å se dem her
              </p>
              <Link href="/" className="spk-btn-primary inline-block px-6 py-3">
                Se agenda
              </Link>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {renderGroup("Nå pågår", current, 0)}
              {renderGroup("Kommende", upcoming, current.length)}
              {renderGroup(
                "Ferdig",
                completed,
                current.length + upcoming.length,
              )}
            </div>
          ))}
      </main>

      <SpkFooter />

      {detailSession && currentTime && (
        <SessionDetail
          session={detailSession}
          currentTime={currentTime}
          isFavorite={favorites.includes(detailSession.id)}
          hasSubmittedFeedback={hasSubmittedFeedback(detailSession.id)}
          onFavoriteToggle={toggleFavorite}
          onFeedbackClick={handleFeedbackClick}
          animateIn={openedViaUi}
          onClose={closeDetail}
        />
      )}

      {feedbackSession && (
        <FeedbackForm
          sessionId={feedbackSession.id}
          sessionTitle={feedbackSession.title || "Ingen tittel"}
          onClose={() => setFeedbackSession(null)}
          onSubmit={async (feedback) => {
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
          }}
        />
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense>
      <FavoritesContent />
    </Suspense>
  );
}
