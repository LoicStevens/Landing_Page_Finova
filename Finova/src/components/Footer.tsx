export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 py-20">

      {/* GLOW TOP LINE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[2px]
        bg-gradient-to-r from-transparent via-[#4EF2FF] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* LOGO + TEXT */}
        <div>
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
            <li className="hover:text-[#4EF2FF] cursor-pointer">About</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer">Contact</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer">Careers</li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-[#4EF2FF] cursor-pointer">Terms of Service</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer">Privacy Policy</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer">Disclaimer</li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-[#4EF2FF] cursor-pointer">Twitter</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer">LinkedIn</li>
            <li className="hover:text-[#4EF2FF] cursor-pointer">YouTube</li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-xs mt-16">
        © {new Date().getFullYear()} FINOVA CAPITAL — All Rights Reserved.
      </div>
    </footer>
  );
}
