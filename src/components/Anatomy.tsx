import { useId, useState } from "react";
import { LAYERS } from "../data/content";
import { Rs } from "./Rs";

const C = 200; // svg centre
const MAX = 176; // px for r = 1.0

/**
 * Scale cross-section. The rings are drawn at their true relative radii —
 * the shadow really is 2.6x the horizon, and it looks it.
 */
export function Anatomy() {
  const uid = useId();
  const [open, setOpen] = useState("horizonte");
  const [hover, setHover] = useState<string | null>(null);

  const focus = hover ?? open;
  const active = LAYERS.find((l) => l.id === focus)!;
  const activeR = active.r * MAX;
  const dimAngle = (-38 * Math.PI) / 180;

  return (
    <div className="anatomy panel">
      <div className="anatomy__diagram">
        <svg
          className="anatomy__svg"
          viewBox="0 0 400 400"
          role="img"
          aria-label="Corte em escala de um buraco negro, do disco de acreção até a singularidade"
        >
          <defs>
            <radialGradient id={`${uid}-disk`}>
              <stop offset="57%" stopColor="rgba(255,171,61,0)" />
              <stop offset="63%" stopColor="rgba(255,171,61,0.34)" />
              <stop offset="78%" stopColor="rgba(209,69,47,0.18)" />
              <stop offset="94%" stopColor="rgba(107,20,16,0.06)" />
              <stop offset="100%" stopColor="rgba(107,20,16,0)" />
            </radialGradient>
          </defs>

          {/* the disk, painted rather than outlined */}
          <circle cx={C} cy={C} r={MAX} fill={`url(#${uid}-disk)`} />

          {/* the horizon is the only thing here that is genuinely solid */}
          <circle cx={C} cy={C} r={LAYERS[1].r * MAX} fill="#05040a" />

          {LAYERS.map((l) => (
            <circle
              key={l.id}
              className="anatomy__ring"
              cx={C}
              cy={C}
              r={Math.max(2, l.r * MAX)}
              data-active={l.id === focus}
              data-dim={l.id !== focus}
            />
          ))}

          {/* dimension line for whatever layer is in focus */}
          <line
            className="anatomy__ring"
            data-active="true"
            x1={C}
            y1={C}
            x2={C + Math.cos(dimAngle) * activeR}
            y2={C + Math.sin(dimAngle) * activeR}
            strokeDasharray="2 3"
          />
          <text
            className="anatomy__label"
            data-active="true"
            x={C + Math.cos(dimAngle) * activeR + 8}
            y={C + Math.sin(dimAngle) * activeR - 6}
          >
            {active.radius} rₛ
          </text>

          <circle cx={C} cy={C} r={2} fill="var(--redshift)" />
        </svg>
      </div>

      <ul className="anatomy__list">
        {LAYERS.map((l) => {
          const isOpen = l.id === open;
          return (
            <li
              key={l.id}
              className="anatomy__item"
              onMouseEnter={() => setHover(l.id)}
              onMouseLeave={() => setHover(null)}
            >
              <h3>
                <button
                  type="button"
                  className="anatomy__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`${uid}-${l.id}`}
                  onFocus={() => setHover(l.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => setOpen(isOpen ? "" : l.id)}
                >
                  <span className="anatomy__name">{l.name}</span>
                  <span className="anatomy__radius tnum">
                    {l.radius} <Rs />
                  </span>
                </button>
              </h3>
              <div className="anatomy__panel" data-open={isOpen} id={`${uid}-${l.id}`}>
                <div className="anatomy__panel-inner">
                  <p className="anatomy__body">{l.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
