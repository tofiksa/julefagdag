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

    let registration: ServiceWorkerRegistration | null = null;
    let updateInterval: NodeJS.Timeout | null = null;
    let refreshing = false;

    const promptForWorker = (worker: ServiceWorker | null) => {
      if (!worker) return;
      setWaitingWorker(worker);
      setUpdateReady(true);
    };

    const checkForUpdate = () => {
      registration?.update().catch(() => {
        // Ignore transient update check failures
      });
    };

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SW_UPDATED") {
        // controllerchange handles reload after the user accepts an update
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkForUpdate();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;
        console.log("Service Worker registered:", reg.scope);

        checkForUpdate();

        if (reg.waiting && navigator.serviceWorker.controller) {
          promptForWorker(reg.waiting);
        }

        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              promptForWorker(reg.waiting ?? installing);
            }
          });
        });

        updateInterval = setInterval(checkForUpdate, 5 * 60 * 1000);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
