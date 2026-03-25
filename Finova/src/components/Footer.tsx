import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaInstagram, FaReddit, FaWhatsapp, FaTelegram } from "react-icons/fa";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";

const SOCIALS = [
  { icon: FaFacebook,  label: "Facebook",  href: "https://www.facebook.com/share/1A6oZeNShW/",                                                                              color: "#1877F2" },
  { icon: FaYoutube,   label: "YouTube",   href: "https://youtube.com/@finocap-z9i?si=oT7L9gUG_BOidn9v",                                                                    color: "#FF0000" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/_finocap?igsh=bXo0MDE5MHhpcnhr",                                                               color: "#E1306C" },
  { icon: FaXTwitter,  label: "X",         href: "https://x.com/FinoCap_?t=Iwx9ApcYDUH_tDMzGQUvYg&s=09",                                                                  color: "#ffffff" },
  { icon: FaTelegram,  label: "Telegram",  href: "https://t.me/FinoCap",                                                                                                    color: "#26A5E4" },
  { icon: FaReddit,    label: "Reddit",    href: "https://www.reddit.com/user/Main_Recover_1840/",                                                                          color: "#FF4500" },
  { icon: FaTiktok,    label: "TikTok",    href: "https://tiktok.com/@_finocap",                                                                                            color: "#ffffff" },
  { icon: FaWhatsapp,  label: "WhatsApp",  href: "https://wa.me/237698639717",                                                                                              color: "#25D366" },
];

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 py-12 md:py-20">

      {/* GLOW TOP LINE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[2px]
        bg-gradient-to-r from-transparent via-[#4EF2FF] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

        {/* LOGO + TEXT */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="logo" className="h-10" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#4EF2FF] tracking-wider">FINOVA</span>
              <span className="text-[10px] font-semibold text-[#4EF2FF] tracking-[0.35em]">CAPITAL</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Quantitative Finance • Advanced AI Models • Institutional Trading Solutions.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/about"   className="hover:text-[#4EF2FF] transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-[#4EF2FF] transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-[#4EF2FF] cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer transition-colors">Disclaimer</li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${color}22`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}66`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <Icon size={16} style={{ color }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-xs mt-10 md:mt-16 px-6">
        © {new Date().getFullYear()} FINOVA CAPITAL — All Rights Reserved.
      </div>
    </footer>
  );
}
