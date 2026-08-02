"use client";

import { useState } from "react";

type StripId = "head" | "body" | "feet";

const BASE = 35;
const WEIGHTS: Record<StripId, [number, number, number]> = {
  head: [40, -8, 12],   // stärkstes Feature
  body: [18, 9, -2],     // mittlerer Einfluss
  feet: [4, 2, 0],      // kaum Einfluss
};
const IMAGES: Record<StripId, [string, string, string]> = {
  head: ["Cat1Head", "Cat2Head", "Cat3Head"],
  body: ["Cat1Body", "Cat2Body", "Cat3Body"],
  feet: ["Cat1Feet", "Cat2Feet", "Cat3Feet"],
};
const STRIPS: StripId[] = ["head", "body", "feet"];

// Button zum Wechseln der Varianten
function ArrowButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Vorherige Variante" : "Nächste Variante"}
      className={`absolute top-1/2 -translate-y-1/2 ${
        dir === "left" ? "left-1.5" : "right-1.5"
      } w-7 h-7 flex items-center justify-center rounded-full bg-black/35 text-white text-base leading-none select-none hover:bg-black/55 transition-colors z-10`}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}

export default function LimeCatModule() {
  const [variants, setVariants] = useState<Record<StripId, number>>({
    head: 0,
    body: 0,
    feet: 0,
  });

  const cycle = (strip: StripId, dir: 1 | -1) =>
    setVariants((v) => ({ ...v, [strip]: (v[strip] + dir + 3) % 3 }));

  const confidence =
    BASE +
    WEIGHTS.head[variants.head] +
    WEIGHTS.body[variants.body] +
    WEIGHTS.feet[variants.feet];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      {/* Bild aus drei Streifen */}
      <div className="w-full max-w-[290px] rounded-xl overflow-hidden ring-1 ring-white/15 shadow-lg bg-white/20 relative">
        {STRIPS.map((strip) => (
          <div key={strip} className="relative leading-none">
            <img
                src={`/lime/${IMAGES[strip][variants[strip]]}.png`}              
                alt={IMAGES[strip][variants[strip]]}
                className="block w-full h-auto"
                draggable={false}
            />
            <ArrowButton dir="left" onClick={() => cycle(strip, -1)} />
            <ArrowButton dir="right" onClick={() => cycle(strip, 1)} />

            {/* Dots */}
            <div className="absolute bottom-1.5 left-10 flex gap-1 pointer-events-none">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    variants[strip] === i ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modell-Vorhersage */}
      <div className="w-full max-w-[290px]" aria-live="polite">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs text-white/60">Modell-Vorhersage</span>
          <span className="text-base font-bold text-white">
            Katze: {confidence} %
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-300 transition-all duration-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}