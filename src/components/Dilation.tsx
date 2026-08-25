import { useId, useState } from "react";
import { dilationFactor } from "../lib/physics";
import { Rs } from "./Rs";

/** Slider position 0..1000 -> radius 1.001 .. 60 r_s, log-spaced. */
function radiusFor(v: number) {
  const t = v / 1000;
  return 10 ** (Math.log10(1.001) + t * (Math.log10(60) - Math.log10(1.001)));
}

function formatOutside(hours: number): string {
  if (hours < 48) return `${hours.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} horas`;
  const days = hours / 24;
  if (days < 730) return `${days.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} dias`;
  return `${(days / 365.25).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} anos`;
}

export function Dilation() {
  const uid = useId();
  const [v, setV] = useState(420);

  const r = radiusFor(v);
  const factor = dilationFactor(r);

  return (
    <div className="dilation panel">
      <div className="dilation__figures">
        <div className="dilation__figure">
          <span className="readout">seu relógio</span>
          <span className="dilation__num tnum">1 hora</span>
        </div>
        <div className="dilation__figure">
          <span className="readout">relógio distante</span>
          <span className="dilation__num dilation__num--far tnum">
            {formatOutside(factor)}
          </span>
        </div>
      </div>

      <div className="dilation__slider-row">
        <label className="readout" htmlFor={uid}>
          altitude · {r.toFixed(r < 10 ? 3 : 1).replace(".", ",")} <Rs />
        </label>
        <input
          id={uid}
          className="dilation__slider"
          type="range"
          min={0}
          max={1000}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          aria-valuetext={`${r.toFixed(3)} raios de Schwarzschild, dilatação de ${factor.toFixed(2)} vezes`}
        />
        <div className="dilation__legend">
          <span className="readout">
            1,001 <Rs />
          </span>
          <span className="readout">
            60 <Rs />
          </span>
        </div>
      </div>

      <p className="dilation__caption">
        Arraste em direção ao horizonte. A dilatação vale{" "}
        <span className="mark tnum">
          1 / √(1 − <Rs />/r)
        </span> e não tem teto: encostado no
        horizonte, uma hora sua se estica indefinidamente do lado de fora. Quem observa de
        longe nunca vê você atravessar — vê sua imagem congelar, avermelhar e apagar.
      </p>
    </div>
  );
}
