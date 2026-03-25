import { useState, useEffect, useRef } from "react";
import {
  ExternalLink, TrendingUp, Shield, Zap, BarChart2,
  Bell, ChevronRight, Lock, Target, Clock,
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

// ── Reveal wrapper ──────────────────────────────────────────────────────────
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}
function Reveal({ children, delay = 0, direction = "up", className = "" }: RevealProps) {
  const [ref, inView] = useInView();
  const dirMap = {
    up: "translate-y-12",
    left: "-translate-x-12",
    right: "translate-x-12",
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

// ── Animated number counter ─────────────────────────────────────────────────
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
    const duration = 1400;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric * eased;
      const decimals = value.includes(".") ? 1 : 0;
      setDisplayed(current.toFixed(decimals) + suffix);
      if (step >= steps) { setDisplayed(value); clearInterval(timer); }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-black" style={{ color }}>{displayed}</div>
      <div className="text-xs text-white/50 mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ── Countdown hook ──────────────────────────────────────────────────────────
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

// ── Countdown digit block ───────────────────────────────────────────────────
function DigitBlock({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-black text-[#C9A227]"
          style={{
            background: "linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)",
            border: "1px solid rgba(201,162,39,0.4)",
            boxShadow: "0 0 20px rgba(201,162,39,0.2), inset 0 1px 0 rgba(201,162,39,0.1)",
          }}
        >
          {str}
        </div>
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ── Pricing tier ────────────────────────────────────────────────────────────
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
  { label: "Early Access", range: "First 15 purchases", price: "$97",  color: "#22c55e", current: true,  locked: false, spotsLeft: 15 },
  { label: "Founders Price", range: "Purchases 16–40",  price: "$167", color: "#3b82f6", current: false, locked: true  },
  { label: "Standard Price", range: "Purchases 41–100", price: "$297", color: "#94a3b8", current: false, locked: true  },
  { label: "Full Price",     range: "From purchase 101",price: "$497", color: "#6b7280", current: false, locked: true  },
];

// ── Floating particle background ────────────────────────────────────────────
function ParticleField({ color }: { color: string }) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export default function TradingTools() {
  // LBS launch: March 30, 2026
  const lbsLaunch = new Date("2026-03-30T09:00:00Z");
  const countdown = useCountdown(lbsLaunch);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyStatus("loading");

    const daysLeft = Math.max(
      0,
      Math.ceil((lbsLaunch.getTime() - Date.now()) / 86400000)
    );

    try {
      // 1. Sauvegarder dans Firestore
      await addDoc(collection(db, "lbs_waitlist"), {
        email: notifyEmail.trim(),
        createdAt: serverTimestamp(),
      });

      // 2. Envoyer l'email de confirmation via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_LBS_TEMPLATE_ID,
        {
          to_email: notifyEmail.trim(),
          days_remaining: daysLeft,
          launch_date: "March 30, 2026",
          early_price: "$97",
          spots_remaining: "15",
        },
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
          to   { transform: translateY(-20px) translateX(10px); }
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
          100% { background-position: 200% center; }
        }
        @keyframes badge-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes coming-soon-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
        .tier-current {
          animation: pulse-glow-gold 2s ease-in-out infinite;
        }
        .live-dot::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 6px;
          animation: badge-pulse 1.4s ease-in-out infinite;
        }
        .coming-soon-overlay {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
          pointer-events: none;
        }
        .coming-soon-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201,162,39,0.6), transparent);
          animation: coming-soon-scan 3s linear infinite;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #4EF2FF 0%, transparent 70%)" }} />
        <div className="absolute top-20 left-[20%] w-72 h-72 rounded-full opacity-10 blur-[80px]"
          style={{ background: "#C9A227" }} />
        <div className="absolute top-20 right-[20%] w-72 h-72 rounded-full opacity-10 blur-[80px]"
          style={{ background: "#C9A227" }} />
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
            Two fully automated Expert Advisors engineered for consistent, compounding returns 
            built on years of institutional backtesting, zero emotional interference.
          </p>
        </Reveal>

        <Reveal direction="up" delay={320}>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {["MetaTrader 5", "FTMO Compatible", "Multi-Asset", "24/7 Operation"].map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/85"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(78,242,255,0.25)",
                }}
              >
                <CheckCircle2 size={14} className="text-[#4EF2FF]" />
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          KINGSLEY SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 max-w-6xl mx-auto">
        {/* Section label */}
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

        {/* Main card */}
        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0f0d07 50%, #0a0a0a 100%)", border: "1px solid rgba(201,162,39,0.25)" }}>
          <ParticleField color="#C9A227" />
          <div className="coming-soon-overlay" style={{ display: "none" }} />

          {/* Top glow strip */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #C9A227, transparent)" }} />

          <div className="relative z-10 p-8 md:p-12">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
              {/* Logo */}
              <Reveal direction="left">
                <div className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)", animation: "pulse-glow-gold 3s ease-in-out infinite" }}>
                  <img src="/kingsley-logo.png" alt="Kingsley EA" className="w-full h-full object-contain p-2"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </Reveal>

              {/* Title block */}
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

            {/* Stats bar */}
            <Reveal delay={150}>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-6 rounded-2xl mb-10"
                style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.15)" }}>
                <AnimatedStat value="222%" label="Net Profit" color="#C9A227" />
                <AnimatedStat value="7%" label="Max DD" color="#4EF2FF" />
                <AnimatedStat value="51%" label="Win Rate" color="#C9A227" />
                <AnimatedStat value="2.0" label="Profit Factor" color="#4EF2FF" />
                <AnimatedStat value="4" label="Years Tested" color="#C9A227" />
              </div>
            </Reveal>

            {/* Features + Pricing grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Features */}
              <Reveal direction="left" delay={200}>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#C9A227]/80 mb-4">What makes KINGSLEY elite</h3>
                  <ul className="space-y-3">
                    {[
                      { icon: Target, text: "NY session impulse capture — highest-probability window" },
                      { icon: TrendingUp, text: "Dynamic trailing stop adapts to live market structure" },
                      { icon: Shield, text: "Institutional-grade resistance zone detection" },
                      { icon: Zap, text: "Set-and-forget — runs 24/7 without intervention" },
                      { icon: BarChart2, text: "Optimised exclusively for XAUUSD (Gold)" },
                      { icon: Activity, text: "4-year backtest with consistent compounding returns" },
                    ].map(({ icon: Icon, text }, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70 text-base">
                        <div className="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)" }}>
                          <Icon size={12} className="text-[#C9A227]" />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Pricing */}
              <Reveal direction="right" delay={250}>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#C9A227]/80 mb-4">Pricing</h3>
                  <div className="space-y-3">
                    {/* Buy outright */}
                    <div className="p-4 rounded-xl flex items-center justify-between"
                      style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.35)" }}>
                      <div>
                        <div className="font-bold text-white text-lg">Buy Outright</div>
                        <div className="text-sm text-white/50">Full lifetime access</div>
                      </div>
                      <div className="text-3xl font-black shimmer-text">$499</div>
                    </div>
                    {/* Rent 3 months */}
                    <div className="p-4 rounded-xl flex items-center justify-between"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div>
                        <div className="font-semibold text-white">Rent · 3 Months</div>
                        <div className="text-sm text-white/50">Flexible access</div>
                      </div>
                      <div className="text-2xl font-bold text-white/80">$150</div>
                    </div>
                    {/* Rent 6 months */}
                    <div className="p-4 rounded-xl flex items-center justify-between"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div>
                        <div className="font-semibold text-white">Rent · 6 Months</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/50">Save 28%</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold text-black"
                            style={{ background: "#C9A227" }}>BEST VALUE</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white/80">$219</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="https://www.mql5.com/en/market/product/162421"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(201,162,39,0.6)] active:scale-95"
                    style={{ background: "linear-gradient(135deg, #C9A227, #F5D87A, #C9A227)", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }}
                  >
                    <ExternalLink size={16} />
                    Get KINGSLEY on MQL5
                    <ChevronRight size={16} />
                  </a>
                  <p className="text-center text-sm text-white/40 mt-2">
                    Available on mql5.com · Instant download after purchase
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LBS SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 max-w-6xl mx-auto">
        {/* Section label */}
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(78,242,255,0.5))" }} />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-[0.15em]"
              style={{ background: "rgba(78,242,255,0.08)", border: "1px solid rgba(78,242,255,0.3)", color: "#4EF2FF" }}>
              <Clock size={13} />
              Coming Soon · Launching Next Week
            </div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(78,242,255,0.5), transparent)" }} />
          </div>
        </Reveal>

        {/* Main card */}
        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #060d1e 0%, #0a1228 50%, #060d1e 100%)", border: "1px solid rgba(78,242,255,0.2)" }}>
          <ParticleField color="#4EF2FF" />

          {/* Scanline animation overlay */}
          <div className="coming-soon-overlay">
            <div className="coming-soon-scanline" />
          </div>

          {/* Top glow strip */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #4EF2FF, transparent)" }} />

          {/* Coming Soon badge */}
          <div className="absolute top-6 right-6 z-20">
            <div className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
              style={{
                background: "linear-gradient(135deg, rgba(78,242,255,0.2), rgba(78,242,255,0.08))",
                border: "1px solid rgba(78,242,255,0.5)",
                color: "#4EF2FF",
                animation: "badge-pulse 2s ease-in-out infinite",
              }}>
              <Zap size={11} className="inline mr-1" />Coming Soon
            </div>
          </div>

          <div className="relative z-10 p-8 md:p-12">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
              {/* Logo */}
              <Reveal direction="left">
                <div className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: "rgba(78,242,255,0.06)", border: "1px solid rgba(78,242,255,0.3)", animation: "pulse-glow-cyan 3s ease-in-out infinite" }}>
                  <img src="/lbs-logo.png" alt="LBS EA" className="w-full h-full object-contain p-2"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </Reveal>

              {/* Title block */}
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

            {/* Stats bar */}
            <Reveal delay={150}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl mb-10"
                style={{ background: "rgba(78,242,255,0.04)", border: "1px solid rgba(78,242,255,0.12)" }}>
                <AnimatedStat value="+$403K" label="Total Net Profit" color="#4EF2FF" />
                <AnimatedStat value="2.09" label="Avg Profit Factor" color="#C9A227" />
                <AnimatedStat value="2.28" label="Avg Sharpe Ratio" color="#4EF2FF" />
                <AnimatedStat value="15%" label="Max Drawdown" color="#C9A227" />
              </div>
            </Reveal>

            {/* How it works + Backtest results */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* How it works */}
              <Reveal direction="left" delay={180}>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#4EF2FF]/80 mb-4">How LBS Works</h3>
                <div className="space-y-3">
                  {[
                    { num: "01", title: "Zone Detection", desc: "Scans price history for institutional resistance zones, scored by touch frequency, recency & precision." },
                    { num: "02", title: "Breakout Confirmation", desc: "Signal validated when price closes above a scored zone + higher timeframe trend confirms + news filter active." },
                    { num: "03", title: "Precision Risk Management", desc: "Real-time position sizing to exact risk %. Dynamic stop-loss from market structure, not arbitrary pip count." },
                    { num: "04", title: "Automated Trade Management", desc: "Optional breakeven automation, Telegram control centre, multi-asset deployment with presets included." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl transition-colors duration-200 hover:bg-white/[0.03]">
                      <span className="text-[#4EF2FF]/50 font-mono font-bold text-sm flex-shrink-0 mt-0.5">{item.num}</span>
                      <div>
                        <div className="font-semibold text-white/90 text-base">{item.title}</div>
                        <div className="text-white/50 text-sm mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Backtest results */}
              <Reveal direction="right" delay={220}>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#4EF2FF]/80 mb-4">Backtested Performance · 2019–2026</h3>
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(78,242,255,0.12)" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "rgba(78,242,255,0.08)" }}>
                        <th className="text-left px-3 py-2.5 text-[#4EF2FF]/70 text-sm font-bold uppercase tracking-wider">Asset</th>
                        <th className="text-right px-3 py-2.5 text-[#4EF2FF]/70 text-sm font-bold uppercase tracking-wider">Net P&L</th>
                        <th className="text-right px-3 py-2.5 text-[#4EF2FF]/70 text-sm font-bold uppercase tracking-wider">PF</th>
                        <th className="text-right px-3 py-2.5 text-[#4EF2FF]/70 text-sm font-bold uppercase tracking-wider">DD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { asset: "XAUUSD", profit: "+$133K", pf: "2.44", dd: "12.64%", highlight: true },
                        { asset: "BTCUSD", profit: "+$148K", pf: "1.66", dd: "13.87%", highlight: false },
                        { asset: "USDJPY", profit: "+$48K",  pf: "1.58", dd: "13.24%", highlight: false },
                        { asset: "NVDA",   profit: "+$45K",  pf: "2.62", dd: "11.88%", highlight: false },
                        { asset: "COST",   profit: "+$29K",  pf: "2.12", dd: "14.43%", highlight: false },
                      ].map((row, i) => (
                        <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                          style={row.highlight ? { background: "rgba(78,242,255,0.04)" } : {}}>
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
              </Reveal>
            </div>

            {/* ── COUNTDOWN ── */}
            <Reveal delay={260}>
              <div className="rounded-2xl p-8 mb-10 text-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(78,242,255,0.05) 100%)", border: "1px solid rgba(201,162,39,0.25)" }}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 opacity-10 blur-[60px] rounded-full"
                    style={{ background: "#C9A227" }} />
                </div>
                <div className="relative z-10">
                  <div className="text-[#C9A227]/80 text-sm font-semibold uppercase tracking-[0.25em] mb-2">
                    <Clock size={13} className="inline mr-1.5" />Launch Countdown
                  </div>
                  <div className="text-white font-semibold mb-6 text-base">LBS v2.4 goes live on March 30, 2026</div>
                  <div className="flex items-center justify-center gap-3 md:gap-5">
                    <DigitBlock value={countdown.days} label="Days" />
                    <span className="text-[#C9A227] text-3xl font-black mb-4 opacity-60">:</span>
                    <DigitBlock value={countdown.hours} label="Hours" />
                    <span className="text-[#C9A227] text-3xl font-black mb-4 opacity-60">:</span>
                    <DigitBlock value={countdown.minutes} label="Minutes" />
                    <span className="text-[#C9A227] text-3xl font-black mb-4 opacity-60">:</span>
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
                    <div key={i}
                      className={`relative p-5 rounded-2xl transition-all duration-300 ${tier.current ? "tier-current scale-[1.03]" : "opacity-70 hover:opacity-90"}`}
                      style={{
                        background: tier.current
                          ? "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${tier.current ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.08)"}`,
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
                        <div className="mt-2 text-sm font-semibold" style={{ color: "#22c55e" }}>
                          {tier.spotsLeft} spots remaining
                        </div>
                      )}
                      {!tier.current && (
                        <div className="mt-2 flex items-center gap-1 text-sm text-white/30">
                          <Lock size={12} /> Locked until previous tier fills
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-xl text-center"
                  style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  <p className="text-[#22c55e] text-sm font-semibold">
                    Monthly rental <span className="text-white/60 font-normal">($69/month)</span> available at all tiers
                    <span className="text-white/40 font-normal"> · Does not affect milestone counter</span>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── NOTIFY FORM ── */}
            <Reveal delay={350}>
              <div id="lbs-notify" className="rounded-2xl p-6 text-center"
                style={{ background: "rgba(78,242,255,0.04)", border: "1px solid rgba(78,242,255,0.15)" }}>
                <Bell size={22} className="text-[#4EF2FF] mx-auto mb-3" />
                <h4 className="font-bold text-white mb-1">Get notified at launch</h4>
                <p className="text-white/50 text-sm mb-4">Lock in the Early Access price before spots disappear.</p>
                {notifyStatus === "success" ? (
                  <div className="flex items-center justify-center gap-2 text-[#22c55e] font-semibold text-base">
                    <CheckCircle2 size={20} /> You're on the list  check your inbox (Spam included)!
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={notifyStatus === "loading"}
                        className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all disabled:opacity-50"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(78,242,255,0.25)",
                        }}
                        onFocus={(e) => { e.target.style.border = "1px solid rgba(78,242,255,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(78,242,255,0.08)"; }}
                        onBlur={(e) => { e.target.style.border = "1px solid rgba(78,242,255,0.25)"; e.target.style.boxShadow = "none"; }}
                      />
                      <button
                        type="submit"
                        disabled={notifyStatus === "loading"}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all duration-200 hover:scale-105 hover:shadow-[0_0_25px_rgba(78,242,255,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{ background: "linear-gradient(135deg, #4EF2FF, #0EA5E9)" }}>
                        {notifyStatus === "loading" ? (
                          <><Loader2 size={15} className="animate-spin" /> Sending…</>
                        ) : "Notify Me"}
                      </button>
                    </form>
                    {notifyStatus === "error" && (
                      <p className="text-red-400 text-sm mt-2">
                        Something went wrong — please try again.
                      </p>
                    )}
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative px-6 pb-32 text-center max-w-4xl mx-auto">
        <Reveal>
          <div className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0a0e1a 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 opacity-20 blur-[80px] rounded-full"
              style={{ background: "linear-gradient(90deg, #C9A227, #4EF2FF)" }} />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A227)" }} />
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">Finova Capital</span>
                <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, #C9A227, transparent)" }} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                <span className="shimmer-text">Discipline.</span>{" "}
                <span className="shimmer-text-cyan">Precision.</span>{" "}
                <span className="text-white">Growth.</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">
                Both EAs are built on the same principle: remove emotion from trading, deploy institutional-grade
                logic, and let compounding do the rest — around the clock, across every session.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://www.mql5.com/en/market/product/162421"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-black transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #C9A227, #F5D87A)" }}>
                  <ExternalLink size={15} />
                  Get KINGSLEY Now
                </a>
                <button
                  onClick={() => document.getElementById('lbs-notify')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#4EF2FF] transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: "rgba(78,242,255,0.08)", border: "1px solid rgba(78,242,255,0.3)" }}>
                  <Bell size={15} />
                  Pre-register for LBS
                </button>
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
