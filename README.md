# OM Food and Spices LLP — website

Next.js 15 (App Router) + React 19 + Tailwind CSS v4. Built for B2B quotation and sample enquiries for dehydrated onion and garlic ingredients. Deploys to Vercel with no extra config.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
```

Other scripts: `npm run lint` (type-check), `npm run check:images` (every image path loads), `npm run check:contrast` (WCAG AA check of the colour tokens), `npm run images` (regenerate the placeholder illustrations).

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import the repo. Framework preset is detected as Next.js; keep the defaults.
3. Add the environment variables from `.env.example` (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — your final domain, e.g. `https://www.example.com`
   - `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL` — enquiry email delivery
   - optional `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY`
4. Click **Deploy**. Then add your custom domain under Settings → Domains and redeploy so canonical URLs and the sitemap use it.
5. Submit `https://your-domain/sitemap.xml` in Google Search Console.

### Enquiry email (important)
The form posts to `/api/enquiry` (a serverless function) which emails `ENQUIRY_TO_EMAIL` through [Resend](https://resend.com). Create a free Resend account, add an API key, and **verify your sending domain** so mail can be delivered to the Gmail inbox. Until `RESEND_API_KEY` is set the form shows an error with phone / email / WhatsApp fallbacks — it never pretends an enquiry was sent. Spam protection: hidden honeypot field, minimum fill time, per-IP rate limit and optional reCAPTCHA v3.

## Where to edit things

| What | File |
|---|---|
| Company name, phone, email, address, hours, nav, footer, languages | `src/content/site.ts` |
| Colour tokens (all colours come from here) | `src/theme.css` |
| Products (names, forms, applications, SEO text) | `src/content/products.ts` |
| Home page copy | `src/content/home.ts` |
| FAQ answers (also feed the FAQPage JSON-LD) | `src/content/faq.ts` |
| Inner pages, certificates list, placeholders | `src/content/pages.ts` |
| Enquiry fields and validation | `src/lib/enquiry.ts`, `src/components/EnquiryForm.tsx` |

## Folder structure

```
src/
  app/            routes (page.tsx per route), layout, sitemap.ts, robots.ts, api/enquiry
  components/     Header, Footer, HeroSlider, ProductCard, ProductGrid, SectionHeading, FAQ,
                  EnquiryForm, EnquiryProvider (modal), WhatsAppButton, FloatingActions, …
    home/         home-page sections
  content/        all text and config
  lib/            SEO helpers, enquiry validation
  theme.css       colour/type tokens
public/images/    product, hero and section images
scripts/          image generator, image path checker, contrast checker
```

## IMPORTANT before launch

1. **Replace the images.** The images in `public/images` are generated *illustrations* standing in for photography — no real photos were available. Replace each file with real product photography **using the same file name** (WebP, ~1200×900 for products, 1920×1080 for hero) and every page keeps working. Update the alt text in `src/content/*.ts` if the content changes. Then run `npm run check:images`.
2. **Content to be provided by the company.** Pages marked with a dashed *"Content to be provided by the company"* box (plant, process, quality, certifications, packaging, responsible manufacturing, company story) intentionally contain no invented facts. Fill them in `src/content/pages.ts`. Do not add certifications, capacities, export countries or statistics unless they are real and documented.
3. **Certificates & downloads.** Put approved PDFs in `public/documents/` and list them in `certificatesPage.documents` in `src/content/pages.ts`.
4. **Legal pages** (`/privacy`, `/terms`) are general drafts — have them reviewed.
5. **Domain.** Set `NEXT_PUBLIC_SITE_URL`.

## Languages (Hindi / Gujarati later)
The header has a language selector driven by `locales` in `src/content/site.ts`; Hindi and Gujarati are listed as "coming soon". To add them, put translated copies of the files in `src/content/` under a locale folder, move routes under `app/[locale]`, and set `enabled: true`.

## Accessibility & performance notes
Skip link, semantic landmarks, native `<dialog>` for the modal and mobile drawer (focus trap + Esc), keyboard-operable slider (←/→ to change, Space to pause, pauses on hover/focus), ARIA accordion, visible focus rings, AA-checked colours, `prefers-reduced-motion` respected. Self-hosted font, `next/image` (AVIF/WebP, responsive sizes, lazy-loading), static generation for all pages.
