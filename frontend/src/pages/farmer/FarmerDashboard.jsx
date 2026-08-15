import { useNavigate } from "react-router-dom";
import FarmerLayout from "../../layouts/FarmerLayout";
import { useAuth } from "../../context/AuthContext";

function FarmerDashboard() {
    const navigate = useNavigate();

    const { user } = useAuth();

    // =========================================================
    // FARMER NAME
    // =========================================================

    const farmerName =
        user?.full_name ||
        user?.name ||
        user?.email?.split("@")[0] ||
        "Farmer";

    // =========================================================
    // SAMPLE DASHBOARD DATA
    // Later these values can be connected to your APIs.
    // =========================================================

    const stats = [
        {
            title: "My Crops",
            value: "5",
            subtitle: "Active crops",
            icon: "🌾",
            path: "/farmer/crops"
        },
        {
            title: "Best Market Price",
            value: "₹2,600",
            subtitle: "per quintal",
            icon: "💰",
            path: "/farmer/market-prices"
        },
        {
            title: "Nearby Mandis",
            value: "8",
            subtitle: "Markets found",
            icon: "🏪",
            path: "/farmer/mandi"
        },
        {
            title: "Saved Mandis",
            value: "4",
            subtitle: "Your saved markets",
            icon: "⭐",
            path: "/farmer/saved-mandis"
        }
    ];

    // =========================================================
    // MARKET TREND DATA
    // =========================================================

    const priceData = [
        {
            date: "09 Aug",
            price: 2200
        },
        {
            date: "10 Aug",
            price: 2280
        },
        {
            date: "11 Aug",
            price: 2350
        },
        {
            date: "12 Aug",
            price: 2420
        },
        {
            date: "13 Aug",
            price: 2500
        },
        {
            date: "14 Aug",
            price: 2600
        }
    ];

    // =========================================================
    // MARKET COMPARISON
    // =========================================================

    const marketComparison = [
        {
            mandi: "Gundlupet APMC",
            district: "Chamarajanagar",
            price: 2600,
            difference: "+₹200"
        },
        {
            mandi: "Mysore APMC",
            district: "Mysore",
            price: 2400,
            difference: "₹0"
        },
        {
            mandi: "Haveri APMC",
            district: "Haveri",
            price: 2300,
            difference: "-₹100"
        },
        {
            mandi: "Dharwad APMC",
            district: "Dharwad",
            price: 2250,
            difference: "-₹150"
        }
    ];

    // =========================================================
    // CROP DATA
    // =========================================================

    const crops = [
        {
            name: "Onion",
            quantity: "500 kg",
            status: "Ready for sale",
            icon: "🧅"
        },
        {
            name: "Tomato",
            quantity: "300 kg",
            status: "Growing",
            icon: "🍅"
        },
        {
            name: "Maize",
            quantity: "700 kg",
            status: "Growing",
            icon: "🌽"
        }
    ];

    // =========================================================
    // RECENT ACTIVITY
    // =========================================================

    const activities = [
        {
            icon: "🌾",
            title: "Onion crop added",
            time: "Today"
        },
        {
            icon: "⭐",
            title: "Gundlupet APMC saved",
            time: "Today"
        },
        {
            icon: "💰",
            title: "Onion market prices checked",
            time: "Yesterday"
        },
        {
            icon: "🏪",
            title: "Haveri mandis searched",
            time: "Yesterday"
        }
    ];

    // =========================================================
    // GRAPH HELPERS
    // =========================================================

    const graphWidth = 700;
    const graphHeight = 260;

    const paddingLeft = 55;
    const paddingRight = 25;
    const paddingTop = 25;
    const paddingBottom = 45;

    const chartWidth =
        graphWidth -
        paddingLeft -
        paddingRight;

    const chartHeight =
        graphHeight -
        paddingTop -
        paddingBottom;

    const prices =
        priceData.map(
            item => item.price
        );

    const minPrice =
        Math.min(...prices) - 100;

    const maxPrice =
        Math.max(...prices) + 100;

    const getX = (index) => {

        if (priceData.length <= 1) {
            return paddingLeft;
        }

        return (
            paddingLeft +
            (index /
                (priceData.length - 1)) *
            chartWidth
        );
    };

    const getY = (price) => {

        return (
            paddingTop +
            (
                (maxPrice - price) /
                (maxPrice - minPrice)
            ) *
            chartHeight
        );
    };

    const points =
        priceData.map(
            (item, index) =>
                `${getX(index)},${getY(item.price)}`
        ).join(" ");

    const latestPrice =
        priceData[
            priceData.length - 1
        ].price;

    const firstPrice =
        priceData[0].price;

    const priceIncrease =
        latestPrice -
        firstPrice;

    const priceIncreasePercent =
        (
            (priceIncrease /
                firstPrice) *
            100
        ).toFixed(1);

    // =========================================================
    // NAVIGATION
    // =========================================================

    const goTo = (path) => {
        navigate(path);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <FarmerLayout>

            <div className="min-h-screen bg-gray-50">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* =================================================
                        WELCOME
                    ================================================== */}

                    <section className="bg-gray-950 text-white rounded-2xl shadow-xl overflow-hidden">

                        <div className="p-6 sm:p-8">

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                <div>

                                    <p className="text-orange-400 font-semibold tracking-wider text-sm">
                                        FARMER DASHBOARD
                                    </p>

                                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                                        Welcome, {farmerName}
                                    </h1>

                                    <p className="text-gray-300 mt-3 max-w-2xl">
                                        Monitor your crops, compare mandi prices
                                        and make smarter selling decisions with
                                        Form2Feature.
                                    </p>

                                </div>

                                <div className="flex flex-wrap gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            goTo(
                                                "/farmer/mandi"
                                            )
                                        }
                                        className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-lg font-semibold transition"
                                    >
                                        🏪 Find Mandi
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            goTo(
                                                "/farmer/market-prices"
                                            )
                                        }
                                        className="bg-white text-gray-900 hover:bg-gray-100 px-5 py-3 rounded-lg font-semibold transition"
                                    >
                                        💰 Check Prices
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            goTo(
                                                "/farmer/crops/add"
                                            )
                                        }
                                        className="border border-gray-600 hover:bg-gray-800 px-5 py-3 rounded-lg font-semibold transition"
                                    >
                                        + Add Crop
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        STAT CARDS
                    ================================================== */}

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">

                        {stats.map((stat) => (

                            <button
                                key={stat.title}
                                type="button"
                                onClick={() =>
                                    goTo(stat.path)
                                }
                                className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-gray-500 text-sm font-medium">
                                            {stat.title}
                                        </p>

                                        <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                            {stat.value}
                                        </h2>

                                    </div>

                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                                        {stat.icon}
                                    </div>

                                </div>

                                <p className="text-sm text-orange-600 mt-3">
                                    {stat.subtitle}
                                </p>

                            </button>

                        ))}

                    </section>


                    {/* =================================================
                        MAIN DASHBOARD GRID
                    ================================================== */}

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-7">

                        {/* =================================================
                            MARKET PRICE GRAPH
                        ================================================== */}

                        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Market Price Trend
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                        Onion
                                    </h2>

                                </div>

                                <div className="text-right">

                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{latestPrice.toLocaleString("en-IN")}
                                    </p>

                                    <p className="text-sm text-green-600 font-semibold">
                                        ↑ {priceIncreasePercent}% this week
                                    </p>

                                </div>

                            </div>


                            {/* GRAPH */}

                            <div className="w-full overflow-x-auto mt-6">

                                <svg
                                    viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                                    className="w-full min-w-[600px]"
                                    role="img"
                                    aria-label="Onion market price trend"
                                >

                                    {/* GRID */}

                                    {[0, 1, 2, 3, 4].map(
                                        (line) => {

                                            const y =
                                                paddingTop +
                                                (line / 4) *
                                                chartHeight;

                                            const value =
                                                Math.round(
                                                    maxPrice -
                                                    (
                                                        line / 4
                                                    ) *
                                                    (
                                                        maxPrice -
                                                        minPrice
                                                    )
                                                );

                                            return (
                                                <g
                                                    key={line}
                                                >

                                                    <line
                                                        x1={paddingLeft}
                                                        y1={y}
                                                        x2={
                                                            graphWidth -
                                                            paddingRight
                                                        }
                                                        y2={y}
                                                        stroke="#e5e7eb"
                                                        strokeWidth="1"
                                                    />

                                                    <text
                                                        x="5"
                                                        y={y + 5}
                                                        fontSize="12"
                                                        fill="#6b7280"
                                                    >
                                                        ₹
                                                        {value}
                                                    </text>

                                                </g>
                                            );
                                        }
                                    )}


                                    {/* GRAPH LINE */}

                                    <polyline
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={points}
                                    />


                                    {/* POINTS */}

                                    {priceData.map(
                                        (item, index) => (

                                            <g
                                                key={
                                                    item.date
                                                }
                                            >

                                                <circle
                                                    cx={getX(index)}
                                                    cy={getY(item.price)}
                                                    r="6"
                                                    fill="white"
                                                    stroke="#f97316"
                                                    strokeWidth="3"
                                                />

                                                <text
                                                    x={getX(index)}
                                                    y={
                                                        graphHeight -
                                                        15
                                                    }
                                                    textAnchor="middle"
                                                    fontSize="11"
                                                    fill="#6b7280"
                                                >
                                                    {item.date}
                                                </text>

                                            </g>

                                        )
                                    )}

                                </svg>

                            </div>


                            <div className="mt-4 flex items-center justify-between border-t pt-4">

                                <p className="text-sm text-gray-500">
                                    Latest market data
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/farmer/market-prices"
                                        )
                                    }
                                    className="text-orange-600 font-semibold hover:text-orange-700"
                                >
                                    View all prices →
                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            BEST MARKET
                        ================================================== */}

                        <div className="bg-gray-950 text-white rounded-2xl shadow-sm p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-400 text-sm">
                                        Best Market Today
                                    </p>

                                    <h2 className="text-xl font-bold mt-1">
                                        Gundlupet APMC
                                    </h2>

                                </div>

                                <span className="text-3xl">
                                    ⭐
                                </span>

                            </div>


                            <div className="mt-8">

                                <p className="text-gray-400 text-sm">
                                    Onion modal price
                                </p>

                                <p className="text-4xl font-bold mt-2">
                                    ₹2,600
                                </p>

                                <p className="text-gray-400 mt-1">
                                    per quintal
                                </p>

                            </div>


                            <div className="border-t border-gray-800 mt-7 pt-5">

                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-400">
                                        District
                                    </span>

                                    <span>
                                        Chamarajanagar
                                    </span>

                                </div>

                                <div className="flex justify-between text-sm mt-3">

                                    <span className="text-gray-400">
                                        State
                                    </span>

                                    <span>
                                        Karnataka
                                    </span>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    goTo(
                                        "/farmer/market-prices"
                                    )
                                }
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 mt-7 font-semibold transition"
                            >
                                Compare Market Prices
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        CROP OVERVIEW + MARKET ALERTS
                    ================================================== */}

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-7">

                        {/* CROP OVERVIEW */}

                        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">

                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Crop Overview
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Your currently managed crops
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/farmer/crops"
                                        )
                                    }
                                    className="text-orange-600 font-semibold text-sm"
                                >
                                    View all →
                                </button>

                            </div>


                            <div className="divide-y">

                                {crops.map(
                                    (crop) => (

                                        <div
                                            key={crop.name}
                                            className="p-5 flex items-center justify-between gap-4"
                                        >

                                            <div className="flex items-center gap-4">

                                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                                                    {crop.icon}
                                                </div>

                                                <div>

                                                    <h3 className="font-bold text-gray-900">
                                                        {crop.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {crop.quantity}
                                                    </p>

                                                </div>

                                            </div>


                                            <span
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                                                    crop.status ===
                                                    "Ready for sale"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {crop.status}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* ALERTS */}

                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

                            <h2 className="text-xl font-bold text-gray-900">
                                Market Alerts
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                Important updates for you
                            </p>


                            <div className="space-y-4 mt-6">

                                <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                                    <div className="flex gap-3">

                                        <span className="text-xl">
                                            📈
                                        </span>

                                        <div>

                                            <h3 className="font-semibold text-green-800">
                                                Price Increased
                                            </h3>

                                            <p className="text-sm text-green-700 mt-1">
                                                Onion price increased
                                                compared with last week.
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">

                                    <div className="flex gap-3">

                                        <span className="text-xl">
                                            🏪
                                        </span>

                                        <div>

                                            <h3 className="font-semibold text-orange-800">
                                                Best Mandi Found
                                            </h3>

                                            <p className="text-sm text-orange-700 mt-1">
                                                Gundlupet APMC currently
                                                has the highest price.
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                                    <div className="flex gap-3">

                                        <span className="text-xl">
                                            🌦️
                                        </span>

                                        <div>

                                            <h3 className="font-semibold text-blue-800">
                                                Weather Check
                                            </h3>

                                            <p className="text-sm text-blue-700 mt-1">
                                                Check today's weather
                                                before transportation.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    goTo(
                                        "/farmer/weather"
                                    )
                                }
                                className="w-full border border-gray-300 hover:bg-gray-50 rounded-lg py-2.5 mt-5 font-semibold text-gray-700 transition"
                            >
                                Check Weather
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        MARKET COMPARISON
                    ================================================== */}

                    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm mt-7 overflow-hidden">

                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Market Comparison
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Compare onion prices across selected mandis
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    goTo(
                                        "/farmer/market-prices"
                                    )
                                }
                                className="text-orange-600 font-semibold"
                            >
                                Full comparison →
                            </button>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Mandi
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            District
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Modal Price
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Difference
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y">

                                    {marketComparison.map(
                                        (market, index) => (

                                            <tr
                                                key={
                                                    market.mandi
                                                }
                                                className={
                                                    index === 0
                                                        ? "bg-orange-50/40"
                                                        : ""
                                                }
                                            >

                                                <td className="px-6 py-4">

                                                    <p className="font-semibold text-gray-900">
                                                        {market.mandi}
                                                    </p>

                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {market.district}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <span className="font-bold text-gray-900">
                                                        ₹
                                                        {market.price.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`font-semibold ${
                                                            market.difference.startsWith(
                                                                "+"
                                                            )
                                                                ? "text-green-600"
                                                                : market.difference ===
                                                                  "₹0"
                                                                ? "text-gray-500"
                                                                : "text-red-500"
                                                        }`}
                                                    >
                                                        {market.difference}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-4">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            goTo(
                                                                "/farmer/market-prices"
                                                            )
                                                        }
                                                        className="text-orange-600 font-semibold text-sm"
                                                    >
                                                        View →
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>


                    {/* =================================================
                        LOWER DASHBOARD
                    ================================================== */}

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-7">

                        {/* =================================================
                            RECENT ACTIVITY
                        ================================================== */}

                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">

                            <div className="p-6 border-b border-gray-100">

                                <h2 className="text-xl font-bold text-gray-900">
                                    Recent Activity
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Your latest activity
                                </p>

                            </div>


                            <div className="divide-y">

                                {activities.map(
                                    (activity) => (

                                        <div
                                            key={
                                                activity.title
                                            }
                                            className="p-5 flex items-center justify-between"
                                        >

                                            <div className="flex items-center gap-4">

                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    {activity.icon}
                                                </div>

                                                <p className="font-medium text-gray-800">
                                                    {activity.title}
                                                </p>

                                            </div>

                                            <span className="text-sm text-gray-400">
                                                {activity.time}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            WEATHER
                        ================================================== */}

                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Today's Conditions
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Farming and transportation overview
                                    </p>

                                </div>

                                <span className="text-4xl">
                                    🌤️
                                </span>

                            </div>


                            <div className="grid grid-cols-2 gap-4 mt-7">

                                <div className="bg-gray-50 rounded-xl p-5">

                                    <p className="text-gray-500 text-sm">
                                        Temperature
                                    </p>

                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        28°C
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">

                                    <p className="text-gray-500 text-sm">
                                        Condition
                                    </p>

                                    <p className="text-xl font-bold text-gray-900 mt-3">
                                        Clear
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">

                                    <p className="text-gray-500 text-sm">
                                        Rain Chance
                                    </p>

                                    <p className="text-xl font-bold text-gray-900 mt-3">
                                        20%
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">

                                    <p className="text-gray-500 text-sm">
                                        Humidity
                                    </p>

                                    <p className="text-xl font-bold text-gray-900 mt-3">
                                        65%
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    goTo(
                                        "/farmer/weather"
                                    )
                                }
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-3 mt-6 font-semibold transition"
                            >
                                View Weather Details
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        QUICK DECISION PANEL
                    ================================================== */}

                    <section className="bg-orange-50 border border-orange-100 rounded-2xl p-6 sm:p-8 mt-7">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                            <div>

                                <p className="text-orange-600 font-semibold text-sm">
                                    SMART SELLING
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                    Make your next selling decision smarter
                                </h2>

                                <p className="text-gray-600 mt-2 max-w-2xl">
                                    Check current market prices, compare
                                    mandis and identify the market offering
                                    the best price for your crop.
                                </p>

                            </div>


                            <div className="flex flex-wrap gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/farmer/market-prices"
                                        )
                                    }
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    📊 Compare Prices
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/farmer/mandi"
                                        )
                                    }
                                    className="bg-white border border-orange-200 hover:bg-orange-100 text-orange-700 px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    🏪 Find Mandi
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        FOOTER DASHBOARD NOTE
                    ================================================== */}

                    <div className="text-center py-8">

                        <p className="text-sm text-gray-400">
                            Form2Feature • Smart Agriculture Platform
                        </p>

                    </div>

                </div>

            </div>

        </FarmerLayout>
    );
}

export default FarmerDashboard;