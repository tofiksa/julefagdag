"use client";

import type { Session } from "@prisma/client";
import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";

interface NotificationBannerProps {
  sessions: Session[];
  currentTime: Date;
}

export function NotificationBanner({
  sessions,
  currentTime,
}: NotificationBannerProps) {
  const { favorites } = useFavorites();
  const [upcomingSession, setUpcomingSession] = useState<Session | null>(null);
  const [minutesUntilStart, setMinutesUntilStart] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const favoriteSessions = sessions.filter((session) =>
      favorites.includes(session.id),
    );

    let nextSession: Session | null = null;
    let minMinutes: number | null = null;

    for (const session of favoriteSessions) {
      const startTime = new Date(session.startTime);
      const timeUntilStart = startTime.getTime() - currentTime.getTime();
      const minutesUntilStart = Math.floor(timeUntilStart / (1000 * 60));

      if (minutesUntilStart > 0 && minutesUntilStart <= 15) {
        if (minMinutes === null || minutesUntilStart < minMinutes) {
          minMinutes = minutesUntilStart;
          nextSession = session;
        }
      }
    }

    setUpcomingSession(nextSession);
    setMinutesUntilStart(minMinutes);
  }, [sessions, favorites, currentTime]);

  if (!upcomingSession || minutesUntilStart === null) {
    return null;
  }

  const minutesText = minutesUntilStart === 1 ? "minutt" : "minutter";

  return (
    <div className="mb-6">
      <div className="rounded-xl border-2 border-spk-gold bg-spk-gold/15 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 text-2xl" aria-hidden="true">
            ⭐
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-spk-gold-bright">
              Kommende favoritt
            </h3>
            <p className="mt-1 break-words text-sm text-white">
              <span className="font-semibold">{upcomingSession.title}</span>
            </p>
            <p className="mt-1 text-xs text-white/70">
              {upcomingSession.room} · Starter om {minutesUntilStart}{" "}
              {minutesText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
