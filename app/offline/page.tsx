"use client";

import { SpkFooter } from "@/components/AppHeader";

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="spk-page flex min-h-screen flex-col">
      <main className="spk-main flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl border-2 border-white/10 bg-spk-navy-deep/60 p-8 text-center">
          <div className="text-5xl" aria-hidden="true">
            📡
          </div>
          <h1 className="mt-4 text-xl font-black text-white">Du er offline</h1>
          <p className="mt-2 text-sm text-white/70">
            Vi får ikke kontakt med nettet akkurat nå. Agendaen lastes inn igjen
            så snart du er tilkoblet.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 rounded-lg bg-spk-gold px-5 py-3 font-bold text-spk-navy transition-colors hover:bg-spk-gold-bright"
          >
            Prøv igjen
          </button>
        </div>
      </main>

      <SpkFooter />
    </div>
  );
}
