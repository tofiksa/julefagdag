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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (useful === null || learned === null || explore === null) {
      setError("Vennligst svar på alle spørsmålene");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      await onSubmit({
        sessionId,
        useful,
        learned,
        explore,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Kunne ikke sende tilbakemelding. Prøv igjen.");
      console.error("Error submitting feedback:", err);
      setIsSubmitting(false);
    }
  };

  const EmojiButton = ({
    selected,
    onClick,
    label,
    emoji,
  }: {
    selected: boolean;
    onClick: () => void;
    label: string;
    emoji: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn("spk-form-choice", selected && "spk-form-choice-selected")}
      aria-label={label}
      aria-pressed={selected}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold spk-text-on-light">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-spk-navy-deep/80 p-3 sm:p-4">
      <div className="spk-form-surface max-h-[90vh] w-full max-w-md overflow-y-auto">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold spk-text-on-light sm:text-xl">
            Gi tilbakemelding
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full p-2 spk-text-on-light hover:bg-spk-cream"
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

        <p className="mb-4 break-words spk-form-hint sm:mb-6">{sessionTitle}</p>

        {isSuccess && (
          <div className="spk-form-success mb-4">
            <div className="mb-2 text-4xl">😊</div>
            <p className="text-sm font-semibold spk-text-on-light">
              Takk! Tilbakemeldingen er mottatt
            </p>
          </div>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <div className="mb-3 spk-form-label">Var dette nyttig?</div>
              <div className="flex gap-3 sm:gap-4">
                <EmojiButton
                  selected={useful === true}
                  onClick={() => setUseful(true)}
                  label="Ja"
                  emoji="👍"
                />
                <EmojiButton
                  selected={useful === false}
                  onClick={() => setUseful(false)}
                  label="Nei"
                  emoji="👎"
                />
              </div>
            </div>

            <div>
              <div className="mb-3 spk-form-label">Lærte du noe nytt?</div>
              <div className="flex gap-3 sm:gap-4">
                <EmojiButton
                  selected={learned === true}
                  onClick={() => setLearned(true)}
                  label="Ja"
                  emoji="👍"
                />
                <EmojiButton
                  selected={learned === false}
                  onClick={() => setLearned(false)}
                  label="Nei"
                  emoji="👎"
                />
              </div>
            </div>

            <div>
              <div className="mb-3 spk-form-label">
                Kunne du tenke deg å utforske dette temaet selv?
              </div>
              <div className="flex gap-3 sm:gap-4">
                <EmojiButton
                  selected={explore === true}
                  onClick={() => setExplore(true)}
                  label="Ja"
                  emoji="👍"
                />
                <EmojiButton
                  selected={explore === false}
                  onClick={() => setExplore(false)}
                  label="Nei"
                  emoji="👎"
                />
              </div>
            </div>

            {error && <div className="spk-form-error">{error}</div>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] flex-1 rounded-lg border border-spk-navy/25 bg-white px-4 py-3 font-medium spk-text-on-light transition-colors hover:bg-spk-cream"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="spk-btn-primary min-h-[44px] flex-1"
              >
                {isSubmitting ? "Sender..." : "Send tilbakemelding"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
