export default function TryPage_shap() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-4 py-6 sm:py-8 md:py-10">
      
      {/* HEADER */}
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold">
          Try{" "}
          <span className="bg-gradient-to-r from-purple-500 to-cyan-300 bg-clip-text text-transparent">
            SAPE
          </span>
        </h1>
      </div>
      
      {/* CONTENT */}
      <div className="w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 xl:gap-10">

        {/* NAVIGATION */}
        <div className="w-full md:w-[45%] xl:w-[40%] flex flex-col rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-5 md:p-6 xl:p-8">
          
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 text-center">
            NAVIGATION
          </h3>

          <p className="text-xs sm:text-sm text-white/70 text-center mb-4 sm:mb-6">
            Select a dataset to explore its features.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="relative group">
              <button className="px-3 py-2 sm:px-4 bg-white/10 rounded-md hover:bg-white/20">
              Dataset 1
            </button>

            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                            opacity-0 group-hover:opacity-100 transition
                            bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Customer dataset with 10k rows
            </div>
          </div>

            <div className="relative group">
              <button className="px-3 py-2 sm:px-4 bg-white/10 rounded-md hover:bg-white/20">
                Dataset 2
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                              opacity-0 group-hover:opacity-100 transition
                              bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Sales dataset with 5k rows
              </div>
            </div>

            <div className="relative group">
              <button className="px-3 py-2 sm:px-4 bg-white/10 rounded-md hover:bg-white/20">
                Dataset 3
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                              opacity-0 group-hover:opacity-100 transition
                              bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Product dataset with 8k rows
              </div>
            </div>
          </div>

          {/* MODEL BOX */}
          <div className="w-full min-h-[120px] sm:min-h-[160px] md:min-h-[220px] xl:min-h-[260px] rounded-md border border-white/10 mb-4 sm:mb-6 flex items-center justify-center">
            MODEL
          </div>

          <p className="text-xs sm:text-sm text-white/70 text-center mb-3 sm:mb-4">
            Click the button to use SAPE on the selected dataset and look at the feature importance.
          </p>

          <button className="mx-auto text-base sm:text-lg md:text-xl font-bold px-3 py-2 sm:px-4 w-[30%] bg-gradient-to-r from-purple-700 to-cyan-600 rounded-md hover:from-purple-600 hover:to-cyan-400">
            SHAPE
          </button>

        </div>

        {/* MODEL */}
        <div className="w-full md:w-[55%] xl:w-[60%] min-h-[200px] sm:min-h-[300px] md:min-h-[350px] xl:min-h-[450px] flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-6">
          MODEL
        </div>

      </div>
      
    </main>
  );
}