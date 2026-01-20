import { Brain, LineChart, ShieldCheck, Coins } from "lucide-react";

export default function WhyFinova() {
  const benefits = [
    {
      title: "AI-Driven Quant Strategies",
      icon: <Brain className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "Our proprietary models analyze market micro-structures to detect high-probability opportunities with unmatched precision.",
    },
    {
      title: "Institution-Grade Risk Management",
      icon: <ShieldCheck className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "Multi-layer protection system designed to preserve capital through volatility and extreme market conditions.",
    },
    {
      title: "HFT-Inspired Execution",
      icon: <LineChart className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "Ultra-optimized execution engine inspired by high-frequency trading frameworks for maximum efficiency.",
    },
    {
      title: "Sustainable Long-Term Growth",
      icon: <Coins className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "We focus on compounding strategies that build stable and exponential value over time.",
    },
  ];

  return (
    <section className="relative py-28 bg-black overflow-hidden">

      {/* Holographic glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4EF2FF]/5 via-transparent to-[#4EF2FF]/5 opacity-40 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Why <span className="text-[#4EF2FF]">Finova?</span>
          </h2>
          <p className="text-gray-400 text-xl mt-4">
            A new standard for quantitative finance & autonomous trading.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="opacity-0 animate-fadeUp h-full"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                hover:border-[#4EF2FF]/40 transition group shadow-[0_0_25px_rgba(78,242,255,0.08)]
                h-full flex flex-col">
                
                <div className="mb-6 group-hover:scale-110 transition">
                  {b.icon}
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  {b.title}
                </h3>

                {/* DESCRIPTION — flex-grow pour égaliser la hauteur */}
                <p className="text-gray-400 leading-relaxed flex-grow">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FadeUp Animation */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.9s ease-out forwards;
        }
      `}</style>
      
    </section>
  );
}
