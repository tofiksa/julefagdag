"use client";

import { useCallback, useRef, useState } from "react";

/** Minimum movement before we decide whether the gesture is horizontal. */
const DIRECTION_LOCK_SLOP_PX = 10;
/** Release speed that counts as a deliberate fling. */
const VELOCITY_THRESHOLD_PX_PER_MS = 0.5;

export interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /**
   * Distance (px) the finger must travel before release counts as a swipe.
   * A function is evaluated at release time (e.g. fraction of screen width).
   */
  threshold?: number | (() => number);
  enabled?: boolean;
}

/**
 * Hand-rolled horizontal swipe detection that coexists with vertical
 * scrolling: the gesture only "locks" as horizontal once |dx| > |dy| and
 * |dx| passes a small slop. Once a vertical intent is detected, the touch
 * is ignored and the browser scrolls as normal.
 *
 * Pair with CSS `touch-action: pan-y` on the element for smooth tracking.
 *
 * `offsetX` reports the live horizontal drag offset (0 when idle) so the
 * consumer can let the element follow the finger via `transform`.
 */
export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60,
  enabled = true,
}: UseSwipeGestureOptions) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const gesture = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    direction: "undecided" | "horizontal" | "vertical";
  } | null>(null);

  const reset = useCallback(() => {
    gesture.current = null;
    setOffsetX(0);
    setIsDragging(false);
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || e.touches.length !== 1) return;
      const touch = e.touches[0];
      gesture.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: e.timeStamp,
        direction: "undecided",
      };
    },
    [enabled],
  );

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const current = gesture.current;
    if (!current || current.direction === "vertical") return;

    const touch = e.touches[0];
    const dx = touch.clientX - current.startX;
    const dy = touch.clientY - current.startY;

    if (current.direction === "undecided") {
      if (
        Math.abs(dx) > DIRECTION_LOCK_SLOP_PX &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        current.direction = "horizontal";
        setIsDragging(true);
      } else if (Math.abs(dy) > DIRECTION_LOCK_SLOP_PX) {
        current.direction = "vertical";
        return;
      }
    }

    if (current.direction === "horizontal") {
      setOffsetX(dx);
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const current = gesture.current;
      if (!current) return;

      if (current.direction === "horizontal") {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - current.startX;
        const elapsed = Math.max(e.timeStamp - current.startTime, 1);
        const velocity = Math.abs(dx) / elapsed;
        const requiredDistance =
          typeof threshold === "function" ? threshold() : threshold;

        if (
          Math.abs(dx) >= requiredDistance ||
          velocity >= VELOCITY_THRESHOLD_PX_PER_MS
        ) {
          if (dx > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      }

      reset();
    },
    [threshold, onSwipeLeft, onSwipeRight, reset],
  );

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel: reset,
    },
    offsetX,
    isDragging,
  };
}
