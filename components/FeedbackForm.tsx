"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FeedbackFormProps {
  sessionId: string;
  sessionTitle: string;
  onClose: () => void;
  onSubmit: (feedback: {
    sessionId: string;
    useful: boolean;
    learned: boolean;
    explore: boolean;
  }) => Promise<void>;
}

export function FeedbackForm({
  sessionId,
  sessionTitle,
  onClose,
  onSubmit,
}: FeedbackFormProps) {
  const [useful, setUseful] = useState<boolean | null>(null);
  const [learned, setLearned] = useState<boolean | null>(null);
  const [explore, setExplore] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (useful === null || learned === null || explore === null) {
      setError("Vennligst svar på alle spørsmålene");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        sessionId,
        useful,
        learned,
        explore,
      });
      onClose();
    } catch (err) {
      setError("Kunne ikke sende tilbakemelding. Prøv igjen.");
      console.error("Error submitting feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const EmojiButton = ({
    value: currentValue,
    onClick,
    label,
    emoji,
  }: {
    value: boolean | null;
    onClick: () => void;
    label: string;
    emoji: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
        "min-h-[80px] min-w-[90px] flex-1",
        "hover:bg-gray-50 dark:hover:bg-gray-800",
        "sm:gap-2 sm:p-4 sm:min-w-[100px] sm:flex-none",
        currentValue === true
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : currentValue === false
            ? "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
            : "border-gray-200 dark:border-gray-700",
      )}
      aria-label={label}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
            Gi tilbakemelding
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex-shrink-0"
            aria-label="Lukk"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 break-words sm:mb-6">
          {sessionTitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Question 1: Useful */}
          <div>
            <div className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Var dette nyttig?
            </div>
            <div className="flex gap-3 sm:gap-4">
              <EmojiButton
                value={useful === true ? true : null}
                onClick={() => setUseful(true)}
                label="Ja"
                emoji="👍"
              />
              <EmojiButton
                value={useful === false ? true : null}
                onClick={() => setUseful(false)}
                label="Nei"
                emoji="👎"
              />
            </div>
          </div>

          {/* Question 2: Learned */}
          <div>
            <div className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Lærte du noe nytt?
            </div>
            <div className="flex gap-3 sm:gap-4">
              <EmojiButton
                value={learned === true ? true : null}
                onClick={() => setLearned(true)}
                label="Ja"
                emoji="👍"
              />
              <EmojiButton
                value={learned === false ? true : null}
                onClick={() => setLearned(false)}
                label="Nei"
                emoji="👎"
              />
            </div>
          </div>

          {/* Question 3: Explore */}
          <div>
            <div className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Kunne du tenke deg å utforske dette temaet selv?
            </div>
            <div className="flex gap-3 sm:gap-4">
              <EmojiButton
                value={explore === true ? true : null}
                onClick={() => setExplore(true)}
                label="Ja"
                emoji="👍"
              />
              <EmojiButton
                value={explore === false ? true : null}
                onClick={() => setExplore(false)}
                label="Nei"
                emoji="👎"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 min-h-[44px]"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? "Sender..." : "Send tilbakemelding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
