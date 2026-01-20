export default function TrustSection() {
  const partners = [
    { name: "Bloomberg", logo: "/partners/bloomberg.png" },
    { name: "Nasdaq", logo: "/partners/nasdaq.png" },
    { name: "Binance", logo: "/partners/binance.png" },
    { name: "Citadel", logo: "/partners/citadel.png" },
    { name: "BlackRock", logo: "/partners/blackrock.png" },
  ];

  return (
    <section className="relative py-24 bg-black overflow-hidden">

      {/* Holographic glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4EF2FF]/5 to-transparent blur-3xl opacity-40"></div>

      <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
        
        {/* Section Title */}
        <h2 className="text-gray-400 uppercase tracking-[0.25em] text-sm mb-14">
          Trusted By Industry Leaders
        </h2>

        {/* LOGOS */}
        <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-10 md:gap-16">
          {partners.map((p, i) => (
            <div
              key={i}
              className="opacity-0 animate-fadeUp"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <img
                src={p.logo}
                alt={p.name}
                className="mx-auto w-32 opacity-70 hover:opacity-100 transition drop-shadow-[0_0_12px_rgba(78,242,255,0.25)]"
              />
            </div>
          ))}
        </div>

      </div>

      {/* FadeUp Animation */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.8s ease-out forwards;
        }
      `}</style>

    </section>
  );
}
