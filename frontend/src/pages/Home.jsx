import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// SVG ICONS
// ============================================================

const Icon = ({
    type,
    size = 42,
    strokeWidth = 1.8
}) => {

    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    switch (type) {

        // FARMER / AGRICULTURE
        case "farmer":
            return (
                <svg {...common}>
                    <path d="M3 21h18" />
                    <path d="M5 21V9l7-5 7 5v12" />
                    <path d="M9 21v-6h6v6" />
                    <path d="M8 10h8" />
                    <path d="M12 4V2" />
                </svg>
            );

        // CART / BUYER
        case "cart":
            return (
                <svg {...common}>
                    <circle cx="9" cy="20" r="1.5" />
                    <circle cx="18" cy="20" r="1.5" />
                    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                    <path d="M9 8v4" />
                    <path d="M12 8v4" />
                    <path d="M15 8v4" />
                </svg>
            );

        // AI / SMART
        case "ai":
            return (
                <svg {...common}>
                    <rect x="5" y="5" width="14" height="14" rx="3" />
                    <path d="M9 9h6v6H9z" />
                    <path d="M9 2v3" />
                    <path d="M15 2v3" />
                    <path d="M9 19v3" />
                    <path d="M15 19v3" />
                    <path d="M2 9h3" />
                    <path d="M2 15h3" />
                    <path d="M19 9h3" />
                    <path d="M19 15h3" />
                </svg>
            );

        // MARKET
        case "market":
            return (
                <svg {...common}>
                    <path d="M4 10h16" />
                    <path d="M5 10v10h14V10" />
                    <path d="M3 10l2-6h14l2 6" />
                    <path d="M8 14h3v6H8z" />
                    <path d="M14 14h3" />
                    <path d="M14 17h3" />
                </svg>
            );

        // MONEY
        case "money":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v10" />
                    <path d="M15 9.5c-.6-1-1.6-1.5-3-1.5-1.7 0-3 1-3 2.3 0 3.4 6 1.6 6 4.7 0 1.3-1.2 2.5-3.1 2.5-1.4 0-2.6-.5-3.4-1.6" />
                </svg>
            );

        // CHART
        case "chart":
            return (
                <svg {...common}>
                    <path d="M4 19V5" />
                    <path d="M4 19h17" />
                    <path d="M7 15l4-4 3 2 5-6" />
                    <path d="M17 7h2v2" />
                </svg>
            );

        // GOVERNMENT
        case "government":
            return (
                <svg {...common}>
                    <path d="M3 21h18" />
                    <path d="M5 21V10" />
                    <path d="M9 21V10" />
                    <path d="M15 21V10" />
                    <path d="M19 21V10" />
                    <path d="M3 10l9-6 9 6" />
                    <path d="M3 7h18" />
                </svg>
            );

        // DEAL
        case "deal":
            return (
                <svg {...common}>
                    <path d="M8 12l-2 2a3 3 0 0 0 4 4l2-2" />
                    <path d="M16 12l2-2a3 3 0 0 0-4-4l-2 2" />
                    <path d="M8 16l8-8" />
                    <path d="M5 8l3-3" />
                    <path d="M16 19l3-3" />
                </svg>
            );

        // TRANSACTION
        case "transaction":
            return (
                <svg {...common}>
                    <path d="M3 7h15" />
                    <path d="M15 4l3 3-3 3" />
                    <path d="M21 17H6" />
                    <path d="M9 14l-3 3 3 3" />
                </svg>
            );

        // STAR
        case "star":
            return (
                <svg {...common}>
                    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
                </svg>
            );

        // MESSAGE
        case "message":
            return (
                <svg {...common}>
                    <path d="M20 11.5a8 8 0 0 1-8 8 8.5 8.5 0 0 1-4-.9L4 20l1.4-3.5A8 8 0 1 1 20 11.5z" />
                    <path d="M8 11h.01" />
                    <path d="M12 11h.01" />
                    <path d="M16 11h.01" />
                </svg>
            );

        // CHECK
        case "check":
            return (
                <svg {...common}>
                    <path d="M5 12l4 4L19 6" />
                </svg>
            );

        // ARROW
        case "arrow":
            return (
                <svg {...common}>
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                </svg>
            );

        default:
            return null;
    }
};


// ============================================================
// HOME PAGE
// ============================================================

