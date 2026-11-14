/**
 * Product catalogue. Only formats named by the company are listed.
 * No specifications, shelf life, capacities or prices are stated — those are
 * "on request" and confirmed directly by the company.
 */

export type Category = "onion" | "garlic";
export type Form = "fresh" | "flakes" | "minced" | "granules" | "powder";

export type Product = {
  slug: string;
  name: string;
  /** Short name used in forms / chips */
  shortName: string;
  category: Category;
  form: Form;
  /** Other trade names buyers may use */
  alsoKnownAs?: string[];
  description: string; // one line for cards
  overview: string; // paragraph for detail page
  forms: string[];
  applications: string[];
  image: string;
  imageAlt: string;
  galleryImages?: string[];
  seoTitle: string;
  seoDescription: string;
};

export const products: Product[] = [
  {
    slug: "pink-onion",
    name: "Pink Onion",
    shortName: "Pink Onion",
    category: "onion",
    form: "fresh",
    description: "Fresh pink onion enquiries for food businesses. Variety, grade and availability are confirmed directly by the company.",
    overview: "Enquire about pink onions for your business requirements. Variety, size grades, packaging and current availability are confirmed directly by the company.",
    forms: ["Whole fresh onion"],
    applications: ["Food processing and manufacturing", "Commercial kitchens"],
    image: "/images/products/pink-onion.jpg",
    imageAlt: "Bangalore rose onions in sacks at a market; reference photograph by Maaimpex",
    seoTitle: "Pink Onion Enquiries | OM Food and Spices LLP",
    seoDescription: "Contact OM Food and Spices LLP to enquire about pink onions for business use. Variety, grade and availability are confirmed directly.",
  },
  {
    slug: "dehydrated-onion-flakes",
    name: "White onion flakes / kibbled onion",
    shortName: "White onion flakes / kibbled",
    category: "onion",
    form: "flakes",
    alsoKnownAs: ["Kibbled onion", "Onion flakes"],
    description: "Flaked and kibbled onion pieces for soups, prepared foods and blends.",
    overview:
      "Dehydrated white onion flakes (also called kibbled onion) are an ingredient format used where visible onion pieces are wanted. Available sizes, grades and specifications are confirmed directly by the company for each enquiry.",
    forms: ["Flakes", "Kibbled"],
    applications: ["Instant & prepared foods", "Bakery applications", "Restaurants and commercial kitchens", "Food processing and manufacturing"],
    image: "/images/products/white-onion-flakes-1.webp",
    imageAlt: "White dehydrated onion flakes in a tray",
    galleryImages: ["/images/products/white-onion-flakes-1.webp", "/images/products/white-onion-flakes-2.webp"],
    seoTitle: "White Dehydrated Onion Flakes & Kibbled Onion Supplier India",
    seoDescription:
      "Enquire about dehydrated white onion flakes and kibbled onion from OM Food and Spices LLP, Gujarat, India. Bulk supply and export enquiries welcome. Specifications on request.",
  },
  {
    slug: "red-onion-flakes",
    name: "Red onion flakes",
    shortName: "Red onion flakes",
    category: "onion",
    form: "flakes",
    alsoKnownAs: ["Dehydrated red onion flakes"],
    description: "Red dehydrated onion flakes for prepared foods, seasonings and food manufacturing.",
    overview: "Red onion flakes are a visible-piece dehydrated ingredient format for prepared foods and seasoning blends. Available sizes, grades and specifications are confirmed directly by the company for each enquiry.",
    forms: ["Flakes"],
    applications: ["Instant & prepared foods", "Seasonings & spice blends", "Restaurants and commercial kitchens", "Food processing and manufacturing"],
    image: "/images/products/red-onion-flakes-1.webp",
    imageAlt: "Dehydrated red onion flakes",
    galleryImages: ["/images/products/red-onion-flakes-1.webp", "/images/products/red-onion-flakes-2.webp"],
    seoTitle: "Red Dehydrated Onion Flakes Supplier India | Bulk & Export",
    seoDescription: "Enquire about red dehydrated onion flakes from OM Food and Spices LLP, Gujarat, India. Bulk supply and export enquiries welcome. Specifications on request.",
  },
  {
    slug: "dehydrated-minced-onion",
    name: "Minced onion",
    shortName: "Minced onion",
    category: "onion",
    form: "minced",
    description: "Small minced onion pieces for sauces, instant foods and seasonings.",
    overview:
      "Dehydrated minced onion is a smaller-piece format used across sauces, instant foods and blends. Particle size and grade are discussed and confirmed directly with the company.",
    forms: ["Minced"],
    applications: ["Instant & prepared foods", "Sauces & condiments", "Restaurants and commercial kitchens", "Food processing and manufacturing"],
    image: "/images/products/onion-minced.webp",
    imageAlt: "Dehydrated minced onion pieces heaped in a ceramic bowl",
    seoTitle: "Dehydrated Minced Onion Supplier India | Bulk & Export",
    seoDescription:
      "Request details on dehydrated minced onion from OM Food and Spices LLP, Gujarat. Bulk and export enquiries welcome. Specifications confirmed directly.",
  },
  {
    slug: "dehydrated-onion-granules",
    name: "White onion granules",
    shortName: "White onion granules",
    category: "onion",
    form: "granules",
    description: "Free-flowing onion granules for seasoning blends, snacks and bakery.",
    overview:
      "White onion granules are a fine-to-medium particle format commonly used in seasoning and spice blends. Size, mesh and grade are confirmed directly by the company for each requirement.",
    forms: ["Granules", "Fine granules"],
    applications: ["Seasonings & spice blends", "Snacks & savoury foods", "Bakery applications", "Food processing and manufacturing"],
    image: "/images/products/white-onion-granules-1.webp",
    imageAlt: "White dehydrated onion granules",
    galleryImages: ["/images/products/white-onion-granules-1.webp", "/images/products/white-onion-granules-2.webp", "/images/products/white-onion-granules-3.webp", "/images/products/white-onion-granules-4.webp"],
    seoTitle: "White Onion Granules Supplier India | Dehydrated Onion Granules",
    seoDescription:
      "Enquire about dehydrated white onion granules from OM Food and Spices LLP, Gujarat, India for seasoning blends and food manufacturing. Specifications on request.",
  },
  {
    slug: "dehydrated-onion-powder",
    name: "White onion powder",
    shortName: "White onion powder",
    category: "onion",
    form: "powder",
    description: "Fine onion powder for seasonings, snacks, sauces and condiments.",
    overview:
      "Dehydrated white onion powder is a fine format used in seasonings, snack coatings, sauces and condiments. Mesh size and technical specifications are confirmed directly by the company.",
    forms: ["Powder"],
    applications: ["Seasonings & spice blends", "Snacks & savoury foods", "Sauces & condiments", "Food processing and manufacturing"],
    image: "/images/products/white-onion-powder-1.webp",
    imageAlt: "Fine white dehydrated onion powder",
    galleryImages: ["/images/products/white-onion-powder-1.webp", "/images/products/white-onion-powder-2.webp"],
    seoTitle: "White Onion Powder Manufacturer & Supplier India | Bulk Export",
    seoDescription:
      "Request details on dehydrated white onion powder from OM Food and Spices LLP, Gujarat, India. Bulk supply and export enquiries welcome.",
  },
  {
    slug: "dehydrated-garlic-flakes",
    name: "Dehydrated garlic flakes",
    shortName: "Garlic flakes",
    category: "garlic",
    form: "flakes",
    description: "Sliced and flaked garlic pieces for prepared foods, blends and kitchens.",
    overview:
      "Dehydrated garlic flakes are a visible-piece format used in prepared foods, blends and commercial kitchens. Sizes, grades and specifications are confirmed directly by the company.",
    forms: ["Flakes"],
    applications: ["Instant & prepared foods", "Bakery applications", "Restaurants and commercial kitchens", "Food processing and manufacturing"],
    image: "/images/products/garlic-flakes-1.webp",
    imageAlt: "Dehydrated garlic flakes",
    galleryImages: ["/images/products/garlic-flakes-1.webp", "/images/products/garlic-flakes-2.webp", "/images/products/garlic-flakes-3.webp", "/images/products/garlic-flakes-4.webp", "/images/products/garlic-flakes-5.webp"],
    seoTitle: "Dehydrated Garlic Flakes Supplier India | Bulk & Export",
    seoDescription:
      "Enquire about dehydrated garlic flakes from OM Food and Spices LLP, Gujarat, India. Bulk supply and export enquiries welcome. Specifications on request.",
  },
  {
    slug: "dehydrated-minced-garlic",
    name: "Dehydrated minced garlic",
    shortName: "Minced garlic",
    category: "garlic",
    form: "minced",
    description: "Minced garlic pieces for sauces, instant foods and seasonings.",
    overview:
      "Dehydrated minced garlic is a smaller-piece format used in sauces, instant foods and blends. Particle size and grade are discussed and confirmed directly with the company.",
    forms: ["Minced"],
    applications: ["Instant & prepared foods", "Sauces & condiments", "Restaurants and commercial kitchens", "Food processing and manufacturing"],
    image: "/images/products/garlic-minced.webp",
    imageAlt: "Dehydrated minced garlic in a ceramic bowl",
    seoTitle: "Dehydrated Minced Garlic Supplier India | Bulk & Export",
    seoDescription:
      "Request details on dehydrated minced garlic from OM Food and Spices LLP, Gujarat, India. Bulk and export enquiries welcome.",
  },
  {
    slug: "dehydrated-garlic-granules",
    name: "Dehydrated garlic granules",
    shortName: "Garlic granules",
    category: "garlic",
    form: "granules",
    description: "Garlic granules for seasoning blends, snacks and food manufacturing.",
    overview:
      "Garlic granules are a fine-to-medium particle format commonly used in seasoning and spice blends. Size, mesh and grade are confirmed directly by the company for each requirement.",
    forms: ["Granules", "Fine granules"],
    applications: ["Seasonings & spice blends", "Snacks & savoury foods", "Bakery applications", "Food processing and manufacturing"],
    image: "/images/products/garlic-granules-1.webp",
    imageAlt: "Dehydrated garlic granules",
    galleryImages: ["/images/products/garlic-granules-1.webp", "/images/products/garlic-granules-2.webp"],
    seoTitle: "Garlic Granules Supplier India | Dehydrated Garlic Granules",
    seoDescription:
      "Enquire about dehydrated garlic granules from OM Food and Spices LLP, Gujarat, India for seasoning blends and food manufacturing. Specifications on request.",
  },
  {
    slug: "dehydrated-garlic-powder",
    name: "Dehydrated garlic powder",
    shortName: "Garlic powder",
    category: "garlic",
    form: "powder",
    description: "Fine garlic powder for seasonings, snacks, sauces and condiments.",
    overview:
      "Dehydrated garlic powder is a fine format used in seasonings, snack coatings, sauces and condiments. Mesh size and technical specifications are confirmed directly by the company.",
    forms: ["Powder"],
    applications: ["Seasonings & spice blends", "Snacks & savoury foods", "Sauces & condiments", "Food processing and manufacturing"],
    image: "/images/products/garlic-powder-1.webp",
    imageAlt: "Fine dehydrated garlic powder",
    galleryImages: ["/images/products/garlic-powder-1.webp", "/images/products/garlic-powder-2.webp", "/images/products/garlic-powder-3.webp"],
    seoTitle: "Garlic Powder Manufacturer & Supplier India | Bulk Export",
    seoDescription:
      "Request details on dehydrated garlic powder from OM Food and Spices LLP, Gujarat, India. Bulk supply and export enquiries welcome.",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (c: Category) => products.filter((p) => p.category === c && p.form !== "fresh");

export const productFootnote =
  "Products, formats, specifications and packaging depend on availability and confirmation by the company.";
