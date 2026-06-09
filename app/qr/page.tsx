"use client";

import Image from "next/image";
import Link from "next/link";
import { AppHeader, SpkFooter } from "@/components/AppHeader";

export default function QRCodePage() {
  const url = "https://agendaen.vercel.app/";

  return (
    <div className="spk-page">
      <AppHeader
        title={
          <h1 className="truncate text-lg font-black text-white sm:text-xl md:text-2xl">
            📱 QR-kode
          </h1>
        }
        actions={
          <Link href="/" className="spk-nav-link">
            <span className="hidden sm:inline">← Tilbake til agenda</span>
            <span className="sm:hidden">← Tilbake</span>
          </Link>
        }
      />

      <main className="spk-main">
        <div className="flex flex-col items-center justify-center space-y-6 rounded-xl border border-white/10 bg-white p-8 sm:p-12">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-spk-navy sm:text-3xl">
              Skann QR-koden
            </h2>
            <p className="mb-6 text-spk-navy/70">
              Skann QR-koden med kameraet på telefonen din for å åpne agendaen
            </p>
          </div>

          <div className="relative flex items-center justify-center rounded-xl bg-spk-cream p-4">
            <Image
              src="/qr-code.png"
              alt="QR-kode for Inspirasjonsdag 2026"
              width={400}
              height={400}
              className="rounded-lg"
              priority
            />
          </div>

          <div className="w-full max-w-md space-y-4 rounded-xl bg-spk-cream p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-spk-gold/30">
                <svg
                  className="h-5 w-5 text-spk-navy"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-spk-navy">Lenke</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-spk-navy/80 hover:text-spk-navy hover:underline"
                >
                  {url}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-spk-navy/60">
              Del denne siden med deltakere på arrangementet
            </p>
          </div>
        </div>
      </main>

      <SpkFooter />
    </div>
  );
}
