import { useEffect } from "react";
import { subscribeToScroll } from "../lib/scroll";

/**
 * Publishes scroll depth as --descent on the root element.
 *
 * Nothing renders from this: it only feeds the gravitational redshift applied
 * to the headings and the masthead fade.
 */
export function useDescent() {
  useEffect(() => {
    let last = -1;
    return subscribeToScroll((m) => {
      const p = Math.round(m.progress * 200) / 200;
      if (p === last) return;
      last = p;
      document.documentElement.style.setProperty("--descent", String(p));
    });
  }, []);
}
