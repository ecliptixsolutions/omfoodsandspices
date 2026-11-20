"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { products as fallbackProducts, type Product } from "@/content/products";
import { site, whatsappLink } from "@/content/site";
import {
  PACKAGING_OPTIONS,
  QUANTITY_UNITS,
  TIMELINE_OPTIONS,
  productListText,
  validateEnquiry,
  sanitizePhoneInput,
  type EnquiryPayload,
  type EnquiryType,
  type FieldErrors,
} from "@/lib/enquiry";
import { COUNTRIES } from "@/lib/countries";
import { ArrowUpRight, Check, WhatsAppIcon } from "./Icons";
import type { ContactSettings } from "@/lib/site-content.server";
import type { PublicCategory } from "@/lib/products.server";

type Props = {
  initialSlugs?: string[];
  initialType?: EnquiryType;
  /** Unique prefix so ids don't clash when the form exists twice on a page (modal + page) */
  idPrefix?: string;
  products?: Product[];
  contact?: ContactSettings;
  categories?: PublicCategory[];
};

const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (key: string, opts: { action: string }) => Promise<string>;
    };
  }
}

function loadRecaptcha() {
  if (!RECAPTCHA_KEY || document.getElementById("recaptcha-script")) return;
  const s = document.createElement("script");
  s.id = "recaptcha-script";
  s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_KEY}`;
  s.async = true;
  document.head.appendChild(s);
}

export function EnquiryForm({ initialSlugs = [], initialType = "quote", idPrefix, products = fallbackProducts, contact = site.contact, categories = [{slug:"onion",name:"Onion",description:"",image:"",displayOrder:0},{slug:"garlic",name:"Garlic",description:"",image:"",displayOrder:1}] }: Props) {
  const autoId = useId();
  const pre = idPrefix ?? autoId.replace(/:/g, "");
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const initialNames = useMemo(
    () => products.filter((p) => initialSlugs.includes(p.slug)).map((p) => p.name),
    [initialSlugs],
  );

  const [type, setType] = useState<EnquiryType>(initialType);
  const [selected, setSelected] = useState<string[]>(initialNames);
  const [unit, setUnit] = useState<string>(initialType === "sample" ? QUANTITY_UNITS[0] : "kg");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);

  useEffect(() => {
    statusRef.current?.focus();
  }, [status]);

  const isSample = unit === "Sample / Trial Order";
  const waText = `Hello OM Food and Spices LLP, I would like to ${type === "sample" ? "request a sample" : "request a quotation"} for ${productListText(selected)}.`;

  function toggleProduct(name: string) {
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
    setErrors((e) => ({ ...e, products: undefined }));
  }

  function changeType(t: EnquiryType) {
    setType(t);
    setErrors(current => ({ ...current, quantity: undefined, unit: undefined, type: undefined }));
    if (t === "sample") setUnit(QUANTITY_UNITS[0]);
    else if (unit === QUANTITY_UNITS[0]) setUnit("kg");
  }

  function readPayload(form: HTMLFormElement): EnquiryPayload {
    const fd = new FormData(form);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    const payload: EnquiryPayload = {
      type,
      name: g("name"),
      company: g("company"),
      email: g("email"),
      phone: g("phone"),
      country: g("country"),
      products: selected,
      formSize: g("formSize"),
      quantity: isSample ? "" : g("quantity"),
      unit,
      packaging: g("packaging"),
      destination: g("destination"),
      timeline: g("timeline"),
      message: g("message"),
      website: g("website"),
      startedAt: startedAt.current,
    };

    return payload;
  }
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const payload = readPayload(e.currentTarget);
    const found = validateEnquiry(payload, products.map(p => p.name));
    setErrors(found);
    const keys = Object.keys(found);
    if (keys.length) {
      const first = keys[0];
      const el =
        first === "products"
          ? document.getElementById(`${pre}-products`)
          : (formRef.current?.elements.namedItem(first) as HTMLElement | null);
      el?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage("");
    try {
      if (RECAPTCHA_KEY && window.grecaptcha) {
        payload.recaptchaToken = await new Promise<string>((resolve, reject) =>
          window.grecaptcha!.ready(() => window.grecaptcha!.execute(RECAPTCHA_KEY, { action: "enquiry" }).then(resolve, reject)),
        );
      }
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: FieldErrors };
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerMessage(data.message ?? "Sorry, your enquiry could not be sent.");
      setStatus("error");
    } catch {
      setServerMessage("Sorry, we could not reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  /* ---------- success ---------- */
  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="py-6 text-center outline-none">
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-success text-on-forest">
          <Check size={28} />
        </span>
        <h3 className="text-2xl">Thank you — your enquiry has been sent.</h3>
        <p className="mx-auto mt-3 max-w-md">
          The team will reply directly. We are available {contact.hours} (subject to holiday variations). Availability, specifications and pricing are confirmed by the company.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a className="btn btn-primary" href={whatsappLink(waText, contact.whatsappNumber)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={18} /> Also message us on WhatsApp
          </a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              startedAt.current = Date.now();
              setStatus("idle");
            }}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const errCount = Object.values(errors).filter(Boolean).length;
  const err = (k: keyof FieldErrors) => errors[k];
  const describe = (k: keyof FieldErrors) => (err(k) ? `${pre}-${k}-err` : undefined);
  const groups = categories.map((category) => [category.name, products.filter((p) => p.category === category.slug)] as const).filter(([,list])=>list.length);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      onBlurCapture={() => { if (Object.values(errors).some(Boolean) && formRef.current) setErrors(validateEnquiry(readPayload(formRef.current), products.map(p => p.name))); }}
      onFocusCapture={loadRecaptcha}
      aria-describedby={`${pre}-note`}
      className="space-y-6"
    >
      {/* Status / errors announced to screen readers */}
      <div ref={statusRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {status === "error" && (
          <div role="alert" className="rounded-xl border border-error bg-card p-4 text-error">
            <p className="font-bold">{serverMessage}</p>
            <p className="mt-1 text-sm text-body">
              You can also call{" "}
              <a className="font-bold underline" href={`tel:${contact.phoneTel}`}>{contact.phoneDisplay}</a>, email{" "}
              <a className="font-bold underline" href={`mailto:${contact.email}`}>{contact.email}</a>, or{" "}
              <a className="font-bold underline" href={whatsappLink(waText, contact.whatsappNumber)} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a>.
            </p>
          </div>
        )}
        {errCount > 0 && status !== "error" && (
          <p role="alert" className="rounded-xl border border-error bg-card p-3 text-sm font-bold text-error">
            Please check the highlighted fields.
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people and assistive tech; bots fill it in */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset>
        <legend className="field-label">I would like to</legend>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["quote", "Get a quotation"],
              ["sample", "Get a sample"],
            ] as const
          ).map(([v, label]) => (
            <label
              key={v}
              className={`flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-sm font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-copper-ink ${
                type === v ? "border-copper-ink bg-beige text-ink" : "border-line bg-card text-ink"
              }`}
            >
              <input type="radio" name="type" value={v} checked={type === v} onChange={() => changeType(v)} className="accent-[var(--brand-copper-ink)]" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {err("type") && <p className="field-error">{err("type")}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor={`${pre}-name`}>Name *</label>
          <input id={`${pre}-name`} name="name" maxLength={160} className="field" autoComplete="name" required aria-required="true" aria-invalid={!!err("name")} aria-describedby={describe("name")} />
          {err("name") && <p id={`${pre}-name-err`} className="field-error">{err("name")}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor={`${pre}-company`}>Company</label>
          <input id={`${pre}-company`} name="company" maxLength={200} className="field" autoComplete="organization" aria-invalid={!!err("company")} aria-describedby={describe("company")} />
          {err("company") && <p id={`${pre}-company-err`} className="field-error">{err("company")}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor={`${pre}-email`}>Email *</label>
          <input id={`${pre}-email`} name="email" maxLength={255} type="email" className="field" autoComplete="email" required aria-required="true" aria-invalid={!!err("email")} aria-describedby={describe("email")} />
          {err("email") && <p id={`${pre}-email-err`} className="field-error">{err("email")}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor={`${pre}-phone`}>Phone / WhatsApp</label>
          <input id={`${pre}-phone`} name="phone" maxLength={60} type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="+91 81407 12205"
            onChange={event => {
              event.currentTarget.value = sanitizePhoneInput(event.currentTarget.value);
              if (errors.phone && formRef.current) setErrors(current => ({ ...current, phone: validateEnquiry(readPayload(formRef.current!)).phone }));
            }}
            onBlur={() => { if (formRef.current) setErrors(current => ({ ...current, phone: validateEnquiry(readPayload(formRef.current!)).phone })); }}
            aria-invalid={!!err("phone")} aria-describedby={describe("phone")} />
          {err("phone") && <p id={`${pre}-phone-err`} className="field-error">{err("phone")}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor={`${pre}-country`}>Country *</label>
          <select id={`${pre}-country`} name="country" className="field" autoComplete="country-name" required aria-required="true" defaultValue="" aria-invalid={!!err("country")} aria-describedby={describe("country")}><option value="">Select a country</option>{COUNTRIES.map(country => <option key={country.code} value={country.name}>{country.name}</option>)}</select>
          {err("country") && <p id={`${pre}-country-err`} className="field-error">{err("country")}</p>}
        </div>
      </div>

      <fieldset aria-describedby={describe("products")}>
        <legend className="field-label">Product(s) * <span className="font-normal text-body">— select one or more</span></legend>
        <div id={`${pre}-products`} tabIndex={-1} className="outline-none">
          {groups.map(([label, list]) => (
            <div key={label} className="mb-3">
              <p className="eyebrow mb-2">{label}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {list.map((p) => (
                  <label
                    key={p.slug}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm font-semibold text-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-copper-ink ${
                      selected.includes(p.name) ? "border-copper-ink bg-beige" : "border-line bg-card"
                    }`}
                  >
                    <input type="checkbox" checked={selected.includes(p.name)} onChange={() => toggleProduct(p.name)} className="h-4 w-4 accent-[var(--brand-copper-ink)]" />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {err("products") && <p id={`${pre}-products-err`} className="field-error">{err("products")}</p>}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor={`${pre}-formSize`}>Form / size / mesh</label>
          <input id={`${pre}-formSize`} name="formSize" maxLength={200} className="field" placeholder="e.g. fine granules, specific mesh, flake size" aria-invalid={!!err("formSize")} aria-describedby={describe("formSize")} />
          {err("formSize") && <p id={`${pre}-formSize-err`} className="field-error">{err("formSize")}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor={`${pre}-quantity`}>Required quantity {isSample ? "" : "*"}</label>
          <div className="flex gap-2">
            <input
              id={`${pre}-quantity`}
              name="quantity"
              maxLength={120}
              required={!isSample}
              inputMode="decimal"
              className="field min-w-0 flex-1 disabled:opacity-50"
              disabled={isSample}
              placeholder={isSample ? "Not needed for samples" : "e.g. 500"}
              aria-invalid={!!err("quantity")}
              aria-describedby={describe("quantity")}
            />
            <select aria-label="Quantity unit" aria-invalid={!!err("unit")} aria-describedby={describe("unit")} name="unit" className="field w-auto max-w-[11rem]" value={unit} onChange={(e) => { setUnit(e.target.value); setType(e.target.value === QUANTITY_UNITS[0] ? "sample" : "quote"); setErrors(current => ({ ...current, quantity: undefined, unit: undefined })); }}>
              {QUANTITY_UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          {err("unit") && <p id={`${pre}-unit-err`} className="field-error">{err("unit")}</p>}
          {err("quantity") && <p id={`${pre}-quantity-err`} className="field-error">{err("quantity")}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor={`${pre}-packaging`}>Packaging preference</label>
          <select id={`${pre}-packaging`} name="packaging" aria-invalid={!!err("packaging")} aria-describedby={describe("packaging")} className="field" defaultValue={PACKAGING_OPTIONS[0]}>
            {PACKAGING_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {err("packaging") && <p id={`${pre}-packaging-err`} className="field-error">{err("packaging")}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor={`${pre}-destination`}>Destination (city / port / country)</label>
          <input id={`${pre}-destination`} name="destination" maxLength={200} className="field" aria-invalid={!!err("destination")} aria-describedby={describe("destination")} />
          {err("destination") && <p id={`${pre}-destination-err`} className="field-error">{err("destination")}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor={`${pre}-timeline`}>Delivery timeline</label>
          <select id={`${pre}-timeline`} name="timeline" aria-invalid={!!err("timeline")} aria-describedby={describe("timeline")} className="field" defaultValue={TIMELINE_OPTIONS[0]}>
            {TIMELINE_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {err("timeline") && <p id={`${pre}-timeline-err`} className="field-error">{err("timeline")}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor={`${pre}-message`}>Message</label>
          <textarea id={`${pre}-message`} name="message" maxLength={2000} onChange={e => setMessageLength(e.target.value.length)} rows={4} className="field" placeholder="Tell us about your application, specification needs or questions." aria-invalid={!!err("message")} aria-describedby={describe("message")} />
          <p className="mt-1 text-sm text-body" data-no-translate aria-live="polite">{messageLength} / 2000</p>
          {err("message") && <p id={`${pre}-message-err`} className="field-error">{err("message")}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary" disabled={status === "submitting"} aria-disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : type === "sample" ? "Request sample" : "Request quotation"}
          {status !== "submitting" && <ArrowUpRight size={16} />}
        </button>
        <a className="btn btn-outline" href={whatsappLink(waText, contact.whatsappNumber)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={18} /> Chat on WhatsApp
        </a>
      </div>

      <p id={`${pre}-note`} className="text-sm">
        Availability, specifications, pricing and shipping are subject to company confirmation. We use your details only to reply to this enquiry —
        see our <a className="font-bold text-copper-ink underline" href="/privacy">Privacy policy</a>.
        {RECAPTCHA_KEY && (
          <>
            {" "}This form is protected by reCAPTCHA; the Google{" "}
            <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
            <a className="underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
          </>
        )}
      </p>
    </form>
  );
}


