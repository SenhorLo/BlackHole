import { MASS_POINTS } from "../data/content";
import { formatMass } from "../lib/physics";

const LOG_MIN = 1; // 10 massas solares
const LOG_MAX = 11; // 100 bilhões

const CLASS_COLOR: Record<string, string> = {
  estelar: "var(--blueshift)",
  intermediário: "var(--gold)",
  supermassivo: "var(--redshift)",
};

const DECADES = [1, 3, 5, 7, 9, 11];
const SUPER = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

function superscript(n: number) {
  return String(n)
    .split("")
    .map((d) => SUPER[Number(d)])
    .join("");
}

function pos(mass: number) {
  return ((Math.log10(mass) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
}

/**
 * Nine orders of magnitude do not fit on a linear axis, and pretending
 * otherwise is the usual way this comparison gets ruined.
 */
export function MassScale() {
  return (
    <div className="scale">
      <div className="scale__ruler">
        {DECADES.map((d) => (
          <div key={d} className="scale__decade" style={{ left: `${pos(10 ** d)}%` }}>
            <span className="scale__decade-label">
              10{superscript(d)} M☉
            </span>
          </div>
        ))}

        {MASS_POINTS.map((p, i) => {
          const x = pos(p.mass);
          const lane = i % 2;
          const height = lane === 0 ? "6.5rem" : "12rem";
          const anchor = x < 12 ? "0" : x > 88 ? "-100%" : "-50%";

          return (
            <div
              key={p.name}
              className="scale__point"
              style={{
                left: `${x}%`,
                height,
                ["--point-color" as string]: CLASS_COLOR[p.klass],
              }}
            >
              <span className="scale__dot" />
              <div className="scale__caption" style={{ transform: `translateX(${anchor})` }}>
                <p className="scale__name">{p.name}</p>
                <p className="scale__mass tnum">{formatMass(p.mass)} M☉</p>
                <p className="scale__detail">{p.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="readout scale__axis-label">
        massa, em massas solares — escala logarítmica
      </p>

      <ul className="scale__list">
        {MASS_POINTS.map((p) => (
          <li
            key={p.name}
            className="scale__list-item"
            style={{ ["--point-color" as string]: CLASS_COLOR[p.klass] }}
          >
            <p className="scale__name">{p.name}</p>
            <p className="scale__mass tnum">{formatMass(p.mass)} M☉ · {p.klass}</p>
            <p className="scale__detail">{p.detail}</p>
            <span
              className="scale__list-bar"
              style={{ width: `${Math.max(4, pos(p.mass))}%` }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
