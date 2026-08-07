import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { RotateCcw } from "lucide-react";

const TREE_CONFIGS = [
  { root: "Größe > 5cm?",    left: "Farbe = rot?",   right: "🍊 Orange",    ll: "🍎 Apfel",     lr: "🍓 Erdbeere",  result: "🍎" },
  { root: "Farbe = blau?",   left: "Form = rund?",   right: "🫐 Blaubeere", ll: "🍎 Apfel",     lr: "🍓 Erdbeere",  result: "🍎" },
  { root: "Gewicht > 80g?",  left: "Stiel = lang?",  right: "🍎 Apfel",     ll: "🍓 Erdbeere",  lr: "🫐 Blaubeere", result: "🫐" },
  { root: "Textur = glatt?", left: "Farbe = rot?",   right: "🍎 Apfel",     ll: "🫐 Blaubeere", lr: "🍓 Erdbeere",  result: "🍎" },
  { root: "Größe < 3cm?",    left: "Farbe = blau?",  right: "🍎 Apfel",     ll: "🫐 Blaubeere", lr: "🍓 Erdbeere",  result: "🍓" },
];

type TreeConfig = typeof TREE_CONFIGS[0];

const PUR = "#4e2572";
const LT  = "#9a8ad8";
const LN  = "#64748b";

// Geometrie einmal auf Modulebene statt bei jedem Render neu berechnet
const nW = 90, nH = 34;
const W = 200, cx = W / 2 + 60;
const rootX = cx - nW / 2;
const leftX = 60, rightX = W - nW + 60;

// Aufbau-Zeitpunkte des Einzelbaums in Sekunden – ersetzt die komplette setTimeout-Kette
const T = { root: 0, lines1: 0.7, nodes1: 1.4, lines2: 2.1, leaves: 2.8 };

// Ein Knoten; ohne play-Prop (Wald-Ansicht) als plain <g> ohne jeglichen Animations-Overhead
function Node({ x, y, fill, label, play, delay = 0 }: {
  x: number; y: number; fill: string; label: string; play?: boolean; delay?: number;
}) {
  const content = (
    <>
      <rect x={x} y={y} width={nW} height={nH} rx={9} fill={fill} />
      <text x={x + nW / 2} y={y + 18} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={10.5}>
        {label}
      </text>
    </>
  );
  // Statischer Fall: kein motion-Element, spart pro Wald 45+ animierte SVG-Elemente
  if (play === undefined) return <g>{content}</g>;
  return (
    // Nur Opacity animieren – SVG-Scale wird auf der CPU gerastert und ruckelt unter Last
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: play ? 1 : 0 }} transition={{ delay, duration: 0.4 }}>
      {content}
    </motion.g>
  );
}

// Eine Kante, gleiche Statisch/Animiert-Logik wie Node
function Edge({ x1, y1, x2, y2, play, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; play?: boolean; delay?: number;
}) {
  if (play === undefined) return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LN} strokeWidth={2} />;
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2} stroke={LN} strokeWidth={2}
      initial={{ opacity: 0 }} animate={{ opacity: play ? 1 : 0 }} transition={{ delay, duration: 0.4 }}
    />
  );
}

