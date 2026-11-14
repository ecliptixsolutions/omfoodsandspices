"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "@/content/translations";
import { extraTranslations } from "@/content/translations-extra";
import { contentTranslations } from "@/content/translations-content";
import { otherTranslations } from "@/content/translations-other";
import { remainingTranslations } from "@/content/translations-remaining";

type Locale = "en" | "hi" | "gu";
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void };
const LocaleContext = createContext<LocaleContextValue | null>(null);
const localeCodes = new Set<Locale>(["en", "hi", "gu"]);
const originalText = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const dictionaries: Record<Locale, Record<string, string>> = {
  en: {},
  hi: { ...translations.hi, ...extraTranslations.hi, ...contentTranslations.hi, ...otherTranslations.hi, ...remainingTranslations.hi },
  gu: { ...translations.gu, ...extraTranslations.gu, ...contentTranslations.gu, ...otherTranslations.gu, ...remainingTranslations.gu },
};

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used within LocaleProvider");
  return value;
}

function translatePage(locale: Locale) {
  const dictionary = dictionaries[locale];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,code,pre,svg,[data-no-translate]")) continue;
    const original = originalText.get(node) ?? node.textContent ?? "";
    originalText.set(node, original);
    const key = original.trim().replace(/\s+/g, " ");
    if (!key) continue;
    const value = dictionary[key] ?? key;
    const start = original.match(/^\s*/)?.[0] ?? "";
    const end = original.match(/\s*$/)?.[0] ?? "";
    const translated = `${start}${value}${end}`;
    if (node.textContent !== translated) node.textContent = translated;
  }

  for (const element of document.body.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title], img[alt]")) {
    if (element.closest("[data-no-translate]")) continue;
    for (const attribute of ["placeholder", "aria-label", "title", "alt"]) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      let originals = originalAttributes.get(element);
      if (!originals) {
        originals = new Map();
        originalAttributes.set(element, originals);
      }
      const baseValue = originals.get(attribute) ?? value;
      originals.set(attribute, baseValue);
      const key = baseValue.trim().replace(/\s+/g, " ");
      const translated = dictionary[key];
      const displayValue = translated ?? baseValue;
      if (value !== displayValue) element.setAttribute(attribute, displayValue);
    }
  }
}

export function LocaleProvider({ children, initialLocale = "en" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  const setLocale = useCallback((next: Locale) => {
    if (!localeCodes.has(next)) return;
    updateLocale(next);
    document.cookie = `om_locale=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    const apply = () => translatePage(locale);
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
