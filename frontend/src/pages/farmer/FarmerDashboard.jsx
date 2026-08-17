import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FarmerLayout from "../../layouts/FarmerLayout";

import {
    getMyCrops
} from "../../services/cropService";


// ============================================================
// BACKEND URL
// ============================================================

const getBackendUrl = () => {

    if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
    ) {
        return "http://localhost:5000";
    }

    return window.location.origin;
};


// ============================================================
// IMAGE URL
// ============================================================

const getImageUrl = (image) => {

    if (!image) {
        return null;
    }

    const cleanImage =
        String(image).trim();

    if (!cleanImage) {
        return null;
    }

    // Already complete URL
    if (
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("https://")
    ) {
        return cleanImage;
    }

    const backendUrl =
        getBackendUrl();

    const imagePath =
        cleanImage.startsWith("/")
            ? cleanImage
            : `/${cleanImage}`;

    return `${backendUrl}${imagePath}`;
};


// ============================================================
// FORMAT MONEY
// ============================================================

const formatMoney = (value) => {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "₹0";
    }

    return `₹${number.toLocaleString("en-IN")}`;
};


// ============================================================
// FORMAT NUMBER
// ============================================================

const formatNumber = (value) => {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (date) => {

    if (!date) {
        return "Not specified";
    }

    const parsedDate =
        new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not specified";
    }

    return parsedDate.toLocaleDateString(
        "en-IN"
    );
};


// ============================================================
// STATUS COLOR
// ============================================================

