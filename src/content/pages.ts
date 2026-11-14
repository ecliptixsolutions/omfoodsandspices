/**
 * Inner-page content. Anything the company has not supplied is a block with
 * `placeholder: true`, rendered with the label "Content to be provided by the company".
 * Do NOT replace placeholders with invented certifications, capacities, countries or statistics.
 */

export const PLACEHOLDER_LABEL = "Content to be provided by the company";

export type InfoSection = {
  heading: string;
  body?: string;
  steps?: { title: string; detail: string }[];
  placeholder?: boolean;
  /** What the company should supply, shown as a hint in the placeholder box */
  hint?: string;
};

export type InfoPage = {
  slug: string; // "" for /about
  path: string;
  title: string; // H1
  eyebrow: string;
  intro: string;
  image: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  sections: InfoSection[];
};

export const infoPages: InfoPage[] = [
  {
    slug: "",
    path: "/about",
    eyebrow: "About us",
    title: "About OM Food and Spices LLP",
    intro:
      "From Gujarat, India, OM Food and Spices LLP brings onion and garlic ingredient enquiries into one clear conversation for food manufacturers, seasoning and spice-blend companies, commercial kitchens, importers and bulk buyers.",
    image: "/images/products/white-onion-flakes-1.webp",
    imageAlt: "White dehydrated onion flakes from OM Food and Spices LLP",
    seoTitle: "About OM Food and Spices LLP | Dehydrated Onion & Garlic, Gujarat",
    seoDescription:
      "OM Food and Spices LLP, Gujarat, India: dehydrated onion and garlic ingredients for food manufacturers, seasoning companies, importers and bulk buyers.",
    sections: [
      {
        heading: "What we do",
        body: "We work with dehydrated onion (flakes / kibbled, minced, granules and powder) and dehydrated garlic (flakes, minced, granules and powder). Start with your application and we'll discuss the form, specifications and supply requirements that matter to you.",
      },
      {
        heading: "Who we work with",
        body: "Food manufacturers, seasoning and spice-blend companies, commercial kitchens, importers and bulk buyers — in India and for export.",
      },
      {
        heading: "Company story",
        placeholder: true,
        hint: "Founding story, team, and what the company stands for.",
      },
    ],
  },
  {
    slug: "plant",
    path: "/about/plant",
    eyebrow: "About us",
    title: "Our plant",
    intro: "Our facility is based at Survey No. 125, P5, Kikariya, Gujarat. Details of the plant will be added here once supplied by the company.",
    image: "/images/products/garlic-flakes-1.webp",
    imageAlt: "Dehydrated garlic flakes supplied by OM Food and Spices LLP",
    seoTitle: "Our Plant | OM Food and Spices LLP, Kikariya, Gujarat",
    seoDescription: "Information about the OM Food and Spices LLP facility in Kikariya, Gujarat, India.",
    sections: [
      { heading: "Location", body: "Survey No. 125, OM Food and Spices LLP, P5, Kikariya, Gujarat 364280, India." },
      { heading: "Facility details", placeholder: true, hint: "Plant description, layout, equipment and photographs." },
      { heading: "Visits", placeholder: true, hint: "Whether buyer visits and audits are possible, and how to arrange them." },
    ],
  },
  {
    slug: "process",
    path: "/about/process",
    eyebrow: "About us",
    title: "Our process",
    intro: "How onion and garlic become dehydrated ingredients, from raw material to finished product.",
    image: "/images/products/white-onion-flakes-1.webp",
    imageAlt: "White dehydrated onion flakes",
    seoTitle: "Our Process | OM Food and Spices LLP",
    seoDescription: "How OM Food and Spices LLP handles dehydrated onion and garlic ingredient production and supply.",
    sections: [
      { heading: "Production process", body: "The plant process follows these 18 stages. Product-specific settings and checkpoints are confirmed by the team; the sequence is an overview, not a technical specification.", steps: [
        { title: "Receiving and storage", detail: "Raw material arrives and is held for the next production stage." },
        { title: "Feed hopper and controlled transfer", detail: "Material is fed into the line for controlled movement." },
        { title: "Initial screening, grading and destoning", detail: "The incoming material passes through initial separation steps." },
        { title: "First washing", detail: "Material goes through an initial wash." },
        { title: "Peeling", detail: "Outer layers are removed." },
        { title: "Second / final washing", detail: "A further wash follows peeling." },
        { title: "Slicing / cutting", detail: "Prepared material is cut for dehydration." },
        { title: "Transfer to drying", detail: "Cut material is moved to the drying line." },
        { title: "Main five-belt drying", detail: "Material passes through the main belt dryer." },
        { title: "Two-stage hot drying", detail: "Further hot drying follows the main dryer." },
        { title: "Cooling / cold drying", detail: "The material is cooled after hot drying." },
        { title: "Size grading and separation", detail: "Dried material is separated by size." },
        { title: "Eight-chute optical sorting", detail: "The optical sorter helps identify material for separation." },
        { title: "All-metal detection and separation", detail: "The line includes a metal detection and separation stage." },
        { title: "Final inspection", detail: "Finished material is checked before packing." },
        { title: "Packing", detail: "Product is packed according to the confirmed order." },
        { title: "Finished-goods storage", detail: "Packed goods are held before dispatch." },
        { title: "Dispatch", detail: "The confirmed order leaves the facility." },
      ] },
      { heading: "From enquiry to supply", body: "Our enquiry-to-supply process — share requirements, confirm availability, discuss specifications and quotation, coordinate packaging and dispatch — is described on the Sourcing page." },
    ],
  },
  {
    slug: "quality-food-safety",
    path: "/about/quality-food-safety",
    eyebrow: "About us",
    title: "Quality & food safety",
    intro: "Specifications and documentation are discussed and confirmed directly with each buyer.",
    image: "/images/products/garlic-powder-1.webp",
    imageAlt: "Dehydrated garlic powder",
    seoTitle: "Quality & Food Safety | OM Food and Spices LLP",
    seoDescription: "Quality and food safety information for dehydrated onion and garlic from OM Food and Spices LLP, Gujarat.",
    sections: [
      { heading: "Quality checkpoints", body: "Buyer requirements should be checked at raw-material receipt, during processing, after sorting and metal detection, and before packed product is released. The exact test plan and acceptance limits must be confirmed for each product and batch." },
      { heading: "Laboratory information", body: "Request the available in-house or external test report for the relevant product and batch. Laboratory scope, methods and results are supplied only after company confirmation." },
      { heading: "Batch traceability", body: "A supplier approval should connect the incoming raw material, processing lot, finished batch, pack identification and shipment documents. Ask the team for the records applicable to your order." },
      { heading: "Food safety", body: "Discuss hygiene, cleaning and relevant hazard controls with the team during technical review. No specific treatment or certification is represented here without an approved record." },
      { heading: "Food safety systems and certifications", placeholder: true, hint: "Only certifications the company actually holds, with certificate numbers and validity." },
      { heading: "Documentation", body: "Approved public documents appear on the Certificates & downloads page; other documentation is shared after company confirmation." },
    ],
  },
  {
    slug: "responsible-manufacturing",
    path: "/about/responsible-manufacturing",
    eyebrow: "About us",
    title: "Responsible manufacturing",
    intro: "How we approach people, resources and the environment.",
    image: "/images/products/white-onion-granules-1.webp",
    imageAlt: "White dehydrated onion granules",
    seoTitle: "Responsible Manufacturing | OM Food and Spices LLP",
    seoDescription: "Responsible manufacturing practices at OM Food and Spices LLP, Gujarat, India.",
    sections: [
      { heading: "Our approach", placeholder: true, hint: "Sustainability, worker welfare and environmental practices." },
      { heading: "Sourcing", placeholder: true, hint: "How raw onion and garlic are sourced." },
    ],
  },
  {
    slug: "packaging-export",
    path: "/about/packaging-export",
    eyebrow: "About us",
    title: "Packaging & export",
    intro: "Packaging options, documentation and shipping are discussed and confirmed directly for each enquiry.",
    image: "/images/products/garlic-granules-1.webp",
    imageAlt: "Dehydrated garlic granules",
    seoTitle: "Packaging & Export | OM Food and Spices LLP",
    seoDescription: "Packaging and export enquiries for dehydrated onion and garlic from OM Food and Spices LLP, Gujarat, India.",
    sections: [
      { heading: "Packaging brief", body: "Tell us the required pack format, net weight, liner, outer packaging and label information. Private-label needs can be included in the same enquiry. The team will confirm which options are available for your product." },
      { heading: "Container loading", body: "Twenty-foot and forty-foot container quantities depend on pack type, pallet basis, destination and shipping terms. Request a verified loading plan for your order." },
      { heading: "Export", body: "Export enquiries are welcome. Share your destination in the enquiry form; shipping arrangements, documents and timelines depend on confirmation by the company." },
      { heading: "Export markets and shipping terms", placeholder: true, hint: "Markets served, shipping terms and lead times — only if the company wishes to publish them." },
    ],
  },
];

