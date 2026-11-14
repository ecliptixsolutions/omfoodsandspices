import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { organizationLd } from "@/lib/seo";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { TopBar } from "@/components/TopBar";
import { LocaleProvider } from "@/components/LocaleProvider";
import { cookies } from "next/headers";

// Manrope (SIL Open Font License), self-hosted so there is no render-blocking request to Google Fonts.
const manrope = localFont({
  src: [
    { path: "../fonts/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Dehydrated Onion & Garlic Manufacturer India | OM Food and Spices LLP",
    template: "%s",
  },
  description:
    "OM Food and Spices LLP, Gujarat, India — dehydrated onion and garlic ingredients (flakes, minced, granules, powder) for food manufacturers and bulk buyers. Bulk supply and export enquiries welcome.",
  applicationName: site.name,
  keywords: [
    "dehydrated onion manufacturer India",
    "dehydrated garlic supplier",
    "onion flakes",
    "onion powder",
    "garlic granules",
    "bulk export",
  ],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#21392c",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("om_locale")?.value;
  const initialLocale = savedLocale === "hi" || savedLocale === "gu" ? savedLocale : "en";
  return (
    <html lang={initialLocale} className={manrope.variable}>
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">Skip to content</a>
        <LocaleProvider initialLocale={initialLocale}>
        <EnquiryProvider>
          <TopBar />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <FloatingActions />
        </EnquiryProvider>
        </LocaleProvider>
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
