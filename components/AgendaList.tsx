"use client";

import type { Session } from "@prisma/client";
import {
  groupSessionsByStatus,
  isLogisticsSession,
  sortSessionsByTime,
} from "@/lib/utils";
import { SessionCard } from "./SessionCard";

interface AgendaListProps {
  sessions: Session[];
  favorites?: string[];
  onFavoriteToggle?: (sessionId: string) => void;
  onFeedbackClick?: (sessionId: string) => void;
  onOpenDetail?: (sessionId: string) => void;
  currentTime?: Date;
  hasSubmittedFeedback?: (sessionId: string) => boolean;
}

function SessionGroup({
  title,
  sessions,
  favorites,
  currentTime,
  hasSubmittedFeedback,
  onFavoriteToggle,
  onFeedbackClick,
  onOpenDetail,
  startIndex,
}: {
  title: string;
  sessions: Session[];
  favorites: string[];
  currentTime: Date;
  hasSubmittedFeedback?: (sessionId: string) => boolean;
  onFavoriteToggle?: (sessionId: string) => void;
  onFeedbackClick?: (sessionId: string) => void;
  onOpenDetail?: (sessionId: string) => void;
  startIndex: number;
}) {
  if (sessions.length === 0) return null;

  return (
    <section>
      <h2 className="spk-section-bar">{title}</h2>
      <div className="space-y-3 sm:space-y-4">
        {sessions.map((session, i) => {
          const interactive = !isLogisticsSession(session);

          return (
            <SessionCard
              key={session.id}
              session={session}
              currentTime={currentTime}
              index={startIndex + i}
              isFavorite={favorites.includes(session.id)}
              hasSubmittedFeedback={hasSubmittedFeedback?.(session.id) ?? false}
              onFavoriteToggle={interactive ? onFavoriteToggle : undefined}
              onFeedbackClick={interactive ? onFeedbackClick : undefined}
              onOpenDetail={interactive ? onOpenDetail : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}

export function AgendaList({
  sessions,
  favorites = [],
  onFavoriteToggle,
  onFeedbackClick,
  onOpenDetail,
  currentTime = new Date(),
  hasSubmittedFeedback,
}: AgendaListProps) {
  const sortedSessions = sortSessionsByTime(sessions, currentTime);
  const { current, upcoming, completed } = groupSessionsByStatus(
    sortedSessions,
    currentTime,
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <SessionGroup
        title="Nå pågår"
        sessions={current}
        favorites={favorites}
        currentTime={currentTime}
        hasSubmittedFeedback={hasSubmittedFeedback}
        onFavoriteToggle={onFavoriteToggle}
        onFeedbackClick={onFeedbackClick}
        onOpenDetail={onOpenDetail}
        startIndex={0}
      />

      <SessionGroup
        title="Kommende"
        sessions={upcoming}
        favorites={favorites}
        currentTime={currentTime}
        hasSubmittedFeedback={hasSubmittedFeedback}
        onFavoriteToggle={onFavoriteToggle}
        onFeedbackClick={onFeedbackClick}
        onOpenDetail={onOpenDetail}
        startIndex={current.length}
      />

      <SessionGroup
        title="Ferdig"
        sessions={completed}
        favorites={favorites}
        currentTime={currentTime}
        hasSubmittedFeedback={hasSubmittedFeedback}
        onFavoriteToggle={onFavoriteToggle}
        onFeedbackClick={onFeedbackClick}
        onOpenDetail={onOpenDetail}
        startIndex={current.length + upcoming.length}
      />

      {sessions.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/70">Ingen sesjoner funnet.</p>
        </div>
      )}
    </div>
  );
}
