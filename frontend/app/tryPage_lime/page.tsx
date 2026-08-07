"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, RotateCw, X, Lightbulb, PartyPopper, ChevronLeft } from "lucide-react";

import Character from "@/components/Character";
import SpeechBubble from "@/components/SpeechBubble";
import LimeImportancePlot from "@/components/CreatePlotLime";
import { ForestAnimationForModul } from "@/components/ForestAnimationForModul";

import penguinsData from "../../public/data/penguins/lime_local.json";
import mushroomsData from "../../public/data/mushroom/lime_local.json";
import wineData from "../../public/data/wine/lime_local.json";

import { classLabels} from "@/components/featureLabels";
import { motion } from "framer-motion";


// Konstanten, Typen, und Komponenten für die Seite
const ANIMATION_CYCLE_MS = 5500;
const TESTING = false;

let MIN_TRAINING_RUNS: number;
let MAX_TRAINING_RUNS: number;

if (TESTING) {
  MIN_TRAINING_RUNS = 0;
  MAX_TRAINING_RUNS = 0;
} else {
  MIN_TRAINING_RUNS = 1;
  MAX_TRAINING_RUNS = 3;
}

const CHARACTER_IMAGES = {
  idle: "/pixel2L.png",
  training: "/pixel1L.png",
  explaining: "/pixel5R.png",
} as const;

const DRAG_HINT = (
  <span
    className="mt-2 inline-flex items-center gap-1 text-gray-700"
    style={{ fontSize: "10px" }}
  >
    <Lightbulb size={10} />
    Verschiebe mich, wenn ich im Weg bin!
  </span>
);

const MESSAGES = {
  selectDataset:
    "Suche dir einen Datensatz aus, auf den du LIME anwenden möchtest.",
  training: "Der Random Forest wird trainiert …",
  limeReady:
    "Klicke auf den Button, um LIME zu verwenden und die Feature-Importanz anzusehen.",
  featureImportance: [
    <>
      <div className="inline-flex gap-2">
        <PartyPopper size={12} /><b> JUHU! </b><PartyPopper size={12} />
      </div>
      <br />
      Dein erster LIME-Plot auf echten Daten!
      <br />
      Hier siehst du einen dir schon bekannten Plot: den <b>Waterfall-Plot</b>.
      Er zeigt die <b>lokale Feature-Importanz</b> für ein einzelnes Datenpunkt.
      <br />
      {DRAG_HINT}
    </>,
    <>
      Vielleicht fragst du dich:
      Was ist eigentlich der Unterschied zwischen LIME und SHAP?
      Schließlich kann SHAP ebenfalls lokale Feature-Analysen durchführen.
    </>,
    <>
      Beide Methoden erklären einzelne Vorhersagen, verfolgen dabei aber unterschiedliche Ansätze.
      SHAP berechnet für jedes Feature einen <em>mathematisch fundierten Beitrag</em> zur Vorhersage.
      LIME erstellt in der Umgebung des ausgewählten Datenpunkts ein einfaches <em>Ersatzmodell</em> und erklärt dessen Verhalten.
    </>,
    <>
      Beide Methoden haben Vor- und Nachteile.
      SHAP liefert konsistente und theoretisch fundierte Erklärungen, benötigt dafür aber meist mehr Rechenzeit.
      LIME ist oft schneller und einfacher, die Ergebnisse können jedoch stärker von der erzeugten Nachbarschaft abhängen.
    </>,
    <>
      Probiere verschiedene Datenpunkte und Datensätze aus und schau dir die Plots in Ruhe an.
      Wenn du so weit bist, kehre zur Hauptseite zurück.
    </>
  ],
} as const;

type DatasetId = "penguins" | "mushrooms" | "wine";

type DatasetOption = {
  id: DatasetId;
  label: string;
  idleClassName: string;
  tooltipAlignmentClassName: string;
  tooltip: {
    imageSrc: string;
    imageAlt: string;
    stats: string;
    description: string;
  };
};

const LIME_DATA_BY_DATASET = {
  penguins: penguinsData,
  mushrooms: mushroomsData,
  wine: wineData,
};

