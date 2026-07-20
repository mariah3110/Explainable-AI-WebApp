"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Character from "@/components/Character";
import { RotateCw } from "lucide-react";

import penguinsData from "../../data/shap/penguins.json";
import mushroomsData from "../../data/shap/mushrooms.json";
import wineData from "../../data/shap/wine.json";
import ShapImportancePlot from "@/components/CreatePlotShap";
import { ForestAnimationForModul } from "@/components/ForestAnimationForModul";

// ── Timing-Konfiguration ──────────────────────────────────────────────
// Dauer EINES Durchlaufs der ForestAnimationForModul in ms.
// ⚠️ An die tatsächliche Länge deiner Animation anpassen!
const ANIMATION_CYCLE_MS = 3000;

// Zufällige Gesamtdauer der "Trainingsphase" liegt zwischen MIN und MAX.
const MIN_TOTAL_MS = 4000;
const MAX_TOTAL_MS = 10000;
// ──────────────────────────────────────────────────────────────────────

export default function TryPage_shap() {

  type ShapFeature = { feature: string; importance: number };

  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [animationOver, setAnimationOver] = useState(false)
  const [showShapImage, setShowShapImage] = useState(false)
  const [shapData, setShapData] = useState<ShapFeature[] | null>(null);
  const datasetLocked = selectedDataset !== null;
  const [characterText, setCharacterText] = useState(
    "Suche dir einen Datensatz aus, auf den du SHAP anwenden möchtest.")

  // Refs für Timer, damit sie bei Reset/Unmount sicher aufgeräumt werden
  const loopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    if (endTimeoutRef.current) {
      clearTimeout(endTimeoutRef.current);
      endTimeoutRef.current = null;
    }
  };

  // Timer aufräumen, falls die Seite verlassen wird, während die Animation läuft
  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startAnimation = () => {
    clearTimers();
    setAnimationOver(false);
    setIsAnimating(true);
    setAnimationKey(0);
    setCharacterText("Der Random Forest wird trainiert …");

    // Zufällige Gesamtdauer zwischen MIN_TOTAL_MS und MAX_TOTAL_MS
    const totalDuration =
      Math.floor(Math.random() * (MAX_TOTAL_MS - MIN_TOTAL_MS + 1)) + MIN_TOTAL_MS;

    // Die Animation läuft nur einmal durch → wir mounten sie nach jedem
    // Durchlauf neu (key ändert sich), damit sie von vorne startet.
    loopIntervalRef.current = setInterval(() => {
      setAnimationKey((k) => k + 1);
    }, ANIMATION_CYCLE_MS);

    // Nach Ablauf der zufälligen Zeit: Loop stoppen, SHAP-Button freischalten
    endTimeoutRef.current = setTimeout(() => {
      clearTimers();
      setIsAnimating(false);
      setAnimationOver(true);
      setCharacterText(
        "Klicke auf den Button, um SHAP zu verwenden und die Feature-Importanz anzusehen."
      );
    }, totalDuration);
  };

  const handleShapClick = async () => {
    try {
      const res = await fetch(`/shap/${selectedDataset}.json`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} beim Laden von /shap/${selectedDataset}.json`);
      }
      const json = await res.json();
      setShapData(json.features);
      setShowShapImage(true);
      setCharacterText(
        "Das ist die Feature-Importanz! Je länger der Balken, desto stärker beeinflusst dieses Merkmal die Vorhersage des Modells."
      );
    } catch (err) {
      console.error("SHAP-Daten konnten nicht geladen werden:", err);
      // Plot trotzdem anzeigen – er nutzt die statisch importierten JSON-Daten
      setShowShapImage(true);
      setCharacterText(
        "Das ist die Feature-Importanz! Je länger der Balken, desto stärker beeinflusst dieses Merkmal die Vorhersage des Modells."
      );
    }
  };

  const resetPage = () => {
    clearTimers();
    setSelectedDataset(null);
    setIsAnimating(false);
    setAnimationOver(false);
    setShowShapImage(false);
    setAnimationKey(0);
    setShapData(null);

    setCharacterText(
      "Suche dir einen Datensatz aus, auf den du SHAP anwenden möchtest."
    );
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-3">

      {/* HEADER */}
      <div className="text-center sm:mb-2 md:mb-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold">
          Try{" "}
          <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent">
            SHAP
          </span>
        </h1>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10">

        {/* NAVIGATION */}
        <div className="w-full md:w-[45%] xl:w-[40%] flex flex-col rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-4 md:p-5 xl:p-4">
          <div className="relative flex items-center mb-6">
            <button onClick={resetPage}>
              <RotateCw
                className="left-0 text-gray-500 hover:text-gray-300 mb-7" size={25}/>
            </button>

            <h2 className="w-full text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 text-center">
              NAVIGATION
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full mb-4 sm:mb-6">
            <div className="relative group w-full">
              <button
                disabled={datasetLocked}
                onClick={() => {
                  setSelectedDataset("penguins");
                  startAnimation();
                }}
                className={`w-full px-3 py-2 sm:px-4 rounded-md transition
                  ${
                    datasetLocked
                      ? "opacity-50 border border-gray-500/50 cursor-not-allowed"
                      : "bg-violet-400/40 hover:bg-gray-500/40"
                  }
                  ${
                    selectedDataset === "penguins"
                      ? "bg-gray-500/50 shadow-lg shadow-purple-500/50 opacity-100"
                      : ""
                  }
                `}
              >
                Pinguine
              </button>

              <div
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                          bg-gradient-to-r from-violet-600 to-cyan-600
                          opacity-0 group-hover:opacity-100 transition
                          bg-black text-white text-xs p-2 rounded-lg
                          pointer-events-none z-50 w-44"
              >
                <h3 className="text-center font-bold mb-1 text-sm">Pinguine</h3>
                <div className="relative w-32 h-20 mx-auto mb-2">
                  <Image
                    src="/penguins.png"
                    alt="Pinguine"
                    fill
                    className="object-contain"
                  />
                </div>

                <p className="text-center whitespace-normal">
                  (334 Spalten, 7 Zeilen)
                  <br /><br />
                  Pinguin-Daten mit Körpermaßen und Art.
                  Das Modell lernt, anhand von Merkmalen wie Schnabellänge,
                  Flossenlänge und Gewicht die Pinguinart vorherzusagen.
                </p>
              </div>
            </div>

            <div className="relative group w-full">
              <button
                disabled={datasetLocked}
                onClick={() => {
                  setSelectedDataset("mushrooms");
                  startAnimation();
                }}
                className={`w-full px-3 py-2 sm:px-4 rounded-md transition
                  ${
                    datasetLocked
                      ? "opacity-50 border border-gray-500/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-400/40 to-cyan-400/40 hover:from-gray-500/40 hover:to-gray-500/40"
                  }
                  ${
                    selectedDataset === "mushrooms"
                      ? "bg-gray-500/50 shadow-lg shadow-purple-500/50 opacity-100"
                      : ""
                  }
                `}
              >
                Pilze
              </button>

              <div
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                          bg-gradient-to-r from-violet-600 to-cyan-600
                          opacity-0 group-hover:opacity-100 transition
                          bg-black text-white text-xs p-2 rounded-lg
                          pointer-events-none z-50 w-44"
              >
                <h3 className="text-center font-bold mb-1 text-sm">Pilze</h3>
                <div className="relative w-32 h-20 mx-auto mb-2">
                  <Image
                    src="/mushrooms.png"
                    alt="Dataset 2"
                    fill
                    className="object-contain"
                  />
                </div>

                <p className="text-center whitespace-normal">
                  (8124 Spalten, 22 Zeilen)
                  <br /><br />
                  Pilz-Daten mit äußeren Merkmalen wie Farbe,
                  Form und Geruch. Das Modell sagt voraus,
                  ob ein Pilz essbar oder giftig ist.
                </p>
              </div>
            </div>

            <div className="relative group w-full">
              <button
                disabled={datasetLocked}
                onClick={() => {
                  setSelectedDataset("wine");
                  startAnimation();
                }}
                className={`w-full px-3 py-2 sm:px-4 rounded-md transition
                  ${
                    datasetLocked
                      ? "opacity-50 border border-gray-500/50 cursor-not-allowed"
                      : "bg-cyan-400/40 hover:bg-gray-500/40"
                  }
                  ${
                    selectedDataset === "wine"
                      ? "bg-gray-500/50 shadow-lg shadow-purple-500/50 opacity-100"
                      : ""
                  }
                `}
              >
                Wein
              </button>

              <div
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                          bg-gradient-to-r from-violet-600 to-cyan-600
                          opacity-0 group-hover:opacity-100 transition
                          bg-black text-white text-xs p-2 rounded-lg
                          pointer-events-none z-50 w-44"
              >
                <h3 className="text-center font-bold mb-1 text-sm">Wein</h3>
                <div className="relative w-32 h-20 mx-auto mb-2">
                  <Image
                    src="/wine.png"
                    alt="Dataset 3"
                    fill
                    className="object-contain"
                  />
                </div>

                <p className="text-center whitespace-normal">
                  (178 Spalten, 13 Zeilen)
                  <br /><br />
                  Chemische Eigenschaften von Wein. Vorhersage:
                  Zu welcher Weinsorte oder Qualitätsklasse gehört er?
                </p>
              </div>
            </div>
          </div>

          {/* MODEL BOX */}
          <div className="w-full min-h-[130px] sm:min-h-[170px] md:min-h-[230px] xl:min-h-[270px] rounded-md mb-4 sm:mb-6 flex items-center justify-center flex-col text-gray-300">

            {showShapImage ? (
              /* Nach Klick auf SHAP: Charakter mit Sprechblase wandert hierher */
              <div className="flex items-center gap-3 animate-fadeIn">
                <div
                  className="
                    relative
                    max-w-[160px] md:max-w-[200px]
                    rounded-md bg-gray-200 text-black
                    px-3 py-2 text-xs sm:text-sm shadow-xl
                  "
                >
                  {characterText}
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 bg-gray-200 rotate-45"></div>
                </div>

                <Character src="/pixel2L.png" />
              </div>
            ) : selectedDataset ? (
              /* Solange die Animation läuft: nach jedem Durchlauf neu mounten.
                 Nach Ablauf bleibt der letzte Durchlauf stehen. */
              <ForestAnimationForModul key={animationKey} />
            ) : null}

          </div>

          <button
                disabled={!animationOver || showShapImage}
                onClick={handleShapClick}
                className={`mx-auto text-base sm:text-lg md:text-xl font-bold px-3 py-2 sm:px-4 w-[30%] rounded-md
                ${
                  animationOver && !showShapImage
                    ? "bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-400"
                    : "bg-gray-500/40 cursor-not-allowed opacity-50"
                }`}
              >
            SHAP
          </button>

        </div>

        {/* MODEL */}
        <div className="w-full md:w-[55%] xl:w-[60%] min-h-[200px] sm:min-h-[300px] md:min-h-[350px] xl:min-h-[450px] flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-6">

          {/* CHARACTER / PLOT */}
          {showShapImage ? (
            <div className="w-full animate-fadeIn">
              <div className="flex flex-col gap-4">
                  {selectedDataset === "penguins"
                      ? <ShapImportancePlot data={penguinsData} />
                      : selectedDataset === "mushrooms"
                      ? <ShapImportancePlot data={mushroomsData} />
                      : selectedDataset === "wine"
                      ? <ShapImportancePlot data={wineData} />
                      : null
                  }

              </div>
            </div>
          ) : (
          <div className="flex items-center gap-4">

            <div
              className="
                relative mb-6 md:mb-20
                max-w-[180px] md:max-w-[240px]
                rounded-md bg-gray-200 text-black
                px-4 py-3 text-sm shadow-xl
              "
            >
              {characterText}
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-gray-200 rotate-45"></div>
            </div>

            <Character src="/pixel2L.png" />

          </div>
          )}

        </div>

      </div>

    </main>
  );
}