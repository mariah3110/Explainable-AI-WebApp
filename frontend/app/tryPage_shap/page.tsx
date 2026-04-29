export default function TryPage_shap() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">Try 
          <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent">
            {" "}SAPE
          </span>
        </h1>
      </div>
      
      {/* CONTENT ROW */}
      <div className="w-full flex md:flex-row items-center px-10 gap-10">
      
        {/* NAVIGATION */}
        <div className="relative w-full md:w-[30%] flex items-center justify-center aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
              MODEL
        </div>
        
        {/* MODEL */}
        <div className="relative w-full md:w-[40%] flex items-center justify-center aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
              MODEL
        </div>

      </div>
      
    </main>
  );
}