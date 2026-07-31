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

function formatFeatureName(feature: string): string {
  const replacements: Record<string, string> = {
    // ================= Penguins =================
    "culmen = length = mm": "Schnabellänge",
    "culmen = depth = mm": "Schnabeltiefe",
    "bill = length = mm": "Schnabellänge",
    "bill = depth = mm": "Schnabeltiefe",
    "flipper = length = mm": "Flügellänge",
    "body = mass = g": "Körpergewicht",
    "body_mass_g": "Körpergewicht",
    "flipper_length_mm": "Flügellänge",
    "bill_length_mm": "Schnabellänge",
    "bill_depth_mm": "Schnabeltiefe",

    "sex = MALE": "Geschlecht: Männlich",
    "sex = FEMALE": "Geschlecht: Weiblich",
    "sex =  = ": "Geschlecht",

    "island = Biscoe": "Insel: Biscoe",
    "island = Dream": "Insel: Dream",
    "island = Torgersen": "Insel: Torgersen",
    "island": "Insel",

    // ================= Mushroom =================
    "cap-shape": "Hutform",
    "cap-surface": "Hutoberfläche",
    "cap-color": "Hutfarbe",
    "bruises": "Druckstellen",
    "odor": "Geruch",
    "gill-attachment": "Lamellenansatz",
    "gill-spacing": "Lamellenabstand",
    "gill-size": "Lamellengröße",
    "gill-color": "Lamellenfarbe",
    "stalk-shape": "Stielform",
    "stalk-root": "Stielwurzel",
    "stalk-surface-above-ring": "Stieloberfläche oberhalb Ring",
    "stalk-surface-below-ring": "Stieloberfläche unterhalb Ring",
    "stalk-color-above-ring": "Stielfarbe oberhalb Ring",
    "stalk-color-below-ring": "Stielfarbe unterhalb Ring",
    "veil-type": "Schleiertyp",
    "veil-color": "Schleierfarbe",
    "ring-number": "Anzahl Ringe",
    "ring-type": "Ringtyp",
    "spore-print-color": "Sporenfarbe",
    "population": "Population",
    "habitat": "Lebensraum",

    // ================= Wine =================
    "alcohol":                      "Alkoholgehalt",
    "malic_acid":                   "Apfelsäure",
    "ash":                          "Aschegehalt",
    "alcalinity_of_ash":            "Alkalität der Asche",
    "magnesium":                    "Magnesium",
    "total_phenols":                "Gesamtphenole",
    "flavanoids":                   "Flavonoide",
    "nonflavanoid_phenols":         "Andere Phenole",
    "proanthocyanins":              "Proanthocyanidine",
    "color_intensity":              "Farbintensität",
    "hue":                          "Farbton",
    "od280/od315_of_diluted_wines": "Lichtabsorption",
    "proline":                      "Prolin",
  };

  let label = replacements[feature] ?? feature;

  // One-Hot-Encoding schöner darstellen
  label = label.replace(/ = /g, ": ");

  // LIME-Schwellen entfernen
  label = label.replace(/<=\s*-?\d+(\.\d+)?/g, "");
  label = label.replace(/>\s*-?\d+(\.\d+)?/g, "");

  // Intervalle entfernen
  label = label.replace(/-?\d+(\.\d+)?\s*</g, "");

  // Unterstriche entfernen
  label = label.replace(/_/g, " ");

  // Mehrfache Leerzeichen entfernen
  label = label.replace(/\s+/g, " ").trim();

  return label;
}

export default function CreatePlotShap({
  data,
  title = "Globale SHAP-Feature-Wichtigkeit",
}: Props) {
  const chartData = [...data]
    .sort((a, b) => b.importance - a.importance)
    .map((item) => ({
      ...item,
      displayName: formatFeatureName(item.feature),
      importance: Number(item.importance.toFixed(3)),
    }));

  const chartHeight = Math.max(400, chartData.length * 28);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-center mb-4">
        SHAP Analyse – {title}
      </h2>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 10,
          }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            type="category"
            dataKey="displayName"
            width={140}
            interval={0}
            tick={{ fontSize: 12 }}
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

                  <p className="text-sm text-gray-500">
                    {item.feature}
                  </p>

                  <p className="mt-1 text-gray-400">
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
  );
}