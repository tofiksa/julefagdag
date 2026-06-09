"use client";

import { useState } from "react";

interface EventFeedbackFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function EventFeedbackForm({
  onSuccess,
  onClose,
}: EventFeedbackFormProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!comment.trim() && !rating) {
      setError("Vennligst gi enten en kommentar eller en vurdering");
      setIsSubmitting(false);
      return;
    }

    if (comment.trim() && comment.length > 1000) {
      setError("Kommentaren kan ikke være lengre enn 1000 tegn");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/event-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment.trim(),
          rating: rating || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Kunne ikke sende tilbakemelding");
      }

      setIsSuccess(true);
      setComment("");
      setRating(null);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke sende tilbakemelding",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="spk-form-success">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl" aria-hidden="true">
            ⭐
          </span>
          <p className="font-semibold spk-text-on-light">
            Takk for tilbakemeldingen!
          </p>
        </div>
      </div>
    );
  }

  const activeRating = hoveredRating ?? rating;

  return (
    <div className="spk-form-surface">
      <h3 className="mb-3 text-lg font-bold spk-text-on-light">
        💬 Gi tilbakemelding til hele fagdagen
      </h3>
      <p className="mb-4 spk-form-hint">
        Vi setter pris på din tilbakemelding! Del gjerne dine tanker om
        arrangementet.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="spk-form-label">Vurder fagdagen (valgfritt)</span>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = activeRating !== null && star <= activeRating;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setError(null);
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-spk-gold/40"
                  aria-label={`Gi ${star} ${star === 1 ? "stjerne" : "stjerner"}`}
                >
                  <svg
                    className={`h-8 w-8 ${
                      filled
                        ? "fill-spk-gold-bright text-spk-gold-bright"
                        : "fill-spk-star-empty text-spk-star-empty"
                    }`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              );
            })}
            {rating && (
              <span className="ml-2 spk-form-hint">
                {rating} {rating === 1 ? "stjerne" : "stjerner"}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="event-comment" className="spk-form-label">
            Din kommentar
          </label>
          <textarea
            id="event-comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError(null);
            }}
            rows={4}
            maxLength={1000}
            className="spk-form-input"
            placeholder="Skriv din tilbakemelding her (valgfritt)..."
            disabled={isSubmitting}
          />
          <div className="mt-1 spk-form-meta">
            <span>{comment.length} / 1000 tegn</span>
          </div>
        </div>

        {error && <div className="spk-form-error">{error}</div>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || (!comment.trim() && !rating)}
            className="spk-btn-primary flex-1 px-4 py-2"
          >
            {isSubmitting ? "Sender..." : "Send tilbakemelding"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-spk-navy/25 px-4 py-2 font-medium spk-text-on-light transition-colors hover:bg-spk-cream disabled:cursor-not-allowed disabled:text-spk-star-empty"
            >
              Avbryt
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
