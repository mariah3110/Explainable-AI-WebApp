"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PawPrint } from "lucide-react";
import PixelAnimation from "@/components/PixelAnimation";
import Character from "@/components/Character";
import FootballField from "@/components/FootballField";
import { ForestAnimation } from "@/components/ForestAnimation";
import { ExplainableAIDiagram } from "@/components/ExplainableAIDiagram";
import LimeCatModule from "@/components/LimeModule";

/* ══════════════════════════════════════════════════════════════════
   RESPONSIVE-KONSTANTEN — die EINE Quelle der Wahrheit.
   Alle Größen, die auf mehreren Geräten funktionieren müssen,
   stehen hier zentral. Ändert man sie hier, ändern sich alle
   Sections konsistent mit.
   ══════════════════════════════════════════════════════════════════ */

// Ab dieser Breite wechselt das Layout von "gestapelt" auf 3 Spalten.
// Entspricht Tailwind "lg". Wird in CSS (lg:) UND im Scroll-Hook benutzt,
// damit Layout und JavaScript nie auseinanderlaufen.
const DESKTOP_MIN_WIDTH = 1024;

// Höhe des scrollbaren Sprechblasen-Inhalts: nie kleiner als 220px,
// wächst mit dem Viewport, nie größer als 420px.
const BUBBLE_HEIGHT = "clamp(220px, 55vh, 420px)";

// Kantenlänge der quadratischen Modell-Box: nimmt die volle Zellbreite,
// aber maximal 420px und maximal 55% der Viewport-Höhe.
const MODEL_SIZE = "min(100%, 420px, 55vh)";

// Breite des Characters: fluide zwischen Handy und großem Desktop.
const CHARACTER_WIDTH = "clamp(110px, 13vw, 200px)";

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
      // Gleicher Breakpoint wie das lg:-Layout — nicht mehr md (768px)!
      const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
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

type StickyBubble = ReturnType<typeof useStickyBubble>;

/* ── Wiederverwendbare Bausteine ───────────────────────────────────── */

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-center mb-6 lg:mb-14">
      {/* Fluide Schriftgröße statt fester Breakpoint-Sprünge:
          skaliert stufenlos von Handy bis 4K-Monitor. */}
      <h2 className="font-bold leading-tight text-[clamp(1.9rem,3.5vw+0.8rem,4rem)]">
        {children}
      </h2>
    </div>
  );
}

function SpeechBubble({
  scrollRef,
  arrowSide,
  children,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  arrowSide: "left" | "right";
  children: ReactNode;
}) {
  // Desktop: Pfeil zeigt seitlich zum Character.
  // Mobil/Tablet: Pfeil zeigt nach oben zum Character darüber.
  const desktopArrow =
    arrowSide === "right"
      ? "lg:top-1/2 lg:left-auto lg:right-0 lg:translate-x-1/2 lg:-translate-y-1/2"
      : "lg:top-1/2 lg:left-0 lg:-translate-x-1/2 lg:-translate-y-1/2";

  return (
    <div className="relative w-full max-w-[480px] min-w-0 rounded-3xl bg-gray-200 text-black px-5 py-4 sm:px-6 sm:py-5 text-sm sm:text-base shadow-2xl">
      <div
        className={`absolute z-20 w-5 h-5 bg-gray-200 rotate-45 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${desktopArrow}`}
      />
      <div
        ref={scrollRef}
        className="overflow-hidden"
        style={{ height: BUBBLE_HEIGHT }}
      >
        {children}
      </div>
    </div>
  );
}

