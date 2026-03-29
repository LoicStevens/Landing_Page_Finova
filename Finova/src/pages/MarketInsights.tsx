import { useEffect, useRef, useState } from "react";
import { TrendingUp, Zap, Calendar, BarChart2, ExternalLink, ChevronRight } from "lucide-react";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>{children}</div>
  );
}

const CATEGORIES = [
  {
    icon: TrendingUp, color: "#4EF2FF",
    title: "Weekly Analysis",
    desc: "Market structure breakdown published every Monday before the open. Key levels, LBS configuration for the week, bias.",
    status: "Coming soon",
  },
  {
    icon: Zap, color: "#C9A94A",
    title: "Flash Signals",
    desc: "Real-time breakout alerts on key levels. Published on Telegram @FinoCap and X @FinoCap_ — join us there.",
    status: "Live on Telegram",
    link: "https://t.me/FinoCap",
    linkLabel: "Join @FinoCap",
  },
  {
    icon: Calendar, color: "#4EF2FF",
    title: "Economic Calendar",
    desc: "High-impact news preview with expected volatility zones for assets traded by LBS.",
    status: "Coming soon",
  },
  {
    icon: BarChart2, color: "#C9A94A",
    title: "Trade Reviews",
    desc: "Post-trade analysis on every closed LBS position. Chart screenshot, entry rationale, result and lessons.",
    status: "Coming soon",
  },
];

export default function MarketInsights() {
  return (
    <main className="bg-black text-white min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(78,242,255,0.07),transparent_55%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#C9A94A] text-sm font-semibold tracking-widest mb-3">ANALYSIS · SIGNALS · CONTEXT</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Market Insights</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Educational content, trade reviews and real-time signals —
              the content layer of our 80/20 strategy.
            </p>
          </div>
        </Reveal>

        {/* Telegram CTA — immediate value */}
        <Reveal delay={80}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-7 rounded-2xl bg-[#1A2535] border border-[#4EF2FF]/25 mb-14">
            <div>
              <p className="text-[#4EF2FF] text-sm font-semibold tracking-widest mb-1">LIVE NOW</p>
              <h3 className="text-xl font-bold">Flash signals and early announcements on Telegram</h3>
              <p className="text-gray-400 text-sm mt-1">LBS launch, FTMO updates, market alerts — all in real time.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a href="https://t.me/FinoCap" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4EF2FF] text-black font-semibold text-sm hover:opacity-90 transition">
                Join Telegram <ExternalLink size={14} />
              </a>
              <a href="https://x.com/FinoCap_" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition">
                Follow on X <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {CATEGORIES.map(({ icon: Icon, color, title, desc, status, link, linkLabel }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="h-full p-7 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    status.includes("Live") ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-white/5 text-gray-400 border border-white/10"
                  }`}>{status}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-[#4EF2FF] text-sm font-medium hover:underline">
                    {linkLabel} <ChevronRight size={13} />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Coming soon notice */}
        <Reveal delay={200}>
          <div className="text-center p-10 rounded-2xl bg-white/2 border border-white/6">
            <p className="text-2xl font-bold mb-3">Articles & Trade Reviews — Coming soon</p>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              The full editorial hub launches after LBS goes live. Subscribe to our channels
              to receive every analysis and trade review as it's published.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="https://t.me/FinoCap" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#26A5E4]/15 border border-[#26A5E4]/30 text-[#26A5E4] text-sm font-medium hover:bg-[#26A5E4]/25 transition">
                Telegram <ExternalLink size={13} />
              </a>
              <a href="https://x.com/FinoCap_" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/8 border border-white/15 text-white text-sm font-medium hover:bg-white/12 transition">
                X (Twitter) <ExternalLink size={13} />
              </a>
              <a href="https://youtube.com/@finocap-z9i" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/25 transition">
                YouTube <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
