import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securityCode, setSecurityCode] = useState("");
  const [captcha, setCaptcha] = useState("F7K9B");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";

    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setCaptcha(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (securityCode.toUpperCase() !== captcha) {
      setError("Invalid security verification code.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (result.user.role === "farmer") {
          navigate("/farmer/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
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

      {/* TOP NAVBAR */}
      <header className="bg-white border-b border-gray-200 text-[#111827] shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
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
              onClick={() => navigate("/register")}
              className="text-xs font-semibold text-[#f95700] border border-[#f95700] px-3.5 py-1.5 rounded-lg hover:bg-[#fff7f2] transition"
            >
              Create account
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex justify-center items-center px-4 py-3 overflow-hidden">
        <div className="w-full max-w-[480px]">
          {/* LOGIN CARD */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            {/* CARD HEADER */}
            <div className="bg-[#111827] text-white px-6 py-5 text-center border-b-4 border-[#f95700]">
              <div className="mx-auto w-11 h-11 rounded-full bg-[#f95700]/20 border border-[#f95700]/40 flex items-center justify-center mb-1.5">
                <span className="text-xl">🔒</span>
              </div>

              <h2 className="text-xl font-black tracking-wide uppercase">
                Log In
              </h2>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Farmer & User Portal
              </p>
            </div>

            {/* FORM */}
            <div className="px-7 py-5">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                    Email Address <span className="text-[#f95700]">*</span>
                  </label>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#f95700] focus-within:ring-1 focus-within:ring-[#f95700] transition">
                    <div className="w-10 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-sm text-gray-500">
                      👤
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="flex-1 px-3 py-2 outline-none text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD WITH VIEW TOGGLE */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                    Password <span className="text-[#f95700]">*</span>
                  </label>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#f95700] focus-within:ring-1 focus-within:ring-[#f95700] transition">
                    <div className="w-10 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-sm text-gray-500">
                      🔒
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      className="flex-1 px-3 py-2 outline-none text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 bg-gray-50 border-l border-gray-200 text-gray-500 hover:text-[#f95700] transition text-sm font-medium"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* SECURITY VERIFICATION */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                    Security Verification <span className="text-[#f95700]">*</span>
                  </label>

                  <div className="flex gap-2">
                    <div className="flex flex-1 border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#f95700] focus-within:ring-1 focus-within:ring-[#f95700] transition">
                      <div className="w-10 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-sm text-gray-500">
                        🛡️
                      </div>
                      <input
                        type="text"
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 outline-none text-sm text-gray-800 placeholder-gray-400"
                        required
                      />
                    </div>

                    {/* CAPTCHA */}
                    <div className="w-28 bg-[#111827] rounded-lg flex items-center justify-center text-[#f95700] font-bold tracking-[0.15em] italic select-none text-base">
                      {captcha}
                    </div>

                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="w-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center font-bold text-gray-600 text-base"
                      title="Refresh security code"
                    >
                      ↻
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-2.5 text-xs">
                    {error}
                  </div>
                )}

                {/* BUTTONS */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#f95700] hover:bg-[#e04e00] active:bg-[#c94500] text-white rounded-lg py-2.5 text-sm font-semibold transition shadow-md shadow-[#f95700]/20 disabled:opacity-70"
                  >
                    {loading ? "Signing In..." : "➜  Log In"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="border border-gray-300 text-gray-700 bg-gray-50 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* BOTTOM OPTIONS */}
              <div className="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-gray-600 hover:text-[#f95700] transition"
                >
                  Forgot Password?
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="text-xs font-semibold text-[#f95700] hover:underline transition"
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

export default Login;