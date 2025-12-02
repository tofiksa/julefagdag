'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function QRCodePage() {
  const url = 'https://julefagdag.vercel.app/'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-4xl px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl md:text-2xl truncate">
              📱 QR-kode
            </h1>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-4 sm:text-sm min-h-[44px] whitespace-nowrap"
            >
              <span className="hidden sm:inline">← Tilbake til agenda</span>
              <span className="sm:hidden">← Tilbake</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 sm:p-12">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Skann QR-koden
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Skann QR-koden med kameraet på telefonen din for å åpne agendaen
            </p>
          </div>

          <div className="relative flex items-center justify-center rounded-lg bg-white p-4 shadow-lg">
            <Image
              src="/qr-code.png"
              alt="QR-kode for Julefagdag 2025"
              width={400}
              height={400}
              className="rounded-lg"
              priority
            />
          </div>

          <div className="w-full max-w-md space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Lenke
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  {url}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Del denne siden med deltakere på arrangementet
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

