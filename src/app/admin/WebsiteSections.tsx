"use client";
import { useEffect, useState, type ReactNode } from "react";
import { infoPages, sourcingPage, type InfoPage } from "@/content/pages";

type EditablePage = InfoPage | typeof sourcingPage;
type Stored = { key: string; draft: EditablePage; published: EditablePage | null; publishedAt: string | null };
const pages: { key: string; label: string; fallback: EditablePage }[] = [
  ...infoPages.map((page) => ({ key: `page:${page.path}`, label: page.path === "/about" ? "About us" : page.title, fallback: page as EditablePage })),
  { key: "page:/sourcing", label: "Sourcing", fallback: sourcingPage },
];

export function WebsiteSections() {
  const [key, setKey] = useState(pages[0].key);
  const [value, setValue] = useState<EditablePage>(pages[0].fallback);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const selected = pages.find((page) => page.key === key)!;
  useEffect(() => { void load(); }, [key]);
  async function load() {
    setMessage("");
    try { const r = await fetch(`/api/admin/content?key=${encodeURIComponent(key)}`, { cache: "no-store" }); const d = await r.json(); if (!r.ok) throw new Error(d.message); const item = d.content as Stored; setValue(item.draft ?? selected.fallback); }
    catch (e) { setValue(selected.fallback); setMessage(e instanceof Error ? e.message : "Could not load this page."); }
  }
  function setText(path: (string | number)[], text: string) {
    setValue((old) => {
      const next = structuredClone(old) as unknown as Record<string, unknown>;
      let target: Record<string, unknown> | unknown[] = next;
      for (const part of path.slice(0, -1)) target = (target as Record<string | number, unknown>)[part] as Record<string, unknown> | unknown[];
      (target as Record<string | number, unknown>)[path[path.length - 1]] = text;
      return next as unknown as EditablePage;
    });
  }
  function setList(path: (string | number)[], value: string[]) {
    setValue((old) => {
      const next = structuredClone(old) as unknown as Record<string, unknown>;
      let target: Record<string | number, unknown> | unknown[] = next;
      for (const part of path.slice(0, -1)) target = (target as Record<string | number, unknown>)[part] as Record<string | number, unknown> | unknown[];
      (target as Record<string | number, unknown>)[path[path.length - 1]] = value;
      return next as unknown as EditablePage;
    });
  }
  async function save(publish: boolean) {
    if (publish && !window.confirm(`Publish ${selected.label} changes to the live website?`)) return;
    setBusy(true); setMessage("");
    try { const r = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value, publish }) }); const d = await r.json(); if (!r.ok) throw new Error(d.message); setMessage(publish ? "Page updates published." : "Draft saved; live page is unchanged."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Could not save this page."); }
    finally { setBusy(false); }
  }
  const isSourcing = key === "page:/sourcing";
  const page = value as InfoPage;
  return <section className="admin-card admin-editor"><div className="admin-card-heading"><div><h2>Website sections</h2><p>Edit existing public pages, save drafts, then publish.</p></div><select className="admin-page-select" value={key} onChange={(e) => { setValue(pages.find(page => page.key === e.target.value)!.fallback); setKey(e.target.value); }} aria-label="Choose website page">{pages.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></div>
    <div className="admin-form-grid"><Field label="Page heading"><input value={isSourcing ? (value as typeof sourcingPage).title.join(" / ") : page.title} onChange={(e) => isSourcing ? setValue({ ...(value as typeof sourcingPage), title: e.target.value.split("/").map((x) => x.trim()).slice(0, 2) as [string, string] }) : setText(["title"], e.target.value)} /></Field><Field label="Eyebrow"><input value={isSourcing ? (value as typeof sourcingPage).eyebrow : page.eyebrow} onChange={(e) => setText(["eyebrow"], e.target.value)} /></Field><Field label="Introduction" wide><textarea rows={3} value={isSourcing ? (value as typeof sourcingPage).intro : page.intro} onChange={(e) => setText(["intro"], e.target.value)} /></Field><Field label="Hero image path"><input value={isSourcing ? (value as typeof sourcingPage).image : page.image} onChange={(e) => setText(["image"], e.target.value)} /></Field><Field label="Image alt text"><input value={isSourcing ? (value as typeof sourcingPage).imageAlt : page.imageAlt} onChange={(e) => setText(["imageAlt"], e.target.value)} /></Field>
      {isSourcing ? <><Field label="SEO title"><input value={(value as typeof sourcingPage).seoTitle} onChange={(e) => setText(["seoTitle"], e.target.value)} /></Field><Field label="SEO description"><textarea rows={2} value={(value as typeof sourcingPage).seoDescription} onChange={(e) => setText(["seoDescription"], e.target.value)} /></Field><Field label="Support heading"><input value={(value as typeof sourcingPage).support.title} onChange={(e) => setText(["support", "title"], e.target.value)} /></Field><Field label="Support description"><textarea rows={3} value={(value as typeof sourcingPage).support.text} onChange={(e) => setText(["support", "text"], e.target.value)} /></Field><Field label="Support points · one per line" wide><textarea rows={3} value={(value as typeof sourcingPage).support.points.join("\n")} onChange={(e) => setList(["support", "points"], e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} /></Field></> : <>
      <Field label="SEO title"><input value={page.seoTitle} onChange={(e) => setText(["seoTitle"], e.target.value)} /></Field><Field label="SEO description"><textarea rows={2} value={page.seoDescription} onChange={(e) => setText(["seoDescription"], e.target.value)} /></Field>
      {page.sections.map((section, index) => <div className="admin-content-slide wide" key={`${section.heading}-${index}`}><h3>{section.heading}</h3><div className="admin-form-grid"><Field label="Section heading"><input value={section.heading} onChange={(e) => setText(["sections", index, "heading"], e.target.value)} /></Field>{section.body !== undefined && <Field label="Section text" wide><textarea rows={4} value={section.body} onChange={(e) => setText(["sections", index, "body"], e.target.value)} /></Field>}{section.placeholder && <p className="admin-hint">This section remains a company-supplied placeholder on the public page.</p>}{section.steps?.map((step, n) => <div className="admin-content-slide wide" key={`${step.title}-${n}`}><h4>Step {n + 1}</h4><Field label="Step heading"><input value={step.title} onChange={(e) => setText(["sections", index, "steps", n, "title"], e.target.value)} /></Field><Field label="Step details"><textarea rows={2} value={step.detail} onChange={(e) => setText(["sections", index, "steps", n, "detail"], e.target.value)} /></Field></div>)}</div></div>)}
      </>}
    </div>
    {message && <p className="admin-inline-message" role="status">{message}</p>}<div className="admin-editor-footer"><button className="admin-secondary-button" disabled={busy} onClick={() => void save(false)}>Save draft</button><button className="admin-primary-button" disabled={busy} onClick={() => void save(true)}>Publish page</button></div>
  </section>;
}
function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={`admin-field ${wide ? "wide" : ""}`}><span>{label}</span>{children}</label>; }
