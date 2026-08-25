/** Distance, in Schwarzschild radii, mapped logarithmically onto page progress. */
const R_TOP = 10000;
const R_BOTTOM = 1.02;

export function depthFromProgress(progress: number): number {
  const a = Math.log10(R_TOP);
  const b = Math.log10(R_BOTTOM);
  return 10 ** (a + (b - a) * Math.min(1, Math.max(0, progress)));
}

/**
 * Schwarzschild time dilation: one second at radius r takes this many
 * seconds for an observer at infinity. Diverges at the horizon.
 */
export function dilationFactor(r: number): number {
  return 1 / Math.sqrt(Math.max(1 - 1 / r, 1e-6));
}

/** Formats seconds as mm:ss,d — the fractional digit keeps the clocks alive. */
export function formatClock(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const m = Math.floor(clamped / 60);
  const s = Math.floor(clamped % 60);
  const d = Math.floor((clamped * 10) % 10);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${d}`;
}

export function formatDepth(r: number): string {
  if (r >= 1000) return Math.round(r / 1000) * 1000 >= 10000 ? "10.000" : Math.round(r).toLocaleString("pt-BR");
  if (r >= 100) return String(Math.round(r));
  if (r >= 10) return r.toFixed(0);
  return r.toFixed(2).replace(".", ",");
}

/** Solar masses -> readable Portuguese. */
export function formatMass(m: number): string {
  if (m >= 1e9) return `${(m / 1e9).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} bilhões`;
  if (m >= 1e6) return `${(m / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} milhões`;
  if (m >= 1e3) return `${(m / 1e3).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  return m.toLocaleString("pt-BR");
}

// ------------------------------------------------------------------ color --

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

const BLUESHIFT = hexToRgb("#79cdff");
const GOLD = hexToRgb("#ffab3d");
const REDSHIFT = hexToRgb("#d1452f");

/**
 * The doppler ramp as a function. t = 0 is the approaching limb, t = 1 the
 * receding one. Used to colour any sequence that runs from outside to inside.
 */
export function rampColor(t: number): string {
  const c = t < 0.5 ? mix(BLUESHIFT, GOLD, t * 2) : mix(GOLD, REDSHIFT, (t - 0.5) * 2);
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}
