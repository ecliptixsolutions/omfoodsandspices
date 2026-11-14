import type { ElementType } from "react";

type Props = {
  eyebrow?: string;
  /** Line 1 — dark green/near-black */
  line1: string;
  /** Line 2 — copper accent */
  line2?: string;
  as?: ElementType;
  align?: "left" | "center";
  /** "display" = hero/page-title scale, "section" = standard H2 scale */
  size?: "display" | "section";
  className?: string;
  id?: string;
};

/** Eyebrow label + two-tone headline (line 1 dark, line 2 copper). Colours adapt inside `.section-forest` / `.on-dark`. */
export function SectionHeading({ eyebrow, line1, line2, as: Tag = "h2", align = "left", size = "section", className = "", id }: Props) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag id={id} className={size === "display" ? "h-display" : "h-section"}>
        {line1}
        {line2 && (
          <>
            <br className="hidden sm:block" />{" "}
            <span className="tone-accent">{line2}</span>
          </>
        )}
      </Tag>
    </div>
  );
}