function ModelBox({ children }: { children: ReactNode }) {
  return (
    // Immer quadratisch; Kantenlänge = min(Zellbreite, 420px, 55vh).
    // Dadurch passt die Box auf jedem Gerät, ohne feste Sonderfälle.
    <div
      className="relative aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-6"
      style={{ width: MODEL_SIZE }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function CharacterSlot({ src }: { src: string }) {
  return (
    // Der Wrapper bestimmt die fluide Breite; das Character-Bild
    // sollte darin einfach w-full h-auto sein (siehe Hinweis unten).
    <div className="shrink-0 flex justify-center" style={{ width: CHARACTER_WIDTH }}>
      <Character src={src} alt="Pixel" />
    </div>
  );
}

function TryButton({ href }: { href: string }) {
  return (
    <div className="mt-6 w-full max-w-7xl mx-auto flex justify-center lg:justify-end">
      <a
        href={href}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-300 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-cyan-400 transition-colors"
      >
        Try it out! ➔
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ExplainerSection — DAS zentrale Layout für alle Erklär-Sections.

   Jede Section besteht aus denselben drei Modulen:
   Character, Sprechblase, Modell/Visual.

   Responsive-Verhalten (für alle Sections identisch):
   - Handy & Tablet (< 1024px): gestapelt in fester Lese-Reihenfolge
       1. Character   2. Sprechblase   3. Visual
   - Desktop (>= 1024px): 3 Spalten nebeneinander,
       Character wahlweise links oder rechts, Sprechblase in der Mitte.
   - Der Sprechblasen-Pfeil zeigt automatisch zum Character.
   ══════════════════════════════════════════════════════════════════ */

function ExplainerSection({
  sticky,
  bg,
  title,
  characterSrc,
  characterSide,
  visual,
  tryHref,
  children,
}: {
  sticky: StickyBubble;
  bg: string;
  title: ReactNode;
  characterSrc: string;
  characterSide: "left" | "right";
  visual: ReactNode;
  tryHref?: string;
  children: ReactNode;
}) {
  const charLeft = characterSide === "left";

  // Spaltenraster: die "auto"-Spalte gehört dem Character,
  // die beiden 1fr-Spalten teilen sich Sprechblase und Visual.
  // minmax(0, 1fr) verhindert, dass Inhalte die Spalte aufsprengen
  // (klassische Ursache für horizontales Scrollen auf kleinen Geräten).
  const gridCols = charLeft
    ? "lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]"
    : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]";

  return (
    <section ref={sticky.sectionRef} className={`relative min-h-screen ${bg}`}>
      <div className="sticky top-0 min-h-screen flex flex-col justify-center px-4 sm:px-6 py-8 lg:py-10">
        <SectionTitle>{title}</SectionTitle>

        <div
          className={`w-full max-w-7xl mx-auto grid grid-cols-1 ${gridCols} items-center justify-items-center gap-6 lg:gap-8`}
        >
          {/* DOM-Reihenfolge = Mobil-Reihenfolge (Character, Bubble, Visual).
              Auf Desktop sortiert lg:order-* je nach Character-Seite um. */}
          <div className={charLeft ? "lg:order-1" : "lg:order-3"}>
            <CharacterSlot src={characterSrc} />
          </div>

          <div className="lg:order-2 w-full min-w-0 flex justify-center">
            <SpeechBubble
              scrollRef={sticky.bubbleRef}
              arrowSide={charLeft ? "left" : "right"}
            >
              {children}
            </SpeechBubble>
          </div>

          <div
            className={`${charLeft ? "lg:order-3" : "lg:order-1"} w-full min-w-0 flex justify-center`}
          >
            {visual}
          </div>
        </div>

        {tryHref && <TryButton href={tryHref} />}
      </div>
    </section>
  );
}

/* ── Hauptseite ────────────────────────────────────────────────────── */

export default function Home() {
  const ml = useStickyBubble();
  const xai = useStickyBubble();
  const shap = useStickyBubble();
  const lime = useStickyBubble();

  return (
    // overflow-x-clip als Sicherheitsnetz gegen horizontales Wackeln
    // auf sehr schmalen Geräten.
    <main className="overflow-x-clip">

      {/* ── Section 1 — Intro ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <h1 className="max-w-4xl font-bold tracking-tight leading-tight text-[clamp(2.4rem,5vw+1rem,4.5rem)]">
          Understand AI.
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Visually.
          </span>
        </h1>

        <p className="mt-6 max-w-4xl text-base sm:text-lg text-white/70 mb-16 lg:mb-32">
          Lerne die Welt der Künstlichen Intelligenz etwas besser kennen. Hier erklärt dir Pixel anhand von einem Maschien Learning Modell,
          wie man mithilfe von Explainable AI die Entscheidungen von KI und Machine Learning Modellen besser verstehen und nachvollziehen kann.
        </p>

        {/* Auf Handy/Tablet im Textfluss zentriert, erst ab lg absolut
            unten links — so überlappt auf Tablets nichts mit dem Text. */}
        <div className="mt-8 w-full flex justify-center items-end gap-2 lg:mt-0 lg:w-auto lg:absolute lg:left-20 lg:bottom-10">
          <PixelAnimation frames={["/pixel_waving1.png", "/pixel_waving2.png"]} interval={500} />
          <div className="relative mb-6 lg:mb-20 max-w-[200px] lg:max-w-[240px] rounded-2xl bg-gray-200 text-black px-4 py-3 text-sm shadow-xl">
            Hi, ich bin Pixel. Ich werde dich durch die Welt der KI und des Machine Learnings führen.
            Lass es uns gemeinsam entdecken!
            <div className="absolute bottom-6 -left-2 w-4 h-4 bg-gray-200 rotate-45" />
          </div>
        </div>
      </section>

      {/* ── Section 2 — Machine Learning ── */}
      <ExplainerSection
        sticky={ml}
        bg="bg-slate-800"
        characterSrc="/pixel5L.png"
        characterSide="right"
        visual={
          <div className="w-full max-w-[480px] flex justify-center">
            <ForestAnimation />
          </div>
        }
        title={
          <>
            What is
            <span className="bg-gradient-to-r from-purple-700 to-cyan-300 bg-clip-text text-transparent"> M</span>achine
            <span className="bg-gradient-to-r from-purple-700 to-cyan-300 bg-clip-text text-transparent"> L</span>earning?
          </>
        }
      >
        <b>Machine Learning</b> ist ein Teilgebiet der Künstlichen Intelligenz,
        bei dem Computer aus Daten lernen, anstatt explizit programmiert zu werden.
        Die Algorithmen enthalten flexible Regeln, die sich anpassen, wärend sie mit
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
        Im Beispiel siehst du, wie ein Random Forest aufgebaut wird und entscheidet ob
        es sich um einen <b>Apfel</b>, eine <b>Erdbeere</b> oder eiene <b>Blaubeere</b> handelt.
        <br /><br />
        Heute wollen wir einen Random Forest erstellen und verstehen,
        wie er Entscheidungen trifft mithilfe von Explainable AI Methoden.
        Was ist eigendlich <b>Explainable AI</b>? Das schauen wir uns im nächsten Abschnitt an!
      </ExplainerSection>

      {/* ── Section 3 — Explainable AI ── */}
      <ExplainerSection
        sticky={xai}
        bg="bg-violet-950"
        characterSrc="/pixel1R.png"
        characterSide="left"
        visual={
          <ModelBox>
            <ExplainableAIDiagram />
          </ModelBox>
        }
        title={
          <>
            EXPL<span className="bg-gradient-to-r from-cyan-700 to-cyan-300 bg-clip-text text-transparent">AI</span>NABLE AI
          </>
        }
      >
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
        Das ist hilfreich, weil es ein teil dessen ist, <b>KI besser zu verstehen</b>,
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
        <b>Fangen wir an!!</b>
      </ExplainerSection>

      {/* ── Section 4 — SHAP ── */}
      <ExplainerSection
        sticky={shap}
        bg="bg-violet-900"
        characterSrc="/pixel2L.png"
        characterSide="right"
        tryHref="/tryPage_shap"
        visual={
          <div className="w-full max-w-[480px] max-h-[460px] min-h-0 flex justify-center">
            <FootballField />
          </div>
        }
        title={
          <>
            Explainable AI mit
            <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent"> SHAP</span>
          </>
        }
      >
        Schauen wir uns jetzt <b>SHAP</b> an. 🔍
        <br /><br />
        SHAP hilft uns zu verstehen, warum ein Modell genau dieses Ergebnis
        vorhergesagt hat. Dafür wird berechnet, welchen Beitrag jedes
        einzelne Merkmal zur Entscheidung leistet. Das macht das Modell
        indem es verschiedene Kombinationen von Merkmalen durchspielt und
        schaut, wie sich die Vorhersage verändert, wenn ein Merkmal weggelassen wird.
        <br /><br />
        Stell dir das wie ein Team aus Spielern vor. ⚽
        Jeder Spieler beeinflusst das Endergebnis unterschiedlich stark.
        <br /><br />
        <b>Jetzt bist du dran!</b>
        <br />
        Du bist jetzt Shap und versuchst herauszufinden,
        welcher Spieler/ welche Spielerin, welchen beitrag geleistet hat.
        Ziehe die SpielerInnen auf das Feld oder zurück auf die Bank und beobachte,
        wie sich die Vorhersage verändert.
        <br /><br />
        <b>Wie bekommen wir das beste Ergebnis?</b> (2:0)
        <br />
        <b>Welche SpielerInnen haben den größten Einfluss?</b>
        <br /><br />
        Einige SpielerInnen verbessern das Ergebnis, andere verschlechtern es,
        andere wiederum haben keinen Einfluss.
        <br />
        In unserer Visualisierung steht jeder Spieler für ein Merkmal/Feature
        und auf eine ähnliche art und weiße findet Shap heraus welchen beitrag
        sie zum ergebnis leisten. Der Wert wird berechnet und du kannst sie dir direkt anschauen.
        <br /><br />
        <b>Probiere shap an einem Echten Datensatz aus</b> und schau dir die Werte an!
        Klicke auf den Button "Try it out!" und entdecke es selbst! 🚀
      </ExplainerSection>

      {/* ── Section 5 — LIME ── */}
      <ExplainerSection
        sticky={lime}
        bg="bg-violet-800"
        characterSrc="/pixel5R.png"
        characterSide="left"
        tryHref="/tryPage_lime"
        visual={
          <ModelBox>
            <LimeCatModule />
          </ModelBox>
        }
        title={
          <>
            Explainable AI mit
            <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent"> LIME</span>
          </>
        }
      >
        Jetzt schauen wir uns <b>LIME</b> an. 🔍
        <br /><br />
        LIME hilft uns zu verstehen, warum ein Modell genau bei einem
        einzelnen Beispiel so entschieden hat. Dabei wird nicht das ganze
        Modell erklärt, sondern nur die Entscheidung für diesen einen
        konkreten Fall.
        <br />
        Stell dir vor, wir untersuchen einen Bild analyse tool für <b>Katzenbilder</b>.
        LIME schaut sich an, welche Merkmale des Bildes besonders wichtig waren, um zu entscheiden, ob es sich um eine Katze handelt oder nicht.
        <br /><br />
        Auch LIME schaut sich an, wie sich die Vorhersage verändert, wenn man bestimmte Merkmale weglässt oder verändert. Aber im Gegensatz zu SHAP konzentriert sich LIME nur auf die Umgebung eines einzelnen Beispiels und erklärt genau diese lokale Entscheidung.
        <br /><br />
        <b>Jetzt bist du dran!</b>
        <br />
        In der interaktiven Ansicht kannst du die Merkmale einer Katze verändern und beobachten,
        was das für die Vorhersage bedeutet. Du kannst zum Beispiel:
        <PawPrint size={17} /> die Ohren verändern
        <PawPrint size={17} /> den Schwanz verändern
        <PawPrint size={17} /> die Füße verändern
        <br /><br />
        Sobald du etwas änderst, siehst du direkt, wie sich die Vorhersage
        verändert.
        <br /><br />
        Welche veränderung hat das Ergebnis wie beeinflusst?
        <br />
        Welche Merkmale waren besonders wichtig für die Entscheidung?
        <br /><br />
        LIME arbeitet also wie eine Lupe für Einzelfälle.
        Es schaut sich nur die Umgebung eines Beispiels an und erklärt
        genau diese lokale Entscheidung einfach und nachvollziehbar.
        <br /><br />
        <b>Probiere LIME an einem Echten Datensatz aus</b> und schau dir die Werte an!
        Klicke auf den Button <b>"Try it out!"</b> und entdecke es selbst! 🚀
      </ExplainerSection>

      {/* ── Section 6 — Abschluss ── */}
      <section className="min-h-screen bg-violet-950 flex flex-col justify-center items-center px-4 sm:px-6 py-20">
        <div className="relative max-w-2xl items-center justify-center flex flex-col gap-1">
          <h2 className="font-bold text-center text-[clamp(1.9rem,3.5vw+0.8rem,4rem)]">
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
        </div>
      </section>

    </main>
  );
}