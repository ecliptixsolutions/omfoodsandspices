/** Client-approved catalogue structure. Individual forms remain unpublished until approved. */
export const productFamilies = [
  { name: "White onion", code: "WO" },
  { name: "Red onion", code: "RO" },
  { name: "Pink onion", code: "PO" },
  { name: "Garlic", code: "GA" },
] as const;

export const productForms = [
  { name: "Flakes / kibbled", code: "FLK" },
  { name: "Chopped", code: "CHP" },
  { name: "Minced", code: "MIN" },
  { name: "Granules", code: "GRA" },
  { name: "Powder", code: "PWD" },
] as const;

export const plannedProducts = productFamilies.flatMap((family) =>
  productForms.map((form) => ({
    name: `${family.name} ${form.name.toLowerCase()}`,
    code: `${family.code}-${form.code}`,
    family: family.name,
    form: form.name,
    status: "Pending product approval" as const,
  })),
);
