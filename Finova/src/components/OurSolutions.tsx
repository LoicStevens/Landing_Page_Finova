import { Cpu, BarChart3, Layers, Radar } from "lucide-react";

export default function OurSolutions() {
  const solutions = [
    {
      title: "Automated Quant Trading",
      icon: <Cpu className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "Fully autonomous trading engines powered by AI and microstructure analysis.",
    },
    {
      title: "Portfolio Optimization Suite",
      icon: <BarChart3 className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "Dynamic asset allocation models maximizing growth while minimizing drawdown.",
    },
    {
      title: "Risk Intelligence Layer",
      icon: <Radar className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "Real-time risk assessment modules using volatility clustering and anomaly detection.",
    },
    {
      title: "Market Pattern Engine",
      icon: <Layers className="w-10 h-10 text-[#4EF2FF]" />,
      desc: "Advanced pattern-recognition algorithms trained on 20+ years of market data.",
    },
  ];

  return (
    <section className="relative py-28 bg-black overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#4EF2FF]/5 to-black opacity-40 blur-3xl"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('/grid.svg')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Our <span className="text-[#4EF2FF]">Solutions</span>
          </h2>
          <p className="text-gray-400 text-xl mt-4 max-w-2xl mx-auto">
            Institutional-grade tools crafted for traders, funds, and financial innovators.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {solutions.map((s, i) => (
            <div
              key={i}
              className="opacity-0 animate-fadeUp"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="
                group relative p-8 rounded-2xl h-full
                bg-white/5 backdrop-blur-xl border border-white/10
                hover:border-[#4EF2FF]/40 transition
                shadow-[0_0_20px_rgba(78,242,255,0.1)]
                hover:shadow-[0_0_35px_rgba(78,242,255,0.25)]
                flex flex-col transform hover:-translate-y-3
                duration-300
              ">

                {/* Glow behind icon */}
                <div className="absolute top-6 left-6 w-14 h-14 rounded-full bg-[#4EF2FF]/20 blur-xl opacity-0 group-hover:opacity-60 transition"></div>

                {/* Icon */}
                <div className="relative mb-6 group-hover:scale-110 transition">
                  {s.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-4">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed flex-grow">
                  {s.desc}
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
