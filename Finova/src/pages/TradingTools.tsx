import { useState, useEffect, useRef, useMemo } from "react";
import {
  ExternalLink, TrendingUp, Shield, Zap, BarChart2,
  ChevronRight, Lock, Target, Clock,
  Activity, AlertTriangle, CheckCircle2, Loader2
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

// ── Scroll reveal hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// ── Reveal wrapper ──────────────────────────────────────────────────────────
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}
function Reveal({ children, delay = 0, direction = "up", className = "" }: RevealProps) {
  const [ref, inView] = useInView();
  const dirMap = { up: "translate-y-12", left: "-translate-x-12", right: "translate-x-12", none: "" };
  return (
    <div ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${dirMap[direction]}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Animated stat counter ────────────────────────────────────────────────────
function AnimatedStat({ value, label, color = "#4EF2FF" }: { value: string; label: string; color?: string }) {
  const [ref, inView] = useInView(0.3);
  const [displayed, setDisplayed] = useState("0");
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    if (isNaN(numeric)) { setDisplayed(value); return; }
    const steps = 50;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      const decimals = value.includes(".") ? 1 : 0;
      setDisplayed((numeric * eased).toFixed(decimals) + suffix);
      if (step >= steps) { setDisplayed(value); clearInterval(timer); }
    }, 1400 / steps);
    return () => clearInterval(timer);
  }, [inView, value]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-black" style={{ color }}>{displayed}</div>
      <div className="text-xs text-white/50 mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// ── Countdown digit block — with flip animation ──────────────────────────────
function DigitBlock({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 360);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div style={{ perspective: "500px" }}>
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-black text-[#C9A227]"
          style={{
            background: "linear-gradient(135deg, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0.05) 100%)",
            border: "1px solid rgba(201,162,39,0.45)",
            boxShadow: "0 0 24px rgba(201,162,39,0.22), inset 0 1px 0 rgba(201,162,39,0.15)",
            animation: flipping ? "digit-flip 0.36s ease-in-out" : undefined,
          }}
        >
          {str}
        </div>
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ── Pricing tier type ────────────────────────────────────────────────────────
interface Tier {
  label: string;
  range: string;
  price: string;
  color: string;
  current: boolean;
  locked: boolean;
  spotsLeft?: number;
}
const LBS_TIERS: Tier[] = [
  { label: "Early Access",   range: "First 15 purchases", price: "$97",  color: "#22c55e", current: true,  locked: false, spotsLeft: 15 },
  { label: "Founders Price", range: "Purchases 16–40",    price: "$167", color: "#3b82f6", current: false, locked: true  },
  { label: "Standard Price", range: "Purchases 41–100",   price: "$297", color: "#94a3b8", current: false, locked: true  },
  { label: "Full Price",     range: "From purchase 101",  price: "$497", color: "#6b7280", current: false, locked: true  },
];

// ── Particle field — deterministic positions (no re-render flicker) ──────────
function ParticleField({ color }: { color: string }) {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: (i * 47 + 13) % 100,
      y: (i * 31 + 7) % 100,
      size: 1.5 + (i % 3),
      duration: 6 + (i % 8),
      delay: i % 5,
    })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full opacity-25"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: color,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }} />
      ))}
    </div>
  );
}

