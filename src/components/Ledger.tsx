import { FACTS } from "../data/content";
import { rampColor } from "../lib/physics";
import { useReveal } from "../hooks/useReveal";

function Row({ fact, t }: { fact: (typeof FACTS)[number]; t: number }) {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.25);

  return (
    <div className="ledger__row" ref={ref} data-shown={revealed}>
      <div
        className="ledger__figure reveal"
        style={{ ["--row-color" as string]: rampColor(t) }}
      >
        <span className="ledger__value tnum">{fact.value}</span>
        <span className="ledger__unit">{fact.unit}</span>
      </div>
      <div className="reveal reveal--d1">
        <h3 className="ledger__title">{fact.title}</h3>
        <p className="ledger__body">{fact.body}</p>
      </div>
    </div>
  );
}

/**
 * The figures run down the doppler ramp — blue at the top, ember at the
 * bottom — so the list itself cools off the way the disk does outward.
 */
export function Ledger() {
  return (
    <div className="ledger">
      {FACTS.map((f, i) => (
        <Row key={f.title} fact={f} t={i / (FACTS.length - 1)} />
      ))}
    </div>
  );
}
