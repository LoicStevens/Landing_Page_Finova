import { Link } from "react-router-dom";

interface Props {
  title: string;
}

export default function ComingSoon({ title }: Props) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#4EF2FF] mb-4">{title}</h1>
      <p className="text-white/60 text-base sm:text-lg mb-8 max-w-sm">This page will be available soon.</p>
      <Link
        to="/"
        className="bg-gradient-to-r from-[#3EE8FF] to-[#0EA5E9] text-black px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition text-base"
      >
        Back to Home
      </Link>
    </div>
  );
}
