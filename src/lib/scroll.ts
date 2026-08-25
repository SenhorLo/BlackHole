/**
 * One rAF loop for the whole page.
 *
 * The shader needs scroll data every frame but must never trigger a React
 * render, so everything reads from here instead of from component state.
 */

export type ScrollMetrics = {
  /** 0 at the top of the document, 1 at the bottom. */
  progress: number;
  /** Smoothed |dProgress/dt|, used to drive the star streaking. */
  velocity: number;
  /** Seconds since the loop started. */
  time: number;
};

type Listener = (m: ScrollMetrics) => void;

const listeners = new Set<Listener>();
const metrics: ScrollMetrics = { progress: 0, velocity: 0, time: 0 };

let running = false;
let frame = 0;
let startedAt = 0;
let lastTs = 0;
let lastProgress = 0;

function readProgress(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function tick(ts: number) {
  frame = requestAnimationFrame(tick);

  if (!startedAt) startedAt = ts;
  const dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0.016;
  lastTs = ts;

  const p = readProgress();
  const raw = dt > 0 ? Math.abs(p - lastProgress) / dt : 0;
  lastProgress = p;

  metrics.progress = p;
  metrics.time = (ts - startedAt) / 1000;
  // asymmetric smoothing: spike fast on a flick, settle slowly afterwards
  metrics.velocity += (raw - metrics.velocity) * (raw > metrics.velocity ? 0.5 : 0.06);

  for (const fn of listeners) fn(metrics);
}

export function subscribeToScroll(fn: Listener): () => void {
  listeners.add(fn);
  if (!running) {
    running = true;
    frame = requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) {
      cancelAnimationFrame(frame);
      running = false;
      lastTs = 0;
      startedAt = 0;
    }
  };
}

/**
 * Shared view state the shader reads directly. Kept out of React so the
 * renderer never depends on a commit landing.
 */
export const view = { eclipse: 0 };