// ── Backtest table with stagger entrance ─────────────────────────────────────
const BACKTEST_ROWS = [
  { asset: "XAUUSD", profit: "+$133K", pf: "2.44", dd: "12.64%", highlight: true  },
  { asset: "BTCUSD", profit: "+$148K", pf: "1.66", dd: "13.87%", highlight: false },
  { asset: "USDJPY", profit: "+$48K",  pf: "1.58", dd: "13.24%", highlight: false },
  { asset: "NVDA",   profit: "+$45K",  pf: "2.62", dd: "11.88%", highlight: false },
  { asset: "COST",   profit: "+$29K",  pf: "2.12", dd: "14.43%", highlight: false },
];
function BacktestTable() {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref}>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(78,242,255,0.12)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "rgba(78,242,255,0.08)" }}>
              {["Asset","Net P&L","PF","DD"].map((h, i) => (
                <th key={i} className={`${i === 0 ? "text-left" : "text-right"} px-3 py-2.5 text-[#4EF2FF]/70 text-sm font-bold uppercase tracking-wider`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BACKTEST_ROWS.map((row, i) => (
              <tr key={i}
                className="border-t border-white/5"
                style={{
                  background: row.highlight ? "rgba(78,242,255,0.04)" : undefined,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateX(0)" : "translateX(-14px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  transitionDelay: `${i * 75}ms`,
                }}>
                <td className="px-3 py-3 font-mono font-bold text-white/90 text-sm">{row.asset}</td>
                <td className="px-3 py-3 text-right font-bold text-sm" style={{ color: "#4EF2FF" }}>{row.profit}</td>
                <td className="px-3 py-3 text-right text-white/60 text-sm">{row.pf}</td>
                <td className="px-3 py-3 text-right text-white/60 text-sm">{row.dd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/40 mt-2 leading-relaxed">
        Conducted on MT5 Strategy Tester · 85–100% tick quality · 1% risk per trade · FTMO-compatible conditions
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function TradingTools() {
  const lbsLaunch = new Date("2026-03-30T09:00:00Z");
  const countdown = useCountdown(lbsLaunch);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [kHovered, setKHovered] = useState(false);
  const [lHovered, setLHovered] = useState(false);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyStatus("loading");
    const daysLeft = Math.max(0, Math.ceil((lbsLaunch.getTime() - Date.now()) / 86400000));
    try {
      await addDoc(collection(db, "lbs_waitlist"), { email: notifyEmail.trim(), createdAt: serverTimestamp() });
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_LBS_TEMPLATE_ID,
        { to_email: notifyEmail.trim(), days_remaining: daysLeft, launch_date: "March 30, 2026", early_price: "$97", spots_remaining: "15" },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setNotifyStatus("success");
      setNotifyEmail("");
    } catch (err: any) {
      console.error("LBS notify error:", err);
      setNotifyStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes float-particle {
          from { transform: translateY(0px) translateX(0px); }
          to   { transform: translateY(-22px) translateX(12px); }
        }
        @keyframes digit-flip {
          0%   { transform: rotateX(0deg) scale(1); }
          40%  { transform: rotateX(-80deg) scale(0.92); }
          60%  { transform: rotateX(80deg) scale(0.92); }
          100% { transform: rotateX(0deg) scale(1); }
        }
        @keyframes pulse-ring-hero {
          0%, 100% { transform: scale(1);    opacity: 0.07; }
          50%       { transform: scale(1.05); opacity: 0.16; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.38; }
        }
        @keyframes pulse-glow-gold {
          0%, 100% { box-shadow: 0 0 20px rgba(201,162,39,0.3); }
          50%       { box-shadow: 0 0 50px rgba(201,162,39,0.7); }
        }
        @keyframes pulse-glow-cyan {
          0%, 100% { box-shadow: 0 0 20px rgba(78,242,255,0.3); }
          50%       { box-shadow: 0 0 50px rgba(78,242,255,0.6); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes badge-pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #C9A227 0%, #F5D87A 40%, #C9A227 60%, #8B6914 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .shimmer-text-cyan {
          background: linear-gradient(90deg, #4EF2FF 0%, #a0f9ff 40%, #4EF2FF 60%, #0EA5E9 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .tier-current { animation: pulse-glow-gold 2s ease-in-out infinite; }
        .live-dot::before {
          content: '';
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 6px;
          animation: badge-pulse 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #4EF2FF 0%, transparent 70%)" }} />
        <div className="absolute top-20 left-[20%] w-72 h-72 rounded-full opacity-10 blur-[80px]"
          style={{ background: "#C9A227" }} />
        <div className="absolute top-20 right-[20%] w-72 h-72 rounded-full opacity-10 blur-[80px]"
          style={{ background: "#C9A227" }} />

        {/* Pulsing rings */}
        <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
          {[320, 480, 640].map((size, i) => (
            <div key={i} className="absolute rounded-full border border-[#4EF2FF]"
              style={{
                width: size, height: size, top: -size / 2, left: -size / 2,
                animation: `pulse-ring-hero ${3.5 + i * 0.8}s ease-in-out ${i * 0.7}s infinite`,
              }} />
          ))}
        </div>

        <ParticleField color="#4EF2FF" />

        <Reveal direction="up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ background: "rgba(78,242,255,0.08)", border: "1px solid rgba(78,242,255,0.25)", color: "#4EF2FF" }}>
            <Activity size={12} />
            Finova Capital · Trading Arsenal
          </div>
        </Reveal>

        <Reveal direction="up" delay={100}>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4 leading-[1.05] tracking-tight">
            <span className="shimmer-text-cyan">Precision</span>{" "}
            <span className="text-white">Tools</span>
            <br />
            <span className="text-white">Institutional</span>{" "}
            <span className="shimmer-text">Edge</span>
          </h1>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <p className="max-w-2xl mx-auto text-white/60 text-lg md:text-xl leading-relaxed mt-6">
            Two fully automated Expert Advisors engineered for consistent, compounding returns —
            built on years of institutional backtesting, zero emotional interference.
          </p>
        </Reveal>

        {/* Staggered pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {["MetaTrader 5", "FTMO Compatible", "Multi-Asset", "24/7 Operation"].map((t, i) => (
            <Reveal key={t} direction="up" delay={300 + i * 60}>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/85"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(78,242,255,0.25)" }}>
                <CheckCircle2 size={14} className="text-[#4EF2FF]" />
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ KINGSLEY ══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.5))" }} />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-[0.15em]"
              style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)", color: "#C9A227" }}>
              <span className="live-dot" />
              Live · Available Now
            </div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(201,162,39,0.5), transparent)" }} />
          </div>
        </Reveal>

        {/* Main card — hover glow */}
        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-500"
          onMouseEnter={() => setKHovered(true)}
          onMouseLeave={() => setKHovered(false)}
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #0f0d07 50%, #0a0a0a 100%)",
            border: `1px solid ${kHovered ? "rgba(201,162,39,0.55)" : "rgba(201,162,39,0.25)"}`,
            boxShadow: kHovered ? "0 0 70px rgba(201,162,39,0.12), 0 30px 60px rgba(0,0,0,0.5)" : "none",
          }}>
          <ParticleField color="#C9A227" />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #C9A227, transparent)" }} />

          <div className="relative z-10 p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
              <Reveal direction="left">
                <div className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)", animation: "pulse-glow-gold 3s ease-in-out infinite" }}>
                  <img src="/kingsley-logo.png" alt="Kingsley EA" className="w-full h-full object-contain p-2"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </Reveal>
              <Reveal direction="right" delay={100}>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C9A227]/80 mb-1">Expert Advisor · MetaTrader 5</div>
                  <h2 className="text-5xl md:text-6xl font-black shimmer-text leading-none">KINGSLEY</h2>
                  <p className="text-white/60 mt-3 text-base md:text-lg max-w-xl">
                    100% automated EA for XAUUSD — captures NY session impulse moves with
                    dynamic trailing, precision zone detection, and zero emotional interference.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Stats — fix orphan: 5 items → col-span trick on last */}
            <Reveal delay={150}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-6 rounded-2xl mb-10"
                style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.15)" }}>
                <AnimatedStat value="222%" label="Net Profit"    color="#C9A227" />
                <AnimatedStat value="7%"   label="Max DD"        color="#4EF2FF" />
                <AnimatedStat value="51%"  label="Win Rate"      color="#C9A227" />
                <AnimatedStat value="2.0"  label="Profit Factor" color="#4EF2FF" />
                <div className="col-span-2 sm:col-span-1 lg:col-span-1">
                  <AnimatedStat value="4"  label="Years Tested"  color="#C9A227" />
                </div>
              </div>
            </Reveal>

            {/* Features + Pricing */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Features — staggered per item */}
              <div>
                <Reveal direction="left" delay={180}>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#C9A227]/80 mb-4">What makes KINGSLEY elite</h3>
                </Reveal>
                <ul className="space-y-3">
                  {[
                    { icon: Target,    text: "NY session impulse capture — highest-probability window" },
                    { icon: TrendingUp,text: "Dynamic trailing stop adapts to live market structure" },
                    { icon: Shield,    text: "Institutional-grade resistance zone detection" },
                    { icon: Zap,       text: "Set-and-forget — runs 24/7 without intervention" },
                    { icon: BarChart2, text: "Optimised exclusively for XAUUSD (Gold)" },
                    { icon: Activity,  text: "4-year backtest with consistent compounding returns" },
                  ].map(({ icon: Icon, text }, i) => (
                    <Reveal key={i} direction="left" delay={220 + i * 65}>
                      <li className="flex items-start gap-3 text-white/70 text-base">
                        <div className="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)" }}>
                          <Icon size={12} className="text-[#C9A227]" />
                        </div>
                        {text}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>

              {/* Pricing */}
              <Reveal direction="right" delay={250}>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#C9A227]/80 mb-4">Pricing</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Buy Outright", sub: "Full lifetime access", price: "$499", highlight: true },
                      { title: "Rent · 3 Months", sub: "Flexible access", price: "$150", highlight: false },
                      { title: "Rent · 6 Months", sub: null, price: "$219", highlight: false, badge: "BEST VALUE", save: "Save 28%" },
                    ].map((opt, i) => (
                      <PricingRow key={i} {...opt} goldAccent />
                    ))}
                  </div>
                  <a href="https://www.mql5.com/en/market/product/162421" target="_blank" rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(201,162,39,0.6)] active:scale-95"
                    style={{ background: "linear-gradient(135deg, #C9A227, #F5D87A, #C9A227)", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }}>
                    <ExternalLink size={16} />
                    Get KINGSLEY on MQL5
                    <ChevronRight size={16} />
                  </a>
                  <p className="text-center text-sm text-white/40 mt-2">Available on mql5.com · Instant download after purchase</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Animated separator between sections */}
      <SectionDivider />

      {/* ══ LBS ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(78,242,255,0.5))" }} />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-[0.15em]"
              style={{ background: "rgba(78,242,255,0.08)", border: "1px solid rgba(78,242,255,0.3)", color: "#4EF2FF" }}>
              <Clock size={13} />
              Launching March 30, 2026
            </div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(78,242,255,0.5), transparent)" }} />
          </div>
        </Reveal>

        {/* Main card — hover glow */}
        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-500"
          onMouseEnter={() => setLHovered(true)}
          onMouseLeave={() => setLHovered(false)}
          style={{
            background: "linear-gradient(135deg, #060d1e 0%, #0a1228 50%, #060d1e 100%)",
            border: `1px solid ${lHovered ? "rgba(78,242,255,0.5)" : "rgba(78,242,255,0.2)"}`,
            boxShadow: lHovered ? "0 0 70px rgba(78,242,255,0.10), 0 30px 60px rgba(0,0,0,0.5)" : "none",
          }}>
          <ParticleField color="#4EF2FF" />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #4EF2FF, transparent)" }} />

          {/* Badge top-right */}
          <div className="absolute top-6 right-6 z-20">
            <div className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
              style={{
                background: "linear-gradient(135deg, rgba(78,242,255,0.2), rgba(78,242,255,0.08))",
                border: "1px solid rgba(78,242,255,0.5)",
                color: "#4EF2FF",
                animation: "badge-pulse 2s ease-in-out infinite",
              }}>
              <Clock size={11} className="inline mr-1" />March 30
            </div>
          </div>

          <div className="relative z-10 p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
              <Reveal direction="left">
                <div className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "rgba(78,242,255,0.06)", border: "1px solid rgba(78,242,255,0.3)", animation: "pulse-glow-cyan 3s ease-in-out infinite" }}>
                  <img src="/lbs-logo.png" alt="LBS EA" className="w-full h-full object-contain p-2"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </Reveal>
              <Reveal direction="right" delay={100}>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[#4EF2FF]/80 mb-1">Expert Advisor · MetaTrader 5</div>
                  <h2 className="text-4xl md:text-6xl font-black shimmer-text-cyan leading-none">
                    LAYERED BREAKOUT<br />SYSTEM
                  </h2>
                  <div className="text-[#4EF2FF]/50 font-mono text-sm mt-1">LBS v2.4</div>
                  <p className="text-white/60 mt-3 text-base md:text-lg max-w-xl">
                    Fully automated momentum trading across Forex, Gold, Crypto & Equities —
                    powered by institutional-grade resistance zone detection and multi-layer risk management.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Stats */}
            <Reveal delay={150}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl mb-10"
                style={{ background: "rgba(78,242,255,0.04)", border: "1px solid rgba(78,242,255,0.12)" }}>
                <AnimatedStat value="+$403K" label="Total Net Profit"  color="#4EF2FF" />
                <AnimatedStat value="2.09"   label="Avg Profit Factor" color="#C9A227" />
                <AnimatedStat value="2.28"   label="Avg Sharpe Ratio"  color="#4EF2FF" />
                <AnimatedStat value="15%"    label="Max Drawdown"      color="#C9A227" />
              </div>
            </Reveal>

            {/* How it works + Backtest */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* How it works — staggered steps */}
              <div>
                <Reveal direction="left" delay={160}>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#4EF2FF]/80 mb-4">How LBS Works</h3>
                </Reveal>
                <div className="space-y-3">
                  {[
                    { num: "01", title: "Zone Detection",            desc: "Scans price history for institutional resistance zones, scored by touch frequency, recency & precision." },
                    { num: "02", title: "Breakout Confirmation",     desc: "Signal validated when price closes above a scored zone + higher timeframe trend confirms + news filter active." },
                    { num: "03", title: "Precision Risk Management", desc: "Real-time position sizing to exact risk %. Dynamic stop-loss from market structure, not arbitrary pip count." },
                    { num: "04", title: "Automated Trade Management",desc: "Optional breakeven automation, Telegram control centre, multi-asset deployment with presets included." },
                  ].map((item, i) => (
                    <Reveal key={i} direction="left" delay={200 + i * 80}>
                      <div className="flex gap-3 p-3 rounded-xl transition-colors duration-200 hover:bg-white/[0.03]">
                        <span className="text-[#4EF2FF]/50 font-mono font-bold text-sm flex-shrink-0 mt-0.5">{item.num}</span>
                        <div>
                          <div className="font-semibold text-white/90 text-base">{item.title}</div>
                          <div className="text-white/50 text-sm mt-0.5 leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Backtest table */}
              <Reveal direction="right" delay={220}>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#4EF2FF]/80 mb-4">
                  Backtested Performance · 2019–2026
                </h3>
                <BacktestTable />
              </Reveal>
            </div>

            {/* ── COUNTDOWN ── */}
            <Reveal delay={260}>
              <div className="rounded-2xl p-8 mb-10 text-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(78,242,255,0.05) 100%)", border: "1px solid rgba(201,162,39,0.25)" }}>
                {/* Breathing glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 blur-[60px] rounded-full pointer-events-none"
                  style={{ background: "#C9A227", animation: "breathe 4s ease-in-out infinite" }} />
                <div className="relative z-10">
                  <div className="text-[#C9A227]/80 text-sm font-semibold uppercase tracking-[0.25em] mb-2">
                    <Clock size={13} className="inline mr-1.5" />Launch Countdown
                  </div>
                  <div className="text-white font-semibold mb-6 text-base">LBS v2.4 goes live on March 30, 2026</div>
                  {/* 2×2 on mobile, row on sm+ — colon blinks with seconds */}
                  <div className="grid grid-cols-2 sm:flex items-center justify-center gap-4 sm:gap-5 max-w-sm sm:max-w-none mx-auto">
                    <DigitBlock value={countdown.days}    label="Days" />
                    <span className={`hidden sm:block text-[#C9A227] text-3xl font-black mb-4 transition-opacity duration-300 ${countdown.seconds % 2 === 0 ? "opacity-60" : "opacity-15"}`}>:</span>
                    <DigitBlock value={countdown.hours}   label="Hours" />
                    <span className={`hidden sm:block text-[#C9A227] text-3xl font-black mb-4 transition-opacity duration-300 ${countdown.seconds % 2 === 0 ? "opacity-60" : "opacity-15"}`}>:</span>
                    <DigitBlock value={countdown.minutes} label="Minutes" />
                    <span className={`hidden sm:block text-[#C9A227] text-3xl font-black mb-4 transition-opacity duration-300 ${countdown.seconds % 2 === 0 ? "opacity-60" : "opacity-15"}`}>:</span>
                    <DigitBlock value={countdown.seconds} label="Seconds" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── MILESTONE PRICING ── */}
            <Reveal delay={300}>
              <div className="mb-10">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-white mb-1">Milestone-Based Pricing</h3>
                  <p className="text-white/50 text-sm">
                    Price increases automatically at each sales milestone — once a tier is gone, it's gone forever.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {LBS_TIERS.map((tier, i) => (
                    <TierCard key={i} tier={tier} />
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl text-center"
                  style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  <p className="text-[#22c55e] text-sm font-semibold">
                    Monthly rental <span className="text-white/60 font-normal">($69/month)</span> available from 2nd tier
                    <span className="text-white/40 font-normal"> · Does not affect milestone counter</span>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── NOTIFY FORM ── */}
            <Reveal delay={350}>
              <div id="lbs-notify" className="rounded-2xl p-6 text-center"
                style={{ background: "rgba(78,242,255,0.04)", border: "1px solid rgba(78,242,255,0.15)" }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm font-semibold tracking-wider">LIVE — AVAILABLE NOW</span>
                </div>
                <h4 className="font-bold text-white mb-1">Early Access — $97</h4>
                <p className="text-white/50 text-sm mb-4">15 spots only. Price increases automatically at each milestone. It won't last.</p>
                {notifyStatus === "success" ? (
                  <div className="flex items-center justify-center gap-2 text-[#22c55e] font-semibold text-base">
                    <CheckCircle2 size={20} /> You're on the list — check your inbox (spam folder included)!
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email" value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="your@email.com" required
                        disabled={notifyStatus === "loading"}
                        className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all disabled:opacity-50"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(78,242,255,0.25)" }}
                        onFocus={(e) => { e.target.style.border = "1px solid rgba(78,242,255,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(78,242,255,0.08)"; }}
                        onBlur={(e)  => { e.target.style.border = "1px solid rgba(78,242,255,0.25)"; e.target.style.boxShadow = "none"; }}
                      />
                      <button type="submit" disabled={notifyStatus === "loading"}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all duration-200 hover:scale-105 hover:shadow-[0_0_25px_rgba(78,242,255,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg, #4EF2FF, #0EA5E9)" }}>
                        {notifyStatus === "loading" ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Notify Me"}
                      </button>
                    </form>
                    {notifyStatus === "error" && (
                      <p className="text-red-400 text-sm mt-2">Something went wrong — please try again.</p>
                    )}
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────────── */}
      <section className="relative px-6 pb-32 text-center max-w-4xl mx-auto">
        <Reveal>
          <div className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0a0e1a 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Breathing glow blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 blur-[80px] rounded-full pointer-events-none"
              style={{ background: "linear-gradient(90deg, #C9A227, #4EF2FF)", animation: "breathe 5s ease-in-out infinite" }} />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A227)" }} />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">Finova Capital</span>
                <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, #C9A227, transparent)" }} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                <span className="shimmer-text">Discipline.</span>{" "}
                <span className="shimmer-text-cyan">Transparency.</span>{" "}
                <span className="text-white">Competence.</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">
                Both EAs are built on the same principle: remove emotion from trading, deploy institutional-grade
                logic, and let compounding do the rest — around the clock, across every session.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://www.mql5.com/en/market/product/162421" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-black transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,162,39,0.5)] active:scale-95"
                  style={{ background: "linear-gradient(135deg, #C9A227, #F5D87A)" }}>
                  <ExternalLink size={15} /> Get KINGSLEY Now
                </a>
                <a href="https://www.mql5.com/en/users/finova_capital" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#4EF2FF] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(78,242,255,0.4)] active:scale-95"
                  style={{ background: "rgba(78,242,255,0.08)", border: "1px solid rgba(78,242,255,0.3)" }}>
                  <ExternalLink size={15} /> Get LBS on MQL5
                </a>
              </div>
              <div className="flex items-center justify-center gap-1 mt-6">
                <AlertTriangle size={11} className="text-white/20" />
                <p className="text-xs text-white/35">
                  Past backtest performance does not guarantee future results. Trading involves risk. Use proper risk management.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PricingRow({ title, sub, price, highlight, badge, save, goldAccent }: {
  title: string; sub?: string | null; price: string; highlight?: boolean;
  badge?: string; save?: string; goldAccent?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = goldAccent ? "201,162,39" : "78,242,255";
  return (
    <div
      className="p-4 rounded-xl flex items-center justify-between transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: highlight
          ? `rgba(${accent},${hovered ? "0.18" : "0.10"})`
          : `rgba(255,255,255,${hovered ? "0.05" : "0.03"})`,
        border: highlight
          ? `1px solid rgba(${accent},${hovered ? "0.6" : "0.35"})`
          : `1px solid rgba(255,255,255,${hovered ? "0.14" : "0.08"})`,
        transform: hovered ? "translateY(-1px)" : "none",
        boxShadow: hovered && highlight ? `0 4px 20px rgba(${accent},0.15)` : "none",
      }}>
      <div>
        <div className={`font-${highlight ? "bold" : "semibold"} text-white ${highlight ? "text-lg" : ""}`}>{title}</div>
        {sub && <div className="text-sm text-white/50">{sub}</div>}
        {(save || badge) && (
          <div className="flex items-center gap-2 mt-0.5">
            {save && <span className="text-sm text-white/50">{save}</span>}
            {badge && <span className="text-xs px-2 py-0.5 rounded-full font-bold text-black" style={{ background: `rgb(${accent})` }}>{badge}</span>}
          </div>
        )}
      </div>
      <div className={`font-${highlight ? "black shimmer-text" : "bold text-white/80"} ${highlight ? "text-3xl" : "text-2xl"}`}>{price}</div>
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative p-5 rounded-2xl transition-all duration-300 cursor-default ${tier.current ? "tier-current scale-[1.03]" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tier.current
          ? "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)"
          : hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${tier.current ? "rgba(34,197,94,0.5)" : hovered ? `${tier.color}44` : "rgba(255,255,255,0.08)"}`,
        transform: !tier.current && hovered ? "translateY(-3px)" : tier.current ? "scale(1.03)" : "none",
        boxShadow: hovered && !tier.current ? `0 8px 24px ${tier.color}18` : "none",
      }}>
      {tier.current && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-black"
          style={{ background: "#22c55e" }}>
          Current
        </div>
      )}
      <div className="w-2 h-2 rounded-full mb-3" style={{ background: tier.color }} />
      <div className="font-bold text-white text-base">{tier.label}</div>
      <div className="text-white/40 text-sm mb-3">{tier.range}</div>
      <div className="text-3xl font-black" style={{ color: tier.color }}>{tier.price}</div>
      {tier.spotsLeft && (
        <div className="mt-2 text-sm font-semibold" style={{ color: "#22c55e" }}>{tier.spotsLeft} spots remaining</div>
      )}
      {!tier.current && (
        <div className="mt-2 flex items-center gap-1 text-sm text-white/30">
          <Lock size={12} /> Locked until previous tier fills
        </div>
      )}
    </div>
  );
}

function SectionDivider() {
  const [ref, inView] = useInView(0.5);
  return (
    <div ref={ref} className="max-w-6xl mx-auto px-6 pb-8 flex items-center gap-6">
      <div className="flex-1 h-px transition-all duration-1000"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.4), rgba(78,242,255,0.4), transparent)",
          opacity: inView ? 1 : 0,
          transform: inView ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
        }} />
      <div className="flex-shrink-0 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A227" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4EF2FF" }} />
      </div>
      <div className="flex-1 h-px transition-all duration-1000 delay-300"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(78,242,255,0.4), rgba(201,162,39,0.4), transparent)",
          opacity: inView ? 1 : 0,
          transform: inView ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "right",
        }} />
    </div>
  );
}