const getStatusClass = (status) => {

    const normalized =
        String(status || "")
            .toLowerCase();

    if (
        normalized === "available" ||
        normalized === "ready"
    ) {
        return "bg-green-100 text-green-700";
    }

    if (
        normalized === "sold"
    ) {
        return "bg-blue-100 text-blue-700";
    }

    if (
        normalized === "growing"
    ) {
        return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
};


// ============================================================
// STATUS TEXT
// ============================================================

const getStatusText = (status) => {

    if (!status) {
        return "Unknown";
    }

    return String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
};


// ============================================================
// CROP ICON
// ============================================================

const getCropIcon = (cropName) => {

    const name =
        String(cropName || "")
            .toLowerCase();

    if (name.includes("onion")) {
        return "🧅";
    }

    if (
        name.includes("tomato") ||
        name.includes("tomoto")
    ) {
        return "🍅";
    }

    if (name.includes("maize")) {
        return "🌽";
    }

    if (name.includes("corn")) {
        return "🌽";
    }

    if (name.includes("potato")) {
        return "🥔";
    }

    if (name.includes("rice")) {
        return "🌾";
    }

    if (name.includes("wheat")) {
        return "🌾";
    }

    if (name.includes("carrot")) {
        return "🥕";
    }

    if (name.includes("cabbage")) {
        return "🥬";
    }

    return "🌱";
};


// ============================================================
// FARMER DASHBOARD
// ============================================================

function FarmerDashboard() {

    const navigate =
        useNavigate();

    // ========================================================
    // AUTH
    // ========================================================

    const user =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );

    const farmerName =
        user?.full_name ||
        user?.name ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "Farmer";


    // ========================================================
    // STATE
    // ========================================================

    const [crops, setCrops] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // LOAD CROPS
    // ========================================================

    const loadCrops = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getMyCrops();

            console.log(
                "DASHBOARD CROPS RESPONSE:",
                response
            );

            if (
                response?.success
            ) {

                setCrops(
                    Array.isArray(
                        response.crops
                    )
                        ? response.crops
                        : []
                );

            } else {

                setCrops([]);

                setError(
                    response?.message ||
                    "Unable to load your crops."
                );

            }

        } catch (err) {

            console.error(
                "DASHBOARD CROP ERROR:",
                err
            );

            setCrops([]);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load crop information."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // LOAD ON PAGE OPEN
    // ========================================================

    useEffect(() => {

        loadCrops();

    }, []);


    // ========================================================
    // CALCULATE DASHBOARD DATA
    // ========================================================

    const dashboardData =
        useMemo(() => {

            const validCrops =
                Array.isArray(crops)
                    ? crops
                    : [];


            // ------------------------------------------------
            // ACTIVE CROPS
            // ------------------------------------------------

            const activeCrops =
                validCrops.filter(
                    crop => {

                        const status =
                            String(
                                crop?.status || ""
                            ).toLowerCase();

                        return (
                            status !== "sold" &&
                            status !== "deleted"
                        );
                    }
                );


            // ------------------------------------------------
            // TOTAL QUANTITY
            // ------------------------------------------------

            const totalQuantity =
                activeCrops.reduce(
                    (total, crop) => {

                        const quantity =
                            Number(
                                crop?.quantity
                            );

                        if (
                            !Number.isFinite(
                                quantity
                            )
                        ) {
                            return total;
                        }

                        return (
                            total +
                            quantity
                        );

                    },
                    0
                );


            // ------------------------------------------------
            // HIGHEST EXPECTED PRICE
            // ------------------------------------------------

            const highestPriceCrop =
                [...validCrops]
                    .filter(
                        crop =>
                            Number.isFinite(
                                Number(
                                    crop?.expected_price
                                )
                            )
                    )
                    .sort(
                        (a, b) =>
                            Number(
                                b.expected_price
                            ) -
                            Number(
                                a.expected_price
                            )
                    )[0] || null;


            // ------------------------------------------------
            // AVAILABLE CROPS
            // ------------------------------------------------

            const availableCrops =
                validCrops.filter(
                    crop =>
                        String(
                            crop?.status || ""
                        ).toLowerCase() ===
                        "available"
                ).length;


            return {

                totalCrops:
                    validCrops.length,

                activeCrops:
                    activeCrops.length,

                availableCrops,

                totalQuantity,

                highestPriceCrop

            };

        }, [crops]);


    // ========================================================
    // RECENT CROPS
    // ========================================================

    const recentCrops =
        useMemo(() => {

            return [...crops]
                .sort((a, b) => {

                    const dateA =
                        new Date(
                            a?.created_at || 0
                        ).getTime();

                    const dateB =
                        new Date(
                            b?.created_at || 0
                        ).getTime();

                    return dateB - dateA;

                })
                .slice(0, 4);

        }, [crops]);


    // ========================================================
    // NAVIGATION
    // ========================================================

    const goTo = (path) => {

        navigate(path);

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <FarmerLayout>

            <div className="min-h-screen bg-gray-50">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                    {/* ==================================================
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


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                <div>

                                    <p className="font-semibold">
                                        Unable to load dashboard crop data
                                    </p>

                                    <p className="text-sm mt-1">
                                        {error}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={loadCrops}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    Retry
                                </button>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        STAT CARDS
                    ================================================== */}

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">

                        {/* MY CROPS */}

                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/farmer/crops"
                                )
                            }
                            className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-500 text-sm font-medium">
                                        My Crops
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">

                                        {loading
                                            ? "..."
                                            : dashboardData.totalCrops}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                                    🌾
                                </div>

                            </div>

                            <p className="text-sm text-orange-600 mt-3">
                                {dashboardData.activeCrops} active crops
                            </p>

                        </button>


                        {/* TOTAL QUANTITY */}

                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/farmer/crops"
                                )
                            }
                            className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-500 text-sm font-medium">
                                        Total Quantity
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">

                                        {loading
                                            ? "..."
                                            : formatNumber(
                                                dashboardData.totalQuantity
                                            )}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                                    📦
                                </div>

                            </div>

                            <p className="text-sm text-green-600 mt-3">
                                Across your active crops
                            </p>

                        </button>


                        {/* HIGHEST EXPECTED PRICE */}

                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/farmer/crops"
                                )
                            }
                            className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-500 text-sm font-medium">
                                        Highest Expected Price
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">

                                        {loading
                                            ? "..."
                                            : dashboardData.highestPriceCrop
                                            ? formatMoney(
                                                dashboardData
                                                    .highestPriceCrop
                                                    .expected_price
                                            )
                                            : "—"}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl">
                                    💰
                                </div>

                            </div>

                            <p className="text-sm text-yellow-600 mt-3">

                                {dashboardData.highestPriceCrop
                                    ? dashboardData
                                        .highestPriceCrop
                                        .crop_name
                                    : "No price available"}

                            </p>

                        </button>


                        {/* AVAILABLE CROPS */}

                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/farmer/crops"
                                )
                            }
                            className="bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-500 text-sm font-medium">
                                        Ready for Sale
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">

                                        {loading
                                            ? "..."
                                            : dashboardData.availableCrops}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                                    🏷️
                                </div>

                            </div>

                            <p className="text-sm text-blue-600 mt-3">
                                Available crops
                            </p>

                        </button>

                    </section>


                    {/* ==================================================
                        QUICK ACTIONS
                    ================================================== */}

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/farmer/market-prices"
                                )
                            }
                            className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-lg transition"
                        >

                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
                                💰
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mt-4">
                                Market Prices
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Compare current market prices from different mandis.
                            </p>

                            <p className="text-orange-600 font-semibold mt-4">
                                Check prices →
                            </p>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/farmer/mandi"
                                )
                            }
                            className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-lg transition"
                        >

                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                                🏪
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mt-4">
                                Mandi Finder
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Find nearby agricultural markets and compare your options.
                            </p>

                            <p className="text-green-600 font-semibold mt-4">
                                Find mandi →
                            </p>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/farmer/weather"
                                )
                            }
                            className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-lg transition"
                        >

                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                                🌦️
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mt-4">
                                Weather
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Check weather conditions before harvesting and transportation.
                            </p>

                            <p className="text-blue-600 font-semibold mt-4">
                                Check weather →
                            </p>

                        </button>

                    </section>


                    {/* ==================================================
                        CROP OVERVIEW
                    ================================================== */}

                    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm mt-7 overflow-hidden">

                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Crop Overview
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Your actual crop listings from Form2Feature
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


                        {loading ? (

                            <div className="py-16 text-center">

                                <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto">
                                </div>

                                <p className="text-gray-500 mt-4">
                                    Loading your crops...
                                </p>

                            </div>

                        ) : crops.length === 0 ? (

                            <div className="py-16 text-center px-6">

                                <div className="text-6xl">
                                    🌾
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mt-4">
                                    No crops added yet
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    Add your first crop to start managing your farm.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/farmer/crops/add"
                                        )
                                    }
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold mt-5"
                                >
                                    + Add Crop
                                </button>

                            </div>

                        ) : (

                            <div className="divide-y">

                                {recentCrops.map(
                                    (crop) => {

                                        const imageUrl =
                                            getImageUrl(
                                                crop?.image
                                            );

                                        return (

                                            <div
                                                key={
                                                    crop.id
                                                }
                                                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-gray-50 transition"
                                            >

                                                <div className="flex items-center gap-4">

                                                    {/* IMAGE */}

                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">

                                                        {imageUrl ? (

                                                            <img
                                                                src={
                                                                    imageUrl
                                                                }
                                                                alt={
                                                                    crop.crop_name ||
                                                                    "Crop"
                                                                }
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    event
                                                                ) => {

                                                                    event
                                                                        .currentTarget
                                                                        .style
                                                                        .display =
                                                                        "none";

                                                                    const parent =
                                                                        event
                                                                            .currentTarget
                                                                            .parentElement;

                                                                    if (
                                                                        parent
                                                                    ) {

                                                                        parent.innerHTML =
                                                                            `<div class="w-full h-full flex items-center justify-center text-3xl">${getCropIcon(
                                                                                crop.crop_name
                                                                            )}</div>`;

                                                                    }

                                                                }}
                                                            />

                                                        ) : (

                                                            <div className="w-full h-full flex items-center justify-center text-3xl">
                                                                {getCropIcon(
                                                                    crop.crop_name
                                                                )}
                                                            </div>

                                                        )}

                                                    </div>


                                                    {/* DETAILS */}

                                                    <div>

                                                        <h3 className="font-bold text-gray-900 capitalize">
                                                            {crop.crop_name ||
                                                                "Unnamed Crop"}
                                                        </h3>

                                                        {crop.crop_variety && (

                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Variety:{" "}
                                                                {
                                                                    crop.crop_variety
                                                                }
                                                            </p>

                                                        )}

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Quantity:{" "}
                                                            <span className="font-semibold text-gray-700">
                                                                {
                                                                    crop.quantity
                                                                }{" "}
                                                                {
                                                                    crop.quantity_unit ||
                                                                    ""
                                                                }
                                                            </span>
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* RIGHT SIDE */}

                                                <div className="flex items-center justify-between sm:justify-end gap-6">

                                                    <div className="text-left sm:text-right">

                                                        <p className="text-xs text-gray-500">
                                                            Expected Price
                                                        </p>

                                                        <p className="font-bold text-orange-600 mt-1">
                                                            {formatMoney(
                                                                crop.expected_price
                                                            )}
                                                        </p>

                                                        {crop.harvest_date && (

                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Harvest:{" "}
                                                                {formatDate(
                                                                    crop.harvest_date
                                                                )}
                                                            </p>

                                                        )}

                                                    </div>


                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusClass(
                                                            crop.status
                                                        )}`}
                                                    >
                                                        {getStatusText(
                                                            crop.status
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </section>


                    {/* ==================================================
                        MARKET SECTION
                    ================================================== */}

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-7">


                        {/* MARKET PRICES */}

                        <div className="bg-gray-950 text-white rounded-2xl p-6">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <p className="text-orange-400 text-sm font-semibold">
                                        MARKET INTELLIGENCE
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        Compare Current Prices
                                    </h2>

                                    <p className="text-gray-400 mt-3">
                                        Check government market data and
                                        Form2Feature market information before
                                        deciding where to sell.
                                    </p>

                                </div>

                                <span className="text-4xl">
                                    📊
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    goTo(
                                        "/farmer/market-prices"
                                    )
                                }
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 mt-6 font-semibold transition"
                            >
                                Compare Market Prices
                            </button>

                        </div>


                        {/* PROFIT CALCULATOR */}

                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <p className="text-orange-600 text-sm font-semibold">
                                        SMART SELLING
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                                        Calculate Your Profit
                                    </h2>

                                    <p className="text-gray-600 mt-3">
                                        Estimate revenue, expenses and expected
                                        profit before selling your crop.
                                    </p>

                                </div>

                                <span className="text-4xl">
                                    💰
                                </span>

                            </div>


                            <div className="flex flex-wrap gap-3 mt-6">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/farmer/profit"
                                        )
                                    }
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold"
                                >
                                    Profit Calculator
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/farmer/profit-history"
                                        )
                                    }
                                    className="bg-white border border-orange-200 hover:bg-orange-100 text-orange-700 px-5 py-3 rounded-lg font-semibold"
                                >
                                    Saved Profits
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* ==================================================
                        WEATHER
                    ================================================== */}

                    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm mt-7 p-6">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                                    🌦️
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Today's Weather
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        Check current weather before farming
                                        and transportation activities.
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
                                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                View Weather
                            </button>

                        </div>

                    </section>


                    {/* ==================================================
                        SMART SELLING
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
                                    Compare market prices, find nearby mandis,
                                    calculate expected profit and check weather
                                    before transporting your crops.
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


                    {/* ==================================================
                        FOOTER
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