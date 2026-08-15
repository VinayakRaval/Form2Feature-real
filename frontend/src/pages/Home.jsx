import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const features = [
        {
            title: "Mandi Finder",
            description:
                "Find nearby agricultural markets using your current location or search by district.",
            path: "/login",
        },
        {
            title: "Market Prices",
            description:
                "Compare crop prices from Government data and the Form2Feature database.",
            path: "/login",
        },
        {
            title: "AI Price Prediction",
            description:
                "Analyze market trends and predict future crop prices.",
            path: "/login",
        },
        {
            title: "Profit Calculator",
            description:
                "Compare mandi prices and calculate your expected farming profit.",
            path: "/login",
        },
        {
            title: "Weather Information",
            description:
                "Get weather forecasts and farming condition alerts.",
            path: "/login",
        },
        {
            title: "AI Crop Detection",
            description:
                "Upload crop images and get AI-based crop identification.",
            path: "/login",
        },
    ];

    const handleFeatureClick = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* =====================================================
                TOP BAR
            ====================================================== */}

            <div className="bg-gray-950 text-gray-300 px-6 py-2 text-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-6">
                        <span>Skip to main content</span>
                        <span>English</span>
                        <span>Contact us</span>
                        <span>Help</span>
                    </div>

                    <div className="hidden md:block">
                        Smart Agriculture Platform
                    </div>

                </div>
            </div>

            {/* =====================================================
                NAVBAR
            ====================================================== */}

            <nav className="border-b border-gray-200 bg-white px-6 md:px-8 py-5">

                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

                    {/* LOGO */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-2xl font-bold text-orange-600 whitespace-nowrap"
                    >
                        Form2Feature
                    </button>

                    {/* NAVIGATION */}

                    <div className="hidden lg:flex items-center gap-8 text-gray-700">

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("features")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                            className="hover:text-orange-600 transition"
                        >
                            Features
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="hover:text-orange-600 transition"
                        >
                            Market Prices
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="hover:text-orange-600 transition"
                        >
                            Mandi Finder
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("features")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                            className="hover:text-orange-600 transition"
                        >
                            AI Tools
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("footer")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                            className="hover:text-orange-600 transition"
                        >
                            Resources
                        </button>

                    </div>

                    {/* AUTH BUTTONS */}

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="border border-orange-500 text-orange-600 px-4 md:px-5 py-2 rounded-lg font-semibold hover:bg-orange-50 transition"
                        >
                            Sign in
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-5 py-2 rounded-lg font-semibold transition"
                        >
                            Create account
                        </button>

                    </div>

                </div>

            </nav>

            {/* =====================================================
                HERO
            ====================================================== */}

            <main>

                <section className="bg-gray-100 px-6 md:px-8 py-20 md:py-28">

                    <div className="max-w-7xl mx-auto">

                        <p className="text-orange-600 font-semibold tracking-wide mb-4">
                            FORM2FEATURE FARMER PLATFORM
                        </p>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-5xl">
                            Smart Agriculture.
                            <br />
                            Better Decisions.
                            <br />
                            Better Profits.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl leading-relaxed">
                            Form2Feature helps farmers find the best mandi,
                            compare market prices, analyze opportunities,
                            understand weather conditions and make smarter
                            selling decisions.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">

                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-lg font-semibold transition"
                            >
                                Get Started
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById("features")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                className="border border-gray-400 hover:border-orange-500 hover:text-orange-600 bg-white px-7 py-3 rounded-lg font-semibold transition"
                            >
                                Explore Features
                            </button>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    FEATURES
                ================================================== */}

                <section
                    id="features"
                    className="px-6 md:px-8 py-20"
                >

                    <div className="max-w-7xl mx-auto">

                        <div className="max-w-2xl mb-10">

                            <h2 className="text-3xl md:text-4xl font-bold">
                                Explore Form2Feature
                            </h2>

                            <p className="text-gray-600 mt-3">
                                Everything a farmer needs to make better
                                agricultural and market decisions.
                            </p>

                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {features.map((feature) => (

                                <div
                                    key={feature.title}
                                    className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 transition duration-300"
                                >

                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-xl font-bold mb-5">
                                        ✓
                                    </div>

                                    <h3 className="text-xl font-bold">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-600 mt-3 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFeatureClick(
                                                feature.path
                                            )
                                        }
                                        className="text-orange-600 font-semibold mt-5 hover:text-orange-700"
                                    >
                                        Learn more →
                                    </button>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>

                {/* =================================================
                    CTA
                ================================================== */}

                <section className="bg-orange-50 px-6 md:px-8 py-16">

                    <div className="max-w-5xl mx-auto text-center">

                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to make smarter farming decisions?
                        </h2>

                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Create your farmer account and start exploring
                            mandi information, market prices and smart
                            agriculture tools.
                        </p>

                        <div className="mt-7">

                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                            >
                                Create Free Account
                            </button>

                        </div>

                    </div>

                </section>

            </main>

            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer
                id="footer"
                className="bg-gray-950 text-gray-300 px-6 md:px-8 py-12"
            >

                <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* BRAND */}

                    <div>

                        <h3 className="text-white text-xl font-bold">
                            Form2Feature
                        </h3>

                        <p className="mt-3 text-gray-400 leading-relaxed">
                            Smart technology for modern farmers.
                        </p>

                    </div>

                    {/* PLATFORM */}

                    <div>

                        <h4 className="text-white font-semibold">
                            Platform
                        </h4>

                        <div className="mt-4 space-y-2">

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="block hover:text-orange-400 transition"
                            >
                                Market Prices
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="block hover:text-orange-400 transition"
                            >
                                Mandi Finder
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="block hover:text-orange-400 transition"
                            >
                                AI Tools
                            </button>

                        </div>

                    </div>

                    {/* RESOURCES */}

                    <div>

                        <h4 className="text-white font-semibold">
                            Resources
                        </h4>

                        <div className="mt-4 space-y-2">

                            <p>Government Schemes</p>
                            <p>Farming Guidance</p>
                            <p>Help & Support</p>

                        </div>

                    </div>

                    {/* SUPPORT */}

                    <div>

                        <h4 className="text-white font-semibold">
                            Support
                        </h4>

                        <div className="mt-4 space-y-2">

                            <p>Contact Us</p>
                            <p>FAQ</p>
                            <p>Report an Issue</p>

                        </div>

                    </div>

                </div>

                <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 text-sm text-gray-400">
                    © 2026 Form2Feature. All rights reserved.
                </div>

            </footer>

        </div>
    );
}

export default Home;