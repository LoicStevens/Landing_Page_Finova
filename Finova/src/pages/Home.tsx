import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, BookOpen, Copy, BarChart2, Briefcase, Trophy,
  ArrowRight, ChevronRight
} from "lucide-react";

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

function Reveal({ children, delay = 0, direction = "up", className = "" }: {
  children: React.ReactNode; delay?: number; direction?: "up"|"left"|"right"|"none"; className?: string;
}) {
  const [ref, inView] = useInView();
  const dir = { up: "translate-y-10", left: "-translate-x-10", right: "translate-x-10", none: "" }[direction];
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${dir}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const SERVICES = [
  { icon: TrendingUp, title: "Expert Advisors", desc: "Fully automated MT5 trading systems : built, backtested and ready to deploy.", href: "/trading-tools", color: "#4EF2FF" },
  { icon: BarChart2,  title: "Trading Signals", desc: "Real-time breakout alerts on key levels via Telegram and X.", href: "/market-insights", color: "#C9A94A" },
  { icon: Copy,       title: "Copy Trading", desc: "Mirror our live trades automatically on your account.", href: "/trading-tools", color: "#4EF2FF" },
  { icon: BookOpen,   title: "Finocap Academy", desc: "Education in algo trading, quant finance, risk management and more.", href: "/academy", color: "#C9A94A" },
  { icon: Briefcase,  title: "Consulting", desc: "Custom EA development, backtesting and 1-on-1 trading sessions.", href: "/consulting", color: "#4EF2FF" },
  { icon: Trophy,     title: "Prop Firm Trading", desc: "We trade FTMO challenges with our own systems. Results are public.", href: "/performance", color: "#C9A94A" },
];

// ── Données FTMO — à mettre à jour manuellement ──────────────────────────────
const FTMO_DATA = {
  profit: "+3%",
  maxDD: "-1.18%",
  target: "+10%",
  phase: "Phase 1",
  myfxbook: "https://www.myfxbook.com/members/Mecsimple/ftmo-challenge-25k/11932997",
};

export default function Home() {
  return (
    <main className="bg-black text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(78,242,255,0.10),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,169,74,0.07),transparent_55%)]" />

        {/* Hologram image */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 pointer-events-none">
          <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#4EF2FF]/20 blur-[120px] rounded-full animate-[finova-holo-glow_6s_ease-in-out_infinite]" />
          <img src="/chart-hologram.png" alt="" className="absolute right-8 top-1/2 -translate-y-1/2 w-[500px] opacity-80 mix-blend-screen animate-[finova-holo-float_6s_ease-in-out_infinite]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-[finova-fade-up_1s_ease-out_forwards]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4EF2FF] animate-pulse" />
              <span className="text-[#4EF2FF] text-sm font-medium tracking-wide">FINOVA CAPITAL</span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              From Savings<br />
              <span className="bg-gradient-to-r from-[#4EF2FF] to-[#C9A94A] bg-clip-text text-transparent">
                To Freedom
              </span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
              Finova Capital builds trading systems, financial education
              and performance tools designed to help you get the most out of the financial markets.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/trading-tools"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold bg-[#4EF2FF] text-black hover:opacity-90 transition shadow-lg shadow-[#4EF2FF]/25">
                Discover our tools
                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/about"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border border-[#4EF2FF]/40 text-[#4EF2FF] hover:bg-[#4EF2FF]/10 transition">
                Our philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-[#040D1A] border-y border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "+$403K", label: "Backtested Net Profit" },
            { value: "7 Years", label: "Historical Data" },
            { value: "4 Markets", label: "Assets Covered" },
            { value: "FTMO Live", label: "Challenge Running" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl md:text-3xl font-bold text-[#C9A94A]">{value}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOUVEAUTÉ LBS ─────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden border border-[#4EF2FF]/20 bg-gradient-to-br from-[#0A1628] to-[#040D1A] p-8 md:p-12">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#4EF2FF]/8 blur-[80px] rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#4EF2FF]/10 border border-[#4EF2FF]/30 px-3 py-1 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4EF2FF] animate-pulse" />
                  <span className="text-[#4EF2FF] text-xs font-semibold tracking-widest">LATEST RELEASE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Layered Breakout System <span className="text-[#4EF2FF]">v2.4</span>
                </h2>
                <p className="text-gray-300 max-w-xl">
                  Multi-asset Expert Advisor for MetaTrader 5. Institutional resistance zone detection,
                  automated breakout entries, precision risk management — across Forex, Gold, Crypto &amp; Equities.
                </p>
                <div className="flex flex-wrap gap-6 mt-6">
                  {[
                    { label: "Profit Factor", value: "> 1.5" },
                    { label: "Avg Sharpe", value: "2.28" },
                    { label: "Max Drawdown", value: "< 15%" },
                    { label: "Markets", value: "4" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xl font-bold text-[#C9A94A]">{value}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/trading-tools"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-gradient-to-r from-[#4EF2FF] to-[#0EA5E9] text-black whitespace-nowrap hover:opacity-90 transition shadow-lg">
                See LBS
                <ChevronRight size={18} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-[#C9A94A] text-sm font-semibold tracking-widest mb-3">WHAT WE OFFER</p>
            <h2 className="text-4xl md:text-5xl font-bold">Our Services</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              A complete ecosystem from automated trading tools to financial education,
              designed around the three phases of our evolution.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon: Icon, title, desc, href, color }, i) => (
            <Reveal key={title} delay={i * 80}>
              <Link to={href}
                className="group h-full flex flex-col p-7 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-[#4EF2FF]/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{desc}</p>
                <div className="flex items-center gap-1 mt-5 text-[#4EF2FF] text-sm font-medium">
                  Learn more
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FTMO LIVE ────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="rounded-2xl border border-green-500/25 bg-gradient-to-br from-green-950/40 to-[#040D1A] p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm font-semibold tracking-widest">FTMO CHALLENGE · LIVE</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">We run our own systems on live data.</h3>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{FTMO_DATA.profit}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Current Profit</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{FTMO_DATA.maxDD}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Max Drawdown</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{FTMO_DATA.target}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Target</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#4EF2FF]">{FTMO_DATA.phase}</div>
                    <div className="text-gray-400 text-xs mt-0.5">In Progress</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-4">Zero manual intervention. Fully automated since day one.</p>
              </div>
              <Link to="/performance"
                className="group flex items-center gap-2 px-7 py-3 rounded-full border border-green-500/40 text-green-400 font-medium hover:bg-green-500/10 transition whitespace-nowrap">
                View live results
                <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CTA GUIDE ────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <p className="text-[#C9A94A] text-sm font-semibold tracking-widest mb-4">FREE RESOURCE</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Are you making these critical algo trading mistakes?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            We put the 2 most destructive categories of errors in a free guide (
            and exactly how to fix them).
          </p>
          <Link to="/guide"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-[#C9A94A] to-[#a8882e] text-black hover:opacity-90 transition shadow-lg">
            Get the free guide
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>

    </main>
  );
}
