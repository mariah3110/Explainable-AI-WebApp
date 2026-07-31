"use client";

import { useEffect, useRef } from "react";
import PixelAnimation from "@/components/PixelAnimation";
import Character from "@/components/Character";
import FootballField from "@/components/FootballField";
import { ForestAnimation } from "@/components/ForestAnimation";
import { ExplainableAIDiagram } from "@/components/ExplainableAIDiagram";

/**
 * Pinnt eine Sektion am Viewport und überträgt den Seiten-Scroll auf den
 * internen Scroll der Sprechblase. Solange die Blase noch Inhalt hat, bleibt
 * die Seite optisch stehen; ist die Blase unten angekommen, scrollt alles weiter.
 *
 * Anwendung:
 *   const ml = useStickyBubble();
 *   <section ref={ml.sectionRef} className="relative min-h-screen ...">
 *     <div className="sticky top-0 min-h-screen ...">
 *       ... <div ref={ml.bubbleRef} className="max-h-[400px] overflow-y-auto"> ... </div> ...
 *     </div>
 *   </section>
 */
function useStickyBubble() {
  const sectionRef = useRef<HTMLElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bubble = bubbleRef.current;
    if (!section || !bubble) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let runway = 0; // Extra-Scroll-Strecke der Sektion (in px)

    const measure = () => {
      const vh = window.innerHeight;
      const isDesktop = window.innerWidth >= 768; // entspricht Tailwind "md"
      const overflow = bubble.scrollHeight - bubble.clientHeight;
      const extraPadding = vh * 0.3; // 10% extra Platz, damit die Blase nicht direkt am Rand klebt

      // Kein Pinning: zu wenig Überlauf, Mobile oder reduzierte Bewegung
      if (reduceMotion || !isDesktop || overflow <= 4) {
        runway = 0;
        section.style.height = "";
        bubble.style.overflowY = "auto";
        bubble.scrollTop = 0;
        return;
      }

      // Aktiver Sticky-Modus
      bubble.style.overflowY = "hidden"; // versteckt den Scrollbalken
      runway = overflow * 1.5; // 1px Seiten-Scroll ≈ 1px Blasen-Scroll
      section.style.height = `${vh + runway + extraPadding}px`;
    };

    const onScroll = () => {
      if (runway <= 0) return;
      const top = section.getBoundingClientRect().top;
      const scrolled = Math.min(Math.max(-top, 0), runway);
      const progress = scrolled / runway; // 0 … 1
      const overflow = bubble.scrollHeight - bubble.clientHeight;
      bubble.scrollTop = progress * overflow;
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { sectionRef, bubbleRef };
}

export default function Home() {
  // Eine Hook-Instanz pro Sektion mit langer Sprechblase
  const ml = useStickyBubble(); // Section 2 – Machine Learning
  const xai = useStickyBubble(); // Section 3 – Explainable AI
  const shap = useStickyBubble(); // Section 4 – SHAP
  const lime = useStickyBubble(); // Section 5 – LIME

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

        <p className="mt-6 max-w-4xl text-lg text-white/70 mb-20 md:mb-32">
          Lerne die Welt der Künstlichen Intelligenz etwas besser kennen. Hier erklärt dir Pixel anhand von einem Maschien Learning Modell, 
          wie man mithilfe von Explainable AI die Entscheidungen von KI und Machine Learning Modellen besser verstehen und nachvollziehen kann.
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
            Hi, ich bin Pixel. Ich werde dich durch die Welt der KI und des Machine Learnings führen. 
            Lass es uns gemeinsam entdecken!
            <div className="absolute bottom-6 -left-2 w-4 h-4 bg-gray-200 rotate-45"></div>
          </div>

        </div>
      </section>

      {/* SECTION 2 - What is Machine Learning? */}
      <section ref={ml.sectionRef} className="relative min-h-screen bg-slate-800">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-20">

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
            <div className="w-full md:w-[40%] flex justify-center m-2">
              <ForestAnimation />
            </div>

            {/* SPEECH BUBBLE */}
            <div className="order-2 md:order-2 w-full md:w-[40%] flex justify-center">
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">

                {/* ARROW (Geschwister des Scrollers → scrollt nicht mit) */}
                <div className="
                  absolute z-20
                  w-5 h-5 bg-gray-200 rotate-45
                  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                  md:top-1/2 md:left-auto md:right-0 md:translate-x-1/2 md:-translate-y-1/2
                "></div>

                {/* SCROLLER */}
                <div ref={ml.bubbleRef} className="max-h-[350px] overflow-y-auto">
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
                </div>
              </div>
            </div>

            {/* CHARACTER*/}
            <div className="order-1 md:order-3">
              <Character src="/pixel5L.png" alt="Pixel" loading="eager" />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 - Explainable AI */}
      <section ref={xai.sectionRef} className="relative min-h-screen bg-violet-950">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-20">

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
            <Character src="/pixel1R.png"/>

            {/* SPEECH BUBBLE */}
            <div className="w-full md:w-[40%] flex justify-center">
              <div className="relative w-full max-w-[440px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">
                <div className="
                  absolute 
                  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                  md:top-1/2 md:left-0 md:-translate-x-1/2 md:-translate-y-1/2
                  w-5 h-5 bg-gray-200 rotate-45"></div>                
                  <div ref={xai.bubbleRef} className="max-h-[400px] overflow-y-auto">
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
                </div>
              </div>
            </div>

            {/* MODEL */}
            <div className="w-full md:w-[40%] flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <div className="absolute inset-0 flex items-center justify-center">
                    <ExplainableAIDiagram />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 - SHAP */}
      <section ref={shap.sectionRef} className="relative min-h-screen bg-violet-900">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-15">

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
            <div className="order-3 md:order-1 w-full md:w-[40%] flex justify-center min-h-0 max-h-[460px]">
              <FootballField />
            </div>

            {/* SPEECH BUBBLE */}
            <div className="order-2 md:order-2 w-full md:w-[40%] flex justify-center min-h-0">

              <div className="relative w-full max-w-[420px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">

                {/* SPEECH TRIANGLE */}
                <div className="
                  absolute z-20
                  w-5 h-5 bg-gray-200 rotate-45
                  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                  md:top-1/2 md:left-auto md:right-0 md:translate-x-1/2 md:-translate-y-1/2
                "></div>

                <div ref={shap.bubbleRef} className="max-h-[400px] overflow-y-auto">

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
                </div>
              </div>
            </div>

            {/* CHARACTER */}
            <div className="order-1 md:order-3">
              <Character src="/pixel2L.png" />
            </div>

          </div>

          {/* FOOTER BUTTON */}
          <div className="mt-5 flex justify-end">

            <a
              href="/tryPage_shap"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-300 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-cyan-400 transition-colors"
            >
              Try it out! ➔
            </a>

          </div>

        </div>
      </section>

      {/* SECTION 5 - LIME */}
      <section ref={lime.sectionRef} className="relative min-h-screen bg-violet-800">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center px-6 py-15">

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
            <Character src="/pixel5R.png"/>

            {/* SPEECH BUBBLE */}
            <div className="w-full md:w-[40%] flex justify-center">
              <div className="relative w-full max-w-[440px] rounded-3xl bg-gray-200 text-black px-6 py-5 text-base shadow-2xl">
                <div className="
                  absolute 
                  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                  md:top-1/2 md:-left-0 md:-translate-y-1/2
                  w-5 h-5 bg-gray-200 rotate-45">
                </div>
                <div ref={lime.bubbleRef} className="max-h-[400px] overflow-y-auto">
                  Jetzt schauen wir uns <b>LIME</b> an. 🔍
                  <br /><br />
                  LIME hilft uns zu verstehen, warum ein Modell genau bei einem 
                  einzelnen Beispiel so entschieden hat. Dabei wird nicht das ganze 
                  Modell erklärt, sondern nur die Entscheidung für diesen einen 
                  konkreten Fall.
                  <br />
                  Stell dir vor, wir untersuchen <b>einen bestimmten Spielzug</b> in einem Fußballspiel.
                  LIME schaut sich nur diesen einen Spielzug an und erklärt, warum er so gelaufen ist, 
                  anstatt das ganze Spiel zu analysieren.
                  <br /><br />
                  Auch LIME schaut sich an, wie sich die Vorhersage verändert, wenn man bestimmte Merkmale weglässt oder verändert. Aber im Gegensatz zu SHAP konzentriert sich LIME nur auf die Umgebung eines einzelnen Beispiels und erklärt genau diese lokale Entscheidung.
                  <br /><br />
                  <b>Jetzt bist du dran!</b>
                  <br />
                  In der interaktiven Ansicht kannst du einzelne Bestandteile 
                  des Spielzugs verändern:
                  <br />
                  Spielerposition ändern
                  <br />
                  Pass entfernen
                  <br />
                  Schusskraft erhöhen
                  <br /><br />
                  Sobald du etwas änderst, siehst du direkt, wie sich die Vorhersage 
                  verändert.
                  <br /><br />
                  Welche veränderung hat das Ergebnis beeinflusst? 
                  Welche Merkmale waren besonders wichtig für diese eine Entscheidung?
                  <br /><br />
                  LIME arbeitet also wie eine Lupe für Einzelfälle.
                  Es schaut sich nur die Umgebung eines Beispiels an und erklärt 
                  genau diese lokale Entscheidung – einfach und nachvollziehbar. 
                  <br /><br /> 
                  <b>Probiere shap an einem Echten Datensatz aus</b> und schau dir die Werte an!
                  Klicke auf den Button "Try it out!" und entdecke es selbst! 🚀
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
        </div>
      </section>

      {/* SECTION 6 - CONGRATULATIONS */}
      <section className="min-h-screen bg-violet-950 flex flex-col justify-center items-center px-6 py-20">

        <div className="relative max-w-2xl items-center justify-center flex flex-col gap-1">
          <h2 className="text-4xl md:text-6xl font-bold text-center">
            DU HAST ES GESCHAFFT!
          </h2>

          <PixelAnimation
            frames={[
              "/pixel_dancing1.png",
              "/pixel_dancing2.png",
              "/pixel_dancing3.png",
              "/pixel_dancing4.png",
            ]}
            interval={300}
            size="xl:w-[20vw] xl:h-[20vw]"
          />
        
          <p className="max-w-2xl text-lg text-white/70 text-center">
            Glückwunsch! Du hast deine ersten Schritte in die Welt der 
            Explainable AI gemacht. Bleib neugierig, stelle Fragen und vor allem: 
            Hab Spaß beim Lernen! 🚀✨
          </p>
        </div>

      </section>

    </main>
  );
}