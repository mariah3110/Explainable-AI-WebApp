import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

interface LimeFeature {
  feature: string;
  weight: number;
  absWeight: number;
  direction: string;
}

interface LimeExplanation {
  sampleId: number;
  prediction: string;
  features: LimeFeature[];
}

interface Props {
  data: LimeExplanation;
  title?: string;
}

export default function CreatePlotLime({
  data,
  title = "Lokale LIME-Erklärung",
}: Props) {
  const chartData = [...data.features]
    .sort((a, b) => b.absWeight - a.absWeight)
    .map((item) => ({
        ...item,
        feature: formatFeatureName(item.feature),
        weight: Number(item.weight.toFixed(3)),
    }));

function formatFeatureName(feature: string): string {
  const replacements: Record<string, string> = {
    // ---------- Penguins ----------
    "bill = length = mm": "Schnabellänge",
    "bill = depth = mm": "Schnabeltiefe",
    "culmen = length = mm": "Schnabellänge",
    "culmen = depth = mm": "Schnabeltiefe",
    "flipper = length = mm": "Flügellänge",
    "body = mass = g": "Körpergewicht",
    "sex = MALE": "Geschlecht: Männlich",
    "sex = FEMALE": "Geschlecht: Weiblich",
    "island = Biscoe": "Insel: Biscoe",
    "island = Dream": "Insel: Dream",
    "island = Torgersen": "Insel: Torgersen",

    // ---------- Mushroom ----------
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

    // ---------- Wine ----------
    "alcohol": "Alkoholgehalt",
    "malic_acid": "Apfelsäure",
    "ash": "Aschegehalt",
    "alcalinity_of_ash": "Alkalität der Asche",
    "magnesium": "Magnesium",
    "total_phenols": "Gesamtphenole",
    "flavanoids": "Flavonoide",
    "nonflavanoid_phenols": "Nicht-Flavonoid-Phenole",
    "proanthocyanins": "Proanthocyanidine",
    "color_intensity": "Farbintensität",
    "hue": "Farbton",
    "od280/od315_of_diluted_wines": "OD280 / OD315",
    "proline": "Prolin",
  };

  let label = replacements[feature] ?? feature;

  // One-Hot-Features schöner darstellen
  label = label.replace(/ = /g, ": ");

  // LIME-Schwellen entfernen
  label = label.replace(/<=\s*-?\d+(\.\d+)?/g, "");
  label = label.replace(/>\s*-?\d+(\.\d+)?/g, "");

  // Mehrfache Leerzeichen entfernen
  label = label.replace(/\s+/g, " ").trim();

  return label;
}

const chartHeight = Math.max(400, chartData.length * 35);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center mb-1">
        {title}
      </h2>

      <p className="text-center text-gray-500 mb-4">
        Vorhersage: <strong>{data.prediction}</strong>
      </p>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
        >
          <XAxis type="number" />

          <YAxis
            type="category"
            dataKey="feature"
            width={260}
            interval={0}
          />

          <ReferenceLine x={0} stroke="#999" />

            <Tooltip
            content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const item = payload[0].payload as {
                feature: string;
                weight: number;
                direction: string;
                };

                return (
                <div className="bg-gray-800/90 border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-white">
                    {item.feature}
                    </p>

                    <p className="mt-2 text-gray-300">
                    Gewicht:{" "}
                    <span className="font-semibold">
                        {typeof item.weight === "number"
                        ? item.weight.toFixed(3)
                        : "-"}
                    </span>
                    </p>

                    <p
                    className={`text-sm ${
                        item.direction === "positive"
                        ? "text-green-400"
                        : "text-blue-400"
                    }`}
                    >
                    {item.direction === "positive"
                        ? "Positiver Einfluss"
                        : "Negativer Einfluss"}
                    </p>
                </div>
                );
            }}
            />
          <Bar dataKey="weight" radius={[0, 6, 6, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.weight >= 0
                    ? "#3bf69f"
                    : "#cf2c7e"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}