"use client";

import Image from "next/image";
import { useEffect, useRef, useState} from "react";
import { Menu, RotateCw, X } from "lucide-react";

import Character from "@/components/Character";
import ShapImportancePlot from "@/components/CreatePlotShap";
import { ForestAnimationForModul } from "@/components/ForestAnimationForModul";

import penguinsData from "../../public/data/penguins/shap_global.json";
import mushroomsData from "../../public/data/mushroom/shap_global.json";
import wineData from "../../public/data/wine/shap_global.json";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/* Konstanten und Typen                                                       */
/* -------------------------------------------------------------------------- */

/** Dauer eines Durchlaufs der ForestAnimationForModul in ms. */
const ANIMATION_CYCLE_MS = 5500;

/** Die Anzahl der Trainings-Durchläufe wird zufällig aus diesem Bereich gewählt (inklusive). */
const MIN_TRAINING_RUNS = 1;
const MAX_TRAINING_RUNS = 3;

/** Bilder des Begleiter-Charakters für die verschiedenen Zustände. */
const CHARACTER_IMAGES = {
  idle: "/pixel2L.png",
  training: "/pixel1L.png",
  explaining: "/pixel5R.png",
} as const;

/** Alle Texte, die der Charakter im Verlauf anzeigt. */
const MESSAGES = {
  selectDataset: "Suche dir einen Datensatz aus, auf den du SHAP anwenden möchtest.",
  training: "Der Random Forest wird trainiert …",
  shapReady:
    "Klicke auf den Button, um SHAP zu verwenden und die Feature-Importanz anzusehen.",
  featureImportance:
    "Das ist die Feature-Importanz! Je länger der Balken, desto stärker beeinflusst dieses Merkmal die Vorhersage des Modells.",
} as const;

type DatasetId = "penguins" | "mushrooms" | "wine";

type ShapFeature = { feature: string; importance: number };

type DatasetOption = {
  id: DatasetId;
  label: string;
  /** Hintergrund des Buttons im aktiven (nicht gesperrten) Zustand. */
  idleClassName: string;
  /** Horizontale Ausrichtung des Tooltips, damit er die Sidebar nicht verlässt. */
  tooltipAlignmentClassName: string;
  tooltip: {
    imageSrc: string;
    imageAlt: string;
    stats: string;
    description: string;
  };
};

/** Statisch importierte SHAP-Daten je Datensatz (Datenquelle des Plots). */
const SHAP_DATA_BY_DATASET = {
  penguins: penguinsData,
  mushrooms: mushroomsData,
  wine: wineData,
};

const COLORES = {
  titel: "from-blue-500 to-green-300",
  tooltip: "from-blue-500 to-green-300",
  ShapButton: "from-blue-500 to-green-400 hover:from-blue-700 hover:to-green-500",
  DataButton1: "bg-blue-500/40 hover:bg-gray-500/40",
  DataButton2: "bg-gradient-to-r from-blue-500/40 to-green-300/40 hover:from-gray-500/40 hover:to-gray-500/40",
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
      stats: "(334 Spalten, 7 Zeilen)",
      description:
        "Pinguin-Daten mit Körpermaßen und Art. Das Modell lernt, anhand von Merkmalen wie Schnabellänge, Flossenlänge und Gewicht die Pinguinart vorherzusagen.",
    },
  },
  {
    id: "mushrooms",
    label: "Pilze",
    idleClassName:
      `${COLORES.DataButton2}`,
    tooltipAlignmentClassName: "left-1/2 -translate-x-1/2",
    tooltip: {
      imageSrc: "/mushrooms.png",
      imageAlt: "Pilze",
      stats: "(8124 Spalten, 22 Zeilen)",
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
      stats: "(178 Spalten, 13 Zeilen)",
      description:
        "Chemische Eigenschaften von Wein. Vorhersage: Zu welcher von drei Weinsorten gehört er?",
    },
  },
];

/** Gemeinsamer Fokus-Stil für alle interaktiven Elemente (Tastatur-Bedienung). */
const FOCUS_RING_CLASSES =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70";

/* -------------------------------------------------------------------------- */
/* UI-Bausteine                                                               */
/* -------------------------------------------------------------------------- */