const COLORES = {
  titel: "from-blue-500 to-green-300",
  tooltip: "from-blue-500 to-green-300",
  LimeButton:
    "from-blue-500 to-green-400 hover:from-blue-700 hover:to-green-500",
  DataButton1: "bg-blue-500/40 hover:bg-gray-500/40",
  DataButton2:
    "bg-gradient-to-r from-blue-500/40 to-green-300/40 hover:from-gray-500/40 hover:to-gray-500/40",
  DataButton3: "bg-green-300/40 hover:bg-gray-500/40",
};

const DATASETS: DatasetOption[] = [
  {
    id: "penguins",
    label: "Pinguine",
    idleClassName: `${COLORES.DataButton1}`,
    tooltipAlignmentClassName: "left-0",
    tooltip: {
      imageSrc: "/penguins.png",
      imageAlt: "Pinguine",
      stats: "(334 Zeilen, 7 Spalten)",
      description:
        "Pinguin-Daten mit Körpermaßen und Art. Das Modell lernt, anhand von Merkmalen wie Schnabellänge, Flossenlänge und Gewicht die Pinguinart vorherzusagen.",
    },
  },
  {
    id: "mushrooms",
    label: "Pilze",
    idleClassName: `${COLORES.DataButton2}`,
    tooltipAlignmentClassName: "left-1/2 -translate-x-1/2",
    tooltip: {
      imageSrc: "/mushrooms.png",
      imageAlt: "Pilze",
      stats: "(8124 Zeilen, 22 Spalten)",
      description:
        "Pilz-Daten mit äußeren Merkmalen wie Farbe, Form und Geruch. Das Modell sagt voraus, ob ein Pilz essbar oder giftig ist.",
    },
  },
  {
    id: "wine",
    label: "Wein",
    idleClassName: `${COLORES.DataButton3}`,
    tooltipAlignmentClassName: "right-0",
    tooltip: {
      imageSrc: "/wine.png",
      imageAlt: "Wein",
      stats: "(178 Zeilen, 13 Spalten)",
      description:
        "Chemische Eigenschaften von Wein. Vorhersage: Zu welcher von drei Weinsorten gehört er?",
    },
  },
];

const FOCUS_RING_CLASSES =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70";

type DatasetButtonProps = {
  dataset: DatasetOption;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: (datasetId: DatasetId) => void;
};

// Hook: kann das Gerät hovern?
function useCanHover() {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return canHover;
}

/** Auswahl-Button für einen Datensatz.
 *  Desktop (hover-fähig): Hover-Tooltip + Klick wählt direkt aus.
 *  Mobile/Tablet (kein Hover): 1. Tap → Info-Panel aufklappen, 2. Tap auf "Auswählen" → Datensatz auswählen. */
function DatasetButton({ dataset, isSelected, isLocked, onSelect }: DatasetButtonProps) {
  const canHover = useCanHover();
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Tap außerhalb des Panels → zuklappen
  useEffect(() => {
    if (!expanded) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [expanded]);

  const handleClick = () => {
    if (isLocked) return;

    // Desktop: direkt auswählen (wie bisher)
    if (canHover) {
      onSelect(dataset.id);
      return;
    }

    // Mobile: erster Tap → Info aufklappen
    if (!expanded) {
      setExpanded(true);
    }
  };

  const stateClassName = isLocked
    ? "cursor-not-allowed border border-gray-500/50 opacity-50"
    : dataset.idleClassName;

  const selectedClassName = isSelected
    ? "bg-gray-500/50 opacity-100 shadow-lg shadow-teal-300/50"
    : "";

  // Gemeinsamer Tooltip-Inhalt für Desktop-Hover und Mobile-Panel
  const tooltipContent = (
    <>
      <h3 className="mb-1 text-center text-sm font-bold">{dataset.label}</h3>
      <div className="relative mx-auto mb-2 h-20 w-32">
        <Image
          src={dataset.tooltip.imageSrc}
          alt={dataset.tooltip.imageAlt}
          fill
          sizes="128px"
          className="object-contain"
        />
      </div>
      <p className="text-center">{dataset.tooltip.stats}</p>
      <p className="mt-2 text-center">{dataset.tooltip.description}</p>
    </>
  );

  return (
    <div ref={ref} className="group relative w-full">
      <button
        type="button"
        disabled={isLocked}
        onClick={handleClick}
        className={`w-full rounded-md px-2 py-2.5 text-sm font-medium transition sm:px-3 ${FOCUS_RING_CLASSES} ${stateClassName} ${selectedClassName}`}
      >
        {dataset.label}
      </button>

      {/* Desktop: Hover-Tooltip (wie bisher) */}
      {canHover && (
        <div
          className={`pointer-events-none absolute top-full z-[60] mt-2 w-44 rounded-lg bg-gradient-to-r ${COLORES.tooltip} p-2 text-xs text-white opacity-0 transition group-hover:opacity-100 ${dataset.tooltipAlignmentClassName}`}
        >
          {tooltipContent}
        </div>
      )}

      {/* Mobile/Tablet: Tap-to-reveal Panel mit explizitem Auswahl-Button */}
      {!canHover && expanded && (
        <div
          className={`absolute top-full z-[60] mt-2 w-52 rounded-lg bg-gradient-to-r ${COLORES.tooltip} p-3 text-xs text-white shadow-lg ${dataset.tooltipAlignmentClassName}`}
        >
          {tooltipContent}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(dataset.id);
              setExpanded(false);
            }}
            className={`mt-2 w-full rounded-md bg-white/20 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30 ${FOCUS_RING_CLASSES}`}
          >
            Auswählen
          </button>
        </div>
      )}
    </div>
  );
}

