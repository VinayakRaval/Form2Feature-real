import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const features = [
        {
            title: "Mandi Finder",
            description: "Find nearby agricultural markets using GPS."
        },
        {
            title: "Market Prices",
            description: "Track crop prices across different mandis."
        },
        {
            title: "AI Price Prediction",
            description: "Analyze market trends and predict future prices."
        },
        {
            title: "Profit Calculator",
            description: "Compare mandi prices and calculate expected profit."
        },
        {
            title: "Weather Information",
            description: "Get weather forecasts and farming condition alerts."
        },
        {
            title: "AI Crop Detection",
            description: "Upload crop images and get AI-based identification."
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Top Bar */}

            <div className="bg-gray-950 text-gray-300 px-6 py-2 text-sm flex justify-between">

                <div className="flex gap-6">
                    <span>Skip to main content</span>
                    <span>English</span>
                    <span>Contact us</span>
                    <span>Help</span>
                </div>

                <div>
                    Smart Agriculture Platform
                </div>

            </div>

            {/* Navbar */}

            <nav className="border-b bg-white px-8 py-5 flex items-center justify-between">

                <div className="text-2xl font-bold text-orange-600">
                    Form2Feature
                </div>

                <div className="hidden md:flex gap-8 text-gray-700">

                    <span>Features</span>
                    <span>Market Prices</span>
                    <span>Mandi Finder</span>
                    <span>AI Tools</span>
                    <span>Resources</span>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => navigate("/login")}
                        className="border border-orange-500 text-orange-600 px-5 py-2 rounded-lg"
                    >
                        Sign in
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="bg-orange-500 text-white px-5 py-2 rounded-lg"
                    >
                        Create account
                    </button>

                </div>

            </nav>

            {/* Hero */}

            <section className="bg-gray-100 px-8 py-24">

                <div className="max-w-6xl mx-auto">

                    <p className="text-orange-600 font-semibold mb-4">
                        FORM2FEATURE FARMER PLATFORM
                    </p>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 max-w-4xl">
                        Smart Agriculture.
                        <br />
                        Better Decisions.
                        <br />
                        Better Profits.
                    </h1>

                    <p className="text-xl text-gray-600 mt-6 max-w-2xl">
                        Form2Feature helps farmers find the best mandi,
                        track market prices, predict future prices and
                        make smarter selling decisions.
                    </p>

                    <div className="flex gap-4 mt-8">

                        <button
                            onClick={() => navigate("/register")}
                            className="bg-orange-500 text-white px-7 py-3 rounded-lg font-semibold"
                        >
                            Get Started
                        </button>

                        <button
                            className="border border-gray-400 px-7 py-3 rounded-lg font-semibold"
                        >
                            Explore Features
                        </button>

                    </div>

                </div>

            </section>

            {/* Features */}

            <section className="px-8 py-20">

                <div className="max-w-6xl mx-auto">

                    <h2 className="text-3xl font-bold">
                        Explore Form2Feature
                    </h2>

                    <p className="text-gray-600 mt-2 mb-10">
                        Everything a farmer needs to make better market decisions.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">

                        {features.map((feature) => (

                            <div
                                key={feature.title}
                                className="border rounded-xl p-6 hover:shadow-xl transition"
                            >

                                <h3 className="text-xl font-bold">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600 mt-3">
                                    {feature.description}
                                </p>

                                <button className="text-orange-600 font-semibold mt-5">
                                    Learn more →
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* Footer */}

            <footer className="bg-gray-950 text-gray-300 px-8 py-12">

                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">

                    <div>
                        <h3 className="text-white text-xl font-bold">
                            Form2Feature
                        </h3>

                        <p className="mt-3 text-gray-400">
                            Smart technology for modern farmers.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold">
                            Platform
                        </h4>

                        <p className="mt-3">Market Prices</p>
                        <p>Mandi Finder</p>
                        <p>AI Tools</p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold">
                            Resources
                        </h4>

                        <p className="mt-3">Government Schemes</p>
                        <p>Farming Guidance</p>
                        <p>Help & Support</p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold">
                            Support
                        </h4>

                        <p className="mt-3">Contact Us</p>
                        <p>FAQ</p>
                        <p>Report an Issue</p>
                    </div>

                </div>

                <div className="max-w-6xl mx-auto border-t border-gray-800 mt-10 pt-6 text-sm">
                    © 2026 Form2Feature. All rights reserved.
                </div>

            </footer>

        </div>
    );
}

export default Home;