function App() {
  return (
    <div className="min-h-screen bg-obsidianDark text-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="z-10 text-center glass-panel p-12 rounded-3xl border border-white/5">
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-12 rounded-full border border-neon-cyan/50 shadow-glow-cyan flex items-center justify-center">
            <div className="w-4 h-4 bg-neon-cyan rounded-full animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-glow text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          THE CLINIC
        </h1>
        
        <p className="text-xl md:text-2xl text-white/50 tracking-wide font-light max-w-md mx-auto">
          Digital Emergency Room
        </p>
      </main>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-sm font-mono tracking-widest">
        SYSTEM.READY
      </div>
    </div>
  );
}

export default App;
