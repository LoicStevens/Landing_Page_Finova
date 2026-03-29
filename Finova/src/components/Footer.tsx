import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaInstagram, FaReddit, FaWhatsapp, FaTelegram } from "react-icons/fa";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";

const SOCIALS = [
  { icon: FaFacebook,  label: "Facebook",  href: "https://www.facebook.com/share/1A6oZeNShW/",                          color: "#1877F2" },
  { icon: FaYoutube,   label: "YouTube",   href: "https://youtube.com/@finocap-z9i?si=oT7L9gUG_BOidn9v",                color: "#FF0000" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/_finocap?igsh=bXo0MDE5MHhpcnhr",            color: "#E1306C" },
  { icon: FaXTwitter,  label: "X",         href: "https://x.com/FinoCap_?t=Iwx9ApcYDUH_tDMzGQUvYg&s=09",              color: "#ffffff" },
  { icon: FaTelegram,  label: "Telegram",  href: "https://t.me/FinoCap",                                                color: "#26A5E4" },
  { icon: FaReddit,    label: "Reddit",    href: "https://www.reddit.com/user/Main_Recover_1840/",                      color: "#FF4500" },
  { icon: FaTiktok,    label: "TikTok",    href: "https://tiktok.com/@_finocap",                                        color: "#ffffff" },
  { icon: FaWhatsapp,  label: "WhatsApp",  href: "https://wa.me/237698639717",                                          color: "#25D366" },
];

const LINKS_SERVICES = [
  { label: "Trading Tools",   path: "/trading-tools" },
  { label: "Performance",     path: "/performance" },
  { label: "Academy",         path: "/academy" },
  { label: "Market Insights", path: "/market-insights" },
  { label: "Consulting",      path: "/consulting" },
];

const LINKS_COMPANY = [
  { label: "About",   path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Free Guide", path: "/guide" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#040810] border-t border-white/8 pt-16 pb-8">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[2px] bg-gradient-to-r from-transparent via-[#4EF2FF] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Finova Capital" className="h-10" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#4EF2FF] tracking-wider">FINOVA</span>
                <span className="text-[10px] font-semibold text-[#4EF2FF] tracking-[0.35em]">CAPITAL</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Algorithmic trading systems, financial education and performance tools —
              from savings to freedom.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2.5">
              {LINKS_SERVICES.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className="text-gray-400 text-sm hover:text-[#4EF2FF] transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {LINKS_COMPANY.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className="text-gray-400 text-sm hover:text-[#4EF2FF] transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Follow Us</h4>
            <div className="flex flex-wrap gap-2.5">
              {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label} title={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = `${color}22`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}55`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Icon size={15} style={{ color }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/6 pt-6 space-y-3">
          <p className="text-gray-500 text-xs leading-relaxed max-w-4xl">
            <strong className="text-gray-400">Risk Disclaimer:</strong> Past performance does not guarantee future results.
            Trading financial markets involves significant risk. Never trade with capital you cannot afford to lose.
            All backtest results shown are historical simulations and do not represent future performance.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-600">
            <span>© {new Date().getFullYear()} Finova Capital · Benjamin Nkoa — All Rights Reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-gray-400 cursor-pointer transition">Terms of Service</span>
              <span className="hover:text-gray-400 cursor-pointer transition">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