export const sourcingPage = {
  eyebrow: "Sourcing",
  title: ["Supply, explained", "step by step."],
  intro:
    "Whether you need a sample or a bulk quantity, the process starts with one enquiry. Bulk and export enquiries are welcome.",
  seoTitle: "Sourcing & Bulk Export Enquiries | OM Food and Spices LLP",
  seoDescription:
    "How to source dehydrated onion and garlic from OM Food and Spices LLP, Gujarat. Bulk supply and export enquiry support.",
  support: {
    title: "Bulk & export enquiry support",
    text: "Tell us the product, form, quantity and destination. We'll confirm availability and discuss specifications and quotation directly with you. Packaging and dispatch are coordinated once details are confirmed.",
    points: [
      "Bulk quantities and trial orders both welcome",
      "Export enquiries welcome — share your destination",
      "Specifications and documents confirmed directly",
    ],
  },
  image: "/images/products/red-onion-flakes-1.webp",
  imageAlt: "Dehydrated red onion flakes",
};

export const certificatesPage = {
  eyebrow: "Certificates & downloads",
  title: "Certificates & downloads",
  intro: "Approved public documents appear here; other documentation is shared after company confirmation.",
  seoTitle: "Certificates & Downloads | OM Food and Spices LLP",
  seoDescription: "Documents and certificates for OM Food and Spices LLP dehydrated onion and garlic. Available on request.",
  documents: [
    {
      title: "GST registration certificate",
      description: "Government of India · Form GST REG-06 · GSTIN 24AAKFO2365E1ZE · issued 8 September 2026. This is a tax registration, not a food-safety certification.",
      href: "/documents/om-food-and-spices-gst-registration.pdf",
      size: "226 KB",
    },
  ],
  emptyTitle: "Documents available on request",
  emptyText:
    "No public documents have been published yet. Tell us what you need — such as product specifications or company documents — and the team will confirm what can be shared.",
};

