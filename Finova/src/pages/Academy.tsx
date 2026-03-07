import { useState, useEffect, useRef } from "react";
import { Loader2, BookOpen, TrendingUp, Shield, Brain, BarChart2, Zap, Lock, ChevronRight } from "lucide-react";
import { FiMail, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

// ── Scroll reveal hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

// ── Animated wrapper ────────────────────────────────────────────────────────
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

function Reveal({ children, delay = 0, direction = "up", className = "" }: RevealProps) {
  const [ref, inView] = useInView();

  const dirMap = {
    up: "translate-y-10",
    left: "-translate-x-10",
    right: "translate-x-10",
    none: "",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${dirMap[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── Animated counter ────────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [ref, inView] = useInView(0.3);
  const [displayed, setDisplayed] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    if (isNaN(numeric)) { setDisplayed(value); return; }

    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numeric);
      setDisplayed(current + suffix);
      if (step >= steps) {
        setDisplayed(value);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div
        className={`text-3xl md:text-4xl font-bold text-[#4EF2FF] transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {displayed}
      </div>
      <div className="text-white/40 text-base mt-1">{label}</div>
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const pillars = [
  {
    icon: TrendingUp,
    title: "Algorithmic Trading",
    description: "Build, backtest and deploy automated trading strategies using Python and quantitative models.",
    modules: ["Intro to Algo Trading", "Strategy Backtesting", "Live Deployment"],
    color: "from-[#4EF2FF]/20 to-transparent",
  },
  {
    icon: BarChart2,
    title: "Quantitative Finance",
    description: "Master statistical models, derivatives pricing, and portfolio optimization techniques.",
    modules: ["Statistical Arbitrage", "Options Pricing", "Portfolio Theory"],
    color: "from-[#0EA5E9]/20 to-transparent",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Learn professional risk control methods used by top hedge funds and trading firms.",
    modules: ["Position Sizing", "Drawdown Control", "VaR & Stress Testing"],
    color: "from-[#4EF2FF]/15 to-transparent",
  },
  {
    icon: Brain,
    title: "Market Psychology",
    description: "Understand behavioral finance and master the mental edge that separates elite traders.",
    modules: ["Trading Psychology", "Bias Elimination", "Discipline Systems"],
    color: "from-[#0EA5E9]/15 to-transparent",
  },
  {
    icon: Zap,
    title: "High-Frequency Strategies",
    description: "Explore market microstructure, order flow analysis and latency-sensitive strategies.",
    modules: ["Order Flow Analysis", "Market Making", "Latency Optimization"],
    color: "from-[#4EF2FF]/20 to-transparent",
  },
  {
    icon: BookOpen,
    title: "Fundamental Analysis",
    description: "Combine macro economics and company fundamentals with quantitative signals.",
    modules: ["Macro Economics", "Earnings Analysis", "Quant-Fundamental Blend"],
    color: "from-[#0EA5E9]/20 to-transparent",
  },
];

const stats = [
  { value: "2400+", label: "Students enrolled" },
  { value: "48", label: "Courses & modules" },
  { value: "320h+", label: "Hours of content" },
  { value: "94%", label: "Satisfaction rate" },
];

const levels = [
  { label: "Beginner", desc: "No prior experience needed", available: true },
  { label: "Intermediate", desc: "Basic trading knowledge required", available: true },
  { label: "Advanced", desc: "Quantitative background recommended", available: false },
  { label: "Pro Mentorship", desc: "1-on-1 sessions with Finova analysts", available: false },
];

// ── Page ────────────────────────────────────────────────────────────────────
export default function Academy() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Hero entrance animation on mount
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "academy_waitlist"), {
        email: trimmed,
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } catch (err: any) {
      setError(`Error: ${err?.code ?? err?.message ?? "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(78,242,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('/grid.svg')] bg-repeat" />

        {/* Parallax glow blobs */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-[#4EF2FF]/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-32 w-80 h-80 bg-[#0EA5E9]/8 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`transition-all duration-700 ease-out ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="inline-block text-[#4EF2FF] text-sm font-semibold tracking-[0.3em] uppercase mb-4 px-4 py-1.5 rounded-full border border-[#4EF2FF]/20 bg-[#4EF2FF]/5">
              Finova Academy
            </span>
          </div>

          {/* Headline */}
          <div
            className={`transition-all duration-700 ease-out ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "120ms" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mt-4">
              Master the{" "}
              <span className="bg-gradient-to-r from-[#4EF2FF] to-[#38bdf8] bg-clip-text text-transparent">
                Markets
              </span>
              <br />
              like a Pro
            </h1>
          </div>

          {/* Sub */}
          <div
            className={`transition-all duration-700 ease-out ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "240ms" }}
          >
            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
              World-class education in algorithmic trading, quantitative finance
              and risk management — built by Finova Capital analysts.
            </p>
          </div>

          {/* CTAs */}
          <div
            className={`transition-all duration-700 ease-out ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "360ms" }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <a
                href="#waitlist"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#3EE8FF] to-[#0EA5E9] text-black font-bold text-base hover:opacity-90 hover:shadow-[0_0_30px_rgba(78,242,255,0.4)] transition"
              >
                Join the Waitlist
              </a>
              <a
                href="#programs"
                className="px-8 py-3.5 rounded-full border border-[#4EF2FF]/30 text-[#4EF2FF] font-semibold text-base hover:bg-[#4EF2FF]/5 transition flex items-center gap-2"
              >
                Explore Programs <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-px bg-gradient-to-r from-transparent via-[#4EF2FF]/40 to-transparent" />
      </section>

      {/* ── STATS ── */}
      <section className="py-14 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section id="programs" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">
              What You'll{" "}
              <span className="bg-gradient-to-r from-[#4EF2FF] to-[#38bdf8] bg-clip-text text-transparent">
                Learn
              </span>
            </h2>
            <p className="text-white/40 text-base mt-3 max-w-xl mx-auto">
              Six core pillars covering every dimension of professional trading.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} direction="up">
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#4EF2FF]/30 hover:shadow-[0_0_30px_rgba(78,242,255,0.06)] transition group overflow-hidden h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition duration-500`} />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#4EF2FF]/10 border border-[#4EF2FF]/20 flex items-center justify-center mb-4">
                      <p.icon size={20} className="text-[#4EF2FF]" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{p.title}</h3>
                    <p className="text-white/40 text-base leading-relaxed mb-4">{p.description}</p>
                    <ul className="space-y-1.5">
                      {p.modules.map((m) => (
                        <li key={m} className="flex items-center gap-2 text-sm text-white/50">
                          <span className="w-1 h-1 rounded-full bg-[#4EF2FF]/60 shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEVELS ── */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              For Every{" "}
              <span className="bg-gradient-to-r from-[#4EF2FF] to-[#38bdf8] bg-clip-text text-transparent">
                Level
              </span>
            </h2>
            <p className="text-white/40 text-base mt-3">From first trade to institutional strategies.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {levels.map((level, i) => (
              <Reveal key={level.label} delay={i * 100} direction="up">
                <div
                  className={`relative rounded-2xl border p-6 transition h-full ${
                    level.available
                      ? "bg-white/5 border-white/10 hover:border-[#4EF2FF]/30"
                      : "bg-white/[0.02] border-white/5 opacity-60"
                  }`}
                >
                  {!level.available && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 text-xs text-white/30 border border-white/10 rounded-full px-2 py-0.5">
                        <Lock size={9} /> Soon
                      </span>
                    </div>
                  )}
                  <h3 className={`font-bold text-base mb-1 ${level.available ? "text-white" : "text-white/40"}`}>
                    {level.label}
                  </h3>
                  <p className="text-white/30 text-sm">{level.desc}</p>
                  {level.available && (
                    <div className="mt-4 w-2 h-2 rounded-full bg-[#4EF2FF] shadow-[0_0_8px_rgba(78,242,255,0.8)]" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(78,242,255,0.08),transparent_65%)]" />

        <Reveal className="relative z-10 max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Be the First to{" "}
            <span className="bg-gradient-to-r from-[#4EF2FF] to-[#38bdf8] bg-clip-text text-transparent">
              Access
            </span>
          </h2>
          <p className="text-white/40 text-base mb-10">
            Finova Academy launches soon. Join the waitlist and get early access + exclusive content.
          </p>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(78,242,255,0.06)]">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-full bg-[#4EF2FF]/10 border border-[#4EF2FF]/30 flex items-center justify-center">
                  <FiCheckCircle size={28} className="text-[#4EF2FF]" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">You're on the list!</p>
                  <p className="text-white/40 text-base mt-1">
                    We'll notify <span className="text-[#4EF2FF]">{email}</span> as soon as Academy launches.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-base rounded-xl px-4 py-3">
                    <FiAlertCircle size={15} className="shrink-0" />
                    {error}
                  </div>
                )}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4EF2FF]/50 focus-within:shadow-[0_0_0_1px_rgba(78,242,255,0.2)] transition">
                  <FiMail className="text-[#4EF2FF]/60 mr-3 shrink-0" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#3EE8FF] to-[#0EA5E9] text-black font-bold py-3 rounded-xl hover:opacity-90 hover:shadow-[0_0_20px_rgba(78,242,255,0.3)] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>
                <p className="text-white/20 text-sm">No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </Reveal>
      </section>

    </div>
  );
}
