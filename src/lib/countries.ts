import countries from "./countries.json";
// Browser and Node ICU versions can disagree on region names. Share the exact
// labels so form options and server validation match during hydration and use.
export const COUNTRIES = countries;
