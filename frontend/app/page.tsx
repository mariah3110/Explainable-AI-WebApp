export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      
      <span className="mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
        🚀 Explainable AI made simple
      </span>

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

      <div className="mt-10 flex gap-4">
        <button className="rounded-xl bg-violet-600 px-6 py-3 font-medium hover:bg-violet-500 transition">
          Start Learning
        </button>

        <button className="rounded-xl border border-white/10 px-6 py-3 hover:bg-white/5 transition">
          Explore Topics
        </button>
      </div>
    </main>
  );
}