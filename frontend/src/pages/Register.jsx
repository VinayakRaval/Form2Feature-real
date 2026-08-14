import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerFarmer } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [securityCode, setSecurityCode] = useState("");
  const [captcha, setCaptcha] = useState("K7P4X");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (securityCode.toUpperCase() !== captcha) {
      setMessage("Invalid security verification code.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerFarmer({
        full_name: form.full_name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });

      if (result.success) {
        setMessage("Account created successfully. Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed."
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
        <div className="w-full max-w-[500px]">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            {/* CARD HEADER */}
            <div className="bg-[#111827] text-white text-center px-6 py-5 border-b-4 border-[#f95700]">
              <div className="mx-auto w-11 h-11 rounded-full bg-[#f95700]/20 border border-[#f95700]/40 flex items-center justify-center mb-1.5">
                <span className="text-xl">👨‍🌾</span>
              </div>

              <h2 className="text-xl font-black tracking-wide uppercase">
                Create Account
              </h2>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Farmer Registration
              </p>
            </div>

            {/* FORM */}
            <div className="px-7 py-5">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* NAME */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                    Full Name <span className="text-[#f95700]">*</span>
                  </label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#f95700] focus:ring-1 focus:ring-[#f95700] transition text-sm text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>

                {/* EMAIL & MOBILE IN ONE ROW */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                      Email <span className="text-[#f95700]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#f95700] focus:ring-1 focus:ring-[#f95700] transition text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                      Mobile <span className="text-[#f95700]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile"
                      maxLength="10"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#f95700] focus:ring-1 focus:ring-[#f95700] transition text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD & CONFIRM PASSWORD IN ONE ROW */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                      Password <span className="text-[#f95700]">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#f95700] focus:ring-1 focus:ring-[#f95700] transition text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                      Confirm <span className="text-[#f95700]">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#f95700] focus:ring-1 focus:ring-[#f95700] transition text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* SECURITY VERIFICATION */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">
                    Security Code <span className="text-[#f95700]">*</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#f95700] focus:ring-1 focus:ring-[#f95700] transition text-sm text-gray-800 placeholder-gray-400"
                      required
                    />

                    <div className="w-28 rounded-lg bg-[#111827] text-[#f95700] flex items-center justify-center font-bold tracking-[0.15em] italic select-none text-base">
                      {captcha}
                    </div>

                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="w-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center font-bold text-gray-600 text-base"
                      title="Refresh code"
                    >
                      ↻
                    </button>
                  </div>
                </div>

                {/* MESSAGE */}
                {message && (
                  <div className="bg-orange-50 border border-orange-200 text-[#f95700] rounded-lg p-2.5 text-xs">
                    {message}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#f95700] hover:bg-[#e04e00] active:bg-[#c94500] text-white rounded-lg py-2.5 text-sm font-semibold transition shadow-md shadow-[#f95700]/20 disabled:opacity-70 mt-1"
                >
                  {loading ? "Creating Account..." : "Create Farmer Account"}
                </button>
              </form>

              <button
                onClick={() => navigate("/login")}
                className="w-full mt-3 text-gray-600 text-xs font-semibold hover:text-[#f95700] transition"
              >
                Already registered? <span className="text-[#f95700] underline">Sign in</span>
              </button>
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

export default Register;