type SpeechBubbleProps = {
  text: string;
  /** Seite, auf der die Sprechblasen-Spitze sitzt (zeigt zum Charakter). */
  tail: "left" | "right";
  className?: string;
};

/** Sprechblase des Begleiter-Charakters. */
function SpeechBubble({ text, tail, className = "" }: SpeechBubbleProps) {
  return (
    <div className={`relative rounded-md bg-gray-200 px-3 py-2 text-black shadow-xl ${className}`}>
      {text}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-gray-200 ${
          tail === "left" ? "-left-1" : "-right-1"
        }`}
      />
    </div>
  );
}

type DatasetButtonProps = {
  dataset: DatasetOption;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: (datasetId: DatasetId) => void;
};

/** Auswahl-Button für einen Datensatz inklusive Hover-Tooltip mit Details. */
function DatasetButton({ dataset, isSelected, isLocked, onSelect }: DatasetButtonProps) {
  const stateClassName = isLocked
    ? "cursor-not-allowed border border-gray-500/50 opacity-50"
    : dataset.idleClassName;

  const selectedClassName = isSelected
    ? "bg-gray-500/50 opacity-100 shadow-lg shadow-teal-300/50"
    : "";

  return (
    <div className="group relative w-full">
      <button
        type="button"
        disabled={isLocked}
        onClick={() => onSelect(dataset.id)}
        className={`w-full rounded-md px-2 py-2.5 text-sm font-medium transition sm:px-3 ${FOCUS_RING_CLASSES} ${stateClassName} ${selectedClassName}`}
      >
        {dataset.label}
      </button>

      {/* Tooltip mit Vorschaubild und Kurzbeschreibung, sichtbar bei Hover */}
      <div
        className={`pointer-events-none absolute top-full z-60 mt-2 w-44 rounded-lg bg-gradient-to-r ${COLORES.tooltip} p-2 text-xs text-white opacity-0 transition group-hover:opacity-100 ${dataset.tooltipAlignmentClassName}`}
      >
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
      </div>
    </div>
  );
}

/** Seitentitel, wird in der Sidebar und in der mobilen Kopfzeile verwendet. */
function PageTitle({ className = "" }: { className?: string }) {
  return (
    <h1 className={`font-bold ${className}`}>
      Try{" "}
      <span className={`bg-gradient-to-r ${COLORES.titel} bg-clip-text text-transparent`}>
        SHAP
      </span>
    </h1>
  );
}

/* -------------------------------------------------------------------------- */
/* Seite                                                                      */
/* -------------------------------------------------------------------------- */

export default function TryShapPage() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetId | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [animationOver, setAnimationOver] = useState(false);
  const [showShapPlot, setShowShapPlot] = useState(false);
  const [shapData, setShapData] = useState<ShapFeature[] | null>(null);
  const [characterText, setCharacterText] = useState<string>(MESSAGES.selectDataset);
  const [characterPicture, setCharacterPicture] = useState<string>(CHARACTER_IMAGES.idle);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const datasetLocked = selectedDataset !== null;
  const canRunShap = animationOver && !showShapPlot;

  const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);

        check();
        window.addEventListener("resize", check);

        return () => window.removeEventListener("resize", check);
    }, []);

  /** Ref für den Trainings-Timer, damit er bei Reset und Unmount sicher aufgeräumt wird. */
  const loopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
  };

  // Timer aufräumen, falls die Seite verlassen wird, während die Animation läuft.
  useEffect(() => {
    return () => clearTimers();
  }, []);

  /** Startet die Trainings-Animation und steuert die zufällige Anzahl an Durchläufen. */
  const startAnimation = () => {
    clearTimers();
    setAnimationOver(false);
    setIsAnimating(true);
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
        setIsAnimating(false);
        setAnimationOver(true);
        setCharacterText(MESSAGES.shapReady);
        setCharacterPicture(CHARACTER_IMAGES.idle);
        return;
      }

      currentRun += 1;
      setAnimationKey((key) => key + 1);
    }, ANIMATION_CYCLE_MS);
  };

  const handleDatasetSelect = (datasetId: DatasetId) => {
    setSelectedDataset(datasetId);
    startAnimation();
  };

  /**
   * Lädt die SHAP-Daten des gewählten Datensatzes und blendet den Plot ein.
   * Der Plot selbst rendert die statisch importierten Daten, daher wird er
   * auch dann angezeigt, wenn der Request fehlschlägt.
   */
  const handleShapClick = async () => {
      setShowShapPlot(true);
      setCharacterText(MESSAGES.featureImportance);
      // Mobilen Drawer schließen, damit der Plot direkt sichtbar ist.
      setIsSidebarOpen(false);
  };

  /** Setzt die Seite auf den Ausgangszustand zurück. */
  const resetPage = () => {
    clearTimers();
    setSelectedDataset(null);
    setIsAnimating(false);
    setAnimationOver(false);
    setShowShapPlot(false);
    setAnimationKey(0);
    setShapData(null);
    setCharacterText(MESSAGES.selectDataset);
    setCharacterPicture(CHARACTER_IMAGES.idle);
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Abdunkelnder Hintergrund hinter dem mobilen Drawer */}
      {isSidebarOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/*
        SIDEBAR
        Ab md fest in das Layout integriert (sticky, volle Höhe), auf kleineren
        Bildschirmen als einklappbarer Drawer von links.
      */}
      <aside
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-slate-900 p-4 transition-transform duration-300 ease-in-out sm:p-5 md:sticky md:top-0 md:z-auto md:h-screen md:w-80 md:max-w-none md:translate-x-0 md:bg-slate-950/40 md:transition-none lg:w-96 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Kopfbereich: Titel, Reset und Schließen-Button (nur mobil) */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <PageTitle className="text-xl lg:text-2xl" />

          <div className="flex items-center gap-1">
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

        {/* Datensatz-Auswahl */}
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

        {/* Modell-Bühne: Trainings-Animation bzw. erklärender Charakter */}
        <div 
        className="mb-5 flex min-h-[250px] w-full flex-col items-center justify-center 
        overflow-hidden rounded-xl bg-white/[0.03] sm:min-h-[230px] md:min-h-[250px]">
          {selectedDataset ? (
            /* Während des Trainings wird die Animation nach jedem Durchlauf neu
               gemountet. Nach dem letzten Durchlauf bleibt das Bild stehen. */
            <ForestAnimationForModul key={animationKey} />
          ) : null}
        </div>

        {/* Startet die SHAP-Auswertung, sobald das Training abgeschlossen ist */}
        <button
          type="button"
          disabled={!canRunShap}
          onClick={handleShapClick}
          className={`w-full rounded-md px-4 py-2.5 text-base font-bold transition sm:text-lg ${FOCUS_RING_CLASSES} ${
            canRunShap
              ? "bg-gradient-to-r " + COLORES.ShapButton
              : "cursor-not-allowed bg-gray-500/40 opacity-50"
          }`}
        >
          SHAP
        </button>
      </aside>

      {/* HAUPTBEREICH */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Kopfzeile mit Menü-Button */}
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
            {showShapPlot && (
                <motion.div
                    drag
                    dragMomentum={false}
                    className="fixed z-55 cursor-grab"
                    style={{
                        left: isMobile ? 10 : 20,
                        top: isMobile ? 700 : 200,
                    }}
                >
                    <div className="flex justify-between items-center">
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
          {showShapPlot && selectedDataset ? (
            
            /* SHAP-Ergebnis: Der Plot erhält die volle verfügbare Breite. Bei
               sehr breiten Diagrammen (viele oder lange Achsen-Beschriftungen)
               verhindert overflow-x-auto, dass die Seite horizontal scrollt. */
            <section className="m-auto w-full max-w-4xl animate-fadeIn">
              <div className="rounded-2xl bg-white/[0.03] py-3 sm:py-3">
                <div className="w-full overflow-x-auto">
                  <ShapImportancePlot data={SHAP_DATA_BY_DATASET[selectedDataset]} />
                </div>
              </div>
            </section>
          ) : (
            /* Begrüßung bzw. Statushinweise des Charakters */
            <div className="m-auto flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <SpeechBubble
                  text={characterText}
                  tail="right"
                  className="mb-6 max-w-[180px] px-4 py-3 text-sm md:mb-10 md:max-w-[240px]"
                />
                <Character src={characterPicture} className="w-50 h-50" />
              </div>

              {/* Mobiler Einstieg: öffnet den Drawer mit der Datensatz-Auswahl */}
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