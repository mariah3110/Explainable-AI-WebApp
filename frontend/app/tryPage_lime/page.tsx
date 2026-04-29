export default function TryPage_lime() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">Try 
          <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent">
            {" "}LIME
          </span>
        </h1>
      </div>
      
      {/* CONTENT ROW */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center px-5">
      
        {/* NAVIGATION */}
        <div className="w-full md:w-[30%] flex justify-center">
          <div className="relative w-full max-h-[400px] max-w-[90%] aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="absolute inset-0 flex items-center justify-center">
              MODEL
            </div>
          </div>
        </div>
        
        {/* MODEL */}
        <div className="w-full md:w-[70%] flex justify-center">
          <div className="relative w-full max-h-[400px] max-w-[90%] aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="absolute inset-0 flex items-center justify-center">
              MODEL
            </div>
          </div>
        </div>

      </div>
      
    </main>
  );
}