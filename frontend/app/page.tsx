import Image from "next/image";

export default function Home() {
  return (
    <main>

      {/* SECTION 1 */}
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
        <div className="absolute left-20 bottom-10 flex items-end gap-2">

          <Image
            src="/pixel1.png"
            alt="AI Guide"
            width={140}
            height={140}
            className="w-28 md:w-40 h-auto"
            priority
          />

          <div className="relative mb-20 max-w-[240px] rounded-2xl bg-gray-200 text-black px-4 py-3 text-sm shadow-xl">
            Hi, I'm Pixel. I will guide you through the world of AI and Machine Learning. Let's explore together!

            <div className="absolute bottom-4 -left-2 w-4 h-4 bg-gray-200 rotate-45"></div>
          </div>

        </div>
      </section>

      {/* SECTION 2 */}
      <section className="min-h-screen bg-slate-900 flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-5xl font-bold">
            What is Machine Learning?
          </h2>

          <p className="mt-6 text-white/70 max-w-2xl">
            Machines learn patterns from data instead of being explicitly programmed.
          </p>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="min-h-screen bg-violet-950 flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-5xl font-bold">
            Explainable AI
          </h2>

          <p className="mt-6 text-white/70 max-w-2xl">
            Understand why models make decisions.
          </p>
        </div>
      </section>

    </main>
  );
}