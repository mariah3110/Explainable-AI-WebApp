"use client"
import Image from "next/image";
import { useState } from "react";
import Character from "@/components/Character";
import {RotateCw} from "lucide-react";

import penguinsData from "../../data/shap/penguins.json";
import mushroomsData from "../../data/shap/mushrooms.json";
import wineData from "../../data/shap/wine.json";
import ShapImportancePlot from "@/components/CreatePlotShap";


export default function TryPage_shap() {

  type ShapFeature = { feature: string; importance: number };

  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [animationOver, setAnimationOver] = useState(false)
  const [showShapImage, setShowShapImage] = useState(false)
  const [shapData, setShapData] = useState<ShapFeature[] | null>(null);
  const datasetLocked = selectedDataset !== null;
  const [characterText, setCharacterText] = useState(
    "Suche dir einen Datensatz aus, auf den du SHAP anwenden möchtest.")

  const startAnimation = () => {
    setAnimationOver(false)
    setAnimationStep(1)

    setTimeout(() => setAnimationStep(2), 1)
    setTimeout(() => setAnimationStep(3), 2)
    setTimeout(() => setAnimationStep(4), 3)
    setTimeout(() => {
      setAnimationOver(true);
      setCharacterText(
        "Klicke auf den Button, um SHAP zu verwenden und die Feature-Importanz anzusehen."
      );
    }, 4)
  }
  {/* Alternative mit async/await:
  const startAnimation = () => {
    setAnimationOver(false)
    setAnimationStep(1)

    setTimeout(() => setAnimationStep(2), 1000)
    setTimeout(() => setAnimationStep(3), 4500)
    setTimeout(() => setAnimationStep(4), 7000)
    setTimeout(() => {
      setAnimationOver(true);
      setCharacterText(
        "Klicke auf den Button, um SHAP zu verwenden und die Feature-Importanz anzusehen."
      );
    }, 7000)
  }*/}

  const resetPage = () => {
    setSelectedDataset(null);
    setAnimationOver(false);
    setShowShapImage(false);
    setAnimationStep(0);

    setCharacterText(
      "Suche dir einen Datensatz aus, auf den du SHAP anwenden möchtest."
    );
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-2 py-3">
      
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
            <button>
              <RotateCw 
                onClick={resetPage}
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
              {animationStep >= 1 && animationStep < 4 && (
              <div className="flex items-center items-end gap-3 mb-8 mt-5"> 
                  <img src="tree1.png" alt="tree icon" className="w-20 h-20 animate-fadeInOut" />
                {animationStep >= 2 && animationStep < 4 && (
                  <img src="tree2.png" alt="tree icon" className="w-15 h-15 animate-fadeInOut delay-200" />
                )}
                {animationStep >= 3 && animationStep < 4 && (
                  <img src="tree3.png" alt="tree icon" className="w-18 h-18 animate-fadeInOut delay-400" />
                )}
              </div>
              )}

              <div className="relative">
                {animationStep === 1 && animationStep < 4 && (
                <p className="animate-fadeIn">
                  Datensatz wird geladen …
                </p>
                )}

                {animationStep === 2 && animationStep < 4 && (
                <p className="animate-fadeIn">
                  Modell wird trainiert …
                </p>
                )}

                {animationStep >= 3 && animationStep < 4 && (  
                <p className="animate-fadeIn">
                  Die Bäume wachsen …
                </p>
                )}
              </div>
              {animationStep >= 4 && (
                <div className="flex items-center flex-col gap-3 mb-8 mt-5">
                  <img 
                    src="bigforest.png" 
                    alt="tree icon" 
                    className="w-85 h-40 animate-fadeInOut delay-400" />
                  <p className="animate-fadeIn">
                    Random Forest mit 100 Bäumen ist fertig!
                  </p>
                </div>
              )}

          </div>

          <button 
                disabled={!animationOver}
                onClick={async () => {
                  setShowShapImage(true);
                  const res = await fetch(`/shap/${selectedDataset}.json`);
                  const json = await res.json();
                  setShapData(json.features);
                }}

                className={`mx-auto text-base sm:text-lg md:text-xl font-bold px-3 py-2 sm:px-4 w-[30%] rounded-md
                ${
                  animationOver
                    ? "bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-400"
                    : "bg-gray-500/40 cursor-not-allowed opacity-50"
                }`}
              >
            SHAP
          </button>

        </div>

        {/* MODEL */}
        <div className="w-full md:w-[55%] xl:w-[60%] min-h-[200px] sm:min-h-[300px] md:min-h-[350px] xl:min-h-[450px] flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-6">
          
          {/* CHARACTER*/}
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