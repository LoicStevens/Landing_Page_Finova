import { useEffect, useRef, useState } from "react";
import { Code2, BarChart2, Search, Users, ChevronRight, MessageCircle } from "lucide-react";

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

const SERVICES = [
  {
    icon: Code2, color: "#4EF2FF",
    title: "Custom EA Development",
    process: "Strategy → Prototype → Backtest → Forward Test → Delivery",
    desc: "We build a fully automated Expert Advisor from your trading idea to a ready-to-deploy .ex5 file. Includes documentation and configuration guide.",
    pricing: "Quote on request",
  },
  {
    icon: BarChart2, color: "#C9A94A",
    title: "Strategy Backtesting",
    process: "Strategy analysis → MT5 testing → Full report",
    desc: "Rigorous historical validation on MT5 Strategy Tester. Delivered with a complete report: PF, Sharpe, DD, win rate, equity curve.",
    pricing: "Quote based on complexity",
  },
  {
    icon: Search, color: "#4EF2FF",
    title: "EA Audit & Optimisation",
    process: "Code review → Bug fix → Parameter optimisation",
    desc: "Full review of an existing EA — bug fixes, parameter tuning, performance improvements. Ideal if your EA isn't performing as expected.",
    pricing: "Quote on request",
  },
  {
    icon: Users, color: "#C9A94A",
    title: "1-on-1 Sessions",
    process: "Live market analysis with a Finova analyst",
    desc: "Personalised session adapted to your level: strategy review, EA setup, risk management guidance or live trading walk-through.",
    pricing: "Quote on request",
  },
];

export default function Consulting() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Simple redirect to WhatsApp with prefilled message
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const service = fd.get("service") as string;
    const desc = fd.get("description") as string;
    const msg = encodeURIComponent(`Hi Finova Capital,\n\nName: ${name}\nService: ${service}\n\nDetails:\n${desc}`);
    window.open(`https://wa.me/237698639717?text=${msg}`, "_blank");
    setSent(true);
    setSubmitting(false);
  };

  return (
    <main className="bg-black text-white min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,169,74,0.07),transparent_55%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#C9A94A] text-sm font-semibold tracking-widest mb-3">TAILORED SOLUTIONS</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Consulting</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Custom algorithmic solutions for serious traders.
              Every strategy is unique. We build yours.
            </p>
          </div>
        </Reveal>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {SERVICES.map(({ icon: Icon, color, title, process, desc, pricing }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="h-full flex flex-col p-7 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-xl font-bold mb-1">{title}</h3>
                <p className="text-xs text-gray-500 mb-3 font-medium">{process}</p>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">{desc}</p>
                <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{pricing}</span>
                  <a href="https://wa.me/237698639717" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#4EF2FF] text-sm font-medium hover:underline">
                    Request quote <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Request form */}
        <Reveal delay={200}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold mb-4">Send a request</h2>
              <p className="text-gray-400 mb-6">
                Describe your need — we'll get back to you via WhatsApp within 24 hours.
              </p>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-950/40 border border-green-500/25">
                <MessageCircle size={20} className="text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-400">Prefer direct contact?</p>
                  <a href="https://wa.me/237698639717" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-white transition">
                    WhatsApp: +237 698 639 717
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/4 rounded-2xl border border-white/10 p-8 flex flex-col gap-5">
              <input name="name" placeholder="Your name" required
                className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#4EF2FF]/60 transition" />
              <input name="email" type="email" placeholder="Email address" required
                className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#4EF2FF]/60 transition" />
              <select name="service" required
                className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#4EF2FF]/60 transition">
                <option value="">Select a service</option>
                {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
              </select>
              <textarea name="description" placeholder="Describe your need, budget and timeline..." rows={4} required
                className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#4EF2FF]/60 transition resize-none" />
              <button type="submit" disabled={submitting || sent}
                className="w-full py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-[#C9A94A] to-[#a8882e] hover:opacity-90 transition disabled:opacity-60">
                {sent ? "Request sent — we'll reply shortly ✓" : "Send request via WhatsApp"}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
