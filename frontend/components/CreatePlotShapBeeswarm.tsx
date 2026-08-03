// CreatePlotShapBeeswarm.tsx — SHAP Beeswarm
// Jeder Punkt = ein Sample. x = SHAP-Wert. Farbe = Feature-Wert.

import { useMemo, useState } from "react";
import { formatFeatureName } from "./featureLabels";

/* ───────── Typen (Format: shap_local.json) ───────── */
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
  data: ShapLocalSample[];
  title?: string;
  maxFeatures?: number;
}

/* ───────── interne Strukturen ───────── */
interface Dot {
  sampleId: number;
  impact: number;
  t: number;
  rawValue: number;
}

interface Row {
  /** Roh-Feature-String aus den Daten (eindeutig, wird als React-Key verwendet) */
  feature: string;
  /** Übersetztes Label für die Anzeige */
  label: string;
  meanAbs: number;
  dots: Dot[];
}

/* ───────── Farbskala blau → rot ───────── */
const LOW  = { r: 59, g: 130, b: 246 };
const HIGH = { r: 239, g: 68,  b: 68  };

function valueColor(t: number): string {
  const r = Math.round(LOW.r + (HIGH.r - LOW.r) * t);
  const g = Math.round(LOW.g + (HIGH.g - LOW.g) * t);
  const b = Math.round(LOW.b + (HIGH.b - LOW.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/* ───────── Layout-Konstanten ───────── */
const LABEL_WIDTH = 160;
const PLOT_WIDTH  = 480;
const ROW_HEIGHT  = 36;
const DOT_RADIUS  = 5;
const AXIS_HEIGHT = 30;

export default function CreatePlotShapBeeswarm({
  data,
  title = "SHAP Beeswarm",
  maxFeatures = 10,
}: Props) {
  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const rows: Row[] = useMemo(() => {
    const byFeature = new Map<
      string,
      { impact: number; value: number; sampleId: number }[]
    >();

    for (const sample of data) {
      for (const f of sample.features) {
        const list = byFeature.get(f.feature) ?? [];
        list.push({
          impact: f.impact,
          value: f.value,
          sampleId: sample.sampleId,
        });
        byFeature.set(f.feature, list);
      }
    }

    const result: Row[] = [];
    for (const [feature, points] of byFeature) {
      const meanAbs =
        points.reduce((sum, p) => sum + Math.abs(p.impact), 0) / points.length;

      const values = points.map((p) => p.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const span = max - min;

      result.push({
        feature,
        label: formatFeatureName(feature),
        meanAbs,
        dots: points.map((p) => ({
          sampleId: p.sampleId,
          impact: p.impact,
          rawValue: p.value,
          t: span === 0 ? 0.5 : (p.value - min) / span,
        })),
      });
    }

    return result
      .sort((a, b) => b.meanAbs - a.meanAbs)
      .slice(0, maxFeatures);
  }, [data, maxFeatures]);

  const maxImpact = useMemo(() => {
    let m = 0;
    for (const row of rows)
      for (const dot of row.dots) m = Math.max(m, Math.abs(dot.impact));
    return m === 0 ? 1 : m * 1.1;
  }, [rows]);

  const xScale = (impact: number) =>
    LABEL_WIDTH + ((impact + maxImpact) / (2 * maxImpact)) * PLOT_WIDTH;

  function jitter(dots: Dot[]): { dot: Dot; dy: number }[] {
    const sorted = [...dots].sort((a, b) => a.impact - b.impact);
    const placed: { x: number; dy: number }[] = [];
    return sorted.map((dot) => {
      const x = xScale(dot.impact);
      const collisions = placed.filter(
        (p) => Math.abs(p.x - x) < DOT_RADIUS * 2
      ).length;
      const dy =
        collisions === 0
          ? 0
          : (collisions % 2 === 1 ? 1 : -1) *
            Math.ceil(collisions / 2) *
            (DOT_RADIUS + 2);
      placed.push({ x, dy });
      return { dot, dy };
    });
  }

  const height = rows.length * ROW_HEIGHT + AXIS_HEIGHT + 30;
  const zeroX  = xScale(0);
  const ticks  = [-maxImpact, -maxImpact / 2, 0, maxImpact / 2, maxImpact];

  return (
    <div className="w-full h-full flex flex-col relative">
      <h2 className="text-xl font-semibold text-center mb-4">
        SHAP Analyse – {title}
      </h2>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${LABEL_WIDTH + PLOT_WIDTH + 20} ${height}`}
          style={{ minWidth: 480 }}
          className="w-full"
        >
          {/* Nulllinie */}
          <line
            x1={zeroX} y1={0}
            x2={zeroX} y2={rows.length * ROW_HEIGHT}
            stroke="rgba(255,255,255,0.25)" strokeWidth={1}
          />

          {/* Achsen-Ticks */}
          {ticks.map((tick, i) => (
            <g key={`tick-${i}`}>
              <line
                x1={xScale(tick)} y1={rows.length * ROW_HEIGHT}
                x2={xScale(tick)} y2={rows.length * ROW_HEIGHT + 5}
                stroke="rgba(255,255,255,0.4)"
              />
              <text
                x={xScale(tick)} y={rows.length * ROW_HEIGHT + 17}
                textAnchor="middle" fontSize={10}
                fill="rgba(255,255,255,0.6)"
              >
                {tick.toFixed(2)}
              </text>
            </g>
          ))}
          <text
            x={zeroX} y={rows.length * ROW_HEIGHT + AXIS_HEIGHT}
            textAnchor="middle" fontSize={10}
            fill="rgba(255,255,255,0.45)"
          >
            SHAP-Wert (Einfluss auf die Vorhersage)
          </text>

          {/* Zeilen — KEY ist row.feature (der Roh-String, immer eindeutig) */}
          {rows.map((row, rowIndex) => {
            const cy = rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
            return (
              <g key={row.feature}>
                <line
                  x1={LABEL_WIDTH} y1={rowIndex * ROW_HEIGHT}
                  x2={LABEL_WIDTH + PLOT_WIDTH} y2={rowIndex * ROW_HEIGHT}
                  stroke="rgba(255,255,255,0.06)"
                />
                <text
                  x={LABEL_WIDTH - 8} y={cy + 4}
                  textAnchor="end" fontSize={11}
                  fill="rgba(255,255,255,0.85)"
                >
                  {row.label}
                </text>

                {jitter(row.dots).map(({ dot, dy }, i) => (
                  <circle
                    key={`${dot.sampleId}-${i}`}
                    cx={xScale(dot.impact)}
                    cy={cy + dy}
                    r={DOT_RADIUS}
                    fill={valueColor(dot.t)}
                    fillOpacity={0.85}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={0.5}
                    onMouseEnter={() =>
                      setHovered({
                        x: xScale(dot.impact),
                        y: cy + dy,
                        text: `Sample ${dot.sampleId} · ${row.label} · SHAP ${dot.impact.toFixed(3)}`,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute pointer-events-none bg-gray-800/95 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white shadow-lg"
          style={{ left: 0, bottom: 0 }}
        >
          {hovered.text}
        </div>
      )}

      {/* Farb-Legende */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
        <span>Feature-Wert: niedrig</span>
        <div
          className="h-2 w-32 rounded-full"
          style={{ background: "linear-gradient(to right, #3b82f6, #ef4444)" }}
        />
        <span>hoch</span>
      </div>
    </div>
  );
}