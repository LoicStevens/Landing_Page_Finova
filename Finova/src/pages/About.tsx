import { useEffect, useRef, useState } from "react";
import { Shield, Eye, Lightbulb, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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

const TEAM = [
  { name: "Benjamin", role: "Leader & Tech", mission: "Strategic vision and technical excellence of our products." },
  { name: "Loïc", role: "Ops & Trading", mission: "Execute the roadmap and ensure trading performance." },
  { name: "Christian", role: "Dev QA", mission: "Operational support for the technical team." },
  { name: "Arthur", role: "Trader Analyst", mission: "Market analysis and operational monitoring." },
  { name: "Alex L.", role: "Marketing", mission: "Define the brand voice and plan high-value content." },
  { name: "Willyane", role: "Community", mission: "Execute the strategy and manage leads daily." },
  { name: "Steve", role: "Design", mission: "Define and embody Finova Capital's visual identity." },
];

const VALUES = [
  { icon: Shield, color: "#4EF2FF", title: "Discipline", desc: "Structured risk and money management strategy. Every rule is enforced systematically, without exception, without emotion." },
  { icon: Eye, color: "#C9A94A", title: "Transparency", desc: "Live results published publicly. Verified on Myfxbook. We show the losses alongside the wins." },
  { icon: Lightbulb, color: "#4EF2FF", title: "Competence", desc: "7 years of backtested data across 5 markets, with 85–100% tick quality. Results that stand up to scrutiny." },
];

const ROADMAP = [
  { phase: "Phase 1", period: "0–12 months", items: ["Expert Advisors (LBS, Kingsley)", "Trading Signals", "Custom Backtesting", "Prop Firm Trading", "Consulting"], active: true },
  { phase: "Phase 2", period: "12–36 months", items: ["Finova Academy", "Copy Trading", "Market Insights", "Scale community"], active: false },
  { phase: "Phase 3", period: "Month 36+", items: ["PAMM Platform", "Asset Management", "Institutional Capital"], active: false },
];

export default function About() {
  return (
    <main className="bg-black text-white min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(78,242,255,0.07),transparent_55%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#4EF2FF] text-sm font-semibold tracking-widest mb-3">WHO WE ARE</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Finova Capital</h1>
            <p className="text-gray-400 text-xl font-light">Discipline. Transparency. Competence.</p>
          </div>
        </Reveal>

        {/* Origin */}
        <Reveal delay={80}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-2xl bg-white/3 border border-white/8">
              <h2 className="text-2xl font-bold text-[#C9A94A] mb-4">Our story</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Finova Capital was founded in January 2026 with a single conviction: access to disciplined,
                automated trading should not be reserved for institutions. Retail traders deserve the same
                level of rigour — systematic rules, verified results, no emotion.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We are a team of developers, traders and marketers. Our first product, the Layered Breakout System,
                is already running live on a real FTMO challenge account — results visible publicly on Myfxbook.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-[#0A1628] border border-[#4EF2FF]/15">
              <h2 className="text-2xl font-bold text-[#4EF2FF] mb-4">Our long-term vision</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We are building towards a PAMM asset management platform — a bridge between individual savings
                and financial market opportunities. Transparent, automated, accessible to everyone.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This vision requires 18+ months of verified track record, a loyal community, and validated
                operational capacity. Every product we launch today is a step toward that goal.
              </p>
              <div className="mt-6 pt-4 border-t border-white/8">
                <div className="text-sm font-semibold text-[#C9A94A]">"From Savings To Freedom"</div>
                <div className="text-xs text-gray-500 mt-1">Finova Capital motto</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Honest stats */}
        <Reveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {[
              { value: "2", label: "Expert Advisors" },
              { value: "1", label: "FTMO Challenge Live" },
              { value: "7 yrs", label: "Data Backtested" },
              { value: "5", label: "Markets Covered" },
              { value: "Jan 2026", label: "Founded" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center p-5 rounded-xl bg-white/3 border border-white/8">
                <div className="text-2xl font-bold text-[#4EF2FF]">{value}</div>
                <div className="text-gray-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Values */}
        <Reveal delay={120}>
          <h2 className="text-3xl font-bold mb-8">Our values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {VALUES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="p-7 rounded-2xl bg-white/3 border border-white/8 hover:bg-white/5 transition">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Team */}
        <Reveal delay={140}>
          <h2 className="text-3xl font-bold mb-3">The team</h2>
          <p className="text-gray-400 mb-8 text-sm">An operational team of 7 people across strategy, technology, trading and marketing.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {TEAM.map(({ name, role, mission }, i) => (
              <Reveal key={name} delay={i * 50}>
                <div className="p-5 rounded-xl bg-white/3 border border-white/8 hover:bg-white/5 transition h-full">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-[#0A1628] border border-[#4EF2FF]/30 flex items-center justify-center mb-4">
                    <span className="text-[#4EF2FF] font-bold text-lg">{name[0]}</span>
                  </div>
                  <div className="font-bold text-sm">{name}</div>
                  <div className="text-[#C9A94A] text-xs font-medium mt-0.5 mb-2">{role}</div>
                  <p className="text-gray-400 text-xs leading-relaxed">{mission}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center mb-16">Team photos coming soon.</p>
        </Reveal>

        {/* Roadmap */}
        <Reveal delay={160}>
          <h2 className="text-3xl font-bold mb-8">Strategic roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROADMAP.map(({ phase, period, items, active }) => (
              <div key={phase} className={`p-7 rounded-2xl border ${active ? "border-[#4EF2FF]/30 bg-[#0A1628]" : "border-white/8 bg-white/2 opacity-70"}`}>
                <div className="flex items-center gap-2 mb-1">
                  {active && <span className="w-2 h-2 rounded-full bg-[#4EF2FF] animate-pulse" />}
                  <span className={`text-sm font-semibold ${active ? "text-[#4EF2FF]" : "text-gray-400"}`}>{phase}</span>
                </div>
                <div className="text-xs text-gray-500 mb-4">{period}</div>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <ChevronRight size={13} className={active ? "text-[#4EF2FF]" : "text-gray-600"} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={180}>
          <div className="mt-16 text-center">
            <Link to="/trading-tools"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-[#4EF2FF] to-[#0EA5E9] text-black hover:opacity-90 transition">
              Discover our tools <ChevronRight size={18} />
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
