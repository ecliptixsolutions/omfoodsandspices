/** Home page copy. All text lives here so it can be edited without touching components. */

export const heroSlides = [
  {
    id: "garlic",
    lines: ["Dehydrated Garlic.", "Ready for Your Market."],
    eyebrow: "DEHYDRATED GARLIC INGREDIENTS",
    title: "Dehydrated Garlic. Ready for Your Market.",
    text: "Explore dehydrated garlic flakes, minced garlic, granules, and powder for seasoning blends, food manufacturing, and commercial ingredient sourcing.",
    primary: { label: "Request a quote", action: "quote" as const, product: undefined as string | undefined },
    secondary: { label: "Explore our products", href: "/products" },
    image: "/images/products/garlic-flakes-1.webp",
    imageAlt: "Dehydrated garlic flakes",
  },
  {
    id: "onion",
    lines: ["Dehydrated Onion Ingredients", "for Industry."],
    eyebrow: "DEHYDRATED ONION INGREDIENTS",
    title: "Dehydrated Onion Ingredients for Industry.",
    text: "Discover onion ingredient formats for food processing, seasoning blends, and commercial applications.",
    primary: { label: "Request product details", action: "quote" as const, product: undefined as string | undefined },
    secondary: { label: "View Onion Products", href: "/dehydrated-onions" },
    image: "/images/products/white-onion-flakes-1.webp",
    imageAlt: "White dehydrated onion flakes",
  },
];

export const heroNote = "Product formats and availability are subject to company confirmation.";
export const heroChips = [
  "Indian agricultural supply",
  "Dehydrated ingredients",
  "Bulk supply & export inquiries welcome",
];

export const tickerItems = ["Flakes / Kibbled", "Chopped", "Minced", "Granules", "Powder"];

export const productRange = {
  eyebrow: "Our dehydrated product range",
  title: ["Onion & garlic ingredients", "for business buyers"],
};

export const aboutTeaser = {
  eyebrow: "A little about us",
  title: ["Rooted in nature.", "Focused on your business."],
  copy: "From Gujarat, India, OM Food and Spices LLP brings onion and garlic ingredient enquiries into one clear conversation. Whether you're developing a seasoning blend or sourcing for food production, start with your application. We'll discuss the form, specifications and supply requirements that matter to you.",
  cta: { label: "Meet OM Food", href: "/about" },
  image: "/images/products/white-onion-flakes-1.webp",
  imageAlt: "White dehydrated onion flakes from OM Food and Spices LLP",
};

export const workingTogether = {
  eyebrow: "Working together",
  title: ["A practical partner", "for onion sourcing"],
  cards: [
    { n: "01", title: "Product-focused sourcing", text: "Start from the ingredient and the application you have in mind." },
    { n: "02", title: "Dehydrated ingredient formats", text: "Flakes, minced, granules and powder — discussed against your use." },
    { n: "03", title: "Bulk inquiry support", text: "Bulk and export enquiries are welcome and handled directly." },
    { n: "04", title: "Direct business communication", text: "One clear conversation with the team, by form, phone or WhatsApp." },
  ],
};

export const formatBlocks = {
  eyebrow: "Formats",
  onion: {
    title: ["Practical formats", "for food businesses"],
    chips: ["Flakes / kibbled", "Minced onion", "Granules", "Powder"],
    cta: "Request dehydrated onion details",
    productSlug: "dehydrated-onion-flakes",
    href: "/dehydrated-onions",
    image: "/images/products/white-onion-flakes-1.webp",
    imageAlt: "White dehydrated onion flakes",
    galleryImages: ["/images/products/white-onion-flakes-1.webp", "/images/products/white-onion-granules-1.webp", "/images/products/white-onion-powder-1.webp", "/images/products/red-onion-flakes-1.webp"],
    text: "Onion ingredient formats for processing, seasoning blends and commercial kitchens.",
  },
  garlic: {
    title: ["Garlic formats", "for food manufacturing"],
    chips: ["Flakes", "Minced garlic", "Granules", "Powder"],
    cta: "Request dehydrated garlic details",
    productSlug: "dehydrated-garlic-flakes",
    href: "/dehydrated-garlic",
    image: "/images/products/garlic-flakes-1.webp",
    imageAlt: "Dehydrated garlic flakes",
    galleryImages: ["/images/products/garlic-flakes-1.webp", "/images/products/garlic-granules-1.webp", "/images/products/garlic-powder-1.webp"],
    text: "Garlic ingredient formats for manufacturers, blenders and commercial buyers.",
  },
};

export const applications = {
  eyebrow: "Applications",
  title: ["One ingredient.", "A world of flavour."],
  items: [
    { n: "01", title: "Seasonings & spice blends", tags: ["Powder", "Granules"] },
    { n: "02", title: "Snacks & namkeen", tags: ["Powder", "Fine granules"] },
    { n: "03", title: "Instant foods, soups & ready meals", tags: ["Flakes", "Minced"] },
    { n: "04", title: "Sauces, dips & dressings", tags: ["Powder", "Minced"] },
    { n: "05", title: "Bakery & savoury foods", tags: ["Granules", "Flakes"] },
  ],
};

export const processSteps = [
  { n: "01", title: "Share your requirements", text: "Tell us the product, form, quantity and destination." },
  { n: "02", title: "Confirm product availability", text: "We confirm what can be supplied against your requirement." },
  { n: "03", title: "Discuss specifications and quotation", text: "Specifications and quotation are discussed directly with you." },
  { n: "04", title: "Coordinate packaging and dispatch", text: "Packaging, documents and dispatch are coordinated with you." },
];
export const processNote =
  "Order acceptance, specifications, lead times, pricing and shipping depend on confirmation by the company.";

export const specs = {
  eyebrow: "Product information",
  title: ["Your specification.", "Our starting point."],
  bullets: [
    "Onion variety and form",
    "Size, grade and mesh where applicable",
    "Technical specifications",
    "Packaging options and documentation",
    "Quantity and delivery requirements",
  ],
  cards: [
    { title: "The right form", text: "Flakes, minced, granules or powder — matched to your application." },
    { title: "Technical clarity", text: "Specifications are confirmed directly, not assumed." },
    { title: "Relevant documents", text: "Approved documents are shared after company confirmation." },
    { title: "Your destination", text: "Tell us where it is going so the right details are discussed." },
  ],
  cta: "Discuss product specifications",
};

export const finalCta = {
  title: ["Let's find your", "right ingredient."],
  text: "Share the product, quantity and destination. We'll take the conversation from there.",
  note: "One enquiry form. A direct conversation.",
};