function PageTitle({ className = "" }: { className?: string }) {
  return (
    <h1 className={`font-bold ${className}`}>
      Try{" "}
      <span
        className={`bg-gradient-to-r ${COLORES.titel} bg-clip-text text-transparent`}
      >
        LIME
      </span>
    </h1>
  );
}


export default function TryLimePage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetId | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [animationOver, setAnimationOver] = useState(false);
  const [showLimePlot, setShowLimePlot] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState(0);
  const [characterText, setCharacterText] = useState<React.ReactNode>(
    MESSAGES.selectDataset
  );
  const [characterPicture, setCharacterPicture] = useState<string>(
    CHARACTER_IMAGES.idle
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const datasetLocked = selectedDataset !== null;
  const canRunLime = animationOver && !showLimePlot;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /** Alle LIME-Samples des aktuell gewählten Datensatzes. */
  const localSamples = selectedDataset
    ? LIME_DATA_BY_DATASET[selectedDataset]
    : null;

  /** Das aktuell ausgewählte Sample (Fallback: erstes). */
  const currentSample =
    localSamples?.find((s) => s.sampleId === selectedSampleId) ??
    localSamples?.[0] ??
    null;

  const loopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startAnimation = () => {
    clearTimers();
    setAnimationOver(false);
    setAnimationKey(0);
    setCharacterText(MESSAGES.training);
    setCharacterPicture(CHARACTER_IMAGES.training);

    const totalRuns =
      MIN_TRAINING_RUNS +
      Math.floor(Math.random() * (MAX_TRAINING_RUNS - MIN_TRAINING_RUNS + 1));
    let currentRun = 1;

    loopIntervalRef.current = setInterval(() => {
      if (currentRun >= totalRuns) {
        clearTimers();
        setAnimationOver(true);
        setCharacterText(MESSAGES.limeReady);
        setCharacterPicture(CHARACTER_IMAGES.idle);
        return;
      }
      currentRun += 1;
      setAnimationKey((key) => key + 1);
    }, ANIMATION_CYCLE_MS);
  };

  const handleDatasetSelect = (datasetId: DatasetId) => {
    setSelectedDataset(datasetId);
    setSelectedSampleId(0);
    startAnimation();
  };

  const handleLimeClick = () => {
    setShowLimePlot(true);
    setCharacterText(MESSAGES.featureImportance);
    setCharacterPicture(CHARACTER_IMAGES.explaining);
    setIsSidebarOpen(false);
  };

  const router = useRouter();
  // Setzt die Seite auf den Ausgangszustand zurück.
  const resetPage = () => {
    clearTimers();
    setSelectedDataset(null);
    setAnimationOver(false);
    setShowLimePlot(false);
    setAnimationKey(0);
    setSelectedSampleId(0);
    setCharacterText(MESSAGES.selectDataset);
    setCharacterPicture(CHARACTER_IMAGES.idle);
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {isSidebarOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <aside
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-slate-900 p-4 transition-transform duration-300 ease-in-out sm:p-5 md:sticky md:top-0 md:z-auto md:h-screen md:w-80 md:max-w-none md:translate-x-0 md:bg-slate-950/40 md:transition-none lg:w-96 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between gap-2">
          <PageTitle className="text-xl lg:text-2xl" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => router.push("/#lime")}
              title="Zur Homepage"
              aria-label="Zur Homepage"
              className={`rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white ${FOCUS_RING_CLASSES}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={resetPage}
              title="Zurücksetzen"
              aria-label="Seite zurücksetzen"
              className={`rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white ${FOCUS_RING_CLASSES}`}
            >
              <RotateCw size={20} />
            </button>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Navigation schließen"
              className={`rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white md:hidden ${FOCUS_RING_CLASSES}`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Navigation
        </h2>

        <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
          {DATASETS.map((dataset) => (
            <DatasetButton
              key={dataset.id}
              dataset={dataset}
              isSelected={selectedDataset === dataset.id}
              isLocked={datasetLocked}
              onSelect={handleDatasetSelect}
            />
          ))}
        </div>

        <div className="mb-5 flex min-h-[250px] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-white/[0.03] sm:min-h-[230px] md:min-h-[250px]">
          {selectedDataset ? (
            <ForestAnimationForModul key={animationKey} />
          ) : null}
        </div>

        <button
          type="button"
          disabled={!canRunLime}
          onClick={handleLimeClick}
          className={`w-full rounded-md px-4 py-2.5 text-base font-bold transition sm:text-lg ${FOCUS_RING_CLASSES} ${
            canRunLime
              ? "bg-gradient-to-r " + COLORES.LimeButton
              : "cursor-not-allowed bg-gray-500/40 opacity-50"
          }`}
        >
          LIME
        </button>
      </aside>

      {/* HAUPTBEREICH */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-slate-900/95 p-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Navigation öffnen"
            className={`rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white ${FOCUS_RING_CLASSES}`}
          >
            <Menu size={22} />
          </button>
          <PageTitle className="text-lg" />
        </header>

        <main className="flex flex-1 flex-col p-4 sm:p-3 lg:p-8">
          {/* Verschiebbarer Charakter */}
          {showLimePlot && (
            <motion.div
              drag
              dragMomentum={false}
              className="fixed z-[55] cursor-grab"
              style={isMobile ? { left: 10, bottom: 10 } : { left: 20, top: 200 }}
            >
              <div className="flex items-center justify-between">
                <Character
                  src={CHARACTER_IMAGES.explaining}
                  className="w-40 h-40"
                />
                <SpeechBubble
                  text={characterText}
                  tail="left"
                  className="max-w-[180px] text-xs sm:text-sm md:max-w-[200px]"
                />
              </div>
            </motion.div>
          )}

          {showLimePlot && selectedDataset && localSamples && currentSample ? (
            <section className="m-auto w-full max-w-4xl animate-fadeIn">
              {/* Sample-Auswahl */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  Beispiel auswählen:
                  <select
                    value={currentSample.sampleId}
                    onChange={(e) =>
                      setSelectedSampleId(Number(e.target.value))
                    }
                    className={`rounded-md border border-white/10 bg-slate-800 px-2 py-1.5 text-sm text-white ${FOCUS_RING_CLASSES}`}
                  >
                    {localSamples.map((sample) => (
                      <option key={sample.sampleId} value={sample.sampleId}>
                        Beispiel {sample.sampleId + 1} ({classLabels[selectedDataset === "mushrooms" ? "mushroom" : selectedDataset]?.[sample.prediction] ?? sample.prediction})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-2xl bg-white/[0.03] py-3 sm:py-3">
                <div className="w-full overflow-x-auto">
                  <LimeImportancePlot 
                    data={currentSample} 
                    predictionLabel={
                      classLabels[selectedDataset === "mushrooms" ? "mushroom" : selectedDataset]
                        ?.[currentSample.prediction] ?? currentSample.prediction
                    }
                  />
                </div>
              </div>
            </section>
          ) : (
            <div className="m-auto flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <SpeechBubble
                  text={characterText}
                  tail="right"
                  className="mb-6 max-w-[180px] px-4 py-3 text-sm md:mb-10 md:max-w-[240px]"
                />
                <Character src={characterPicture} className="w-50 h-50" />
              </div>

              {!selectedDataset && (
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className={`rounded-md bg-gradient-to-r from-purple-700 to-cyan-600 px-4 py-2 text-sm font-semibold transition hover:from-purple-600 hover:to-cyan-400 md:hidden ${FOCUS_RING_CLASSES}`}
                >
                  Datensatz auswählen
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}