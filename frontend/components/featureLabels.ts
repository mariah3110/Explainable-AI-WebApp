// featureLabels.ts
// Zentrales Übersetzungsmodul für Feature-Namen und Kategorie-Werte
// der drei Datensätze (Mushroom, Penguins, Wine).
// Wird von allen SHAP- und LIME-Plots verwendet.

/* ───────── Farb-Codes (mehrfach verwendet, Mushroom) ───────── */
const colors: Record<string, string> = {
  n: "braun",  b: "beige",  c: "zimt",   g: "grau",
  r: "grün",   p: "rosa",   u: "lila",   e: "rot",
  w: "weiß",   y: "gelb",   o: "orange", k: "schwarz",
  h: "schoko",
};

/* ───────── Basis-Feature → deutscher Name ─────────
   Keys stehen SOWOHL mit Underscores (Penguins/Wine)
   ALS AUCH mit Hyphens (Mushroom), damit der Lookup
   unabhängig vom Eingabe-Format funktioniert.           */
const baseNames: Record<string, string> = {
  // Mushroom (Hyphens)
  "cap-shape":                "Hutform",
  "cap-surface":              "Hutfläche",
  "cap-color":                "Hutfarbe",
  "bruises?":                 "Druckstellen",
  "bruises":                  "Druckstellen",
  "odor":                     "Geruch",
  "gill-attachment":          "Lamellen-Ans.",
  "gill-spacing":             "Lamellen-Abst.",
  "gill-size":                "Lamellengröße",
  "gill-color":               "Lamellenfarbe",
  "stalk-shape":              "Stielform",
  "stalk-root":               "Stielwurzel",
  "stalk-surface-above-ring": "Stiel oben",
  "stalk-surface-below-ring": "Stiel unten",
  "stalk-color-above-ring":   "Stielfarbe oben",
  "stalk-color-below-ring":   "Stielfarbe unten",
  "veil-type":                "Schleiertyp",
  "veil-color":               "Schleierfarbe",
  "ring-number":              "Anz. Ringe",
  "ring-type":                "Ringtyp",
  "spore-print-color":        "Sporenfarbe",
  "population":               "Population",
  "habitat":                  "Lebensraum",

  // Penguins (Underscores — so wie sie in den JSON-Dateien stehen)
  "culmen_length_mm":  "Schnabellänge",
  "culmen_depth_mm":   "Schnabeltiefe",
  "bill_length_mm":    "Schnabellänge",
  "bill_depth_mm":     "Schnabeltiefe",
  "flipper_length_mm": "Flügellänge",
  "body_mass_g":       "Gewicht",
  "island":            "Insel",
  "sex":               "Geschlecht",

  // Wine (Underscores — so wie sie in den JSON-Dateien stehen)
  "alcohol":                      "Alkohol",
  "malic_acid":                   "Apfelsäure",
  "ash":                          "Asche",
  "alcalinity_of_ash":            "Asche-Alkalität",
  "magnesium":                    "Magnesium",
  "total_phenols":                "Gesamtphenole",
  "flavanoids":                   "Flavonoide",
  "nonflavanoid_phenols":         "Andere Phenole",
  "proanthocyanins":              "Proanthocyane",
  "color_intensity":              "Farbintensität",
  "hue":                          "Farbton",
  "od280/od315_of_diluted_wines": "OD280/OD315",
  "proline":                      "Prolin",
};

/* ───────── Kategorie-Werte je Feature ───────── */
const categoryValues: Record<string, Record<string, string>> = {
  "cap-shape":    { b: "Glocke", c: "Kegel", x: "konvex", f: "flach", k: "bucklig", s: "vertieft" },
  "cap-surface":  { f: "faserig", g: "gerillt", y: "schuppig", s: "glatt" },
  "cap-color":    colors,
  "bruises?":     { t: "ja", f: "nein" },
  "bruises":      { t: "ja", f: "nein" },
  "odor":         { a: "Mandel", l: "Anis", c: "Kreosot", y: "fischig", f: "faulig", m: "muffig", n: "keiner", p: "stechend", s: "würzig" },
  "gill-attachment": { a: "anliegend", d: "herablaufend", f: "frei", n: "eingekerbt" },
  "gill-spacing": { c: "eng", w: "gedrängt", d: "weit" },
  "gill-size":    { b: "breit", n: "schmal" },
  "gill-color":   colors,
  "stalk-shape":  { e: "verdickt", t: "verjüngt" },
  "stalk-root":   { b: "knollig", c: "keulig", u: "becher", e: "gleich", z: "rhizomorph", r: "verwurzelt", "?": "fehlend", nan: "fehlend" },
  "stalk-surface-above-ring": { f: "faserig", y: "schuppig", k: "seidig", s: "glatt" },
  "stalk-surface-below-ring": { f: "faserig", y: "schuppig", k: "seidig", s: "glatt" },
  "stalk-color-above-ring":   colors,
  "stalk-color-below-ring":   colors,
  "veil-type":    { p: "teilweise", u: "universell" },
  "veil-color":   colors,
  "ring-number":  { n: "keiner", o: "einer", t: "zwei" },
  "ring-type":    { c: "spinnweb", e: "flüchtig", f: "trichter", l: "groß", n: "keiner", p: "hängend", s: "umhüllend", z: "Zone" },
  "spore-print-color": colors,
  "population":   { a: "häufig", c: "gehäuft", n: "zahlreich", s: "verstreut", v: "mehrere", y: "einzeln" },
  "habitat":      { d: "Wald", g: "Gras", l: "Laub", m: "Wiese", p: "Wege", u: "Stadt", w: "Ödland" },
  "island": { Biscoe: "Biscoe", Dream: "Dream", Torgersen: "Torgersen" },
  "sex":    { MALE: "männlich", FEMALE: "weiblich" },
};

