"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Reads/writes the `?session=<id>` URL parameter that drives the
 * full-screen session detail view.
 *
 * Opening pushes a new history entry so the browser back button closes the
 * view naturally. Closing uses `router.back()` when we pushed the entry
 * ourselves, and falls back to `router.replace` for deep links (where going
 * back would leave the app).
 *
 * `openedViaUi` is false for deep links — used to skip the enter animation.
 */
export function useSessionDetailParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [openedViaUi, setOpenedViaUi] = useState(false);

  // Reset when the view closes through any path (e.g. browser back button).
  useEffect(() => {
    if (!sessionId) {
      setOpenedViaUi(false);
    }
  }, [sessionId]);

  const open = useCallback(
    (id: string) => {
      setOpenedViaUi(true);
      router.push(`${pathname}?session=${encodeURIComponent(id)}`, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const close = useCallback(() => {
    if (openedViaUi) {
      router.back();
    } else {
      router.replace(pathname, { scroll: false });
    }
  }, [router, pathname, openedViaUi]);

  return { sessionId, openedViaUi, open, close };
}
