"use client";

import Image from "next/image";
import PixelAnimation from "@/components/PixelAnimation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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


function ForestAnimation() {
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



export default function Home() {

  return (
    <main>

      {/* SECTION 1 - Introduction */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">

        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Understand AI.
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Visually.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/70">
          Learn Machine Learning, Explainable AI and modern KI concepts with
          interactive visuals, playful examples and clear explanations.
        </p>

        {/* Pixel */}
        <div className="
          mt-10 w-full flex justify-center items-end gap-2
          md:mt-0 md:w-auto md:absolute md:left-20 md:bottom-10
        ">

          <PixelAnimation
            frames={[
              "/pixel_waving1.png",
              "/pixel_waving2.png",
            ]}
            interval={500}
          />

          <div className="
            relative mb-6 md:mb-20
            max-w-[180px] md:max-w-[240px]
            rounded-2xl bg-gray-200 text-black
            px-4 py-3 text-sm shadow-xl
          ">
            Hi, I'm Pixel. I will guide you through the world of AI and Machine Learning. Let's explore together!

            <div className="absolute bottom-4 -left-2 w-4 h-4 bg-gray-200 rotate-45"></div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - What is Machine Learning? */}
      <section className="min-h-screen bg-slate-800 flex flex-col justify-center px-6 py-20">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold">
            
            What is 
            <span className="bg-gradient-to-r from-purple-700 to-cyan-300 bg-clip-text text-transparent">
            {" "}M
            </span>
            achine 
            <span className="bg-gradient-to-r from-purple-700 to-cyan-300 bg-clip-text text-transparent">
            {" "}L
            </span>
            earning?

          </h2>
        </div>

        {/* CONTENT ROW */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">

          {/* MODEL */}
          <div className="w-full md:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 overflow-hidden">
              <ForestAnimation />
            </div>
          </div>

          {/* SPEECH BUBBLE */}
          <div className="w-full md:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[420px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">
              <b>Machine Learning</b> bedeutet, dass ein Computer aus Beispielen lernt, 
              statt nur feste Regeln zu befolgen. Er erkennt Muster in Daten und 
              trifft daraus Vorhersagen.
              <br /><br />
              Ein <b>Random Forest</b> funktioniert wie ein Team aus vielen 
              Entscheidungsbäumen. Jeder Baum schaut auf die Daten und trifft 
              eine eigene Entscheidung. Danach stimmen alle Bäume gemeinsam ab. 
              Die häufigste Antwort gewinnt.
              <br /><br />
              So entstehen oft zuverlässige Ergebnisse – und wir können später 
              mit <b>LIME</b> und <b>SHAP</b> erklären, warum das Modell so entschieden hat.              
              <div className="absolute top-1/2 -right-2 w-5 h-5 bg-gray-200 rotate-45 -translate-y-1/2"></div>
            </div>
          </div>

          {/* CHARACTER*/}
          <div className="relative  w-32 h-32 md:w-52 md:h-52">
            <Image
              src="/pixel5L.png"
              alt="Pixel"
              fill
              sizes="(max-width: 768px) 128px, 208px"
              className="object-contain"
            />
          </div>

        </div>
      </section>

      {/* SECTION 3 - Explainable AI */}
      <section className="min-h-screen bg-violet-950 flex flex-col justify-center px-6 py-20">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold">
            EXPL
          <span className="bg-gradient-to-r from-cyan-700 to-cyan-300 bg-clip-text text-transparent">
            AI
          </span>
            NABLE AI
          </h2>
        </div>

        {/* CONTENT ROW */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">

          {/* CHARACTER*/}
          <div className="relative w-32 h-32 md:w-52 md:h-52">
            <Image
              src="/pixel1R.png"
              alt="Pixel"
              fill
              sizes="(max-width: 768px) 128px, 208px"
              className="object-contain"
            />
          </div>

          {/* SPEECH BUBBLE */}
          <div className="w-full md:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[440px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">
              <div className="absolute top-1/2 -left-2 w-5 h-5 bg-gray-200 rotate-45 -translate-y-1/2"></div>
                <div className="max-h-[400px] overflow-y-auto">
                Bis jetzt haben wir gesehen, wie ein Modell Entscheidungen trifft. 
                Aber oft bleibt eine wichtige Frage offen: Warum eigentlich?
                <br /><br />
                Genau hier kommt Explainable AI ins Spiel. 
                Sie hilft uns zu verstehen, welche Gründe hinter einer 
                Vorhersage stecken.
                <br />
                Statt nur ein Ergebnis wie Spam oder Kein Spam zu zeigen, 
                können wir sichtbar machen, welche Merkmale besonders wichtig 
                waren – zum Beispiel viele Links, bestimmte Wörter oder ein 
                unbekannter Absender.
                <br /><br />
                Das ist hilfreich, weil Menschen Entscheidungen besser 
                nachvollziehen, prüfen und ihnen eher vertrauen können.
                <br /><br />
                In dieser App schauen wir uns dafür zwei bekannte Methoden an: 
                LIME und SHAP. Beide helfen dabei, komplexe Modelle wie den 
                Random Forest verständlicher zu machen – nur auf unterschiedliche 
                Weise.
              </div>
            </div>
          </div>

          {/* MODEL */}
          <div className="w-full md:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                  MODEL
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4 - SHAP */}
      <section className="min-h-screen bg-violet-900 flex flex-col justify-center px-6 py-15">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold">
            Explainable AI mit 
            <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent">
            {" "}SHAP
            </span>
            
          </h2>
        </div>

        {/* CONTENT ROW */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">

          {/* MODEL */}
          <div className="w-full md:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                  MODEL
              </div>
            </div>
          </div>

          {/* SPEECH BUBBLE */}
          <div className="w-full md:w-[40%] flex justify-center min-h-0">
            <div className="relative w-full max-w-[420px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">
              <div className="max-h-[400px] overflow-y-auto">
                Schauen wir uns jetzt SHAP an. 🔍
                <br />
                SHAP hilft uns zu verstehen, warum ein Modell genau dieses Ergebnis 
                vorhergesagt hat. Dafür wird berechnet, welchen Beitrag jedes 
                einzelne Merkmal zur Entscheidung leistet.
                <br />
                Stell dir das wie ein Team aus Spielern vor. ⚽🏀 
                Jeder Spieler beeinflusst das Endergebnis unterschiedlich stark.
                <br /><br />
                In unserer Visualisierung steht jeder Spieler für ein Merkmal – 
                zum Beispiel:
                <br />
                - Viele Links
                <br />
                - Wort „FREE“
                <br />
                - Unbekannter Absender
                <br />
                - Bekannter Kontakt
                <br /><br />
                Einige Spieler verbessern das Ergebnis, andere verschlechtern es.
                <br />
                Du kannst einzelne Spieler aus dem Team herausziehen und direkt 
                sehen, wie sich das Gesamtergebnis verändert. Entfernst du zum 
                Beispiel den Spieler „Viele Links“, sinkt die 
                Spam-Wahrscheinlichkeit deutlich.
                <br />
                So zeigt SHAP ganz anschaulich:
                <br />
                Wer hat stark beeinflusst?
                Wer hatte nur wenig Wirkung?
                Welche Faktoren waren entscheidend?
                <br />
                Dadurch verstehen wir nicht nur was das Modell entschieden hat, 
                sondern auch welches Team diese Entscheidung erzeugt hat. 📊✨              
                <div className="absolute top-1/2 -right-2 w-5 h-5 bg-gray-200 rotate-45 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* CHARACTER*/}
          <div className="relative w-32 h-32 md:w-52 md:h-52">
            <Image
              src="/pixel2L.png"
              alt="Pixel"
              fill
              sizes="(max-width: 768px) 128px, 208px"
              className="object-contain"
            />
          </div>

        </div>
        
        {/* FOOTER MIT BUTTON */}
        <div className="mt-5 flex justify-end">
          <a href="/tryPage_shap" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-300 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-cyan-400 transition-colors">
            Try it out! ➔ 
          </a>
        </div>

      </section>

      {/* SECTION 5 - LIME */}
      <section className="min-h-screen bg-violet-800 flex flex-col justify-center px-6 py-15">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-bold">
            Explainable AI mit 
            <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent">
            {" "}LIME
            </span>
          </h2>
        </div>

        {/* CONTENT ROW */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">

          {/* CHARACTER*/}
          <div className="relative w-32 h-32 md:w-52 md:h-52">
            <Image
              src="/pixel5R.png"
              alt="Pixel"
              fill
              sizes="(max-width: 768px) 128px, 208px"
              className="object-contain"
            />
          </div>

          {/* SPEECH BUBBLE */}
          <div className="w-full md:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[440px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">
              <div className="absolute top-1/2 -left-2 w-5 h-5 bg-gray-200 rotate-45 -translate-y-1/2"></div>
              <div className="max-h-[400px] overflow-y-auto">
                Jetzt schauen wir uns LIME an. 🔍
                <br /><br />
                LIME hilft uns zu verstehen, warum ein Modell genau bei einem 
                einzelnen Beispiel so entschieden hat. Dabei wird nicht das ganze 
                Modell erklärt, sondern nur die Entscheidung für diesen einen 
                konkreten Fall.
                <br />
                Stell dir vor, wir untersuchen eine bestimmte E-Mail, die als Spam 
                erkannt wurde.
                <br /><br />
                In der interaktiven Ansicht kannst du einzelne Bestandteile dieser 
                Mail verändern:
                <br />
                Wort FREE entfernen
                <br />
                Einen Link löschen
                <br />
                Absender auf bekannten Kontakt ändern
                <br />
                Betreff neutraler machen
                <br /><br />
                Sobald du etwas änderst, siehst du direkt, wie sich die Vorhersage 
                verändert.
                <br />
                So erkennt man schnell:
                <br /><br />
                Welche Merkmale waren für diese eine E-Mail besonders wichtig?
                Was hat die Spam-Wahrscheinlichkeit erhöht?
                Welche Änderung hätte das Ergebnis beeinflusst?
                <br />
                LIME arbeitet also wie eine Lupe für Einzelfälle.
                Es schaut sich nur die Umgebung eines Beispiels an und erklärt 
                genau diese lokale Entscheidung – einfach und nachvollziehbar.            
              </div>
            </div>
          </div>

          {/* MODEL */}
          <div className="w-full md:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <div className="absolute inset-0 flex items-center justify-center">
                  MODEL
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER MIT BUTTON */}
        <div className="mt-5 flex justify-end">
          <a href="/tryPage_lime" className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-300 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-cyan-400 transition-colors">
            Try it out! ➔ 
          </a>
        </div>
      </section>

      {/* SECTION 6 - CONGRATULATIONS */}
      <section className="min-h-screen bg-violet-950 flex flex-col justify-center items-center px-6 py-20">
        <h2 className="text-4xl md:text-6xl font-bold text-center">
          YOU DID IT!
        </h2>
        <div className="relative w-52 h-52 md:w-64 md:h-64 mt-6">
          <PixelAnimation
            frames={[
              "/pixel_dancing1.png",
              "/pixel_dancing2.png",
              "/pixel_dancing3.png",
              "/pixel_dancing4.png",
            ]}
            interval={300}
          />
        </div>
        <p className="mt-6 max-w-2xl text-lg text-white/70 text-center">
          Congratulations! You've taken your first steps into the world of 
          Explainable AI. Keep exploring, keep asking questions, 
          and most importantly, have fun learning! 🚀✨
        </p>
      </section>

    </main>
  );
}