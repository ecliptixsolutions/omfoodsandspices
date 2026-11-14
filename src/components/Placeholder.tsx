import { PLACEHOLDER_LABEL } from "@/content/pages";

/**
 * Clearly marked gap for facts the company has not supplied.
 * Never replace these with invented certifications, capacities, export countries or statistics.
 */
export function Placeholder({ hint }: { hint?: string }) {
  return (
    <div className="mt-4 rounded-2xl border-2 border-dashed border-copper-ink/60 bg-card p-5" role="note">
      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-copper-ink">{PLACEHOLDER_LABEL}</p>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
    </div>
  );
}
