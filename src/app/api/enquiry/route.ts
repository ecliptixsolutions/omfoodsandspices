import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { site } from "@/content/site";
import { enquiryToText, normalizeEnquiry, validateEnquiry, type EnquiryPayload } from "@/lib/enquiry";
import { getPublishedProducts } from "@/lib/products.server";
import { canUseMySql, getAdminDb } from "@/lib/admin/db.server";
import { getPublicContact } from "@/lib/site-content.server";

export const runtime = "nodejs";

/**
 * Enquiry endpoint (serverless function on Vercel).
 *
 * Spam protection: hidden honeypot field, minimum fill time, optional Google reCAPTCHA v3.
 * Delivery: Resend (https://resend.com) sends the email to ENQUIRY_TO_EMAIL
 * (defaults to the company address). See README for the environment variables.
 */

// Best-effort in-memory rate limit (per serverless instance).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function verifyRecaptcha(token: string | undefined) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // reCAPTCHA not enabled
  if (!token) return false;
  try {
    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const d = (await r.json()) as { success?: boolean; score?: number };
    return !!d.success && (d.score ?? 1) >= 0.4;
  } catch {
    return false;
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Partial<EnquiryPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });

  // Honeypot: pretend success so bots don't learn anything.
  if (body.website) return NextResponse.json({ ok: true });
  // Too-fast submission (< 3s) is almost certainly a bot.
  if (typeof body.startedAt === "number" && Date.now() - body.startedAt < 3000) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, message: "Too many enquiries from your connection. Please try again later or contact us directly." }, { status: 429 });

  const errors = validateEnquiry(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, message: "Please check the highlighted fields.", errors }, { status: 422 });
  const availableProducts = await getPublishedProducts();
  const productErrors = validateEnquiry(body, availableProducts.map(product => product.name));
  if (Object.keys(productErrors).length) return NextResponse.json({ ok: false, message: "Please check the highlighted fields.", errors: productErrors }, { status: 422 });

  if (!(await verifyRecaptcha(body.recaptchaToken))) {
    return NextResponse.json({ ok: false, message: "Spam check failed. Please try again." }, { status: 400 });
  }

  const p = normalizeEnquiry(body as unknown as Record<string, unknown>);
  let savedToCrm = false;
  if (canUseMySql()) {
    try {
      await getAdminDb().execute(
        "INSERT INTO om_enquiries (id,type,customer_name,company_name,email,phone,country,product_names,form_size,quantity,unit,packaging,destination,timeline,message) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [randomUUID(), p.type, p.name.trim(), p.company.trim(), p.email.trim().toLowerCase(), p.phone.trim(), p.country.trim(), JSON.stringify(p.products), p.formSize.trim(), p.quantity.trim(), p.unit, p.packaging, p.destination.trim(), p.timeline, p.message.trim()],
      );
      savedToCrm = true;
    } catch (error) {
      console.error("Could not save website enquiry to MySQL", error);
    }
  }
  const text = enquiryToText(p);
  const contact = await getPublicContact();
  const to = process.env.ENQUIRY_TO_EMAIL || contact.email;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (savedToCrm) {
      console.warn("Enquiry saved in MySQL, but RESEND_API_KEY is not configured; no email notification was sent.");
      return NextResponse.json({ ok: true });
    }
    // Not configured: never silently lose an enquiry. Log it and tell the visitor to use another channel.
    console.error("RESEND_API_KEY is not set — enquiry NOT delivered:\n" + text);
    return NextResponse.json(
      { ok: false, message: "Our enquiry email service is not configured yet, so your enquiry could not be sent." },
      { status: 503 },
    );
  }

  const subject = `${p.type === "sample" ? "Sample" : "Quotation"} enquiry — ${p.products.join(", ").slice(0, 80)} — ${p.name}${p.company ? ` (${p.company})` : ""}`;
  const html = `<pre style="font-family:inherit;white-space:pre-wrap">${esc(text)}</pre>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL || "OM Food Website <onboarding@resend.dev>",
        to: [to],
        reply_to: p.email,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      if (savedToCrm) return NextResponse.json({ ok: true });
      return NextResponse.json({ ok: false, message: "We could not send your enquiry just now." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Enquiry send failed", e);
    if (savedToCrm) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, message: "We could not send your enquiry just now." }, { status: 502 });
  }
}
