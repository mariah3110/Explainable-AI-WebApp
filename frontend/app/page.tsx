"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PawPrint } from "lucide-react";
import PixelAnimation from "@/components/PixelAnimation";
import Character from "@/components/Character";
import FootballField from "@/components/FootballField";
import { ForestAnimation } from "@/components/ForestAnimation";
import { ForestAnimationMobile } from "@/components/ForestAnimationMobile";
import { ExplainableAIDiagram } from "@/components/ExplainableAIDiagram";
import LimeCatModule from "@/components/LimeModule";

/* ── Scroll-gesteuertes Bubble-Pinning ─────────────────────────────── */

function useStickyBubble() {
  const sectionRef = useRef<HTMLElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bubble = bubbleRef.current;
    if (!section || !bubble) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let runway = 0;
    let active = false;

    const measure = () => {
      const vh = window.innerHeight;
      const isDesktop = window.innerWidth >= 768;
      const overflow = bubble.scrollHeight - bubble.clientHeight;

      if (reduceMotion || !isDesktop || overflow <= 4) {
        runway = 0;
        active = false;
        section.style.height = "";
        bubble.style.overflowY = "auto";
        bubble.scrollTop = 0;
        return;
      }

      active = true;
      bubble.style.overflowY = "hidden";
      runway = overflow * 1.5;
      section.style.height = `${vh + runway + vh * 0.3}px`;
    };

    const onScroll = () => {
      if (runway <= 0) return;
      const top = section.getBoundingClientRect().top;
      const scrolled = Math.min(Math.max(-top, 0), runway);
      bubble.scrollTop = (scrolled / runway) * (bubble.scrollHeight - bubble.clientHeight);
    };

    const onWheel = (e: WheelEvent) => {
      if (!active) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, behavior: "instant" as ScrollBehavior });
    };

    const onResize = () => { measure(); onScroll(); };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    bubble.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      bubble.removeEventListener("wheel", onWheel);
    };
  }, []);

  return { sectionRef, bubbleRef };
}

/* ── Wiederverwendbare Bausteine ───────────────────────────────────── */

// Gemeinsamer Fokus-Stil für alle interaktiven Elemente (Tastatur-Bedienung).
const FOCUS_RING_CLASSES =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70";

