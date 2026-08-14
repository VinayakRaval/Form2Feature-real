import { useNavigate } from "react-router-dom";

import FarmerLayout from "../../layouts/FarmerLayout";
import { useAuth } from "../../context/AuthContext";

function FarmerDashboard() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const features = [
        {
            title: "My Crops",
            description: "Add, manage and sell your crop listings.",
            path: "/farmer/crops"
        },
        {
            title: "Mandi Finder",
            description: "Find the nearest mandi using GPS.",
            path: "/farmer/mandi"
        },
        {
            title: "Market Prices",
            description: "Track crop prices across mandis.",
            path: "/farmer/prices"
        },
        {
            title: "AI Price Prediction",
            description: "Predict future market prices.",
            path: "/farmer/prediction"
        },
        {
            title: "Profit Calculator",
            description: "Calculate and compare expected profit.",
            path: "/farmer/profit"
        },
        {
            title: "Weather",
            description: "Get weather and rainfall information.",
            path: "/farmer/weather"
        },
        {
            title: "Transport",
            description: "Calculate distance, routes and fuel cost.",
            path: "/farmer/transport"
        },
        {
            title: "AI Crop Detection",
            description: "Identify crops using artificial intelligence.",
            path: "/farmer/crop-detection"
        },
        {
            title: "AI Assistant",
            description: "Ask farming and selling questions.",
            path: "/farmer/chatbot"
        }
    ];

    return (
        <FarmerLayout>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}

                <section className="bg-gray-900 text-white rounded-2xl p-8 mb-8">

                    <p className="text-orange-400 font-semibold">
                        FARMER DASHBOARD
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        Welcome, {user?.full_name}
                    </h1>

                    <p className="text-gray-300 mt-3 max-w-2xl">
                        Manage your crops, monitor market prices,
                        find the best mandi and make smarter
                        selling decisions.
                    </p>

                </section>


                {/* Quick Stats */}

                <div className="grid md:grid-cols-4 gap-5 mb-8">

                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">
                            My Crops
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            —
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">
                            Market Price
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            —
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">
                            Nearby Mandis
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            —
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">
                            Notifications
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            —
                        </h2>
                    </div>

                </div>


                {/* Features */}

                <h2 className="text-2xl font-bold mb-5">
                    Farmer Services
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {features.map((feature) => (

                        <div
                            key={feature.title}
                            className="bg-white rounded-xl shadow hover:shadow-xl transition p-6"
                        >

                            <h3 className="text-xl font-bold">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 mt-3 min-h-[50px]">
                                {feature.description}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(feature.path)
                                }
                                className="mt-5 text-orange-600 font-semibold"
                            >
                                Open service →
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </FarmerLayout>
    );
}

export default FarmerDashboard;