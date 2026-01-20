import  { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // <-- Icônes PRO
import plantImage from "../assets/auth.jpg";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SECTION */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-gray-800">Register</h1>

          {/* Google Button */}
          <button className="mt-6 w-full bg-white border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* FORM */}
          <form className="space-y-4">

            <div>
              <label className="text-gray-600 text-sm">Email address *</label>
              <input
                type="email"
                className="w-full mt-1 border border-gray-300 rounded-lg p-3 outline-none focus:border-green-500"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">First name *</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-lg p-3 outline-none focus:border-green-600"
              />
            </div>

          

            {/* PASSWORD FIELD */}
            <div className="relative">
              <label className="text-gray-600 text-sm">Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 border border-gray-300 rounded-lg p-3 outline-none focus:border-green-600 pr-12"
              />

              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </button>
            </div>

            {/* TERMS */}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="w-4 h-4" />
              I accept the{" "}
              <span className="text-green-600 cursor-pointer">
                terms and conditions *
              </span>
            </label>

            {/* SUBMIT */}
            <button className="w-full mt-3 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Create an account
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Already have an account?
            <Link to="/signin" className="text-green-600 cursor-pointer ml-1 hover:underline">
                    Sign in
             </Link>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block">
          <img
            src={plantImage}
            alt="plant"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
