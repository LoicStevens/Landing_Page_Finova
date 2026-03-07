import { useState, useEffect } from "react";
import { FiMail, FiAlertCircle, FiCheckCircle, FiX, FiUserPlus } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [showNoAccount, setShowNoAccount] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  // Gère l'animation d'entrée/sortie du popup
  useEffect(() => {
    if (showNoAccount) {
      setTimeout(() => setPopupVisible(true), 10);
    } else {
      setPopupVisible(false);
    }
  }, [showNoAccount]);

  const dismissPopup = () => {
    setPopupVisible(false);
    setTimeout(() => setShowNoAccount(false), 400);
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many requests. Please wait a moment and try again.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmed = email.trim();

      // Vérifie si l'email existe dans Firebase Auth
      const methods = await fetchSignInMethodsForEmail(auth, trimmed);

      if (methods.length === 0) {
        // Aucun compte trouvé → affiche le popup
        setShowNoAccount(true);
        setLoading(false);
        return;
      }

      // Compte trouvé → envoie le reset
      await sendPasswordResetEmail(auth, trimmed, {
        url: window.location.origin + "/signin",
        handleCodeInApp: false,
      });
      setSent(true);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">

      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,242,255,0.10),transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.05] bg-[url('/grid.svg')] bg-repeat" />
      <div className="absolute top-1/3 -left-32 w-72 h-72 bg-[#4EF2FF]/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/3 -right-32 w-72 h-72 bg-[#0EA5E9]/10 blur-[100px] rounded-full" />

      {/* ── POPUP "Pas de compte" ── */}
      {showNoAccount && (
        <div
          className={`
            fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4
            transition-all duration-500 ease-out
            ${popupVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}
          `}
        >
          <div className="relative bg-[#0A0F1A] border border-[#4EF2FF]/20 rounded-2xl p-5 shadow-[0_0_50px_rgba(78,242,255,0.15)] backdrop-blur-xl overflow-hidden">

            {/* Glow top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4EF2FF]/60 to-transparent" />

            {/* Close button */}
            <button
              onClick={dismissPopup}
              className="absolute top-3 right-3 text-white/30 hover:text-white/70 transition"
            >
              <FiX size={16} />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#4EF2FF]/10 border border-[#4EF2FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                <FiUserPlus size={18} className="text-[#4EF2FF]" />
              </div>

              <div className="flex-1">
                <p className="text-white font-bold text-base leading-snug">
                  No Finova Capital account found
                </p>
                <p className="text-white/50 text-sm mt-1.5 leading-relaxed">
                  The address <span className="text-[#4EF2FF]">{email}</span> is not yet registered. Create your account to access the platform.
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="flex-1 bg-gradient-to-r from-[#3EE8FF] to-[#0EA5E9] text-black text-sm font-bold py-2.5 rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(78,242,255,0.35)] transition"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={dismissPopup}
                    className="flex-1 text-white/50 text-sm border border-white/10 py-2.5 rounded-lg hover:bg-white/5 hover:text-white/80 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-dismiss bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4EF2FF] to-[#0EA5E9]"
                style={{
                  animation: popupVisible ? "shrink 6s linear forwards" : "none",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Finova Logo" className="h-12 w-auto object-contain mb-3" />
          <span className="text-2xl font-bold text-[#4EF2FF] tracking-widest">FINOVA</span>
          <span className="text-xs font-semibold text-[#4EF2FF]/70 tracking-[0.4em]">CAPITAL</span>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(78,242,255,0.08)]">

          <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-white/40 text-base mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {/* Success state */}
          {sent ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-[#4EF2FF]/10 border border-[#4EF2FF]/30 flex items-center justify-center">
                <FiCheckCircle size={28} className="text-[#4EF2FF]" />
              </div>
              <div>
                <p className="text-white font-semibold">Email envoyé !</p>
                <p className="text-white/40 text-base mt-1">
                  Vérifiez votre boîte à <span className="text-[#4EF2FF]">{email}</span>.
                </p>
              </div>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-white/40 text-sm hover:text-white/60 transition mt-2"
              >
                Renvoyer avec un autre email
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-base rounded-xl px-4 py-3 mb-5">
                  <FiAlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Adresse email</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4EF2FF]/50 focus-within:shadow-[0_0_0_1px_rgba(78,242,255,0.2)] transition">
                    <FiMail className="text-[#4EF2FF]/60 mr-3 shrink-0" size={16} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/20"
                      placeholder="exemple@mail.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#3EE8FF] to-[#0EA5E9] text-black font-bold py-3 rounded-xl hover:opacity-90 hover:shadow-[0_0_20px_rgba(78,242,255,0.3)] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Envoyer le lien"
                  )}
                </button>
              </form>
            </>
          )}

          <div className="flex flex-col gap-2 mt-6 text-center text-sm text-white/40">
            <span>
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link to="/signin" className="text-[#4EF2FF] hover:underline font-medium">
                Se connecter
              </Link>
            </span>
            <span>
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-[#4EF2FF] hover:underline font-medium">
                S'inscrire
              </Link>
            </span>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © 2025 Finova Capital. All rights reserved.
        </p>
      </div>
    </div>
  );
}
