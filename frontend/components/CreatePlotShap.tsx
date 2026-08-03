// CreatePlotShap.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FeatureData {
  feature: string;
  importance: number;
}

interface Props {
  data: FeatureData[];
  title?: string;
}

/* ───────── Farb-Codes (mehrfach verwendet) ───────── */
const colors: Record<string, string> = {
  n: "braun",  b: "beige",  c: "zimt",   g: "grau",
  r: "grün",   p: "rosa",   u: "lila",   e: "rot",
  w: "weiß",   y: "gelb",   o: "orange", k: "schwarz",
  h: "schoko",
};

/* ───────── Basis-Feature → deutscher Name ───────── */
const baseNames: Record<string, string> = {
  // Mushroom
  "cap-shape":               "Hutform",
  "cap-surface":             "Hutfläche",
  "cap-color":               "Hutfarbe",
  "bruises?":                "Druckstellen",
  "bruises":                 "Druckstellen",
  "odor":                    "Geruch",
  "gill-attachment":         "Lamellen-Ans.",
  "gill-spacing":            "Lamellen-Abst.",
  "gill-size":               "Lamellengröße",
  "gill-color":              "Lamellenfarbe",
  "stalk-shape":             "Stielform",
  "stalk-root":              "Stielwurzel",
  "stalk-surface-above-ring":"Stiel oben",
  "stalk-surface-below-ring":"Stiel unten",
  "stalk-color-above-ring":  "Stielfarbe oben",
  "stalk-color-below-ring":  "Stielfarbe unten",
  "veil-type":               "Schleiertyp",
  "veil-color":              "Schleierfarbe",
  "ring-number":             "Anz. Ringe",
  "ring-type":               "Ringtyp",
  "spore-print-color":       "Sporenfarbe",
  "population":              "Population",
  "habitat":                 "Lebensraum",

  // Penguins
  "culmen_length_mm":  "Schnabellänge",
  "culmen_depth_mm":   "Schnabeltiefe",
  "bill_length_mm":    "Schnabellänge",
  "bill_depth_mm":     "Schnabeltiefe",
  "flipper_length_mm": "Flügellänge",
  "body_mass_g":       "Gewicht",
  "island":            "Insel",
  "sex":               "Geschlecht",

  // Wine
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
  "stalk-root":   { b: "knollig", c: "keulig", u: "becher", e: "gleich", z: "rhizomorph", r: "verwurzelt", "?": "fehlend" },
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

  // Penguins
  "island": { Biscoe: "Biscoe", Dream: "Dream", Torgersen: "Torgersen" },
  "sex":    { MALE: "männlich", FEMALE: "weiblich" },
};

/* ───────── Hauptfunktion ───────── */
function formatFeatureName(feature: string): string {
  // URL-Decoding (z.B. bruises%3F → bruises?)
  let decoded = decodeURIComponent(feature);

  // LIME-Schwellen entfernen (z.B. "> 3.50", "<= -1.20")
  decoded = decoded.replace(/<=?\s*-?\d+(\.\d+)?/g, "");
  decoded = decoded.replace(/>=?\s*-?\d+(\.\d+)?/g, "");
  decoded = decoded.replace(/-?\d+(\.\d+)?\s*</g, "");

  // Auf " = " splitten → Basis + Wert
  const parts = decoded.split(" = ");
  const rawBase = parts[0].replace(/_/g, "-").trim();
  const rawValue = parts.length > 1 ? parts[parts.length - 1].trim() : null;

  // Basis übersetzen
  const base = baseNames[rawBase] ?? rawBase.replace(/[-_]/g, " ");

  // Ohne Kategorie-Wert → nur Basisname
  if (!rawValue || rawValue === "") return base;

  // Kategorie-Wert übersetzen
  const valueLabel = categoryValues[rawBase]?.[rawValue] ?? rawValue;

  return `${base}: ${valueLabel}`;
}

/* ───────── Komponente ───────── */
export default function CreatePlotShap({
  data,
  title = "Globale SHAP-Feature-Wichtigkeit",
}: Props) {
  const chartData = [...data]
    .filter((item) => item.importance !== 0)
    .sort((a, b) => b.importance - a.importance)
    .map((item) => ({
      ...item,
      displayName: formatFeatureName(item.feature),
      importance: Number(item.importance.toFixed(3)),
    }));

  const chartHeight = Math.max(300, chartData.length * 24);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-center mb-4">
        SHAP Analyse – {title}
      </h2>

      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: 320 }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 1, bottom: 10 }}
            >
              <XAxis type="number" tick={{ fontSize: 10 }} />

              <YAxis
                type="category"
                dataKey="displayName"
                width={110}
                interval={0}
                tick={{ fontSize: 10 }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const item = payload[0].payload as {
                    feature: string;
                    displayName: string;
                    importance: number;
                  };

                  return (
                    <div className="bg-gray-800/90 border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-white">
                        {item.displayName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.feature}
                      </p>
                      <p className="mt-1 text-gray-300">
                        Wichtigkeit:{" "}
                        <span className="font-semibold">
                          {item.importance.toFixed(3)}
                        </span>
                      </p>
                    </div>
                  );
                }}
              />

              <Bar
                dataKey="importance"
                radius={[0, 8, 8, 0]}
                animationDuration={1200}
                animationBegin={200}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(${220 - index * 15}, 70%, 60%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}