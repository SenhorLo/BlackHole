import { useEffect, useState } from "react";
import { Rs } from "./Rs";

/**
 * Page-load sequence.
 *
 * The lines arrive out of focus and settle — light that was bent on the way
 * here, resolving. One orchestrated moment rather than scattered effects.
 */
export function Hero() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 260);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="queda" className="station hero" aria-labelledby="queda-title">
      <div className="hero__inner" data-shown={shown}>
        <div className="eyebrow">
          <span className="depth tnum rise rise--1">
            ∞ <Rs />
          </span>
          <span className="eyebrow__rule eyebrow__rule--draw" />
          <span className="readout rise rise--1">observador distante</span>
        </div>

        <h1 id="queda-title" className="hero__title">
          <span className="hero__line rise rise--2">Nada aqui</span>
          <span className="hero__line rise rise--3">
            é <em>escuro</em>.
          </span>
        </h1>

        <p className="hero__lede rise rise--4">
          Buracos negros não emitem luz nenhuma. Ainda assim, a matéria caindo dentro deles
          produz os faróis mais brilhantes do universo conhecido — mais brilhantes que
          galáxias inteiras, visíveis a bilhões de anos-luz.
        </p>

        <div className="hero__cue rise rise--5">
          <span className="hero__cue-line" aria-hidden="true" />
          <span className="readout">role para cair</span>
        </div>
      </div>
    </section>
  );
}