function Home() {

    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [feedbackSent, setFeedbackSent] = useState(false);

    // ========================================================
    // NAVIGATION
    // ========================================================

    const goLogin = () => {
        navigate("/login");
    };

    const goRegister = () => {
        navigate("/register");
    };

    const scrollTo = (id) => {

        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth"
            });
    };


    // ========================================================
    // FEEDBACK
    // ========================================================

    const submitFeedback = (e) => {

        e.preventDefault();

        if (!rating) {
            alert("Please select a rating.");
            return;
        }

        if (!feedback.trim()) {
            alert("Please enter your feedback.");
            return;
        }

        // Currently stored locally.
        // You can connect this to your backend later.

        const existingFeedback =
            JSON.parse(
                localStorage.getItem(
                    "form2feature_feedback"
                ) || "[]"
            );

        existingFeedback.push({
            rating,
            feedback: feedback.trim(),
            date: new Date().toISOString()
        });

        localStorage.setItem(
            "form2feature_feedback",
            JSON.stringify(existingFeedback)
        );

        setFeedback("");
        setRating(0);
        setFeedbackSent(true);

        setTimeout(() => {
            setFeedbackSent(false);
        }, 4000);
    };


    return (

        <div className="min-h-screen bg-white text-gray-900">


            {/* =====================================================
                TOP BAR
            ===================================================== */}

            <div className="bg-[#0b1320] text-gray-300 px-6 py-2 text-sm">

                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-5">

                        <button
                            type="button"
                            onClick={() =>
                                scrollTo("main-content")
                            }
                            className="hover:text-white"
                        >
                            Skip to main content
                        </button>

                        <span>
                            English
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                scrollTo("contact")
                            }
                            className="hover:text-white"
                        >
                            Contact us
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                scrollTo("feedback")
                            }
                            className="hover:text-white"
                        >
                            Feedback
                        </button>

                    </div>

                    <span className="hidden md:block">
                        Smart Agriculture Platform
                    </span>

                </div>

            </div>


            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">

                <div className="max-w-7xl mx-auto px-6 py-4">

                    <div className="flex items-center justify-between">

                        {/* LOGO */}

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-2xl font-extrabold text-[#f95700]"
                        >
                            Form2Feature
                        </button>


                        {/* NAV LINKS */}

                        <div className="hidden lg:flex items-center gap-8">

                            <button
                                type="button"
                                onClick={() =>
                                    scrollTo("about")
                                }
                                className="text-gray-700 hover:text-[#f95700] transition"
                            >
                                About
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollTo("how-it-works")
                                }
                                className="text-gray-700 hover:text-[#f95700] transition"
                            >
                                How It Works
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollTo("features")
                                }
                                className="text-gray-700 hover:text-[#f95700] transition"
                            >
                                Features
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollTo("roles")
                                }
                                className="text-gray-700 hover:text-[#f95700] transition"
                            >
                                Farmers & Buyers
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollTo("feedback")
                                }
                                className="text-gray-700 hover:text-[#f95700] transition"
                            >
                                Feedback
                            </button>

                        </div>


                        {/* AUTH */}

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={goLogin}
                                className="border border-[#f95700] text-[#f95700] px-5 py-2 rounded-lg font-semibold hover:bg-orange-50 transition"
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={goRegister}
                                className="bg-[#f95700] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#dc4b00] transition"
                            >
                                Register
                            </button>

                        </div>

                    </div>

                </div>

            </nav>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main id="main-content">


                {/* =================================================
                    HERO
                ================================================== */}

                <section className="bg-[#f8f9fa] px-6 py-20 md:py-28">

                    <div className="max-w-7xl mx-auto">

                        <div className="max-w-4xl">

                            <p className="text-[#f95700] font-bold tracking-widest text-sm mb-5">
                                SMART AGRICULTURE PLATFORM
                            </p>

                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#111827]">

                                Connecting Farmers,
                                <br />

                                Buyers &

                                <span className="text-[#f95700]">
                                    {" "}Better Markets.
                                </span>

                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 mt-7 max-w-3xl leading-relaxed">

                                Form2Feature is a smart agriculture
                                platform that helps farmers manage
                                crops, discover mandis, compare
                                market prices, calculate profits and
                                connect with buyers.

                            </p>


                            {/* HERO BUTTONS */}

                            <div className="flex flex-wrap gap-4 mt-9">

                                <button
                                    type="button"
                                    onClick={goRegister}
                                    className="bg-[#f95700] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#dc4b00] transition flex items-center gap-2"
                                >
                                    Get Started

                                    <Icon
                                        type="arrow"
                                        size={18}
                                        strokeWidth={2}
                                    />

                                </button>

                                <button
                                    type="button"
                                    onClick={goLogin}
                                    className="border border-gray-400 bg-white px-8 py-3 rounded-lg font-bold hover:border-[#f95700] hover:text-[#f95700] transition"
                                >
                                    Login
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        scrollTo("about")
                                    }
                                    className="border border-gray-300 bg-white px-8 py-3 rounded-lg font-semibold hover:border-gray-500 transition"
                                >
                                    Learn About Form2Feature
                                </button>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ABOUT
                ================================================== */}

                <section
                    id="about"
                    className="px-6 py-20 md:py-24"
                >

                    <div className="max-w-7xl mx-auto">

                        <div className="max-w-3xl">

                            <p className="text-[#f95700] font-bold uppercase text-sm">
                                About Form2Feature
                            </p>

                            <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                                A smarter way to manage agriculture
                            </h2>

                            <p className="text-gray-600 text-lg mt-5 leading-relaxed">

                                Form2Feature brings important
                                agricultural information and tools
                                together in one platform. Instead of
                                depending on multiple disconnected
                                sources, farmers can use one platform
                                to manage their crops, understand
                                market opportunities and make better
                                selling decisions.

                            </p>

                        </div>


                        {/* ABOUT CARDS */}

                        <div className="grid md:grid-cols-3 gap-6 mt-12">


                            {/* FARMERS */}

                            <div className="border rounded-2xl p-7 bg-white hover:shadow-lg transition">

                                <div className="w-14 h-14 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">

                                    <Icon
                                        type="farmer"
                                        size={34}
                                    />

                                </div>

                                <h3 className="text-xl font-bold mt-5">
                                    For Farmers
                                </h3>

                                <p className="text-gray-600 mt-3 leading-relaxed">

                                    Manage crops, find nearby mandis,
                                    compare prices, calculate expected
                                    profits and record sales.

                                </p>

                            </div>


                            {/* BUYERS */}

                            <div className="border rounded-2xl p-7 bg-white hover:shadow-lg transition">

                                <div className="w-14 h-14 rounded-xl bg-orange-50 text-[#f95700] flex items-center justify-center">

                                    <Icon
                                        type="cart"
                                        size={34}
                                    />

                                </div>

                                <h3 className="text-xl font-bold mt-5">
                                    For Buyers
                                </h3>

                                <p className="text-gray-600 mt-3 leading-relaxed">

                                    Browse agricultural products and
                                    discover opportunities to purchase
                                    crops directly from farmers.

                                </p>

                            </div>


                            {/* SMART TOOLS */}

                            <div className="border rounded-2xl p-7 bg-white hover:shadow-lg transition">

                                <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">

                                    <Icon
                                        type="ai"
                                        size={34}
                                    />

                                </div>

                                <h3 className="text-xl font-bold mt-5">
                                    Smart Tools
                                </h3>

                                <p className="text-gray-600 mt-3 leading-relaxed">

                                    Use market information, profit
                                    calculations and intelligent
                                    agriculture tools to support
                                    better decisions.

                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    HOW IT WORKS
                ================================================== */}

                <section
                    id="how-it-works"
                    className="bg-[#f8f9fa] px-6 py-20"
                >

                    <div className="max-w-7xl mx-auto">

                        <div className="text-center max-w-3xl mx-auto">

                            <p className="text-[#f95700] font-bold uppercase text-sm">
                                How It Works
                            </p>

                            <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                                Start using Form2Feature in three steps
                            </h2>

                            <p className="text-gray-600 mt-4">
                                Simple tools designed to make
                                agricultural decision-making easier.
                            </p>

                        </div>


                        <div className="grid md:grid-cols-3 gap-7 mt-12">


                            {/* STEP 1 */}

                            <div className="bg-white border rounded-2xl p-7">

                                <div className="w-12 h-12 bg-orange-100 text-[#f95700] rounded-full flex items-center justify-center font-bold text-xl">
                                    1
                                </div>

                                <h3 className="text-xl font-bold mt-5">
                                    Create an Account
                                </h3>

                                <p className="text-gray-600 mt-3">
                                    Register as a Farmer or Buyer and
                                    create your Form2Feature account.
                                </p>

                            </div>


                            {/* STEP 2 */}

                            <div className="bg-white border rounded-2xl p-7">

                                <div className="w-12 h-12 bg-orange-100 text-[#f95700] rounded-full flex items-center justify-center font-bold text-xl">
                                    2
                                </div>

                                <h3 className="text-xl font-bold mt-5">
                                    Explore the Platform
                                </h3>

                                <p className="text-gray-600 mt-3">
                                    Access crop information, market
                                    prices, mandis, sales and other
                                    useful tools.
                                </p>

                            </div>


                            {/* STEP 3 */}

                            <div className="bg-white border rounded-2xl p-7">

                                <div className="w-12 h-12 bg-orange-100 text-[#f95700] rounded-full flex items-center justify-center font-bold text-xl">
                                    3
                                </div>

                                <h3 className="text-xl font-bold mt-5">
                                    Make Better Decisions
                                </h3>

                                <p className="text-gray-600 mt-3">
                                    Use available information to plan
                                    purchases, sales and farming
                                    activities.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ROLES
                ================================================== */}

                <section
                    id="roles"
                    className="px-6 py-20"
                >

                    <div className="max-w-7xl mx-auto">

                        <div className="text-center">

                            <p className="text-[#f95700] font-bold uppercase text-sm">
                                Choose Your Role
                            </p>

                            <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                                Built for Farmers and Buyers
                            </h2>

                        </div>


                        <div className="grid md:grid-cols-2 gap-8 mt-12">


                            {/* FARMER */}

                            <div className="border rounded-2xl p-8 bg-white">

                                <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">

                                    <Icon
                                        type="farmer"
                                        size={42}
                                    />

                                </div>

                                <h3 className="text-2xl font-bold mt-5">
                                    Farmer
                                </h3>

                                <p className="text-gray-600 mt-3 leading-relaxed">

                                    Manage your agricultural activities,
                                    discover market opportunities and
                                    improve your selling decisions.

                                </p>

                                <ul className="mt-6 space-y-3 text-gray-700">

                                    {[
                                        "Manage crops",
                                        "Find nearby mandis",
                                        "View market prices",
                                        "Calculate profit",
                                        "Record sales",
                                        "Discover government schemes"
                                    ].map((item) => (

                                        <li
                                            key={item}
                                            className="flex items-center gap-2"
                                        >

                                            <span className="text-green-600">
                                                <Icon
                                                    type="check"
                                                    size={18}
                                                    strokeWidth={2.5}
                                                />
                                            </span>

                                            {item}

                                        </li>

                                    ))}

                                </ul>

                                <button
                                    type="button"
                                    onClick={goRegister}
                                    className="mt-7 bg-[#f95700] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#dc4b00] transition"
                                >
                                    Register as Farmer
                                </button>

                            </div>


                            {/* BUYER */}

                            <div className="border rounded-2xl p-8 bg-white">

                                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#f95700] flex items-center justify-center">

                                    <Icon
                                        type="cart"
                                        size={42}
                                    />

                                </div>

                                <h3 className="text-2xl font-bold mt-5">
                                    Buyer
                                </h3>

                                <p className="text-gray-600 mt-3 leading-relaxed">

                                    Discover agricultural products and
                                    connect with farmers for purchasing
                                    opportunities.

                                </p>

                                <ul className="mt-6 space-y-3 text-gray-700">

                                    {[
                                        "Browse available crops",
                                        "View crop information",
                                        "Make offers",
                                        "Manage deals",
                                        "Track transactions",
                                        "View market information"
                                    ].map((item) => (

                                        <li
                                            key={item}
                                            className="flex items-center gap-2"
                                        >

                                            <span className="text-green-600">
                                                <Icon
                                                    type="check"
                                                    size={18}
                                                    strokeWidth={2.5}
                                                />
                                            </span>

                                            {item}

                                        </li>

                                    ))}

                                </ul>

                                <button
                                    type="button"
                                    onClick={goRegister}
                                    className="mt-7 bg-[#f95700] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#dc4b00] transition"
                                >
                                    Register as Buyer
                                </button>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FEATURES
                ================================================== */}

                <section
                    id="features"
                    className="bg-[#f8f9fa] px-6 py-20"
                >

                    <div className="max-w-7xl mx-auto">

                        <div className="max-w-3xl">

                            <p className="text-[#f95700] font-bold uppercase text-sm">
                                Platform Features
                            </p>

                            <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                                Everything in one platform
                            </h2>

                        </div>


                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

                            {[
                                [
                                    "farmer",
                                    "Crop Management",
                                    "Add, update and manage your agricultural crops."
                                ],
                                [
                                    "market",
                                    "Mandi Finder",
                                    "Find nearby agricultural markets."
                                ],
                                [
                                    "money",
                                    "Market Prices",
                                    "Compare available crop market prices."
                                ],
                                [
                                    "chart",
                                    "Profit Calculator",
                                    "Estimate revenue, expenses and profit."
                                ],
                                [
                                    "ai",
                                    "AI Agriculture",
                                    "Use intelligent tools for agricultural decisions."
                                ],
                                [
                                    "government",
                                    "Government Schemes",
                                    "Discover useful government agriculture schemes."
                                ],
                                [
                                    "cart",
                                    "Buyer Marketplace",
                                    "Buyers can discover available agricultural crops."
                                ],
                                [
                                    "deal",
                                    "Deals & Offers",
                                    "Manage purchase offers and accepted deals."
                                ],
                                [
                                    "transaction",
                                    "Transactions",
                                    "Track agricultural buying and selling transactions."
                                ]
                            ].map(
                                ([
                                    icon,
                                    title,
                                    description
                                ]) => (

                                    <div
                                        key={title}
                                        className="bg-white border rounded-2xl p-6 hover:shadow-lg transition"
                                    >

                                        <div className="w-14 h-14 rounded-xl bg-orange-50 text-[#f95700] flex items-center justify-center">

                                            <Icon
                                                type={icon}
                                                size={32}
                                            />

                                        </div>

                                        <h3 className="text-xl font-bold mt-5">
                                            {title}
                                        </h3>

                                        <p className="text-gray-600 mt-3">
                                            {description}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FEEDBACK
                ================================================== */}

                <section
                    id="feedback"
                    className="px-6 py-20 bg-white"
                >

                    <div className="max-w-7xl mx-auto">

                        <div className="text-center max-w-3xl mx-auto">

                            <p className="text-[#f95700] font-bold uppercase text-sm">
                                Your Feedback
                            </p>

                            <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                                Help us improve Form2Feature
                            </h2>

                            <p className="text-gray-600 mt-4 leading-relaxed">
                                Tell us about your experience. Your
                                feedback helps us make the platform
                                better for farmers and buyers.
                            </p>

                        </div>


                        <div className="max-w-3xl mx-auto mt-10">

                            <form
                                onSubmit={submitFeedback}
                                className="border rounded-2xl p-7 md:p-9 bg-[#f8f9fa]"
                            >

                                {/* RATING */}

                                <div>

                                    <label className="font-bold text-gray-900">
                                        How would you rate Form2Feature?
                                    </label>

                                    <div className="flex gap-3 mt-5">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (

                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setRating(star)
                                                    }
                                                    aria-label={`Rate ${star} out of 5`}
                                                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition ${
                                                        rating >= star
                                                            ? "bg-[#fff7f2] text-[#f95700] border-[#f95700]"
                                                            : "bg-white text-gray-400 border-gray-300 hover:border-[#f95700] hover:text-[#f95700]"
                                                    }`}
                                                >

                                                    <Icon
                                                        type="star"
                                                        size={25}
                                                        strokeWidth={2}
                                                    />

                                                </button>

                                            )
                                        )}

                                    </div>

                                    <p className="text-sm text-gray-500 mt-3">

                                        {rating === 0
                                            ? "Select a rating from 1 to 5."
                                            : `${rating} out of 5 selected.`}

                                    </p>

                                </div>


                                {/* MESSAGE */}

                                <div className="mt-7">

                                    <label
                                        htmlFor="feedback-message"
                                        className="font-bold text-gray-900"
                                    >
                                        Your Feedback
                                    </label>

                                    <textarea
                                        id="feedback-message"
                                        value={feedback}
                                        onChange={(e) =>
                                            setFeedback(
                                                e.target.value
                                            )
                                        }
                                        rows={5}
                                        maxLength={1000}
                                        placeholder="Tell us what you like, what can be improved, or what features you would like to see..."
                                        className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f95700] resize-none"
                                    />

                                    <div className="flex justify-end text-xs text-gray-500 mt-2">
                                        {feedback.length}/1000
                                    </div>

                                </div>


                                {/* SUCCESS */}

                                {feedbackSent && (

                                    <div className="mt-5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center gap-3">

                                        <Icon
                                            type="check"
                                            size={22}
                                            strokeWidth={2.5}
                                        />

                                        <span>
                                            Thank you! Your feedback
                                            has been submitted successfully.
                                        </span>

                                    </div>

                                )}


                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    className="mt-7 bg-[#f95700] text-white px-7 py-3 rounded-lg font-bold hover:bg-[#dc4b00] transition flex items-center gap-2"
                                >

                                    <Icon
                                        type="message"
                                        size={20}
                                    />

                                    Submit Feedback

                                </button>

                            </form>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FINAL CTA
                ================================================== */}

                <section className="bg-[#fff7f2] px-6 py-20">

                    <div className="max-w-4xl mx-auto text-center">

                        <p className="text-[#f95700] font-bold uppercase text-sm">
                            Get Started
                        </p>

                        <h2 className="text-3xl md:text-5xl font-extrabold mt-3">
                            Ready to use Form2Feature?
                        </h2>

                        <p className="text-gray-600 text-lg mt-5">
                            Create your account and start exploring
                            the smart agriculture platform.
                        </p>

                        <div className="flex justify-center flex-wrap gap-4 mt-8">

                            <button
                                type="button"
                                onClick={goRegister}
                                className="bg-[#f95700] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#dc4b00] transition"
                            >
                                Get Started
                            </button>

                            <button
                                type="button"
                                onClick={goLogin}
                                className="border border-[#f95700] text-[#f95700] px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition"
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer
                id="contact"
                className="bg-[#0b1320] text-gray-300 px-6 py-12"
            >

                <div className="max-w-7xl mx-auto">

                    <div className="grid md:grid-cols-4 gap-10">


                        {/* BRAND */}

                        <div>

                            <h3 className="text-white text-xl font-extrabold">
                                Form2Feature
                            </h3>

                            <p className="text-gray-400 mt-4 leading-relaxed">
                                Smart agriculture technology connecting
                                farmers, buyers and markets.
                            </p>

                        </div>


                        {/* PLATFORM */}

                        <div>

                            <h4 className="text-white font-bold">
                                Platform
                            </h4>

                            <div className="mt-4 space-y-3">

                                <button
                                    onClick={() =>
                                        scrollTo("features")
                                    }
                                    className="block hover:text-orange-400"
                                >
                                    Features
                                </button>

                                <button
                                    onClick={() =>
                                        scrollTo("roles")
                                    }
                                    className="block hover:text-orange-400"
                                >
                                    Farmers & Buyers
                                </button>

                                <button
                                    onClick={() =>
                                        scrollTo("how-it-works")
                                    }
                                    className="block hover:text-orange-400"
                                >
                                    How It Works
                                </button>

                            </div>

                        </div>


                        {/* ACCOUNT */}

                        <div>

                            <h4 className="text-white font-bold">
                                Account
                            </h4>

                            <div className="mt-4 space-y-3">

                                <button
                                    onClick={goLogin}
                                    className="block hover:text-orange-400"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={goRegister}
                                    className="block hover:text-orange-400"
                                >
                                    Register
                                </button>

                            </div>

                        </div>


                        {/* CONTACT */}

                        <div>

                            <h4 className="text-white font-bold">
                                Contact
                            </h4>

                            <div className="mt-4 space-y-3 text-gray-400">

                                <p>
                                    Smart Agriculture Platform
                                </p>

                                <p>
                                    Contact Form2Feature
                                </p>

                                <button
                                    onClick={() =>
                                        scrollTo("feedback")
                                    }
                                    className="hover:text-orange-400"
                                >
                                    Give Feedback
                                </button>

                            </div>

                        </div>

                    </div>


                    <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500">

                        © 2026 Form2Feature. All rights reserved.

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;