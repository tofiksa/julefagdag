"use client";

import { useEffect, useState } from "react";

export function ServiceWorkerRegistration() {
  const [updateReady, setUpdateReady] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let updateInterval: NodeJS.Timeout | null = null;
    let refreshing = false;

    const promptForWorker = (worker: ServiceWorker | null) => {
      if (!worker) return;
      setWaitingWorker(worker);
      setUpdateReady(true);
    };

    // When the new SW takes control, reload once to pick up fresh assets
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    // The activated SW posts SW_UPDATED — surface the reload prompt
    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SW_UPDATED") {
        // controllerchange will handle the reload; nothing else needed here
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);

    // Register service worker in both dev and production
    // In development, it helps test notifications
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope);

        // A worker may already be waiting from a previous load
        if (registration.waiting && navigator.serviceWorker.controller) {
          promptForWorker(registration.waiting);
        }

        // Detect a new worker being installed
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content is available and an old SW is still in control
              promptForWorker(registration.waiting ?? installing);
            }
          });
        });

        // Check for updates every 5 minutes
        updateInterval = setInterval(
          () => {
            registration.update();
          },
          5 * 60 * 1000,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });

    // Cleanup
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, []);

  const handleReload = () => {
    setUpdateReady(false);
    if (waitingWorker) {
      // Ask the waiting worker to activate; controllerchange triggers reload
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  if (!updateReady) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-xl border-2 border-spk-gold bg-spk-navy/95 p-4 shadow-lg backdrop-blur">
        <div className="shrink-0 text-2xl" aria-hidden="true">
          🔄
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">
            Ny versjon tilgjengelig
          </p>
          <p className="text-xs text-white/70">
            Last inn på nytt for å oppdatere agendaen.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReload}
          className="shrink-0 rounded-lg bg-spk-gold px-3 py-2 text-sm font-bold text-spk-navy"
        >
          Oppdater
        </button>
      </div>
    </div>
  );
}
