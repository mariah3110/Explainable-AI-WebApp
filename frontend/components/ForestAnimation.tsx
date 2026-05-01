import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DecisionTreeAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => setStep(3), 2400),
      setTimeout(() => setStep(4), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="100 100 600 400" className="w-full h-full">

        {/* ROOT */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: step >= 0 ? 1 : 0, scale: step >= 0 ? 1 : 0 }}
        >
          <rect x={360} y={80} width={180} height={70} rx={12} fill="#4e2572" />
          <text x={450} y={115} textAnchor="middle" fill="white">
            Größe &gt; 5cm?
          </text>
        </motion.g>

        {/* LINES */}
        {step >= 1 && (
          <>
            <motion.line
              x1={450}
              y1={150}
              x2={300}
              y2={260}
              stroke="#64748b"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            <motion.line
              x1={450}
              y1={150}
              x2={600}
              y2={260}
              stroke="#64748b"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </>
        )}

        {/* LEFT NODE */}
        {step >= 2 && (
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
            <rect x={210} y={260} width={180} height={70} rx={12} fill="#4e2572" />
            <text x={300} y={295} textAnchor="middle" fill="white">
              Farbe = blau?
            </text>
          </motion.g>
        )}

        {/* RIGHT LEAF */}
        {step >= 2 && (
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
            <rect x={510} y={260} width={180} height={70} rx={12} fill="#9a8ad8" />
            <text x={600} y={295} textAnchor="middle" fill="white">
              🍊 Orange
            </text>
          </motion.g>
        )}

        {/* SECOND LEVEL LINES */}
        {step >= 3 && (
          <>
            <motion.line
              x1={300}
              y1={330}
              x2={200}
              y2={430}
              stroke="#64748b"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            <motion.line
              x1={300}
              y1={330}
              x2={400}
              y2={430}
              stroke="#64748b"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </>
        )}

        {/* LEAVES */}
        {step >= 4 && (
          <>
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={110} y={430} width={180} height={70} rx={12} fill="#9a8ad8" />
              <text x={200} y={465} textAnchor="middle" fill="white">
                🫐 Blaubeere
              </text>
            </motion.g>

            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={310} y={430} width={180} height={70} rx={12} fill="#9a8ad8" />
              <text x={400} y={465} textAnchor="middle" fill="white">
                🍓 Erdbeere
              </text>
            </motion.g>
          </>
        )}

      </svg>
    </div>
  );
}

export function ForestAnimation() {
  const [phase, setPhase] = useState(0);
 
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">


      <motion.div
        animate={{
          scale: phase >= 2 ? 0.5 : 1,
          opacity: phase >= 3 ? 0 : 1
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <DecisionTreeAnimation />
      </motion.div>


      {phase >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mt-4 scale-75"
        >
          <DecisionTreeAnimation />
          <DecisionTreeAnimation />
          <DecisionTreeAnimation />
          <DecisionTreeAnimation />
          <DecisionTreeAnimation />
        </motion.div>
      )}


      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-lg"
        >
          🍎 🍎 🫐 🍎 🍓 → <b>🍎</b>
        </motion.div>
      )}

    </div>
  );
}