export type CategoryPage = {
  category: "onion" | "garlic";
  path: string;
  eyebrow: string;
  title: string[];
  intro: string;
  image: string;
  galleryImages?: string[];
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  applicationsTitle: string;
  faqs: { q: string; a: string }[];
  ctaProduct: string;
};

export const categoryPages: Record<"onion" | "garlic", CategoryPage> = {
  onion: {
    category: "onion",
    path: "/dehydrated-onions",
    eyebrow: "Dehydrated onion ingredients",
    title: ["Dehydrated onion ingredients", "for industry."],
    intro:
      "Onion ingredient formats for food processing, seasoning blends and commercial applications: flakes / kibbled, minced, granules and powder.",
    image: "/images/products/white-onion-flakes-1.webp",
    galleryImages: ["/images/products/white-onion-flakes-1.webp", "/images/products/white-onion-granules-1.webp", "/images/products/white-onion-powder-1.webp", "/images/products/red-onion-flakes-1.webp"],
    imageAlt: "Dehydrated white and red onion ingredient formats",
    seoTitle: "Dehydrated Onion Manufacturer & Supplier India | Flakes, Powder, Granules",
    seoDescription:
      "Dehydrated onion flakes, minced onion, onion granules and onion powder from OM Food and Spices LLP, Gujarat, India. Bulk supply and export enquiries welcome.",
    applicationsTitle: "Where dehydrated onion is used",
    ctaProduct: "dehydrated-onion-flakes",
    faqs: [
      {
        q: "Which dehydrated onion formats can I enquire about?",
        a: "Flakes / kibbled, minced onion, granules and powder. Availability is subject to company confirmation.",
      },
      {
        q: "Can I request a specific size or mesh?",
        a: "Yes, mention it in the enquiry. Whether it can be supplied is confirmed directly by the company.",
      },
      {
        q: "Can I get an onion sample?",
        a: "Choose “Get Sample” in the enquiry form. Sample availability and terms are confirmed directly by the company.",
      },
    ],
  },
  garlic: {
    category: "garlic",
    path: "/dehydrated-garlic",
    eyebrow: "Dehydrated garlic ingredients",
    title: ["Dehydrated garlic.", "Ready for your market."],
    intro:
      "Garlic ingredient formats for seasoning blends, food manufacturing and commercial sourcing: flakes, minced garlic, granules and powder.",
    image: "/images/products/garlic-flakes-1.webp",
    galleryImages: ["/images/products/garlic-flakes-1.webp", "/images/products/garlic-granules-1.webp", "/images/products/garlic-powder-1.webp"],
    imageAlt: "Dehydrated garlic flakes, granules and powder",
    seoTitle: "Dehydrated Garlic Supplier India | Flakes, Granules, Powder",
    seoDescription:
      "Dehydrated garlic flakes, minced garlic, garlic granules and garlic powder from OM Food and Spices LLP, Gujarat, India. Bulk supply and export enquiries welcome.",
    applicationsTitle: "Where dehydrated garlic is used",
    ctaProduct: "dehydrated-garlic-flakes",
    faqs: [
      {
        q: "Which dehydrated garlic formats can I enquire about?",
        a: "Flakes, minced garlic, granules and powder. Availability is subject to company confirmation.",
      },
      {
        q: "Can I request a specific size or mesh?",
        a: "Yes, mention it in the enquiry. Whether it can be supplied is confirmed directly by the company.",
      },
      {
        q: "Can I get a garlic sample?",
        a: "Choose “Get Sample” in the enquiry form. Sample availability and terms are confirmed directly by the company.",
      },
    ],
  },
};

export const legal = {
  privacy: {
    seoTitle: "Privacy Policy | OM Food and Spices LLP",
    seoDescription: "How OM Food and Spices LLP handles information submitted through this website.",
  },
  terms: {
    seoTitle: "Terms of Use | OM Food and Spices LLP",
    seoDescription: "Terms of use for the OM Food and Spices LLP website.",
  },
};
