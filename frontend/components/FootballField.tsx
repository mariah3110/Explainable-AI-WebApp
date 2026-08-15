"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import FootballPlayer from "./FootballPlayer";

const playerEffects = {
  striker: {
    number: "1",
    name: "Torjäger",
    description: "schießt zwei Tore",
    ownGoals: 2,
    opponentGoals: 0,
  },
  defender: {
    number: "2",
    name: "Verteidiger",
    description: "verhindert ein Gegentor",
    ownGoals: -1,
    opponentGoals: 0,
  },
  weakPlayer: {
    number: "3",
    name: "Unsicherer Spieler",
    description: "verschlechtert das Ergebnis",
    ownGoals: 0,
    opponentGoals: 1,
  },
  neutral: {
    number: "4",
    name: "Neutraler Spieler",
    description: "verändert nichts",
    ownGoals: 0,
    opponentGoals: 0,
  },
  opponentPressure: {
    number: "5",
    name: "Gegnerdruck",
    description: "führt zu einem Gegentor",
    ownGoals: 0,
    opponentGoals: -1,
  },
};

export default function FootballField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [isOverField, setIsOverField] = useState(false);

  const [activePlayers, setActivePlayers] = useState<Record<string, boolean>>({
    striker: false,
    defender: false,
    weakPlayer: false,
    neutral: false,
    opponentPressure: false,
  });

  const baseOwnGoals = 0;
  const baseOpponentGoals = 1;

  const ownGoals =
    baseOwnGoals +
    Object.entries(activePlayers).reduce((sum, [id, active]) => {
      if (!active) return sum;
      return sum + playerEffects[id as keyof typeof playerEffects].ownGoals;
    }, 0);

  const opponentGoals =
    baseOpponentGoals +
    Object.entries(activePlayers).reduce((sum, [id, active]) => {
      if (!active) return sum;
      return sum + playerEffects[id as keyof typeof playerEffects].opponentGoals;
    }, 0);

  const safeOwnGoals = Math.max(0, ownGoals);
  const safeOpponentGoals = Math.max(0, opponentGoals);

  const handlePlacementChange = (id: string, isOnField: boolean) => {
    setActivePlayers((prev) => ({
      ...prev,
      [id]: isOnField,
    }));
  };



const benchColor = "bg-gray-800/30"
const fieldColor = "bg-slate-900"

const playerColors = "bg-pink-400"
const oponentColors = "bg-cyan-400"

const lineColorBg = "bg-white"
const lineColorBg40 = "bg-white/40"
const lineColorBorder = "border-white/40"

/*
{original}
const benchColor = "bg-gray-800/80"
const fieldColor = "bg-green-700"

const playerColors = "bg-blue-600"
const oponentColors = "bg-red-600"

const lineColorBg = "bg-white"
const lineColorBg40 = "bg-white/40"
const lineColorBorder = "border-white/40"
*/
/*
{Tief, neon, futuristisch}
const benchColor = "bg-gray-800/30"
const fieldColor = "bg-indigo-950"

const playerColors = "bg-lime-400"
const oponentColors = "bg-fuchsia-400"

const lineColorBg = "bg-violet-300"
const lineColorBg40 = "bg-violet-300/40"
const lineColorBorder = "border-violet-300/40"
*/
/*
{Retro-Neon, hohes Drama}
const benchColor = "bg-gray-800/30"
const fieldColor = "bg-slate-900"

const playerColors = "bg-pink-400"
const oponentColors = "bg-cyan-400"

const lineColorBg = "bg-white"
const lineColorBg40 = "bg-white/40"
const lineColorBorder = "border-white/40"
*/
/*
{Modern, gedämpft, vertraut}
const benchColor = "bg-gray-800/30"
const fieldColor = "bg-emerald-800"

const playerColors = "bg-sky-400"
const oponentColors = "bg-amber-400"

const lineColorBg = "bg-white"
const lineColorBg40 = "bg-white/40"
const lineColorBorder = "border-white/40"
*/




  const players = Object.entries(playerEffects);

  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-gray-900/20 p-2">
      {/* SCORE */}
      <div className="flex flex-col items-center justify-center mb-2 gap-1">
        <div className="px-6 py-2 rounded-2xl bg-black/30 border border-white/10 text-white text-xl font-bold tracking-wide">
          Ergebnis: {safeOwnGoals} : {safeOpponentGoals}
        </div>

        <div className="text-center text-xs text-white/60 px-3">
          Ziehe Spieler ins Feld oder zurück. Du veränderst die Features und
          beobachtest, wie sich die Vorhersage ändert.
        </div>
      </div>

      {/* FIELD + BENCHES */}
      <div className="relative flex justify-center">
        {/* LEFT BENCH */}
        <div className={`absolute left-0 top-0 bottom-0 w-9 sm:w-14 rounded-2xl ${benchColor} border border-white/10 flex flex-col items-center justify-evenly py-2`}>
          {players.map(([id, player]) => (
            <FootballPlayer
              key={id}
              id={id}
              color={playerColors}
              draggable
              number={player.number}
              dropTargets={[fieldRef]}
              onDropTargetHover={setIsOverField}
              onPlacementChange={handlePlacementChange}
            />
          ))}
        </div>

        {/* FOOTBALL FIELD */}
        <motion.div
          ref={fieldRef}
          animate={{
            boxShadow: isOverField
              ? "0 0 0 3px rgba(55, 143, 87, 0.8), 0 0 24px rgba(60, 196, 109, 0.5)"
              : "0 0 0 0px rgba(74, 222, 128, 0)",
          }}
          transition={{ duration: 0.15 }}
          className={`relative w-full max-w-[260px] aspect-[3/4] mx-9 rounded-3xl overflow-hidden border border-white/10 ${fieldColor}`}
        >
          <div className={`absolute top-1/2 w-full h-[2px] ${lineColorBg40} -translate-y-1/2`} />

          <div
            className={`absolute top-1/2 left-1/2 w-20 h-20 rounded-full border-2 ${lineColorBorder} -translate-x-1/2 -translate-y-1/2`}
          />

          <div
            className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${lineColorBg} -translate-x-1/2 -translate-y-1/2`}
          />

          <div
            className={`absolute top-0 left-1/2 w-20 h-5 border-2 border-t-0 ${lineColorBorder} -translate-x-1/2`}
          />
          <div
            className={`absolute top-0 left-1/2 w-35 h-14 border-2 border-t-0 ${lineColorBorder} -translate-x-1/2`}
          />

          <div
            className={`absolute bottom-0 left-1/2 w-20 h-5 border-2 border-b-0 ${lineColorBorder} -translate-x-1/2`}
          />
          <div
            className={`absolute bottom-0 left-1/2 w-35 h-14 border-2 border-b-0 ${lineColorBorder} -translate-x-1/2`}
          />

          {/* FESTE GEGNER */}
          <div className="absolute top-[20%] left-[35%] z-10 pointer-events-none">
            <FootballPlayer color={oponentColors} />
          </div>
          <div className="absolute top-[40%] left-[60%] z-10 pointer-events-none">
            <FootballPlayer color={oponentColors} />
          </div>
          <div className="absolute bottom-[20%] left-[45%] z-10 pointer-events-none">
            <FootballPlayer color={oponentColors} />
          </div>
        </motion.div>

        {/* RIGHT BENCH */}
          <div className={`absolute right-0 top-0 bottom-0 w-9 sm:w-14 rounded-2xl ${benchColor} border border-white/10 flex flex-col items-center justify-evenly py-2`}>
          <FootballPlayer color={oponentColors} />
          <FootballPlayer color={oponentColors} />
        </div>
      </div>
    </div>
  );
}