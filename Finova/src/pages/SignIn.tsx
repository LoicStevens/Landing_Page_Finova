import  { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import plantImage from "../assets/auth.jpg";
import { Link } from "react-router-dom";


export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* -------- LEFT LOGIN FORM -------- */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-gray-800">Sign In</h1>

          {/* Google Login */}
          <button className="mt-6 w-full bg-white border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
            <FcGoogle size={22} />
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* LOGIN FORM */}
          <form className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-gray-600 text-sm">Email address *</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-3 focus-within:border-green-600">
                <FiMail className="text-gray-500 mr-2" size={18} />
                <input
                  type="email"
                  className="flex-1 outline-none"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-gray-600 text-sm">Password *</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg p-3 focus-within:border-green-600">
                <FiLock className="text-gray-500 mr-2" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  className="flex-1 outline-none"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-green-600 hover:underline">
              Forgot Password?
            </Link>
            </div>

            {/* SUBMIT */}
            <button className="w-full mt-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Sign in
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Don’t have an account?
            <Link to="/register" className="text-green-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>

        {/* -------- RIGHT IMAGE -------- */}
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
