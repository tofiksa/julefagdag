"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "pwa_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIosDevice = /iphone|ipad|ipod/i.test(ua);
  // iPadOS 13+ reports as Mac; detect via touch support
  const isIpadOs = /macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  return isIosDevice || isIpadOs;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isStandalone()) {
      return;
    }

    if (localStorage.getItem(DISMISS_KEY) === "true") {
      return;
    }

    setDismissed(false);

    // Android / Chromium: capture the native install event
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari never fires beforeinstallprompt — show manual hint instead
    if (isIos()) {
      setShowIosHint(true);
    }

    // Hide once installed
    const installedHandler = () => {
      setDeferredPrompt(null);
      setShowIosHint(false);
      setDismissed(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIosHint(false);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // ignore storage failures
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      handleDismiss();
    } else {
      setDeferredPrompt(null);
    }
  };

  if (dismissed) return null;
  if (!deferredPrompt && !showIosHint) return null;

  return (
    <div className="mb-6">
      <div className="rounded-xl border-2 border-spk-gold bg-spk-gold/15 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 text-2xl" aria-hidden="true">
            📲
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-spk-gold-bright">
              Installer appen
            </h3>

            {deferredPrompt ? (
              <>
                <p className="mt-1 text-sm text-white">
                  Legg agendaen til på hjemskjermen for rask tilgang og varsler.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleInstall}
                    className="rounded-lg bg-spk-gold px-4 py-2 text-sm font-bold text-spk-navy"
                  >
                    Installer
                  </button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white/70"
                  >
                    Ikke nå
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-white">
                  Trykk på Del-knappen <span aria-hidden="true">⎋</span>{" "}
                  nederst, og velg{" "}
                  <span className="font-semibold">
                    «Legg til på Hjem-skjerm»
                  </span>
                  .
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white/70"
                  >
                    Lukk
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
