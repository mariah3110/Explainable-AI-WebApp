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

interface ShapData {
  dataset: string;
  classes: string[];
  features: FeatureData[];
}

interface Props {
  data: ShapData;
}

const descriptions: Record<string, string> = {
  // Penguins
  bill_length_mm: "Schnabellänge",
  flipper_length_mm: "Flügellänge",
  bill_depth_mm: "Schnabeltiefe",
  body_mass_g: "Körpergewicht",
  island: "Herkunftsinsel",
  sex: "Geschlecht",

  // Mushroom
  cap_shape: "Hutform",
  cap_surface: "Hutoberfläche",
  cap_color: "Hutfarbe",
  "bruises%3F": "Druckstellen",
  odor: "Geruch",
  gill_attachment: "Lamellenbefestigung",
  gill_spacing: "Lamellenabstand",
  gill_size: "Lamellengröße",
  gill_color: "Lamellenfarbe",
  stalk_shape: "Stielform",
  stalk_root: "Stielwurzel",
  stalk_surface_above_ring: "Stieloberfläche über dem Ring",
  stalk_surface_below_ring: "Stieloberfläche unter dem Ring",
  stalk_color_above_ring: "Stielfarbe über dem Ring",
  stalk_color_below_ring: "Stielfarbe unter dem Ring",
  veil_type: "Hüllentyp",
  veil_color: "Hüllenfarbe",
  ring_number: "Anzahl der Ringe",
  ring_type: "Ringtyp",
  spore_print_color: "Sporenpulverfarbe",
  population: "Vorkommenshäufigkeit",
  habitat: "Lebensraum",
"gill-size": "Lamellengröße",
  "spore-print-color": "Sporenfarbe",
  "stalk-surface-above-ring": "Stieloberfläche über dem Ring",
  "stalk-color-above-ring": "Stielfarbe über dem Ring",
  "ring-number": "Anzahl der Ringe",
  "cap-color": "Hutfarbe",
  "veil-color": "Hüllenfarbe",
  "veil-type": "Hüllentyp",
  "bruises": "Druckstellen",
  "gill-spacing": "Lamellenabstand",

  // Wine
  alcohol: "Alkoholgehalt",
  malic_acid: "Apfelsäure",
  ash: "Aschegehalt",
  alcalinity_of_ash: "Alkalität der Asche",
  magnesium: "Magnesium",
  total_phenols: "Gesamtphenole",
  flavanoids: "Flavonoide",
  nonflavanoid_phenols: "Nicht-Flavonoid-Phenole",
  proanthocyanins: "Proanthocyanidine",
  color_intensity: "Farbintensität",
  hue: "Farbton",
  "od280/od315_of_diluted_wines": "UV-Absorptionsverhältnis",
  proline: "Prolin"
};

export default function ShapImportancePlot({ data }: Props) {
  const chartData = [...data.features]
    .sort((a, b) => b.importance - a.importance)
    .map((item) => ({
      originalFeature: item.feature,
      feature: descriptions[item.feature] || item.feature,
      importance: Number(item.importance.toFixed(3)),
    }));

  const chartHeight = Math.max(400, chartData.length * 19);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-center mb-4">
        SHAP Analyse – {data.dataset}
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
            dataKey="feature"
            width={140}
            interval={0}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const item = payload[0].payload as {
                feature: string;
                originalFeature: string;
                importance: number;
              };

              return (
                <div className="bg-gray-800/90 border rounded-lg p-3 shadow-lg">
                  <p className="font-semibold text-white">
                    {item.feature}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.originalFeature}
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