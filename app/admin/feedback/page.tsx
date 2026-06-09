"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { FeedbackResults } from "@/components/FeedbackResults";
import {
  isAdminAuthenticated,
  logoutAdmin,
  setAdminAuthenticated,
} from "@/lib/admin-auth";

interface Feedback {
  id: string;
  useful: boolean;
  learned: boolean;
  explore: boolean;
  createdAt: Date;
}

interface FeedbackStatistics {
  totalFeedback: number;
  usefulCount: number;
  learnedCount: number;
  exploreCount: number;
  usefulPercentage: number;
  learnedPercentage: number;
  explorePercentage: number;
}

interface Session {
  id: string;
  title: string;
  speaker: string | null;
  room: string;
  startTime: Date;
  endTime: Date;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SessionFeedbackResult {
  session: Session;
  statistics: FeedbackStatistics;
  feedbacks: Feedback[];
}

interface EventFeedback {
  id: string;
  comment: string;
  rating: number | null;
  createdAt: Date;
}

export default function AdminFeedbackPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SessionFeedbackResult[]>([]);
  const [eventFeedbacks, setEventFeedbacks] = useState<EventFeedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    if (typeof window !== "undefined") {
      setAuthenticated(isAdminAuthenticated());
      setLoading(false);
    }
  }, []);

  const fetchResults = useCallback(async () => {
    try {
      const response = await fetch("/api/feedback/results", {
        cache: "no-store",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        // If unauthorized, clear authentication and redirect to login
        if (response.status === 401) {
          logoutAdmin();
          setAuthenticated(false);
          setResults([]);
          setEventFeedbacks([]);
          return;
        }
        throw new Error("Kunne ikke hente tilbakemeldinger");
      }

      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "En feil oppstod");
    }
  }, []);

  const fetchEventFeedbacks = useCallback(async () => {
    try {
      const response = await fetch("/api/event-feedback", {
        cache: "no-store",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logoutAdmin();
          setAuthenticated(false);
          setResults([]);
          setEventFeedbacks([]);
          return;
        }
        throw new Error("Kunne ikke hente event-tilbakemeldinger");
      }

      const data = await response.json();
      setEventFeedbacks(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Kunne ikke hente event-tilbakemeldinger";
      console.error("Error fetching event feedbacks:", err);
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    // Fetch feedback results when authenticated
    if (authenticated) {
      fetchResults();
      fetchEventFeedbacks();
      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchResults();
        fetchEventFeedbacks();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [authenticated, fetchResults, fetchEventFeedbacks]);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setAdminAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // Clear server-side cookie
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      // Clear client-side authentication and all sensitive data
      logoutAdmin();
      setAuthenticated(false);
      setResults([]);
      setEventFeedbacks([]);
    }
  };

  if (loading) {
    return (
      <div className="spk-page flex min-h-screen items-center justify-center">
        <div className="text-white/90">Laster...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="spk-page flex min-h-screen items-center justify-center">
        <AdminLoginForm onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="spk-page">
      <header className="spk-header">
        <div className="spk-header-inner">
          <h1 className="text-lg font-black text-white sm:text-xl md:text-2xl">
            📊 Tilbakemeldinger
          </h1>
          <button type="button" onClick={handleLogout} className="spk-nav-link">
            Logg ut
          </button>
        </div>
      </header>

      <main className="spk-main">
        {error && <div className="spk-alert-error mb-4">{error}</div>}

        <div className="spk-admin-panel mb-8">
          <h2 className="mb-4 text-2xl font-bold spk-text-on-light">
            💬 Tilbakemeldinger til hele arrangementet
          </h2>
          {eventFeedbacks.length === 0 ? (
            <div className="rounded-xl bg-spk-cream p-6 text-center spk-form-hint">
              Ingen tilbakemeldinger mottatt ennå
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="spk-admin-stat">
                  <div className="text-sm font-semibold spk-text-on-light-muted">
                    Totalt antall tilbakemeldinger
                  </div>
                  <div className="mt-1 text-2xl font-bold spk-text-on-light">
                    {eventFeedbacks.length}
                  </div>
                </div>
                {(() => {
                  const ratings = eventFeedbacks
                    .map((f) => f.rating)
                    .filter((rating): rating is number => rating !== null);
                  const avgRating =
                    ratings.length > 0
                      ? (
                          ratings.reduce((a, b) => a + b, 0) / ratings.length
                        ).toFixed(1)
                      : "0";
                  const ratingCount = ratings.length;

                  return (
                    <div className="spk-admin-stat bg-spk-gold">
                      <div className="text-sm font-semibold spk-text-on-light-muted">
                        Gjennomsnittlig vurdering
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="text-2xl font-bold spk-text-on-light">
                          {avgRating}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(Number(avgRating))
                                  ? "fill-spk-navy text-spk-navy"
                                  : "fill-spk-star-empty text-spk-star-empty"
                              }`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <div className="spk-form-hint">
                          ({ratingCount}{" "}
                          {ratingCount === 1 ? "vurdering" : "vurderinger"})
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {(() => {
                const ratingCounts = [1, 2, 3, 4, 5].map(
                  (star) =>
                    eventFeedbacks.filter((f) => f.rating === star).length,
                );
                const totalRatings = ratingCounts.reduce((a, b) => a + b, 0);

                if (totalRatings === 0) return null;

                return (
                  <div className="rounded-xl border border-spk-navy/10 bg-spk-cream p-4">
                    <h3 className="mb-3 text-sm font-semibold spk-text-on-light">
                      Vurderingsfordeling
                    </h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star - 1];
                        const percentage =
                          totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <div className="flex w-20 items-center gap-1">
                              <span className="text-sm font-semibold spk-text-on-light">
                                {star}
                              </span>
                              <svg
                                className="h-4 w-4 fill-spk-gold-bright text-spk-gold-bright"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="h-2 overflow-hidden rounded-full bg-white">
                                <div
                                  className="h-full bg-spk-gold transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-16 text-right spk-form-meta">
                              {count} ({Math.round(percentage)}%)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="max-h-96 space-y-3 overflow-y-auto">
                {eventFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-xl border border-spk-navy/10 bg-spk-cream p-4"
                  >
                    {feedback.comment && (
                      <p className="whitespace-pre-wrap spk-text-on-light">
                        {feedback.comment}
                      </p>
                    )}
                    {feedback.rating !== null && (
                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-5 w-5 ${
                              feedback.rating !== null &&
                              star <= feedback.rating
                                ? "fill-spk-gold-bright text-spk-gold-bright"
                                : "fill-spk-star-empty text-spk-star-empty"
                            }`}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                        <span className="ml-1 spk-form-hint">
                          {feedback.rating} / 5
                        </span>
                      </div>
                    )}
                    <p className="mt-2 spk-form-meta">
                      {new Date(feedback.createdAt).toLocaleString("no-NO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Feedback Results */}
        <FeedbackResults results={results} />
      </main>
    </div>
  );
}
