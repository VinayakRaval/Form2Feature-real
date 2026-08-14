import { useAuth } from "../../context/AuthContext";

function FarmerDashboard() {

    const { user, logout } = useAuth();

    const features = [
        {
            title: "Mandi Finder",
            description: "Find nearby mandis using your location."
        },
        {
            title: "Market Prices",
            description: "Check current crop prices."
        },
        {
            title: "Price Prediction",
            description: "Predict future market prices."
        },
        {
            title: "Profit Calculator",
            description: "Calculate your expected profit."
        },
        {
            title: "Weather",
            description: "Check weather and rainfall alerts."
        },
        {
            title: "AI Crop Detection",
            description: "Identify crops using AI."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">

            <header className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-bold">
                        Form2Feature
                    </h1>

                    <p className="text-gray-400">
                        Farmer Dashboard
                    </p>
                </div>

                <div className="flex items-center gap-4">

                    <span>
                        Welcome, {user?.full_name}
                    </span>

                    <button
                        onClick={logout}
                        className="bg-red-500 px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="p-8">

                <h2 className="text-3xl font-bold mb-2">
                    Farmer Dashboard
                </h2>

                <p className="text-gray-600 mb-8">
                    Manage your crops, market prices and farming activities.
                </p>

                <div className="grid md:grid-cols-3 gap-6">

                    {features.map((feature) => (

                        <div
                            key={feature.title}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                        >

                            <h3 className="text-xl font-bold mb-2">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600">
                                {feature.description}
                            </p>

                            <button className="mt-4 text-orange-600 font-semibold">
                                Open →
                            </button>

                        </div>

                    ))}

                </div>

            </main>

        </div>
    );
}

export default FarmerDashboard;