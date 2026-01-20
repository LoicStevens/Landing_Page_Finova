  export default function CallToAction() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,242,255,0.12),transparent_70%)] blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">

        {/* MAIN TITLE */}
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Join <span className="text-[#4EF2FF]">FINOVA CAPITAL</span> Today
        </h2>

        <p className="text-gray-300 text-xl mt-6">
          Empower your financial future with institutional-grade intelligence.
        </p>

        {/* CTA BUTTON */}
        <div className="mt-10">
          <button
            className="
              px-10 py-4 text-lg font-semibold rounded-full
              bg-[#4EF2FF] text-black 
              shadow-[0_0_25px_rgba(78,242,255,0.45)]
              hover:shadow-[0_0_40px_rgba(78,242,255,0.65)]
              backdrop-blur-xl
              transition
            "
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
