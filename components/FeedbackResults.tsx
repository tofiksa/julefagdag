"use client";

import { useState } from "react";

interface Session {
  id: string;
  title: string;
  speaker: string | null;
  room: string;
  startTime: Date;
  endTime: Date;
  description: string | null;
}

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

interface SessionFeedbackResult {
  session: Session;
  statistics: FeedbackStatistics;
  feedbacks: Feedback[];
}

interface FeedbackResultsProps {
  results: SessionFeedbackResult[];
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="spk-admin-stat">
      <div className="text-sm font-semibold spk-text-on-light-muted">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold spk-text-on-light">{value}</div>
    </div>
  );
}

export function FeedbackResults({ results }: FeedbackResultsProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const selectedResult = results.find(
    (r) => r.session.id === selectedSessionId,
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("no-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("no-NO", {
      day: "numeric",
      month: "long",
    });
  };

  if (selectedResult) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedSessionId(null)}
          className="flex items-center gap-2 font-medium text-spk-gold-bright hover:text-white"
        >
          <svg
            className="h-5 w-5"
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
          Tilbake til oversikt
        </button>

        <div className="spk-admin-panel">
          <h2 className="mb-2 text-2xl font-bold spk-text-on-light">
            {selectedResult.session.title}
          </h2>
          {selectedResult.session.speaker && (
            <p className="mb-1 spk-form-hint">
              <span className="font-semibold spk-text-on-light">
                Foredragsholder:
              </span>{" "}
              {selectedResult.session.speaker}
            </p>
          )}
          <p className="mb-4 spk-form-meta">
            {formatDate(selectedResult.session.startTime)} kl.{" "}
            {formatTime(selectedResult.session.startTime)} -{" "}
            {formatTime(selectedResult.session.endTime)} •{" "}
            {selectedResult.session.room}
          </p>

          {selectedResult.statistics.totalFeedback === 0 ? (
            <div className="rounded-xl bg-spk-cream p-6 text-center spk-form-hint">
              Ingen tilbakemeldinger mottatt for dette foredraget
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatBox
                  label="Totalt antall"
                  value={selectedResult.statistics.totalFeedback}
                />
                <StatBox
                  label="Nyttig"
                  value={`${selectedResult.statistics.usefulCount} (${selectedResult.statistics.usefulPercentage}%)`}
                />
                <StatBox
                  label="Lært noe"
                  value={`${selectedResult.statistics.learnedCount} (${selectedResult.statistics.learnedPercentage}%)`}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold spk-text-on-light">
                  Detaljert oversikt
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      label: "Fikk noe nyttig ut av foredraget",
                      count: selectedResult.statistics.usefulCount,
                      pct: selectedResult.statistics.usefulPercentage,
                      bar: "bg-spk-navy",
                    },
                    {
                      label: "Lærte noe nytt",
                      count: selectedResult.statistics.learnedCount,
                      pct: selectedResult.statistics.learnedPercentage,
                      bar: "bg-spk-gold",
                    },
                    {
                      label: "Vil utforske videre",
                      count: selectedResult.statistics.exploreCount,
                      pct: selectedResult.statistics.explorePercentage,
                      bar: "bg-spk-coral",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-spk-navy/10 bg-spk-cream p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-semibold spk-text-on-light">
                          {item.label}
                        </span>
                        <span className="shrink-0 spk-form-meta">
                          {item.count} av{" "}
                          {selectedResult.statistics.totalFeedback}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white">
                        <div
                          className={`h-full ${item.bar} transition-all`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Tilbakemeldinger per foredrag
      </h2>

      {results.length === 0 ? (
        <div className="spk-admin-panel text-center spk-form-hint">
          Ingen foredrag funnet
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <button
              key={result.session.id}
              onClick={() => setSelectedSessionId(result.session.id)}
              className="spk-admin-panel w-full text-left transition-colors hover:bg-spk-cream"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold spk-text-on-light">
                    {result.session.title}
                  </h3>
                  {result.session.speaker && (
                    <p className="mt-1 spk-form-hint">
                      {result.session.speaker}
                    </p>
                  )}
                  <p className="mt-1 spk-form-meta">
                    {formatTime(result.session.startTime)} -{" "}
                    {formatTime(result.session.endTime)} • {result.session.room}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="rounded-full bg-spk-navy px-3 py-1 text-sm font-semibold text-white">
                    {result.statistics.totalFeedback} tilbakemelding
                    {result.statistics.totalFeedback !== 1 ? "er" : ""}
                  </div>
                  {result.statistics.totalFeedback > 0 && (
                    <div className="spk-form-meta">
                      {result.statistics.usefulPercentage}% nyttig
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
