import { useEffect, useRef, useState } from "react";
import { ExternalLink, Shield, TrendingUp, BarChart2, Clock } from "lucide-react";

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

// ── DONNÉES À METTRE À JOUR MANUELLEMENT ────────────────────────────────────
const FTMO = {
  profit: "+0.96%",
  maxDD: "-1.56%",
  target: "+10%",
  days: "In Progress",
  myfxbook: "https://www.myfxbook.com/members/Mecsimple/ftmo-challenge-25k/11932997",
  lastUpdate: "Mars 2026",
};

const BACKTESTS = [
  { asset: "XAUUSD", period: "2019–2026", pnl: "+$133,074", pct: "+1,331%", pf: "2.44", sharpe: "2.23", dd: "12.64%", trades: 573 },
  { asset: "BTCUSD", period: "2019–2025", pnl: "+$148,184", pct: "+593%",   pf: "1.66", sharpe: "1.91", dd: "13.87%", trades: 513 },
  { asset: "USDJPY", period: "2019–2026", pnl: "+$48,468",  pct: "+194%",   pf: "1.58", sharpe: "1.92", dd: "13.24%", trades: 452 },
  { asset: "NVDA",   period: "2020–2026", pnl: "+$44,888",  pct: "+180%",   pf: "2.62", sharpe: "2.82", dd: "11.88%", trades: 106 },
  { asset: "COST",   period: "2019–2026", pnl: "+$28,615",  pct: "+114%",   pf: "2.12", sharpe: "2.53", dd: "14.43%", trades: 103 },
];

export default function Performance() {
  return (
    <main className="bg-black text-white min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(78,242,255,0.07),transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-green-400 text-sm font-semibold tracking-widest mb-3">LIVE & VERIFIED RESULTS</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Live Performance</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              We publish our real results — unfiltered, good and bad.
              No demo account presented as live. No cherry-picked trades.
            </p>
          </div>
        </Reveal>

        {/* FTMO Block */}
        <Reveal delay={100}>
          <div className="relative rounded-3xl border border-green-500/25 bg-gradient-to-br from-green-950/30 to-[#040D1A] p-8 md:p-10 mb-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/8 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-sm font-semibold tracking-widest">FTMO CHALLENGE · IN PROGRESS</span>
                  </div>
                  <h2 className="text-2xl font-bold">Phase 1 — Running on LBS v2.4</h2>
                  <p className="text-gray-400 text-sm mt-1">Zero manual intervention since day one. Fully automated.</p>
                </div>
                <a href={FTMO.myfxbook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-green-500/40 text-green-400 text-sm font-medium hover:bg-green-500/10 transition whitespace-nowrap">
                  Verify on Myfxbook <ExternalLink size={14} />
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { label: "Current Profit", value: FTMO.profit, color: "text-green-400" },
                  { label: "Max Drawdown", value: FTMO.maxDD, color: "text-green-400" },
                  { label: "Target", value: FTMO.target, color: "text-white" },
                  { label: "Status", value: FTMO.days, color: "text-[#4EF2FF]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/8">
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                    <div className="text-gray-400 text-xs mt-1">{label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-5 text-xs text-gray-500">
                <Clock size={12} />
                Last updated: {FTMO.lastUpdate}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Transparency statement */}
        <Reveal delay={150}>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-white/3 border border-white/8 mb-14">
            <Shield size={20} className="text-[#4EF2FF] mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm leading-relaxed">
              <strong className="text-white">Our commitment to transparency:</strong> We publish real results, unfiltered — profitable trades and losing trades.
              No demo account presented as live. No cherry-picked snapshot.
              The Myfxbook link above connects directly to our broker account.
            </p>
          </div>
        </Reveal>

        {/* Backtests */}
        <Reveal delay={200}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BarChart2 size={20} className="text-[#C9A94A]" />
              <h2 className="text-2xl font-bold">Backtested Performance — LBS v2.4</h2>
            </div>
            <p className="text-gray-400 text-sm">
              MT5 Strategy Tester · 85–100% tick quality · 1% risk per trade · FTMO-compatible conditions
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full text-sm">
              <thead className="bg-[#0A1628] text-[#C9A94A] text-xs font-semibold uppercase tracking-wider">
                <tr>
                  {["Asset","Period","Net P&L","Return","Profit Factor","Sharpe","Max DD","Trades"].map(h => (
                    <th key={h} className="px-5 py-4 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BACKTESTS.map((row, i) => (
                  <tr key={row.asset} className={`border-t border-white/5 ${i % 2 === 0 ? "bg-white/2" : "bg-transparent"} hover:bg-white/5 transition`}>
                    <td className="px-5 py-4 font-bold text-white">{row.asset}</td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{row.period}</td>
                    <td className="px-5 py-4 font-semibold text-green-400">{row.pnl}</td>
                    <td className="px-5 py-4 text-green-400">{row.pct}</td>
                    <td className="px-5 py-4 text-white">{row.pf}</td>
                    <td className="px-5 py-4 text-white">{row.sharpe}</td>
                    <td className="px-5 py-4 text-gray-300">{row.dd}</td>
                    <td className="px-5 py-4 text-gray-300">{row.trades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Download reports */}
        <Reveal delay={250}>
          <div className="mt-8 flex items-start gap-4 p-5 rounded-xl bg-[#0A1628] border border-white/8">
            <TrendingUp size={20} className="text-[#4EF2FF] mt-0.5 shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm mb-1">Full backtest reports available</p>
              <p className="text-gray-400 text-sm">
                Complete HTML reports with equity curves, trade-by-trade history and all statistical metrics are included in the LBS package on MQL5.
              </p>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
