"use client";

import { useState } from "react";
import { setAdminAuthenticated } from "@/lib/admin-auth";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ugyldig passord");
      }

      setAdminAuthenticated(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke logge inn");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="spk-form-surface shadow-lg">
        <h2 className="mb-4 text-2xl font-bold spk-text-on-light">
          Arrangør-innlogging
        </h2>
        <p className="mb-6 spk-form-hint">
          Logg inn for å se tilbakemeldinger fra foredragene
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="spk-form-label">
              Passord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="spk-form-input"
              placeholder="Skriv inn passord"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {error && <div className="spk-form-error">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="spk-btn-primary w-full px-4 py-2"
          >
            {isSubmitting ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
      </div>
    </div>
  );
}
