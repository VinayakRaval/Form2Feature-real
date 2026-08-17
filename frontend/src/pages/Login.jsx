import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [securityCode, setSecurityCode] =
        useState("");

    const [captcha, setCaptcha] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =========================================================
    // GENERATE CAPTCHA
    // =========================================================

    const generateCaptcha = () => {

        const characters =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let result = "";

        for (let i = 0; i < 5; i++) {

            result +=
                characters.charAt(
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                );

        }

        setCaptcha(result);

        // Clear old entered CAPTCHA
        setSecurityCode("");
    };


    // =========================================================
    // GENERATE CAPTCHA WHEN PAGE LOADS
    // =========================================================

    useEffect(() => {

        generateCaptcha();

    }, []);


    // =========================================================
    // LOGIN
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // -----------------------------------------------------
        // VALIDATE CAPTCHA
        // -----------------------------------------------------

        const enteredCode =
            securityCode
                .trim()
                .toUpperCase();

        const actualCode =
            captcha
                .trim()
                .toUpperCase();


        if (!enteredCode) {

            setError(
                "Please enter the security verification code."
            );

            return;
        }


        if (enteredCode !== actualCode) {

            setError(
                "Invalid security verification code."
            );

            // Generate fresh CAPTCHA
            generateCaptcha();

            return;
        }


        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        // -----------------------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------------------

        if (!password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        // -----------------------------------------------------
        // START LOGIN
        // -----------------------------------------------------

        setLoading(true);


        try {

            const result =
                await login(
                    email.trim(),
                    password
                );


            console.log(
                "LOGIN RESULT:",
                result
            );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (result?.success) {

                const role =
                    String(
                        result?.user?.role || ""
                    )
                    .trim()
                    .toLowerCase();


                console.log(
                    "LOGIN SUCCESS"
                );

                console.log(
                    "USER ROLE:",
                    role
                );


                // =================================================
                // FARMER
                // =================================================

                if (role === "farmer") {

                    navigate(
                        "/farmer/dashboard",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                // =================================================
                // BUYER
                // =================================================

                if (role === "buyer") {

                    navigate(
                        "/buyer/dashboard",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                // =================================================
                // UNKNOWN ROLE
                // =================================================

                setError(
                    "Invalid user role. Please contact administrator."
                );

                return;
            }


            // -------------------------------------------------
            // LOGIN FAILED
            // -------------------------------------------------

            setError(
                result?.message ||
                "Invalid email or password."
            );

            generateCaptcha();


        } catch (err) {

            console.error(
                "LOGIN ERROR:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Authentication failed. Please try again."
            );


            generateCaptcha();


        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // HOME
    // =========================================================

    const goHome = () => {

        navigate(
            "/",
            {
                replace: false
            }
        );

    };


    // =========================================================
    // REGISTER
    // =========================================================

    const goRegister = () => {

        navigate(
            "/register"
        );

    };


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    const goForgotPassword = () => {

        navigate(
            "/forgot-password"
        );

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="min-h-screen bg-[#f4f5f7] flex flex-col font-sans">


            {/* =================================================
                TOP ANNOUNCEMENT BAR
            ================================================== */}

            <div className="bg-[#0b1320] text-gray-300 text-xs py-2 px-6">

                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div className="flex gap-4">

                        <span>
                            Skip to main content
                        </span>

                        <span>
                            English
                        </span>

                        <span>
                            Contact us
                        </span>

                        <span>
                            Help
                        </span>

                    </div>


                    <div className="hidden sm:block">

                        Smart Agriculture Platform

                    </div>

                </div>

            </div>


            {/* =================================================
                NAVBAR
            ================================================== */}

            <header className="bg-white border-b border-gray-200">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">


                    {/* LOGO */}

                    <Link
                        to="/"
                        className="font-extrabold text-2xl text-[#f95700] tracking-tight hover:text-[#e04e00] transition"
                    >
                        Form2Feature
                    </Link>


                    {/* NAV BUTTONS */}

                    <div className="flex items-center gap-3">


                        {/* HOME */}

                        <Link
                            to="/"
                            className="text-sm font-semibold text-gray-700 hover:text-[#f95700] transition px-3 py-2"
                        >
                            Home
                        </Link>


                        {/* CREATE ACCOUNT */}

                        <Link
                            to="/register"
                            className="text-sm font-semibold text-[#f95700] border border-[#f95700] px-4 py-2 rounded-lg hover:bg-[#fff7f2] transition"
                        >
                            Create account
                        </Link>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================== */}

            <main className="flex-1 flex justify-center items-center px-4 py-8">

                <div className="w-full max-w-[480px]">


                    {/* =================================================
                        LOGIN CARD
                    ================================================== */}

                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">


                        {/* CARD HEADER */}

                        <div className="bg-[#111827] text-white px-6 py-6 text-center border-b-4 border-[#f95700]">

                            <div className="mx-auto w-12 h-12 rounded-full bg-[#f95700]/20 border border-[#f95700]/40 flex items-center justify-center mb-2">

                                <span className="text-xl">
                                    🔒
                                </span>

                            </div>


                            <h2 className="text-xl font-black tracking-wide uppercase">

                                Log In

                            </h2>


                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">

                                Farmer & User Portal

                            </p>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================== */}

                        <div className="px-7 py-6">

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >


                                {/* EMAIL */}

                                <div>

                                    <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">

                                        Email Address

                                        <span className="text-[#f95700]">
                                            {" "}*
                                        </span>

                                    </label>


                                    <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#f95700] focus-within:ring-1 focus-within:ring-[#f95700] transition">

                                        <div className="w-10 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-sm text-gray-500">

                                            👤

                                        </div>


                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Email Address"
                                            className="flex-1 px-3 py-3 outline-none text-sm text-gray-800 placeholder-gray-400"
                                            autoComplete="email"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* PASSWORD */}

                                <div>

                                    <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">

                                        Password

                                        <span className="text-[#f95700]">
                                            {" "}*
                                        </span>

                                    </label>


                                    <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#f95700] focus-within:ring-1 focus-within:ring-[#f95700] transition">

                                        <div className="w-10 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-sm text-gray-500">

                                            🔒

                                        </div>


                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Password"
                                            className="flex-1 px-3 py-3 outline-none text-sm text-gray-800 placeholder-gray-400"
                                            autoComplete="current-password"
                                            required
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            className="px-3 bg-gray-50 border-l border-gray-200 text-gray-500 hover:text-[#f95700] transition"
                                            title={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >

                                            {showPassword
                                                ? "🙈"
                                                : "👁️"}

                                        </button>

                                    </div>

                                </div>


                                {/* =================================================
                                    CAPTCHA
                                ================================================== */}

                                <div>

                                    <label className="block text-xs font-bold tracking-wider text-[#111827] mb-1 uppercase">

                                        Security Verification

                                        <span className="text-[#f95700]">
                                            {" "}*
                                        </span>

                                    </label>


                                    <div className="flex gap-2">


                                        {/* INPUT */}

                                        <div className="flex flex-1 border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#f95700] focus-within:ring-1 focus-within:ring-[#f95700] transition">

                                            <div className="w-10 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-sm text-gray-500">

                                                🛡️

                                            </div>


                                            <input
                                                type="text"
                                                value={securityCode}
                                                onChange={(e) =>
                                                    setSecurityCode(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter code"
                                                className="flex-1 px-3 py-3 outline-none text-sm text-gray-800 placeholder-gray-400 uppercase"
                                                autoComplete="off"
                                                maxLength={5}
                                                required
                                            />

                                        </div>


                                        {/* CAPTCHA DISPLAY */}

                                        <div
                                            className="w-28 bg-[#111827] rounded-lg flex items-center justify-center text-[#f95700] font-bold tracking-[0.15em] italic select-none text-base border border-gray-700"
                                            title="Security code"
                                        >

                                            {captcha}

                                        </div>


                                        {/* REFRESH */}

                                        <button
                                            type="button"
                                            onClick={
                                                generateCaptcha
                                            }
                                            className="w-11 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center font-bold text-gray-600 text-lg"
                                            title="Generate new security code"
                                        >

                                            ↻

                                        </button>

                                    </div>


                                    <p className="text-[11px] text-gray-400 mt-1">

                                        Enter the 5-character code shown above.

                                    </p>

                                </div>


                                {/* =================================================
                                    ERROR
                                ================================================== */}

                                {error && (

                                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-medium">

                                        {error}

                                    </div>

                                )}


                                {/* =================================================
                                    LOGIN + CANCEL
                                ================================================== */}

                                <div className="grid grid-cols-2 gap-3 pt-1">


                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#f95700] hover:bg-[#e04e00] active:bg-[#c94500] text-white rounded-lg py-3 text-sm font-semibold transition shadow-md shadow-[#f95700]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >

                                        {loading
                                            ? "Signing In..."
                                            : "➜  Log In"}

                                    </button>


                                    {/* HOME/CANCEL */}

                                    <Link
                                        to="/"
                                        className="border border-gray-300 text-gray-700 bg-gray-50 rounded-lg py-3 text-sm font-semibold hover:bg-gray-100 transition text-center"
                                    >

                                        Home

                                    </Link>

                                </div>

                            </form>


                            {/* =================================================
                                BOTTOM OPTIONS
                            ================================================== */}

                            <div className="flex justify-between items-center gap-3 mt-5 pt-4 border-t border-gray-100">


                                <button
                                    type="button"
                                    onClick={
                                        goForgotPassword
                                    }
                                    className="text-xs font-semibold text-gray-600 hover:text-[#f95700] transition"
                                >

                                    Forgot Password?

                                </button>


                                <Link
                                    to="/register"
                                    className="text-xs font-semibold text-[#f95700] hover:underline transition"
                                >

                                    Create Account

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </main>


            {/* =================================================
                FOOTER
            ================================================== */}

            <footer className="bg-[#111827] border-t-2 border-[#f95700] text-gray-300">

                <div className="max-w-5xl mx-auto px-6 py-4 text-center text-xs text-gray-400">

                    © 2026 Form2Feature. All rights reserved.

                </div>

            </footer>

        </div>

    );

}

export default Login;