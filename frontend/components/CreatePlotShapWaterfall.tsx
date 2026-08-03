import { useMemo, useState } from "react";
import { formatFeatureName } from "./featureLabels";

// Typen (Format: shap_local.json)
interface ShapLocalFeature {
  feature: string;
  value: number;
  impact: number;
  absImpact: number;
  direction: string;
}

interface ShapLocalSample {
  sampleId: number;
  prediction: string;
  features: ShapLocalFeature[];
}

interface Props {
  sample: ShapLocalSample;
  baseValue?: number;
  predictionLabel?: string;
  maxFeatures?: number;
  title?: string;
}

interface WaterfallBar {
  /** Eindeutiger Key: Roh-Feature-String oder "rest" */
  id: string;
  label: string;
  impact: number;
  start: number;
  end: number;
}

// Layout-Konstanten
const LABEL_WIDTH = 170;
const PLOT_WIDTH  = 460;
const ROW_HEIGHT  = 34;
const BAR_HEIGHT  = 18;

const POSITIVE = "#75da82";
const NEGATIVE = "#5a83f9";

export default function CreatePlotShapWaterfall({
  sample,
  baseValue = 0,
  predictionLabel,
  maxFeatures = 8,
  title = "Warum diese Vorhersage?",
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const { bars, finalValue } = useMemo(() => {
    const sorted = [...sample.features].sort(
      (a, b) => b.absImpact - a.absImpact
    );

    const top = sorted.slice(0, maxFeatures);
    const rest = sorted.slice(maxFeatures);
    const restSum = rest.reduce((sum, f) => sum + f.impact, 0);

    const entries: { id: string; label: string; impact: number }[] = top.map(
      (f) => ({
        id: f.feature,
        label: formatFeatureName(f.feature),
        impact: f.impact,
      })
    );

    if (rest.length > 0) {
      entries.push({
        id: "__rest__",
        label: `${rest.length} weitere Merkmale`,
        impact: restSum,
      });
    }

    let cumulative = baseValue;
    const bars: WaterfallBar[] = entries.map((e) => {
      const start = cumulative;
      cumulative += e.impact;
      return { id: e.id, label: e.label, impact: e.impact, start, end: cumulative };
    });

    return { bars, finalValue: cumulative };
  }, [sample, baseValue, maxFeatures]);

  const { xScale } = useMemo(() => {
    let min = baseValue;
    let max = baseValue;
    for (const bar of bars) {
      min = Math.min(min, bar.start, bar.end);
      max = Math.max(max, bar.start, bar.end);
    }
    const pad = (max - min) * 0.12 || 0.1;
    min -= pad;
    max += pad;
    const scale = (v: number) =>
      LABEL_WIDTH + ((v - min) / (max - min)) * PLOT_WIDTH;
    return { xScale: scale };
  }, [bars, baseValue]);

  const chartHeight = bars.length * ROW_HEIGHT;
  const height = chartHeight + 60;
  const baseX  = xScale(baseValue);
  const finalX = xScale(finalValue);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-center mb-1">
        SHAP Analyse – {title}
      </h2>
      <p className="text-center text-sm text-gray-400 mb-4">
        Beispiel {sample.sampleId + 1} - Vorhersage:{" "}
        <span className="font-semibold text-gray-200">
          {predictionLabel ?? sample.prediction}
        </span>
      </p>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${LABEL_WIDTH + PLOT_WIDTH + 20} ${height}`}
          style={{ minWidth: 480 }}
          className="w-full"
        >
          {/* Base-Value-Linie */}
          <line
            x1={baseX} y1={0} x2={baseX} y2={chartHeight}
            stroke="rgba(255,255,255,0.3)" strokeWidth={1}
            strokeDasharray="4,4"
          />
          <text
            x={baseX} y={chartHeight + 16}
            textAnchor="middle" fontSize={10}
            fill="rgba(255,255,255,0.6)"
          >
            E[f(x)] = {baseValue.toFixed(2)}
          </text>

          {/* Balken — KEY ist bar.id (Roh-Feature-String, eindeutig) */}
          {bars.map((bar, i) => {
            const y = i * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
            const x1 = xScale(Math.min(bar.start, bar.end));
            const x2 = xScale(Math.max(bar.start, bar.end));
            const width = Math.max(x2 - x1, 2);
            const positive = bar.impact >= 0;
            const color = positive ? POSITIVE : NEGATIVE;
            const isHovered = hovered === bar.id;

            return (
              <g
                key={bar.id}
                onMouseEnter={() => setHovered(bar.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <text
                  x={LABEL_WIDTH - 8}
                  y={y + BAR_HEIGHT / 2 + 4}
                  textAnchor="end" fontSize={11}
                  fill={isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)"}
                >
                  {bar.label}
                </text>

                <rect
                  x={x1} y={y}
                  width={width} height={BAR_HEIGHT}
                  rx={3}
                  fill={color}
                  fillOpacity={isHovered ? 1 : 0.85}
                />

                <text
                  x={positive ? x2 + 6 : x1 - 6}
                  y={y + BAR_HEIGHT / 2 + 4}
                  textAnchor={positive ? "start" : "end"}
                  fontSize={10} fontWeight={600}
                  fill={color}
                >
                  {positive ? "+" : ""}{bar.impact.toFixed(3)}
                </text>

                {i < bars.length - 1 && (
                  <line
                    x1={xScale(bar.end)} y1={y + BAR_HEIGHT}
                    x2={xScale(bar.end)}
                    y2={(i + 1) * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2}
                    stroke="rgba(255,255,255,0.25)" strokeWidth={1}
                    strokeDasharray="2,3"
                  />
                )}
              </g>
            );
          })}

          {/* finale Vorhersage */}
          <line
            x1={finalX} y1={chartHeight - ROW_HEIGHT / 2}
            x2={finalX} y2={chartHeight + 6}
            stroke="#a78bfa" strokeWidth={2}
          />
          <text
            x={finalX} y={chartHeight + 32}
            textAnchor="middle" fontSize={11}
            fontWeight={600} fill="#a78bfa"
          >
            f(x) = {finalValue.toFixed(2)}
          </text>
        </svg>
      </div>

      <p className="text-center text-xs text-gray-500 mt-2">
        Rot schiebt die Vorhersage nach oben, blau nach unten. Die Balken
        summieren sich exakt von E[f(x)] zur Vorhersage f(x).
      </p>
    </div>
  );
}