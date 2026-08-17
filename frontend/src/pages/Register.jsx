import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: "farmer",
    });

    const [securityCode, setSecurityCode] = useState("");
    const [captcha, setCaptcha] = useState("");

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [loading, setLoading] = useState(false);

    // =========================================================
    // CAPTCHA
    // =========================================================

    const generateCaptcha = () => {
        const characters =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let result = "";

        for (let i = 0; i < 5; i++) {
            result += characters.charAt(
                Math.floor(
                    Math.random() * characters.length
                )
            );
        }

        setCaptcha(result);
        setSecurityCode("");
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================================================
    // HANDLE REGISTER
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        // Name
        if (!form.full_name.trim()) {
            setMessage("Please enter your full name.");
            setMessageType("error");
            return;
        }

        // Email
        if (!form.email.trim()) {
            setMessage("Please enter your email address.");
            setMessageType("error");
            return;
        }

        // Mobile
        if (!/^[0-9]{10}$/.test(form.mobile.trim())) {
            setMessage(
                "Mobile number must contain exactly 10 digits."
            );
            setMessageType("error");
            return;
        }

        // Password
        if (form.password.length < 6) {
            setMessage(
                "Password must contain at least 6 characters."
            );
            setMessageType("error");
            return;
        }

        // Confirm password
        if (
            form.password !==
            form.confirmPassword
        ) {
            setMessage("Passwords do not match.");
            setMessageType("error");
            return;
        }

        // CAPTCHA
        if (
            securityCode.trim().toUpperCase() !==
            captcha.trim().toUpperCase()
        ) {
            setMessage(
                "Invalid security verification code."
            );
            setMessageType("error");

            generateCaptcha();

            return;
        }

        setLoading(true);

        try {
            console.log("REGISTER:", {
                full_name: form.full_name,
                email: form.email,
                mobile: form.mobile,
                role: form.role,
            });

            const result = await registerUser({
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                mobile: form.mobile.trim(),
                password: form.password,
                role: form.role,
            });

            console.log(
                "REGISTER RESPONSE:",
                result
            );

            if (result?.success) {
                setMessage(
                    `${form.role === "buyer"
                        ? "Buyer"
                        : "Farmer"
                    } account created successfully.`
                );

                setMessageType("success");

                setTimeout(() => {
                    navigate("/login");
                }, 1200);

                return;
            }

            setMessage(
                result?.message ||
                "Registration failed."
            );

            setMessageType("error");

            generateCaptcha();

        } catch (error) {
            console.error(
                "REGISTER ERROR:",
                error
            );

            setMessage(
                error?.response?.data?.message ||
                error?.message ||
                "Registration failed."
            );

            setMessageType("error");

            generateCaptcha();

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f5f7] flex flex-col">

            {/* TOP BAR */}

            <div className="bg-[#0b1320] text-gray-300 text-xs py-2 px-6">

                <div className="max-w-7xl mx-auto flex justify-between">

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

                    <span>
                        Smart Agriculture Platform
                    </span>

                </div>

            </div>

            {/* NAVBAR */}

            <header className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <Link
                        to="/"
                        className="font-extrabold text-2xl text-[#f95700]"
                    >
                        Form2Feature
                    </Link>

                    <div className="flex gap-3">

                        <Link
                            to="/"
                            className="text-sm font-semibold text-gray-700 px-3 py-2 hover:text-[#f95700]"
                        >
                            Home
                        </Link>

                        <Link
                            to="/login"
                            className="text-sm font-semibold text-[#f95700] border border-[#f95700] px-4 py-2 rounded-lg"
                        >
                            Sign in
                        </Link>

                    </div>

                </div>

            </header>

            {/* MAIN */}

            <main className="flex-1 flex justify-center items-center px-4 py-8">

                <div className="w-full max-w-[520px]">

                    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">

                        {/* HEADER */}

                        <div className="bg-[#111827] text-white text-center px-6 py-6 border-b-4 border-[#f95700]">

                            <div className="text-4xl mb-2">
                                {form.role === "buyer"
                                    ? "🛒"
                                    : "👨‍🌾"}
                            </div>

                            <h2 className="text-xl font-black uppercase">
                                Create Account
                            </h2>

                            <p className="text-xs text-gray-400 uppercase mt-1">
                                {form.role === "buyer"
                                    ? "Buyer Registration"
                                    : "Farmer Registration"}
                            </p>

                        </div>

                        {/* FORM */}

                        <div className="px-7 py-6">

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >

                                {/* ROLE */}

                                <div>

                                    <label className="block text-xs font-bold uppercase mb-2">
                                        Register As *
                                    </label>

                                    <div className="grid grid-cols-2 gap-3">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm(
                                                    (previous) => ({
                                                        ...previous,
                                                        role: "farmer",
                                                    })
                                                )
                                            }
                                            className={`p-3 rounded-lg border font-bold ${
                                                form.role === "farmer"
                                                    ? "border-[#f95700] bg-[#fff7f2] text-[#f95700]"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            👨‍🌾 Farmer
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm(
                                                    (previous) => ({
                                                        ...previous,
                                                        role: "buyer",
                                                    })
                                                )
                                            }
                                            className={`p-3 rounded-lg border font-bold ${
                                                form.role === "buyer"
                                                    ? "border-[#f95700] bg-[#fff7f2] text-[#f95700]"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            🛒 Buyer
                                        </button>

                                    </div>

                                </div>

                                {/* NAME */}

                                <div>

                                    <label className="block text-xs font-bold uppercase mb-1">
                                        Full Name *
                                    </label>

                                    <input
                                        name="full_name"
                                        value={
                                            form.full_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter full name"
                                        className="w-full border rounded-lg px-3 py-3 outline-none focus:border-[#f95700]"
                                        required
                                    />

                                </div>

                                {/* EMAIL + MOBILE */}

                                <div className="grid grid-cols-2 gap-3">

                                    <div>

                                        <label className="block text-xs font-bold uppercase mb-1">
                                            Email *
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Email"
                                            className="w-full border rounded-lg px-3 py-3 outline-none focus:border-[#f95700]"
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label className="block text-xs font-bold uppercase mb-1">
                                            Mobile *
                                        </label>

                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={
                                                form.mobile
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="10 digit mobile"
                                            maxLength={10}
                                            className="w-full border rounded-lg px-3 py-3 outline-none focus:border-[#f95700]"
                                            required
                                        />

                                    </div>

                                </div>

                                {/* PASSWORD */}

                                <div className="grid grid-cols-2 gap-3">

                                    <div>

                                        <label className="block text-xs font-bold uppercase mb-1">
                                            Password *
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={
                                                form.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Password"
                                            className="w-full border rounded-lg px-3 py-3 outline-none focus:border-[#f95700]"
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label className="block text-xs font-bold uppercase mb-1">
                                            Confirm *
                                        </label>

                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={
                                                form.confirmPassword
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Confirm"
                                            className="w-full border rounded-lg px-3 py-3 outline-none focus:border-[#f95700]"
                                            required
                                        />

                                    </div>

                                </div>

                                {/* CAPTCHA */}

                                <div>

                                    <label className="block text-xs font-bold uppercase mb-1">
                                        Security Code *
                                    </label>

                                    <div className="flex gap-2">

                                        <input
                                            value={
                                                securityCode
                                            }
                                            onChange={(e) =>
                                                setSecurityCode(
                                                    e.target.value
                                                )
                                            }
                                            maxLength={5}
                                            placeholder="Enter code"
                                            className="flex-1 border rounded-lg px-3 py-3 outline-none focus:border-[#f95700]"
                                            required
                                        />

                                        <div className="w-28 bg-[#111827] rounded-lg flex items-center justify-center text-[#f95700] font-bold tracking-widest">
                                            {captcha}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                generateCaptcha
                                            }
                                            className="w-11 border rounded-lg text-xl"
                                        >
                                            ↻
                                        </button>

                                    </div>

                                </div>

                                {/* MESSAGE */}

                                {message && (

                                    <div
                                        className={`p-3 rounded-lg text-sm ${
                                            messageType === "success"
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-red-50 text-red-600 border border-red-200"
                                        }`}
                                    >
                                        {message}
                                    </div>

                                )}

                                {/* BUTTON */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#f95700] hover:bg-[#e04e00] text-white rounded-lg py-3 font-semibold disabled:opacity-60"
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : form.role === "buyer"
                                            ? "Create Buyer Account"
                                            : "Create Farmer Account"}
                                </button>

                            </form>

                            <div className="text-center mt-4">

                                <Link
                                    to="/login"
                                    className="text-sm text-[#f95700] font-semibold hover:underline"
                                >
                                    Already registered? Sign in
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

            {/* FOOTER */}

            <footer className="bg-[#111827] border-t-2 border-[#f95700] text-center text-gray-400 text-xs py-4">
                © 2026 Form2Feature. All rights reserved.
            </footer>

        </div>
    );
}

export default Register;