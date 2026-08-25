import { useEffect } from "react";
import { subscribeToScroll, view } from "../lib/scroll";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Drives the horizon crossing.
 *
 * A tall empty region after the last station darkens the whole viewport to
 * pure black, and holds it there while the footer scrolls up underneath.
 * That is what crossing the horizon looks like from the inside: the outside
 * universe does not vanish in a flash, it redshifts until there is nothing.
 */
export function useEclipse(targetId: string) {
  useEffect(() => {
    let last = -1;

    return subscribeToScroll(() => {
      const el = document.getElementById(targetId);
      if (!el) return;

      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const e = clamp01((vh - top) / (vh * 0.5));

      const q = Math.round(e * 100) / 100;
      if (q === last) return;
      last = q;
      view.eclipse = q;
      document.documentElement.style.setProperty("--eclipse", String(q));
    });
  }, [targetId]);
}
