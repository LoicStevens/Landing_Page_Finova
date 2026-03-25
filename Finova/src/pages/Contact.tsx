import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaYoutube, FaInstagram, FaReddit, FaWhatsapp, FaTelegram } from "react-icons/fa";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { ExternalLink } from "lucide-react";

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
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

// ── Data ──────────────────────────────────────────────────────────────────────
const SOCIALS = [
  { icon: FaFacebook,  label: "Facebook",   handle: "Finova Capital",     desc: "News, analyses and community updates.",            href: "https://www.facebook.com/share/1A6oZeNShW/",                                                          color: "#1877F2", cta: "Follow" },
  { icon: FaYoutube,   label: "YouTube",    handle: "@finocap-z9i",       desc: "Educational videos, backtests and market analysis.",href: "https://youtube.com/@finocap-z9i?si=oT7L9gUG_BOidn9v",                                                color: "#FF0000", cta: "Subscribe" },
  { icon: FaInstagram, label: "Instagram",  handle: "@_finocap",          desc: "Live results, visuals and behind the scenes.",      href: "https://www.instagram.com/_finocap?igsh=bXo0MDE5MHhpcnhr",                                           color: "#E1306C", cta: "Follow" },
  { icon: FaXTwitter,  label: "X",          handle: "@FinoCap_",          desc: "Real-time market takes and flash signals.",         href: "https://x.com/FinoCap_?t=Iwx9ApcYDUH_tDMzGQUvYg&s=09",                                              color: "#e5e5e5", cta: "Follow" },
  { icon: FaTelegram,  label: "Telegram",   handle: "t.me/FinoCap",       desc: "Public channel — alerts and early announcements.",  href: "https://t.me/FinoCap",                                                                                color: "#26A5E4", cta: "Join Channel" },
  { icon: FaReddit,    label: "Reddit",     handle: "u/Main_Recover_1840",desc: "Quant discussions and strategy sharing.",           href: "https://www.reddit.com/user/Main_Recover_1840/",                                                      color: "#FF4500", cta: "View Profile" },
  { icon: FaTiktok,    label: "TikTok",     handle: "@_finocap",          desc: "Short-form content, trading education and highlights.",href: "https://tiktok.com/@_finocap",                                                                    color: "#e5e5e5", cta: "Follow" },
  { icon: FaWhatsapp,  label: "WhatsApp",   handle: "+237 698 639 717",   desc: "Direct contact for questions and support.",         href: "https://wa.me/237698639717",                                                                          color: "#25D366", cta: "Message Us" },
];

