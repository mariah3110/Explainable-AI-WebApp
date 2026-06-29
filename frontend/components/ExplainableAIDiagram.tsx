"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export function ExplainableAIDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref,{once: false, amount: 0.9})
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const runAnimation = () => {
      setStep(0);

      const timers = [
        setTimeout(() => setStep(1), 500),
        setTimeout(() => setStep(2), 1000),
        setTimeout(() => setStep(3), 2000),
        setTimeout(() => setStep(4), 6000),
        setTimeout(() => setStep(5), 7000),
        setTimeout(() => setStep(6), 8500),
      ];

      return timers;
    };

    let timers = runAnimation();

    const loop = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = runAnimation();
    }, 15000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [isInView]);

  return (
    <div
      ref={ref} 
      className="w-full flex flex-col items-center"
    >

      <div className="relative w-full max-w-[420px] aspect-square">

        {/* GRID */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 items-center justify-items-center">
        
        {/* TITLE */}
        <h2 className="col-span-full text-2xl font-semibold opacity-50 text-center tracking-wide bg-white bg-clip-text">
          Explainable AI
        </h2>
          {/* INPUT */}
          <div className="col-start-1 row-start-2">
            <div className="px-4 py-3 rounded-xl border border-cyan-400 bg-cyan-500/10">
              INPUT
            </div>
          </div>

          {/* MODEL */}
          <div className="col-start-2 row-start-2 relative">
            <div className="px-6 py-4 rounded-xl border border-violet-400 bg-violet-500/10 text-center">
              <div className="font-semibold">MODEL</div>
              <div className="text-xs opacity-70">(Black Box)</div>
            </div>

            {/* ❓ / ❗ */}
            {step >= 3 && step < 6 && (
              <motion.div
                key={step >= 5 ? "!" : "?"}
                initial={{ opacity: 0, y: -10, scale: 0.5 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                className="absolute left-1/2 -translate-x-1/2 -top-8 text-xl"
              >
                {step >= 5 ? "❗" : "❓"}
              </motion.div>
            )}
          </div>

          {/* OUTPUT */}
          <div className="col-start-3 row-start-2">
            <div className="px-4 py-3 rounded-xl border border-green-400 bg-green-500/10">
              OUTPUT
            </div>
          </div>

          {/* EXPLANATION */}
          <div className="col-start-2 row-start-3">
            <div className="px-4 py-3 rounded-xl border border-yellow-400 bg-yellow-400/10">
              EXPLANATION
            </div>
          </div>

        </div>

        {/* ARROWS */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">

          {/* Input → Model */}
          {step >= 1 && (
            <motion.line
              x1="26%"
              y1="50%"
              x2="36.5%"
              y2="50%"
              stroke="white"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          )}

          {/* Model → Output */}
          {step >= 2 && (
            <motion.line
              x1="63.4%"
              y1="50%"
              x2="72%"
              y2="50%"
              stroke="white"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Model ↓ Explanation */}
          {step >= 4 && (
            <motion.line
              x1="50%"
              y1="58.5%"
              x2="50%"
              y2="77.4%"
              stroke="white"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          )}

        </svg>

      </div>
    </div>
  );
}