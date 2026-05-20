"use client";

import FootballPlayer from "./FootballPlayer";

export default function FootballField() {

  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-gray-900/50 p-2">

      {/* SCORE */}
      <div className="flex items-center justify-center mb-2">
        <div className="px-6 py-2 rounded-2xl bg-black/30 border border-white/10 text-white text-xl font-bold tracking-wide">
          3 : 1
        </div>
      </div>

      {/* FIELD + BENCHES */}
      <div className="flex items-center justify-center gap-3">

        {/* LEFT BENCH */}
        <div className="w-14 h-[350px] rounded-2xl bg-gray-800/80 border border-white/10 flex flex-col items-center py-3 gap-3">

          <FootballPlayer
            color="bg-blue-600"
            draggable
            number="1"
          />

          <FootballPlayer
            color="bg-blue-600"
            draggable
            number="2"
          />

          <FootballPlayer
            color="bg-blue-600"
            draggable
            number="3"
          />

          <FootballPlayer
            color="bg-blue-600"
            draggable
            number="4"
          />

          <FootballPlayer
            color="bg-blue-600"
            draggable
            number="5"
          />

        </div>

        {/* FOOTBALL FIELD */}
        <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-green-700">

          {/* Mittellinie */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white/40 -translate-x-1/2" />

          {/* Mittelkreis */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-white/40 -translate-x-1/2 -translate-y-1/2" />

          {/* Mittelpunkt */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />

          {/* Oberes Tor */}
          <div className="absolute top-0 left-1/2 w-24 h-10 border-2 border-t-0 border-white/40 -translate-x-1/2" />

          {/* Unteres Tor */}
          <div className="absolute bottom-0 left-1/2 w-24 h-10 border-2 border-b-0 border-white/40 -translate-x-1/2" />

          {/* ROTE FESTE SPIELER */}

          <div className="absolute top-[20%] left-[35%]">
            <FootballPlayer color="bg-red-600" />
          </div>

          <div className="absolute top-[40%] left-[60%]">
            <FootballPlayer color="bg-red-600" />
          </div>

          <div className="absolute bottom-[20%] left-[45%]">
            <FootballPlayer color="bg-red-600" />
          </div>

        </div>

        {/* RIGHT BENCH */}
        <div className="w-14 h-[350px] rounded-2xl bg-gray-800/80 border border-white/10 flex flex-col items-center py-3 gap-3">

          <FootballPlayer color="bg-red-600" />

          <FootballPlayer color="bg-red-600" />

        </div>

      </div>
    </div>
  );
}