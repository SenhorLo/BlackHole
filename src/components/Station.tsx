import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";
import { Rs } from "./Rs";

type Props = {
  id: string;
  depth: string;
  label: string;
  children: ReactNode;
  variant?: "column" | "full";
  className?: string;
};

/**
 * One altitude on the way down. The eyebrow is not decoration — it is the
 * reader's current distance from the singularity, and it only ever decreases.
 */
export function Station({ id, depth, label, children, variant = "column", className }: Props) {
  const { ref, revealed } = useReveal<HTMLElement>();

  const variantClass = variant === "full" ? " station--full" : "";

  return (
    <section
      id={id}
      ref={ref}
      className={`station${variantClass}${className ? ` ${className}` : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="station__inner" data-shown={revealed}>
        <div className="eyebrow reveal">
          <span className="depth tnum">
            {depth} <Rs />
          </span>
          <span className="eyebrow__rule" />
          <span className="readout">{label}</span>
        </div>
        {children}
      </div>
    </section>
  );
}