/* ───────── Klassen-Labels je Datensatz ───────── */
export const classLabels: Record<string, Record<string, string>> = {
  mushroom: { e: "essbar", p: "giftig" },
  penguins: { Adelie: "Adelie", Chinstrap: "Chinstrap", Gentoo: "Gentoo" },
  wine:     { class_0: "Klasse 0", class_1: "Klasse 1", class_2: "Klasse 2" },
};

export interface ParsedFeature {
  rawBase: string;
  rawValue: string | null;
  base: string;
  value: string | null;
  label: string;
}

/* ───────── Hilfsfunktion: Key in baseNames finden ─────────
   Probiert: Originalstring → mit Hyphens → mit Underscores.
   Gibt den übersetzten Namen zurück oder null.              */
function lookupBase(key: string): string | null {
  if (baseNames[key] !== undefined) return baseNames[key];
  const hyphenated = key.replace(/_/g, "-");
  if (baseNames[hyphenated] !== undefined) return baseNames[hyphenated];
  const underscored = key.replace(/-/g, "_");
  if (baseNames[underscored] !== undefined) return baseNames[underscored];
  return null;
}

/* ───────── Hilfsfunktion: Key in categoryValues finden ───────── */
function lookupCategory(key: string, val: string): string | null {
  if (categoryValues[key]?.[val] !== undefined) return categoryValues[key][val];
  const hyphenated = key.replace(/_/g, "-");
  if (categoryValues[hyphenated]?.[val] !== undefined)
    return categoryValues[hyphenated][val];
  const underscored = key.replace(/-/g, "_");
  if (categoryValues[underscored]?.[val] !== undefined)
    return categoryValues[underscored][val];
  return null;
}

/* ───────── Feature-String zerlegen und übersetzen ─────────
   Reihenfolge:
   1. Ganzen String (mit " = " → "_") in baseNames suchen.
      Trifft z.B. auf "culmen = length = mm" → "culmen_length_mm" → "Schnabellänge" zu.
      Damit werden numerische Penguin-/Wine-Features korrekt erkannt,
      BEVOR der Split sie in unbrauchbare Teile zerlegt.
   2. Erst danach auf " = " splitten (für kategorische Features wie "odor = n"). */
export function parseFeature(feature: string): ParsedFeature {
  let decoded = decodeURIComponent(feature);

  // LIME-Schwellen entfernen
  decoded = decoded.replace(/<=?\s*-?\d+(\.\d+)?/g, "");
  decoded = decoded.replace(/>=?\s*-?\d+(\.\d+)?/g, "");
  decoded = decoded.replace(/-?\d+(\.\d+)?\s*</g, "");
  decoded = decoded.trim();

  // ── Schritt 1: Ganzen String als ein Feature-Name versuchen ──
  // " = " und " " zurück zu "_", dann in baseNames nachschlagen.
  const unified = decoded.replace(/ = /g, "_").replace(/ /g, "_");
  const wholeMatch = lookupBase(unified);
  if (wholeMatch) {
    return { rawBase: unified, rawValue: null, base: wholeMatch, value: null, label: wholeMatch };
  }

  // ── Schritt 2: Auf " = " splitten → Basis + Kategorie-Wert ──
  const parts = decoded.split(" = ");
  const rawBase = parts[0].trim();
  const rawValue = parts.length > 1 ? parts[parts.length - 1].trim() : null;

  const base = lookupBase(rawBase) ?? rawBase.replace(/[-_]/g, " ");

  if (!rawValue || rawValue === "") {
    return { rawBase, rawValue: null, base, value: null, label: base };
  }

  const value = lookupCategory(rawBase, rawValue) ?? rawValue;

  return { rawBase, rawValue, base, value, label: `${base}: ${value}` };
}

/* ───────── Kompatibilität: bisherige Funktion ───────── */
export function formatFeatureName(feature: string): string {
  return parseFeature(feature).label;
}

/* ───────── Kategoriewert eines Samples übersetzen ───────── */
export function translateCategoryValue(
  rawBase: string,
  rawValue: string
): string {
  const decoded = decodeURIComponent(rawBase).trim();
  return lookupCategory(decoded, rawValue) ?? rawValue;
}