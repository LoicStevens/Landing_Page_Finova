import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import emailjs from "@emailjs/browser";
import { User, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const isValidEmail = (email: string) => {
  const blocked = ["mailinator.com","tempmail.com","10minutemail.com","yopmail.com"];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  return !blocked.includes(email.split("@")[1]);
};

export default function Guide() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const email = (fd.get("email") as string).trim();
    const whatsapp = (fd.get("whatsapp") as string).trim();

    if (!isValidEmail(email)) { alert("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "subscribers"), { name, email, whatsapp, createdAt: serverTimestamp(), source: "guide-landing" });
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { to_name: name, to_email: email, guide_link: import.meta.env.VITE_GUIDE_PDF_URL },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      navigate("/guide/merci");
    } catch (error: any) {
      alert(`Something went wrong: ${error?.text ?? error?.message ?? "Unknown error"}`);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(78,242,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(201,169,74,0.06),transparent_55%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#C9A94A]/10 border border-[#C9A94A]/30 px-4 py-1.5 rounded-full mb-5">
            <span className="text-[#C9A94A] text-sm font-medium">Free Resource — Finova Capital</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            2 Categories of <span className="text-[#4EF2FF]">Critical Errors</span><br className="hidden md:block" /> in Algo Trading
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            And how to fix them. Free guide — instant delivery by email.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* LEFT — visuel + bénéfices */}
          <div>
            {/* PDF mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C9A94A]/25 bg-gradient-to-br from-[#0A1628] to-[#040D1A] p-8 mb-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A94A]/8 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logo.png" alt="Finova" className="h-10" />
                  <div>
                    <div className="font-bold text-[#4EF2FF] tracking-wider text-sm">FINOVA</div>
                    <div className="text-[10px] text-[#4EF2FF] tracking-[0.3em]">CAPITAL</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/8">
                  <div className="text-xs text-[#C9A94A] font-semibold tracking-widest mb-3">FREE GUIDE</div>
                  <h3 className="text-2xl font-bold leading-snug mb-2">
                    2 Categories of Critical Errors in Algo Trading
                  </h3>
                  <p className="text-gray-400 text-sm">And how to correct them — by Finova Capital</p>
                  <div className="mt-6 pt-4 border-t border-white/8">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle2 size={15} />
                      <span>Instant delivery to your inbox</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bénéfices */}
            <div className="space-y-4">
              {[
                { title: "Identify the 2 error categories", desc: "Understand exactly what destroys the performance of most automated strategies." },
                { title: "Diagnose your current system", desc: "A simple checklist to evaluate any EA — including the ones you already run." },
                { title: "Apply the corrections", desc: "Concrete, actionable fixes you can implement immediately — no coding required." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/6">
                  <CheckCircle2 size={20} className="text-[#4EF2FF] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">{title}</div>
                    <div className="text-gray-400 text-sm mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — formulaire */}
          <div className="bg-white/4 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Get your free copy</h2>
            <p className="text-gray-400 text-sm mb-8">Immediate delivery · No spam · Unsubscribe anytime</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4EF2FF]/60" size={17} />
                <input name="name" type="text" placeholder="First Name" required
                  className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#4EF2FF]/60 focus:ring-2 focus:ring-[#4EF2FF]/20 transition" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4EF2FF]/60" size={17} />
                <input name="email" type="email" placeholder="Email Address" required
                  className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#4EF2FF]/60 focus:ring-2 focus:ring-[#4EF2FF]/20 transition" />
              </div>
              <div className="relative">
                <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4EF2FF]/60" size={17} />
                <input name="whatsapp" type="text" placeholder="+XXX XXX XXX XXX (optional)"
                  className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#4EF2FF]/60 focus:ring-2 focus:ring-[#4EF2FF]/20 transition" />
              </div>

              <button type="submit" disabled={loading}
                className={`mt-2 w-full py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-[#4EF2FF] to-[#38bdf8] shadow-lg flex items-center justify-center gap-3 transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}>
                {loading ? <><Loader2 className="animate-spin" size={20} />Sending...</> : "Download the free guide →"}
              </button>

              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 pt-2">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-400" />Immediate email delivery</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-400" />No spam</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-400" />Unsubscribe anytime</span>
              </div>
            </form>
          </div>
        </div>

        {/* Cross-sell */}
        <div className="mt-16 text-center border-t border-white/5 pt-12">
          <p className="text-gray-400 text-sm mb-4">Looking for an automated trading system right now?</p>
          <Link to="/trading-tools"
            className="inline-flex items-center gap-2 text-[#4EF2FF] font-medium hover:underline">
            Discover LBS — our latest Expert Advisor →
          </Link>
        </div>
      </div>
    </main>
  );
}
