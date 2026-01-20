export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,242,255,0.12),transparent_70%)]"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.07] bg-[url('/grid.svg')] bg-repeat"></div>

      {/* HOLOGRAM CHART (Ultra Premium) */}
      <div className="absolute right-0 top-0 h-full w-[60%] pointer-events-none">

        {/* Glow behind hologram */}
        <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] 
                        bg-[#4EF2FF]/25 blur-[130px] rounded-full 
                        animate-[finova-holo-glow_6s_ease-in-out_infinite]"></div>

        {/* Holographic chart */}
        <img
          src="/chart-hologram.png"
          alt="Finova Hologram Chart"
          className="absolute right-10 top-1/2 -translate-y-1/2 w-[520px] 
                     opacity-90 mix-blend-screen pointer-events-none
                     animate-[finova-holo-float_6s_ease-in-out_infinite]"
        />
      </div>

      {/* Layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center h-full max-w-7xl mx-auto px-6">

        {/* LEFT SIDE – TEXT */}
        <div className="space-y-6 animate-[finova-fade-up_1.2s_ease-out_forwards]">

          <p className="text-[#4EF2FF] font-semibold text-lg tracking-wide">
            FINOVA CAPITAL
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            The New Era <br />
            <span className="bg-gradient-to-r from-[#4EF2FF] to-white bg-clip-text text-transparent">
              of Quantitative Trading
            </span>
          </h1>

          <p className="text-gray-300 text-xl max-w-xl">
            Hedge Fund • Trading Automation <br />
            • Quant Intelligence • Financial Growth Strategy
          </p>

          <div className="flex gap-4 pt-4">
            <button className="px-7 py-3 rounded-full text-lg font-semibold 
                bg-[#4EF2FF] text-black shadow-lg shadow-[#4EF2FF]/30 
                hover:shadow-[#4EF2FF]/50 transition">
              Get Started
            </button>

            <button className="px-7 py-3 rounded-full text-lg font-semibold border 
                border-[#4EF2FF] text-[#4EF2FF] 
                hover:bg-[#4EF2FF] hover:text-black transition">
              Join the Fund
            </button>
          </div>

        </div>

        {/* RIGHT SIDE – MAIN ILLUSTRATION */}
        <div className="relative hidden md:flex justify-center animate-[finova-fade-up_1.8s_ease-out_forwards]">
          <img
            src="/illustration.png"
            alt="Finova Trading Illustration"
            className="relative w-[90%] max-w-[500px] 
                       drop-shadow-[0_0_25px_rgba(78,242,255,0.35)]
                       animate-[finova-holo-float_7s_ease-in-out_infinite]"
          />
        </div>

      </div>
    </section>
  );
}
