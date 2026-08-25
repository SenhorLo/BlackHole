import { SOURCES } from "../data/content";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <p className="readout" style={{ marginBottom: "1.25rem" }}>
            de onde vêm os números
          </p>
          <ul className="footer__sources">
            {SOURCES.map((s) => (
              <li key={s.label} className="footer__source">
                <span className="footer__source-label">{s.label}</span>
                <span className="readout">{s.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer__colophon">
            Composto em Jost, Archivo e IBM Plex Mono. O buraco negro do fundo é
            traçado em tempo real: cada pixel segue uma geodésica nula pela métrica de
            Schwarzschild, e o anel de fótons e a curvatura do disco não são desenhados —
            aparecem sozinhos, como consequência da integração.
          </p>
          <a className="footer__top" href="#queda">
            voltar ao infinito
          </a>
        </div>
      </div>
    </footer>
  );
}
