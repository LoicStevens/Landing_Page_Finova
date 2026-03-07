import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Hedge Fund", path: "/hedge-fund" },
  { label: "Trading Tools", path: "/trading-tools" },
  { label: "Academy", path: "/academy" },
  { label: "Market Insights", path: "/market-insights" },
  { label: "Consulting", path: "/consulting" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <nav className="relative mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">

        {/* LOGO + TEXTE */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Finova Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-[#4EF2FF] tracking-wider">
              FINOVA
            </span>
            <span className="text-[11px] font-semibold text-[#4EF2FF] tracking-[0.35em]">
              CAPITAL
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex gap-8 text-white/90 text-sm font-medium relative">
          {navItems.map(item => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="cursor-pointer hover:text-[#4EF2FF] transition"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* BARRE LUMINEUSE */}
          <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-[min(620px,100vw)]">
            <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[#4EF2FF] to-transparent opacity-95" />
            <div className="w-full h-[10px] bg-gradient-to-r from-transparent via-[#4EF2FF]/40 to-transparent blur-[8px] -mt-2" />
          </div>
        </ul>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/signin" className="text-white/90 hover:text-[#4EF2FF] transition">
            Log in
          </Link>
          <Link
            to="/register"
            className="
              bg-gradient-to-r
              from-[#3EE8FF]
              to-[#0EA5E9]
              text-black
              px-5 py-2
              rounded-full
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Sign up
          </Link>
        </div>

        {/* HAMBURGER BUTTON (Mobile) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 group"
        >
          <span className={`w-6 h-[2px] bg-[#4EF2FF] transition ${open ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span className={`w-6 h-[2px] bg-[#4EF2FF] transition ${open ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`w-6 h-[2px] bg-[#4EF2FF] transition ${open ? '-rotate-45 -translate-y-1' : ''}`}></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`
          md:hidden
          absolute top-full left-0 w-full
          bg-black/80 backdrop-blur-xl border-b border-white/10
          transition-all duration-300 overflow-hidden
          ${open ? "max-h-[400px] py-6" : "max-h-0 py-0"}
        `}
      >
        <ul className="flex flex-col items-center gap-6 text-white/90 text-lg font-medium">
          {navItems.map(item => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="cursor-pointer hover:text-[#4EF2FF] transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <div className="flex flex-col gap-4 mt-4">
            <Link
              to="/signin"
              className="text-white/90 hover:text-[#4EF2FF] transition text-center"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="
                bg-gradient-to-r
                from-[#3EE8FF]
                to-[#0EA5E9]
                text-black
                px-6 py-2
                rounded-full
                font-semibold
                hover:opacity-90
                transition
              "
              onClick={() => setOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </ul>
      </div>
    </header>
  );
}
