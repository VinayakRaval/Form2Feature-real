import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(
      "If an account exists with this email, password reset instructions will be provided."
    );
  };

  return (
    <div className="h-screen bg-[#f4f5f7] flex flex-col font-sans overflow-hidden">
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0b1320] text-gray-300 text-xs py-1.5 px-6 flex justify-between items-center shrink-0">
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">Skip to main content</span>
          <span className="hover:underline cursor-pointer">English</span>
          <span className="hover:underline cursor-pointer">Contact us</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
        <div>Smart Agriculture Platform</div>
      </div>

      {/* HEADER / NAVBAR */}
      <header className="bg-white border-b border-gray-200 text-[#111827] shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <h1 className="font-extrabold text-2xl text-[#f95700] tracking-tight">
              Form2Feature
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-xs font-semibold text-gray-700 hover:text-[#f95700] transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-semibold text-[#f95700] border border-[#f95700] px-3.5 py-1.5 rounded-lg hover:bg-[#fff7f2] transition"
            >
              Sign in
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex justify-center items-center px-4 py-3 overflow-hidden">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            {/* CARD HEADER */}
            <div className="bg-[#111827] text-white text-center px-6 py-5 border-b-4 border-[#f95700]">
              <div className="mx-auto w-11 h-11 rounded-full bg-[#f95700]/20 border border-[#f95700]/40 flex items-center justify-center mb-1.5">
                <span className="text-xl">🔑</span>
              </div>

              <h2 className="text-xl font-black tracking-wide uppercase">
                Reset Password
              </h2>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Recover your farmer account
              </p>
            </div>

            {/* CARD BODY */}
            <div className="px-7 py-6">
              <p className="text-gray-600 text-xs leading-relaxed mb-5">
                Enter the email address associated with your Form2Feature
                account. We will send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                    Email Address <span className="text-[#f95700]">*</span>
                  </label>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#f95700] focus-within:ring-1 focus-within:ring-[#f95700] transition">
                    <div className="w-10 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-sm text-gray-500">
                      ✉️
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-3 py-2 outline-none text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {message && (
                  <div className="bg-orange-50 border border-orange-200 text-[#f95700] rounded-lg p-3 text-xs leading-5">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#f95700] hover:bg-[#e04e00] active:bg-[#c94500] text-white rounded-lg py-2.5 text-sm font-semibold transition shadow-md shadow-[#f95700]/20 mt-1"
                >
                  Send Reset Instructions
                </button>
              </form>

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 border border-gray-200 rounded-lg py-2 text-xs font-semibold text-gray-700 hover:text-[#f95700] hover:border-[#f95700] transition text-center"
                >
                  ← Back to Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 border border-gray-200 rounded-lg py-2 text-xs font-semibold text-gray-700 hover:text-[#f95700] hover:border-[#f95700] transition text-center"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#111827] border-t-2 border-[#f95700] text-gray-300 shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-2.5 text-center text-xs text-gray-400">
          © 2026 Form2Feature. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default ForgotPassword;