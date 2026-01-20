export default function SuccessPage() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">

      {/* HOLOGRAPHIC BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,242,255,0.18),transparent_70%)] blur-3xl" />

      {/* Floating glow orbs */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-[#4EF2FF]/20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-[#4EF2FF]/25 blur-[100px] rounded-full animate-pulse-slow"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-lg text-center 
        bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 
        shadow-[0_0_50px_rgba(78,242,255,0.15)]
        animate-fadePop">

        {/* HOLOGRAPHIC CHECK */}
        <div className="mx-auto mb-6 w-24 h-24 rounded-full 
          bg-[#4EF2FF]/15 border border-[#4EF2FF]/40 
          flex items-center justify-center
          shadow-[0_0_45px_rgba(78,242,255,0.35)]
          animate-glowPulse">
          <svg
            className="w-12 h-12 text-[#4EF2FF]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* TEXT */}
        <h1 className="text-4xl font-bold text-white">
          Request <span className="text-[#4EF2FF]">Received</span>!
        </h1>

        <p className="text-gray-300 mt-4 text-lg">
          Thank you for choosing <span className="text-[#4EF2FF] font-semibold">FINOVA CAPITAL</span>.
          <br />
          Your trading guide request has been successfully submitted.
        </p>

        <p className="text-gray-400 mt-3 text-sm max-w-md mx-auto">
          You will receive an email or WhatsApp message shortly with access to the guide.
        </p>

        {/* BUTTON */}
        <a
          href="/"
          className="mt-10 inline-block px-10 py-4 rounded-full font-semibold text-black 
            bg-[#4EF2FF] 
            shadow-[0_0_25px_rgba(78,242,255,0.45)]
            hover:shadow-[0_0_45px_rgba(78,242,255,0.75)]
            transition text-lg"
        >
          Return Home
        </a>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadePop {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadePop {
          animation: fadePop 0.6s ease-out forwards;
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 35px rgba(78,242,255,0.35); }
          50% { box-shadow: 0 0 60px rgba(78,242,255,0.55); }
        }
        .animate-glowPulse {
          animation: glowPulse 3s infinite ease-in-out;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.15); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
