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
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {selectedResult.session.title}
          </h2>
          {selectedResult.session.speaker && (
            <p className="mb-1 text-gray-600 dark:text-gray-400">
              <span className="font-medium">Foredragsholder:</span>{" "}
              {selectedResult.session.speaker}
            </p>
          )}
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-500">
            {formatDate(selectedResult.session.startTime)} kl.{" "}
            {formatTime(selectedResult.session.startTime)} -{" "}
            {formatTime(selectedResult.session.endTime)} •{" "}
            {selectedResult.session.room}
          </p>

          {selectedResult.statistics.totalFeedback === 0 ? (
            <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              Ingen tilbakemeldinger mottatt for dette foredraget
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistics Overview */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Totalt antall
                  </div>
                  <div className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {selectedResult.statistics.totalFeedback}
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Nyttig
                  </div>
                  <div className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
                    {selectedResult.statistics.usefulCount} (
                    {selectedResult.statistics.usefulPercentage}%)
                  </div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Lært noe
                  </div>
                  <div className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {selectedResult.statistics.learnedCount} (
                    {selectedResult.statistics.learnedPercentage}%)
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Detaljert oversikt
                </h3>

                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Fikk noe nyttig ut av foredraget
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedResult.statistics.usefulCount} av{" "}
                        {selectedResult.statistics.totalFeedback}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${selectedResult.statistics.usefulPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Lærte noe nytt
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedResult.statistics.learnedCount} av{" "}
                        {selectedResult.statistics.totalFeedback}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${selectedResult.statistics.learnedPercentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Vil utforske videre
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedResult.statistics.exploreCount} av{" "}
                        {selectedResult.statistics.totalFeedback}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-purple-500 transition-all"
                        style={{
                          width: `${selectedResult.statistics.explorePercentage}%`,
                        }}
                      />
                    </div>
                  </div>
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Tilbakemeldinger per foredrag
      </h2>

      {results.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          Ingen foredrag funnet
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <button
              key={result.session.id}
              onClick={() => setSelectedSessionId(result.session.id)}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {result.session.title}
                  </h3>
                  {result.session.speaker && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {result.session.speaker}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {formatTime(result.session.startTime)} -{" "}
                    {formatTime(result.session.endTime)} • {result.session.room}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {result.statistics.totalFeedback} tilbakemelding
                    {result.statistics.totalFeedback !== 1 ? "er" : ""}
                  </div>
                  {result.statistics.totalFeedback > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
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