function SpeechBubble({
  scrollRef,
  arrowSide = "left",
  className = "",
  children,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  arrowSide?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  const arrow =
    arrowSide === "right"
      ? "md:top-1/2 md:left-auto md:right-0 md:translate-x-1/2 md:-translate-y-1/2"
      : "md:top-1/2 md:left-0 md:-translate-x-1/2 md:-translate-y-1/2";

  return (
    <div className={`w-full md:w-[40%] flex justify-center ${className}`}>
      <div className="relative w-full max-w-[440px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">
        <div className={`absolute z-20 w-5 h-5 bg-gray-200 rotate-45 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${arrow}`} />
        <div ref={scrollRef} className="max-h-[250px] md:max-h-[400px] overflow-hidden" style={{ height: "clamp(200px, 60vh, 400px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ModelBox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`w-full md:w-[40%] flex justify-center ${className}`}>
      <div className="relative w-full max-w-[420px] md:aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6" style={{ width: "clamp(100%, 30vw, 420px)", height: "clamp(200px, 63vh, 400px)" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

function TryButton({ href }: { href: string }) {
  return (
    <div className="mt-5 flex justify-end">
      <a
        href={href}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-300 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-cyan-400 transition-colors"
      >
        Try it out! ➔
      </a>
    </div>
  );
}

/* ── Hauptseite ────────────────────────────────────────────────────── */

export default function Home() {
  const [showSurvey, setShowSurvey] = useState(true);
  const [showAfterSurvey, setShowAfterSurvey] = useState(false);
  const ml   = useStickyBubble();
  const xai  = useStickyBubble();
  const shap = useStickyBubble();
  const lime = useStickyBubble();

  return (
    <main>
      {/* Umfrage-Popup beim ersten Laden */}
      {showSurvey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-orange-200 p-6 shadow-2xl sm:p-8">
            <h2 className="mb-3 text-center text-lg font-bold text-black sm:text-xl">
              Kurze Umfrage
            </h2>
            <p className="mb-6 text-center text-sm text-gray-700 sm:text-base">
              Bevor du loslegst, bitte ich dich eine kurze Umfrage auszufüllen.
              Das dauert nur wenige Minuten.
            </p>
            <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div>
                <img src="/qr_code_vorher.png" alt="QR Code" className="mx-auto mb-4 w-32 h-32" />
              </div>
              <div className="order-1 md:order-3">
                <Character 
                  src="/pixel5L.png" 
                  alt="Pixel" loading="eager" 
                  className = "w-[20vw] h-[20vw] md:w-[15vw] md:h-[15vw] max-w-[150px] max-h-[150px]"
                  sizes = "(max-width: 500px) 30vw, 15vw" />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://www.survio.com/survey/d/J6H0E3G0M3F4H7K5C"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowSurvey(false)}
                className={`flex-1 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-green-400 px-4 py-2.5 text-lg font-semibold text-gray-900 transition hover:from-blue-600 hover:to-green-500 ${FOCUS_RING_CLASSES}`}              >
                Zur Umfrage
              </a>
              <button
                type="button"
                onClick={() => setShowSurvey(false)}
                className={`flex-1 rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-white/10 hover:text-gray-900 ${FOCUS_RING_CLASSES}`}
              >
                Habe ich bereits gemacht
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Section 1 — Intro ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/*
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Understand AI.
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Visually.
          </span>
        </h1>
        */}
        {/*
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Verstehe KI.
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Visuell.
          </span>
        </h1>
        */}
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Expl
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            AI
          </span>
          n 
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}IT {" "}
          </span>
           to me.
        </h1>
        

        <p className="mt-6 max-w-4xl text-lg text-white/70 mb-20 md:mb-32">
          Lerne die Welt der Künstlichen Intelligenz etwas besser kennen. Hier erklärt dir Pixel anhand von einem Machine-Learning-Modell, 
          wie man mithilfe von Explainable AI die Entscheidungen von KI und Machine-Learning-Modellen besser verstehen und nachvollziehen kann.
        </p>

        <div className="mt-10 w-full flex justify-center items-end gap-2 md:mt-0 md:w-auto md:absolute md:left-20 md:bottom-10">
          <PixelAnimation frames={["/pixel_waving1.png", "/pixel_waving2.png"]} interval={500} />
          <div className="relative mb-6 md:mb-20 max-w-[180px] md:max-w-[240px] rounded-2xl bg-gray-200 text-black px-4 py-3 text-sm shadow-xl">
            Hi, ich bin Pixel. Ich werde dich durch die Welt der KI und des Machine-Learnings führen. 
            Lass es uns gemeinsam entdecken!
            <div className="absolute bottom-6 -left-2 w-4 h-4 bg-gray-200 rotate-45" />
          </div>
        </div>
      </section>

      {/* ── Section 2 — Machine Learning ── */}
      <section ref={ml.sectionRef} className="relative min-h-screen bg-slate-800">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-8 md:py-10">
          <div className="text-center mb-[clamp(20px,25px,60px)]">
            <h2 className="text-4xl md:text-6xl font-bold" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>
              What is 
              <span className="bg-gradient-to-r from-purple-700 to-cyan-300 bg-clip-text text-transparent"> M</span>achine 
              <span className="bg-gradient-to-r from-purple-700 to-cyan-300 bg-clip-text text-transparent"> L</span>earning?
            </h2>
          </div>

          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8"> 
            <div className="w-full md:w-[40%] flex justify-center m-2">
              {/* Nur auf Smartphones */}
              <div className="block md:hidden">
                <ForestAnimationMobile />
              </div>

              {/* Ab Tablets/Desktop */}
              <div className="hidden md:block">
                <ForestAnimation />
              </div>
            </div>

            <SpeechBubble scrollRef={ml.bubbleRef} arrowSide="right" className="order-2">
              <b>Machine-Learning</b> ist ein Teilgebiet der Künstlichen Intelligenz, 
              bei dem Computer aus Daten lernen, anstatt explizit programmiert zu werden.
              Die Algorithmen enthalten flexible Regeln, die sich anpassen, während sie mit 
              mehr Daten trainiert werden. So können sie Muster erkennen und Vorhersagen treffen.
              <br /><br />
              Wir konzentrieren uns heute auf eine bestimmte ML-Methode: <b>Random Forest</b>. 
              <br />
              Das ist ein Algorithmus, der oft für Klassifikationsaufgaben eingesetzt wird.
              Er erstellt viele Entscheidungsbäume, die jeweils auf unterschiedlichen Daten und 
              Merkmalen trainiert werden.
              Jeder Baum trifft eine eigene Vorhersage, und am Ende entscheidet die Mehrheit 
              der Bäume über das Gesamtergebnis.
              <br /><br />
              Im Beispiel siehst du, wie ein Random Forest aufgebaut wird und entscheidet, ob 
              es sich um einen <b>Apfel</b>, eine <b>Erdbeere</b> oder eine <b>Blaubeere</b> handelt.
              <br /><br />
              Heute wollen wir einen Random-Forest erstellen und verstehen, 
              wie er mithilfe von Explainable-AI-Methoden Entscheidungen trifft.  
              Was ist eigentlich <b>Explainable AI</b>? Das schauen wir uns im nächsten Abschnitt an!
            </SpeechBubble>

            <div className="order-1 md:order-3">
              <Character src="/pixel5L.png" alt="Pixel" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3 — Explainable AI ── */}
      <section ref={xai.sectionRef} className="relative min-h-screen bg-violet-950">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-8 md:py-10">
          <div className="text-center mb-6 md:mb-16">
            <h2 className="text-4xl md:text-6xl font-bold" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>
              EXPL<span className="bg-gradient-to-r from-cyan-700 to-cyan-300 bg-clip-text text-transparent">AI</span>NABLE AI
            </h2>
          </div>

          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <Character src="/pixel1R.png" />

            <SpeechBubble scrollRef={xai.bubbleRef} arrowSide="left">
              Bis jetzt haben wir gesehen, wie ein Modell Entscheidungen trifft. 
              Aber oft bleibt eine wichtige Frage offen: Warum eigentlich?
              <br /><br />
              Genau hier kommt <b>Explainable AI</b> ins Spiel. 
              Sie hilft uns zu verstehen, welche Gründe hinter einer 
              Vorhersage stecken.
              <br />
              Statt nur ein Ergebnis wie Apfel, Erdbeere oder Blaubeere zu zeigen, 
              können wir sichtbar machen, welche Merkmale besonders wichtig 
              waren – zum Beispiel Farbe oder Größe.
              <br /><br />
              Das ist hilfreich, weil es ein Teil dessen ist, <b>KI besser zu verstehen</b>, 
              Fehler zu erkennen und Vertrauen aufzubauen.
              <br /><br />
              Es gibt viele verschiedene Methoden, um KI-Entscheidungen erklärbar zu machen.
              Jede Methode hat ihre eigenen Stärken und Schwächen, und oft ergänzen sie sich gegenseitig.
              Wir schauen uns dafür zwei bekannte Methoden an: 
              <br />
              <b>LIME</b> und <b>SHAP</b>. Beide helfen dabei, komplexe Modelle wie den 
              Random Forest verständlicher zu machen – nur auf unterschiedliche 
              Weise. 
              <br /><br />
              <b>Fangen wir an!</b>
            </SpeechBubble>

            <ModelBox>
              <ExplainableAIDiagram />
            </ModelBox>
          </div>
        </div>
      </section>

      {/* ── Section 4 — SHAP ── */}
      <section ref={shap.sectionRef} className="relative min-h-screen bg-violet-900">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-8 md:py-10">
          <div className="text-center mb-[clamp(20px,25px,64px)]">
            <h2 className="text-4xl md:text-6xl font-bold" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>
              Explainable AI mit
              <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent"> SHAP</span>
            </h2>
          </div>

          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="order-3 md:order-1 w-full md:w-[40%] flex justify-center min-h-0 max-h-[460px]">
              <FootballField />
            </div>

            <SpeechBubble scrollRef={shap.bubbleRef} arrowSide="right" className="order-2">
              Schauen wir uns jetzt <b>SHAP</b> an.
              <br /><br />
              SHAP hilft uns zu verstehen, warum ein Modell genau dieses Ergebnis
              vorhergesagt hat. Dafür wird berechnet, welchen Beitrag jedes
              einzelne Merkmal zur Entscheidung leistet. Dafür spielt SHAP verschiedene
              Kombinationen von Merkmalen durch und beobachtet, wie sich die Vorhersage verändert,
              wenn ein Merkmal fehlt.
              <br /><br />
              Das kann SHAP sowohl lokal als auch global.
              Global bedeutet, dass wir uns das gesamte Modell mit allen Datenpunkten anschauen.
              Lokal bedeutet, dass wir uns nur ein einzelnes Datenpunkt anschauen.
              <br /><br />
              Stell dir das wie ein Team aus Spielerinnen und Spielern vor.
              Jede Spielerin und jeder Spieler beeinflusst das Endergebnis unterschiedlich stark.
              <br /><br />
              <b>Jetzt bist du dran!</b>
              <br />
              Du bist jetzt SHAP und versuchst herauszufinden,
              welche Spielerin bzw. welcher Spieler welchen Beitrag geleistet hat.
              Ziehe die Spielenden auf das Feld oder zurück auf die Bank und beobachte,
              wie sich die Vorhersage verändert.
              <br /><br />
              <b>Wie bekommen wir das beste Ergebnis?</b> (2:0)
              <br />
              <b>Welche Spielerinnen und Spieler haben den größten Einfluss?</b>
              <br /><br />
              Einige Spielerinnen und Spieler verbessern das Ergebnis, andere verschlechtern es,
              andere wiederum haben keinen Einfluss.
              <br />
              In unserer Visualisierung steht jede Spielerin und jeder Spieler für ein Merkmal.
              Auf eine ähnliche Weise findet SHAP heraus, welchen Beitrag die einzelnen Merkmale zur Vorhersage leisten.
              Der Wert wird berechnet und du kannst ihn dir direkt anschauen.
              <br /><br />
              <b>Probiere SHAP an einem echten Datensatz aus</b> und schau dir die Werte an!
              Klicke auf den Button "Try it out!" und entdecke es selbst! 🚀            
            </SpeechBubble>

            <div className="order-1 md:order-3">
              <Character src="/pixel2L.png" />
            </div>
          </div>

          <TryButton href="/tryPage_shap" />
        </div>
      </section>

      {/* ── Section 5 — LIME ── */}
      <section ref={lime.sectionRef} className="relative min-h-screen bg-violet-800">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-8 md:py-10">
          <div className="text-center mb-4 md:mb-10">
            <h2 className="text-4xl md:text-6xl font-bold" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>
              Explainable AI mit 
              <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent"> LIME</span>
            </h2>
          </div>

          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <Character src="/pixel5R.png" />

            <SpeechBubble scrollRef={lime.bubbleRef} arrowSide="left">
              Jetzt schauen wir uns <b>LIME</b> an.
              <br /><br />
              LIME hilft uns zu verstehen, warum ein Modell genau bei einem 
              einzelnen Beispiel so entschieden hat. Dabei wird nicht das ganze 
              Modell erklärt, sondern nur die Entscheidung für diesen einen 
              konkreten Fall.
              <br />
              Stell dir vor, wir untersuchen einen Bildanalyse-Tool für <b>Katzenbilder</b>.
              LIME schaut sich an, welche Merkmale des Bildes besonders wichtig waren, 
              um zu entscheiden, ob es sich um eine Katze handelt oder nicht. 
              <br /><br />
              LIME erzeugt viele leicht veränderte Varianten deines Beispiels, 
              lässt das Modell diese bewerten und baut daraus ein einfaches Ersatzmodell, 
              das nur in der direkten Umgebung dieses einen Beispiels gilt. 
              <br /><br />
              <b>Jetzt bist du dran!</b>
              <br />
              In der interaktiven Ansicht kannst du die Merkmale einer Katze verändern und beobachten,
              was das für die Vorhersage bedeutet. 
              <br /><br />
              Du kannst zum Beispiel:
              <br />
              <span
                className="gap-2 inline-flex items-center">
                  <PawPrint size={17} /> 
                  die Ohren verändern
              </span>
              <br />
              <span
                className="gap-2 inline-flex items-center">
                  <PawPrint size={17} /> 
                  den Schwanz verändern
              </span>
              <br />
              <span
                className="gap-2 inline-flex items-center">
                  <PawPrint size={17} /> 
                  die Füße verändern
              </span>
              <br /><br />
              Sobald du etwas änderst, siehst du direkt, wie sich die Vorhersage 
              verändert.
              <br /><br />
              Welche Veränderung hat das Ergebnis wie beeinflusst? 
              <br />
              Welche Merkmale waren besonders wichtig für die Entscheidung?
              <br /><br />
              LIME arbeitet also wie eine Lupe für Einzelfälle.
              Es schaut sich nur die Umgebung eines Beispiels an und erklärt 
              genau diese lokale Entscheidung einfach und nachvollziehbar. 
              <br /><br /> 
              <b>Probiere LIME an einem echten Datensatz aus</b> und schau dir die Werte an!
              Klicke auf den Button <b>"Try it out!"</b> und entdecke es selbst! 🚀
            </SpeechBubble>

            <ModelBox>
              <LimeCatModule />
            </ModelBox>
          </div>

          <TryButton href="/tryPage_lime" />
        </div>
      </section>

      {/* ── Section 6 — Abschluss ── */}
      <section className="min-h-screen bg-violet-950 flex flex-col justify-center items-center px-6 py-20">
        <div className="relative max-w-2xl items-center justify-center flex flex-col gap-1">
          <h2 className="font-bold text-center text-[clamp(1.5rem,4vw,4rem)]">
            DU HAST ES GESCHAFFT!
          </h2>

          <PixelAnimation
            frames={["/pixel_dancing1.png", "/pixel_dancing2.png", "/pixel_dancing3.png", "/pixel_dancing4.png"]}
            interval={300}
            size="w-[clamp(140px,20vw,320px)] h-[clamp(140px,20vw,320px)]"
          />

          <p className="max-w-2xl text-base sm:text-lg text-white/70 text-center">
            Glückwunsch! Du hast deine ersten Schritte in die Welt der 
            Explainable AI gemacht. Bleib neugierig, stelle Fragen und vor allem: 
            Hab Spaß beim Lernen! 🚀✨
          </p>
          <button 
            onClick={() => setShowAfterSurvey(true)}
            className="flex-1 rounded-lg border border-white/70 px-4 py-2 text-center text-lg font-semibold text-white transition hover:text-gray-300 ${FOCUS_RING_CLASSES}">
            klick hier
          </button>

          {/* Umfrage-Popup beim ersten Laden */}
          {showAfterSurvey && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-orange-200 p-6 shadow-2xl sm:p-8">
                <h2 className="mb-3 text-center text-lg font-bold text-black sm:text-xl">
                  Kurze Umfrage
                </h2>
                <p className="mb-6 text-center text-sm text-gray-700 sm:text-base">
                  Vielen Dank für deine Teilnahme! 
                  Bitte fülle die kurze Umfrage aus, um mir Feedback zu geben. 
                  Das dauert nur wenige Minuten.
                </p>
                <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <div>
                    <img src="/qr_code_nachher.png" alt="QR Code" className="mx-auto mb-4 w-32 h-32" />
                  </div>
                  <div className="order-1 md:order-3">
                    <Character 
                      src="/pixel6L.png" 
                      alt="Pixel" loading="eager" 
                      className = "w-[30vw] h-[30vw] md:w-[25vw] md:h-[25vw] max-w-[180px] max-h-[180px]"
                      sizes = "(max-width: 500px) 30vw, 15vw" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://www.survio.com/survey/d/G9O6A6P0N4C6V9Q9F"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowAfterSurvey(false)}
                    className={`flex-1 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-green-400 px-4 py-2.5 text-lg font-semibold text-gray-900 transition hover:from-blue-600 hover:to-green-500 ${FOCUS_RING_CLASSES}`}              >
                    Zur Umfrage
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowAfterSurvey(false)}
                    className={`flex-1 rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-white/10 hover:text-gray-900 ${FOCUS_RING_CLASSES}`}
                  >
                    Habe ich bereits gemacht
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}