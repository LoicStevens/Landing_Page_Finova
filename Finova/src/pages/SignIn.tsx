import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setLoading(true);
    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">

      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,242,255,0.10),transparent_70%)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('/grid.svg')] bg-repeat" />

      {/* Side glow accents */}
      <div className="absolute top-1/3 -left-32 w-72 h-72 bg-[#4EF2FF]/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-[#0EA5E9]/10 blur-[100px] rounded-full" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Finova Logo" className="h-12 w-auto object-contain mb-3" />
          <span className="text-2xl font-bold text-[#4EF2FF] tracking-widest">FINOVA</span>
          <span className="text-xs font-semibold text-[#4EF2FF]/70 tracking-[0.4em]">CAPITAL</span>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(78,242,255,0.08)]">

          <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
          <p className="text-white/40 text-base mb-6">Welcome back to Finova Capital</p>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-base rounded-xl px-4 py-3 mb-5">
              <FiAlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full bg-white/5 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 hover:border-[#4EF2FF]/30 transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-[#4EF2FF]" />
            ) : (
              <FcGoogle size={20} />
            )}
            <span className="text-white/80 font-medium text-base">
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-grow h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-grow h-px bg-white/10" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Email address</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4EF2FF]/50 focus-within:shadow-[0_0_0_1px_rgba(78,242,255,0.2)] transition">
                <FiMail className="text-[#4EF2FF]/60 mr-3 shrink-0" size={16} />
                <input
                  name="email"
                  type="email"
                  required
                  className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/20"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Password</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#4EF2FF]/50 focus-within:shadow-[0_0_0_1px_rgba(78,242,255,0.2)] transition">
                <FiLock className="text-[#4EF2FF]/60 mr-3 shrink-0" size={16} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-[#4EF2FF] transition ml-2"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#4EF2FF]"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-[#4EF2FF]/70 hover:text-[#4EF2FF] transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#3EE8FF] to-[#0EA5E9] text-black font-bold py-3 rounded-xl hover:opacity-90 hover:shadow-[0_0_20px_rgba(78,242,255,0.3)] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#4EF2FF] hover:underline font-medium">
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © 2025 Finova Capital. All rights reserved.
        </p>
      </div>
    </div>
  );
}
