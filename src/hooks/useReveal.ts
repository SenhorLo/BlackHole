import { useEffect, useRef, useState } from "react";

const SUPPORTED = typeof IntersectionObserver !== "undefined";

/**
 * Marks an element as revealed the first time it enters the viewport.
 * One observer per element, disconnected as soon as it fires.
 *
 * Without IntersectionObserver everything starts revealed, so the content is
 * never hidden behind an effect that cannot run.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(!SUPPORTED);

  useEffect(() => {
    const el = ref.current;
    if (!el || !SUPPORTED) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