// play=undefined: fertiger Baum ohne Animation; play=boolean: Aufbau rein über framer-motion-Delays
function MiniDecisionTree({ cfg, play }: { cfg: TreeConfig; play?: boolean }) {
  return (
    <svg viewBox="0 0 260 215" className="w-full h-full">
      {/* Root */}
      <Node x={rootX} y={6} fill={PUR} label={cfg.root} play={play} delay={T.root} />

      {/* Level-1 Kanten */}
      <Edge x1={cx} y1={40} x2={leftX + nW / 2} y2={95} play={play} delay={T.lines1} />
      <Edge x1={cx} y1={40} x2={rightX + nW / 2} y2={95} play={play} delay={T.lines1} />

      {/* Level-1 Knoten */}
      <Node x={leftX} y={95} fill={PUR} label={cfg.left} play={play} delay={T.nodes1} />
      <Node x={rightX} y={95} fill={LT} label={cfg.right} play={play} delay={T.nodes1} />

      {/* Level-2 Kanten */}
      <Edge x1={leftX + nW / 2} y1={129} x2={leftX + nW / 2 - 60} y2={175} play={play} delay={T.lines2} />
      <Edge x1={leftX + nW / 2} y1={129} x2={leftX + nW / 2 + 60} y2={175} play={play} delay={T.lines2} />

      {/* Blätter */}
      <Node x={leftX + nW / 2 - 60 - nW / 2} y={175} fill={LT} label={cfg.ll} play={play} delay={T.leaves} />
      <Node x={leftX + nW / 2 + 60 - nW / 2} y={175} fill={LT} label={cfg.lr} play={play} delay={T.leaves} />
    </svg>
  );
}

// Wald-Zelle: Scale/Opacity nur auf dem HTML-Wrapper (GPU-komponiert), der Baum selbst ist statisch
function TreeCell({ cfg, index, delay }: { cfg: TreeConfig; index: number; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35 }}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="w-[150px] h-[145px]">
        <MiniDecisionTree cfg={cfg} />
      </div>
      <span className="text-[10px] text-slate-500">
        Baum {index + 1}: {cfg.result}
      </span>
    </motion.div>
  );
}

export function ForestAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.9 });

  const [phase, setPhase] = useState<"single" | "forest" | "vote">("single");
  const [key, setKey] = useState(0);

  // Replay: Key-Wechsel remountet den Baum, alle Delays laufen dadurch von vorn
  const startAnimation = useCallback(() => {
    setPhase("single");
    setKey(k => k + 1);
  }, []);

  // Nur noch zwei grobe Phasen-Timer; der Baum-Aufbau selbst hängt nicht mehr an setTimeout/Re-Renders
  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setPhase("forest"), 4500),
      setTimeout(() => setPhase("vote"), 8000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [key, isInView]);

  return (
    <div ref={ref} className="relative w-full flex flex-col items-center gap-3">
      <div className="relative w-[450px] h-[380px] flex items-center justify-center">
        {/* Replay Button */}
        <button
          onClick={startAnimation}
          className="absolute top-0 left-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer border border-slate-600 hover:border-slate-400 rounded-md px-2.5 py-1 transition-colors"
        >
          <RotateCcw width="12" height="12" />
          Nochmal
        </button>

        <AnimatePresence mode="wait">
          {phase === "single" && (
            <motion.div
              key={`single-${key}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              // opacity max. 1 (vorher 3, ungültig); Baum bleibt beim Rausfliegen sichtbar
              exit={{ x: -70, y: -65, opacity: 1, scale: 0.3 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ willChange: "transform" }}
            >
              {/* Aufbau startet erst, wenn die Section im Viewport ist */}
              <MiniDecisionTree cfg={TREE_CONFIGS[0]} play={isInView} />
            </motion.div>
          )}

          {(phase === "forest" || phase === "vote") && (
            <motion.div
              key={`forest-${key}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex gap-4">
                {TREE_CONFIGS.slice(0, 2).map((cfg, i) => (
                  // Delays wie vorher gestaffelt, Label zeigt jetzt die echte Baum-Nummer
                  <TreeCell key={i} cfg={cfg} index={i} delay={(i + 5) * 0.15} />
                ))}
              </div>
              <div className="flex gap-4">
                {TREE_CONFIGS.slice(2).map((cfg, i) => (
                  <TreeCell key={i + 2} cfg={cfg} index={i + 2} delay={(i + 8) * 0.15} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-10 flex items-center justify-center">
        <AnimatePresence>
          {phase === "vote" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-slate-300 bottom-0"
            >
              <span className="text-slate-500 text-xs">Abstimmung:</span>
              {TREE_CONFIGS.map((c, i) => <span key={i}>{c.result}</span>)}
              <span className="text-slate-500">→</span>
              <span className="font-semibold text-white">🍎 Apfel</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}