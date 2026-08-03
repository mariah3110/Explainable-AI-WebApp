import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine} from "recharts";
import { formatFeatureName } from "./featureLabels";

// Typen (Format: lime_local.json)
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
  predictionLabel?: string;
}

export default function CreatePlotLime({
  data,
  title = "Lokale LIME-Erklärung",
  predictionLabel,
}: Props) {
  const pred = predictionLabel ?? data.prediction;
  const chartData = [...data.features]
    .sort((a, b) => b.absWeight - a.absWeight)
    .map((item) => ({
        ...item,
        feature: formatFeatureName(item.feature),
        weight: Number(item.weight.toFixed(3)),
    }));

const chartHeight = Math.max(400, chartData.length * 35);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center mb-1">
        LIME Analyse – {title}
      </h2>

      <p className="text-center text-sm text-gray-400 mb-4">
        Beispiel {data.sampleId + 1} - Vorhersage: {" "}
        <strong className="font-semibold text-gray-200">
          {pred}
        </strong>
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
                    ? "#75da82"
                    : "#5a83f9"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}