// ── Card ──────────────────────────────────────────────────────────────────────
function SocialCard({ icon: Icon, label, handle, desc, href, color, cta, delay }: typeof SOCIALS[0] & { delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={delay} direction="up">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col p-6 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 cursor-pointer h-full"
        style={{
          background: hovered ? `linear-gradient(135deg, ${color}12 0%, rgba(0,0,0,0) 100%)` : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? color + "55" : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered ? `0 0 40px ${color}20, 0 20px 40px rgba(0,0,0,0.4)` : "none",
          transition: "all 0.35s ease",
        }}
      >
        {/* Glow orb behind icon */}
        <div
          className="absolute top-4 left-4 w-16 h-16 rounded-full blur-2xl transition-opacity duration-500"
          style={{ background: color, opacity: hovered ? 0.18 : 0 }}
        />

        {/* Top strip */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: hovered ? 1 : 0 }}
        />

        {/* Icon */}
        <div
          className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
          style={{
            background: hovered ? `${color}22` : `${color}14`,
            border: `1px solid ${color}${hovered ? "55" : "28"}`,
            transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
          }}
        >
          <Icon size={24} style={{ color }} />
        </div>

        {/* Text */}
        <div className="relative z-10 font-bold text-white text-lg mb-0.5">{label}</div>
        <div className="relative z-10 text-sm font-medium mb-3 transition-colors duration-300" style={{ color: hovered ? color : `${color}99` }}>{handle}</div>
        <p className="relative z-10 text-white/50 text-sm leading-relaxed flex-1">{desc}</p>

        {/* CTA row */}
        <div
          className="relative z-10 mt-5 flex items-center gap-1.5 text-sm font-semibold transition-all duration-300"
          style={{ color, opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)" }}
        >
          <ExternalLink size={13} />
          {cta}
        </div>
      </a>
    </Reveal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Contact() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(160px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(160px) rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50%       { transform: scale(1.08); opacity: 0.3; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">

        {/* Background radial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(78,242,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('/grid.svg')] bg-repeat" />

        {/* Pulsing rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[280, 380, 480].map((size, i) => (
            <div key={i} className="absolute rounded-full border border-[#4EF2FF]"
              style={{ width: size, height: size, top: -size/2, left: -size/2, animation: `pulse-ring ${3 + i}s ease-in-out ${i * 0.6}s infinite` }} />
          ))}
        </div>

        {/* Orbiting dots */}
        <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%,-50%)" }}>
          {SOCIALS.slice(0, 6).map((s, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full"
              style={{ background: s.color, animation: `orbit ${8 + i * 1.5}s ${i * 1.2}s linear infinite`, opacity: 0.6 }} />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Badge */}
          <div className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <span className="inline-block text-[#4EF2FF] text-sm font-semibold tracking-[0.3em] uppercase mb-6 px-4 py-1.5 rounded-full border border-[#4EF2FF]/20 bg-[#4EF2FF]/5">
              Finova Capital · Community
            </span>
          </div>

          {/* Headline */}
          <div className={`transition-all duration-700 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Let's{" "}
              <span className="bg-gradient-to-r from-[#4EF2FF] to-[#0EA5E9] bg-clip-text text-transparent">
                Connect
              </span>
            </h1>
          </div>

          {/* Sub */}
          <div className={`transition-all duration-700 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Eight platforms. One community. Follow, engage or reach out directly — we're always listening.
            </p>
          </div>

          {/* Counter pills */}
          <div className={`transition-all duration-700 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[["8", "Platforms"], ["24/7", "Active"], ["1", "Community"]].map(([val, lbl]) => (
                <div key={lbl} className="px-5 py-2 rounded-full text-sm font-medium"
                  style={{ background: "rgba(78,242,255,0.06)", border: "1px solid rgba(78,242,255,0.2)" }}>
                  <span className="text-[#4EF2FF] font-bold">{val}</span>
                  <span className="text-white/50 ml-1.5">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-px bg-gradient-to-r from-transparent via-[#4EF2FF]/40 to-transparent" />
      </section>

      {/* ── SOCIAL GRID ── */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Find us{" "}
            <span className="bg-gradient-to-r from-[#4EF2FF] to-[#38bdf8] bg-clip-text text-transparent">
              everywhere
            </span>
          </h2>
          <p className="text-white/40 text-base mt-3">Click any card to open the platform directly.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOCIALS.map((s, i) => (
            <SocialCard key={s.label} {...s} delay={i * 70} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <Reveal>
        <section className="pb-24 px-6 max-w-2xl mx-auto text-center">
          <div className="rounded-2xl p-10 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(78,242,255,0.12)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-20 blur-[60px] opacity-20 rounded-full"
              style={{ background: "#4EF2FF" }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(78,242,255,0.08)", border: "1px solid rgba(78,242,255,0.2)" }}>
                <FaWhatsapp size={22} style={{ color: "#25D366" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Prefer a direct conversation?</h3>
              <p className="text-white/50 text-base mb-6">Our team is available on WhatsApp for any questions about our tools or services.</p>
              <a href="https://wa.me/237698639717" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-black transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] active:scale-95"
                style={{ background: "linear-gradient(135deg, #25D366, #1da851)" }}>
                <FaWhatsapp size={16} />
                +237 698 639 717
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      <p className="text-center text-white/20 text-xs pb-12">
        © {new Date().getFullYear()} Finova Capital · Benjamin Nkoa — All platforms listed are official channels.
      </p>
    </div>
  );
}
