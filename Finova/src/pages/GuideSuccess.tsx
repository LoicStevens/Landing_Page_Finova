import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function GuideSuccess() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,242,255,0.12),transparent_65%)] blur-3xl" />

      <div className="relative z-10 max-w-lg w-full text-center bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[#4EF2FF]/15 border border-[#4EF2FF]/40 flex items-center justify-center shadow-[0_0_40px_rgba(78,242,255,0.3)]">
          <CheckCircle2 size={36} className="text-[#4EF2FF]" />
        </div>

        <h1 className="text-3xl font-bold mb-3">Guide on its way!</h1>
        <p className="text-gray-300 mb-2">
          Check your inbox — your copy of the <span className="text-[#4EF2FF] font-semibold">Finova Capital Algo Trading Guide</span> has been sent.
        </p>
        <p className="text-gray-500 text-sm mb-10">Don't see it? Check your spam folder.</p>

        {/* Cross-sell */}
        <div className="bg-white/5 border border-[#C9A94A]/25 rounded-2xl p-6 mb-8">
          <p className="text-[#C9A94A] text-xs font-semibold tracking-widest mb-2">WHILE YOU WAIT</p>
          <p className="text-sm text-gray-300 mb-4">
            Discover LBS v2.4 — our fully automated Expert Advisor, backtested over 7 years across 5 markets.
          </p>
          <Link to="/trading-tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4EF2FF] hover:underline">
            See LBS <ChevronRight size={14} />
          </Link>
        </div>

        <Link to="/"
          className="inline-block px-8 py-3 rounded-full text-black font-semibold bg-[#4EF2FF] hover:opacity-90 transition">
          Return to home
        </Link>
      </div>
    </main>
  );
}
