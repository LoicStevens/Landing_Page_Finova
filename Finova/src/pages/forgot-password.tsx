import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import ForgotImg from "../assets/forgot.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SECTION */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-gray-800">
            Forgot Password
          </h1>

          <p className="text-gray-600 text-sm mt-2">
            Enter your email to receive a password reset link.
          </p>

          {/* Form */}
          <form className="space-y-5 mt-6">

            <div className="relative">
              <label className="text-gray-600 text-sm">Email address *</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-3 pl-10 outline-none focus:border-green-600"
                  placeholder="example@mail.com"
                />
                <FiMail className="absolute left-3 top-4 text-gray-400 text-lg" />
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Send Reset Link
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Remember your password?
            <Link to="/signin" className="text-green-600 ml-1 font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Don’t have an account?
            <Link to="/register" className="text-green-600 ml-1 font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* RIGHT SECTION - IMAGE */}
        <div className="hidden md:block">
          <img
            src={ForgotImg}
            alt="forgot"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
