"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import FootballPlayer from "./FootballPlayer";

export default function FootballField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [isOverField, setIsOverField] = useState(false);




const benchColor = "bg-gray-800/30"
const fieldColor = "bg-emerald-800"

const playerColors = "bg-sky-400"
const oponentColors = "bg-amber-400"

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




  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-gray-900/20 p-2">

      {/* SCORE */}
      <div className="flex items-center justify-center mb-2">
        <div className="px-6 py-2 rounded-2xl bg-black/30 border border-white/10 text-white text-xl font-bold tracking-wide">
          3 : 1
        </div>
      </div>

      {/* FIELD + BENCHES */}
      <div className="flex items-center justify-center gap-3">

        {/* LEFT BENCH */}
        <div className={`w-14 h-[350px] rounded-2xl ${benchColor} border border-white/10 flex flex-col items-center py-3 gap-3`}>
          {["1", "2", "3", "4", "5"].map((num) => (
            <FootballPlayer
              key={num}
              color={playerColors}
              draggable
              number={num}
              dropTargets={[fieldRef]}
              onDropTargetHover={setIsOverField}
            />
          ))}
        </div>

        {/* FOOTBALL FIELD */}
        <motion.div
          ref={fieldRef}
          animate={{
            boxShadow: isOverField
              ? "0 0 0 3px rgba(74, 222, 128, 0.8), 0 0 24px rgba(74, 222, 128, 0.5)"
              : "0 0 0 0px rgba(74, 222, 128, 0)",
          }}
          transition={{ duration: 0.15 }}
          className={`relative w-full max-w-[260px] aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 ${fieldColor}`}
        >
          {/* Mittellinie */}
          <div className={`absolute top-1/2 w-full h-[2px] ${lineColorBg40} -translate-y-1/2`}/>
          {/* Mittelkreis */}
          <div className={`absolute top-1/2 left-1/2 w-20 h-20 rounded-full border-2 ${lineColorBorder} -translate-x-1/2 -translate-y-1/2`} />
          {/* Mittelpunkt */}
          <div className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${lineColorBg} -translate-x-1/2 -translate-y-1/2`} />
          {/* Oberes Tor */}
          <div className={`absolute top-0 left-1/2 w-20 h-5 border-2 border-t-0 ${lineColorBorder} -translate-x-1/2`} />
          <div className={`absolute top-0 left-1/2 w-35 h-14 border-2 border-t-0 ${lineColorBorder} -translate-x-1/2`} />
          {/* Unteres Tor */}
          <div className={`absolute bottom-0 left-1/2 w-20 h-5 border-2 border-b-0 ${lineColorBorder} -translate-x-1/2`} />
          <div className={`absolute bottom-0 left-1/2 w-35 h-14 border-2 border-b-0 ${lineColorBorder} -translate-x-1/2`} />

          {/* ROTE FESTE SPIELER */}
          <div className="absolute top-[20%] left-[35%]">
            <FootballPlayer color={oponentColors} />
          </div>
          <div className="absolute top-[40%] left-[60%]">
            <FootballPlayer color={oponentColors} />
          </div>
          <div className="absolute bottom-[20%] left-[45%]">
            <FootballPlayer color={oponentColors} />
          </div>
        </motion.div>

        {/* RIGHT BENCH */}
        <div className={`w-14 h-[350px] rounded-2xl ${benchColor} border border-white/10 flex flex-col items-center py-3 gap-3`}>
          <FootballPlayer color={oponentColors} />
          <FootballPlayer color={oponentColors} />
        </div>

      </div>
    </div>
  );
}