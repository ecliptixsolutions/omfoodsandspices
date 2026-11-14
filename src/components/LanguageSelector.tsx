"use client";

import { locales } from "@/content/site";
import { useLocale } from "./LocaleProvider";

export function LanguageSelector({ className = "", id = "lang-select" }: { className?: string; id?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">Language</label>
      <select
        id={id}
        data-no-translate
        value={locale}
        onChange={(event) => setLocale(event.target.value as "en" | "hi" | "gu")}
        className="w-auto cursor-pointer rounded-full border border-line bg-card py-2 pl-3 pr-8 text-sm font-bold text-ink"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
