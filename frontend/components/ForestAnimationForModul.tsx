import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { useInView } from "framer-motion";

const TREE_CONFIGS = [
  { root: "root",    left: "Knoten1",   right: "Knoten2",    ll: "Knoten3",     lr: "Knoten4"},
];

type TreeConfig = typeof TREE_CONFIGS[0];

const PUR = "#6781D9";
const LT  = "#8AD9B9";
const LN  = "#64748b";

function MiniDecisionTree({ cfg, step }: { cfg: TreeConfig; step: number }) {
  const nW = 90, nH = 34;
  const W = 200, cx = W / 2 + 60;
  const rootX = cx - nW / 2;
  const leftX = 60, rightX = W - nW + 60;

  return (
    <svg viewBox="0 0 260 215" className="w-full h-full">
      {/* Root */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${cx}px 23px` }}
      >
        <rect x={rootX} y={6} width={nW} height={nH} rx={9} fill={PUR} />
        <text x={cx} y={24} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={10.5}>
          {cfg.root}
        </text>
      </motion.g>

      {/* Level-1 lines */}
      {step >= 1 && (
        <>
          <motion.line x1={cx} y1={40} x2={leftX + nW / 2} y2={95}
            stroke={LN} strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          <motion.line x1={cx} y1={40} x2={rightX + nW / 2} y2={95}
            stroke={LN} strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        </>
      )}

      {/* Level-1 nodes */}
      {step >= 2 && (
        <>
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${leftX + nW / 2}px 112px` }}>
            <rect x={leftX} y={95} width={nW} height={nH} rx={9} fill={PUR} />
            <text x={leftX + nW / 2} y={113} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={10.5}>
              {cfg.left}
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${rightX + nW / 2}px 112px` }}>
            <rect x={rightX} y={95} width={nW} height={nH} rx={9} fill={LT} />
            <text x={rightX + nW / 2} y={113} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={10.5}>
              {cfg.right}
            </text>
          </motion.g>
        </>
      )}

      {/* Level-2 lines */}
      {step >= 3 && (
        <>
          <motion.line x1={leftX + nW / 2} y1={129} x2={leftX + nW / 2 - 60} y2={175}
            stroke={LN} strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          <motion.line x1={leftX + nW / 2} y1={129} x2={leftX + nW / 2 + 60} y2={175}
            stroke={LN} strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        </>
      )}

      {/* Leaves */}
      {step >= 4 && (
        <>
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${leftX + nW / 2 - 60}px 192px` }}>
            <rect x={leftX + nW / 2 - 60 - nW / 2} y={175} width={nW} height={nH} rx={9} fill={LT} />
            <text x={leftX + nW / 2 - 60} y={193} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={10.5}>
              {cfg.ll}
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${leftX + nW / 2 + 60}px 192px` }}>
            <rect x={leftX + nW / 2 + 60 - nW / 2} y={175} width={nW} height={nH} rx={9} fill={LT} />
            <text x={leftX + nW / 2 + 60} y={193} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={10.5}>
              {cfg.lr}
            </text>
          </motion.g>
        </>
      )}
    </svg>
  );
}

export function ForestAnimationForModul() {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, amount: 0.9});

  const [phase, setPhase] = useState<"single" | "end">("single");
  const [treeStep, setTreeStep] = useState(0);
  const [key, setKey] = useState(0);

  const startAnimation = useCallback(() => {
    setPhase("single");
    setTreeStep(0);
    setKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const timers = [
      setTimeout(() => setTreeStep(1), 700),
      setTimeout(() => setTreeStep(2), 1400),
      setTimeout(() => setTreeStep(3), 2100),
      setTimeout(() => setTreeStep(4), 2800),
      setTimeout(() => setPhase("end"), 4500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [key, isInView]);

  return (
    <div 
      ref={ref}
      className="relative w-full flex flex-col items-center"
    >
      <div className="relative w-[380px] h-[230px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "single" && (
            <motion.div
              key={`single-${key}`}
              className=""
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{x: -95, opacity: 3, scale: 0.70 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <MiniDecisionTree cfg={TREE_CONFIGS[0]} step={treeStep} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </div>
  );
}