import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState } from "react";
import { User, Mail,  Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function GuideForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const blockedDomains = [
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "yopmail.com"
  ];

  if (!emailRegex.test(email)) return false;

  const domain = email.split("@")[1];
  if (blockedDomains.includes(domain)) return false;

  return true;
};

const isValidWhatsApp = (phone: string) => {
  const whatsappRegex = /^\+[1-9]\d{7,14}$/;
  return whatsappRegex.test(phone);
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim();
  const whatsapp = (formData.get("whatsapp") as string).trim();

  if (!isValidEmail(email)) {
    alert("Please enter a valid professional email address.");
    return;
  }

  if (!isValidWhatsApp(whatsapp)) {
    alert("Please enter a valid WhatsApp number with country code (e.g. +237...).");
    return;
  }

  setLoading(true);

  try {
    await addDoc(collection(db, "subscribers"), {
      name,
      email,
      whatsapp,
      createdAt: serverTimestamp(),
      source: "guide-landing"
    });

    navigate("/success");
  } catch (error: any) {
    console.error("🔥 FIREBASE ERROR FULL:", error);
    alert("Something went wrong. Please try again.");
    setLoading(false);
  }
};


  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(78,242,255,0.15),transparent_70%)] blur-3xl" />

      <div className="relative z-10 max-w-xl w-full bg-white/5 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-xl">

        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
          Get the <span className="text-[#4EF2FF]">FINOVA CAPITAL ALGO</span> Trading Guide
        </h1>

        <p className="text-gray-300 text-center mt-3">
          Enter your information below to receive your copy.
        </p>

        <form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit}>

          {/* FULL NAME */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4EF2FF]/70" size={18} />
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              className="
                w-full pl-12 pr-5 py-4 rounded-xl
                bg-black/50 backdrop-blur-md
                border border-white/10
                text-white
                placeholder-white/30
                transition-all duration-300
                focus:outline-none
                focus:border-[#4EF2FF]/60
                focus:ring-2 focus:ring-[#4EF2FF]/30
              "
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4EF2FF]/70" size={18} />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className="
                w-full pl-12 pr-5 py-4 rounded-xl
                bg-black/50 backdrop-blur-md
                border border-white/10
                text-white
                placeholder-white/30
                transition-all duration-300
                focus:outline-none
                focus:border-[#4EF2FF]/60
                focus:ring-2 focus:ring-[#4EF2FF]/30
              "
            />
          </div>

          {/* WHATSAPP */}
          <div className="relative">
            <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4EF2FF]/70" size={18} />
            <input
              name="whatsapp"
              type="text"
              placeholder="+XXX XXX XXX XXX"

              required
              className="
                w-full pl-12 pr-5 py-4 rounded-xl
                bg-black/50 backdrop-blur-md
                border border-white/10
                text-white
                placeholder-white/30
                transition-all duration-300
                focus:outline-none
                focus:border-[#4EF2FF]/60
                focus:ring-2 focus:ring-[#4EF2FF]/30
              "
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`
              mt-6 w-full py-4 text-lg font-semibold rounded-xl
              bg-gradient-to-r from-[#4EF2FF] to-[#38bdf8]
              text-black
              shadow-[0_0_30px_rgba(78,242,255,0.45)]
              transition-all duration-300
              flex items-center justify-center gap-3
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-[0_0_55px_rgba(78,242,255,0.75)]"}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              "Subscribe & Download Guide"
            )}
          </button>

        </form>
      </div>
    </section>
  );
}
