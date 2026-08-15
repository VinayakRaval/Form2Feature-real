import React, {
    useEffect,
    useState
} from "react";

import {
    getMarketPrices
} from "../../services/marketPriceService";

import Navbar from "../../components/Navbar";


function MarketPrices() {

    // ========================================================
    // STATE
    // ========================================================

    const [crop, setCrop] =
        useState("Onion");

    const [state, setState] =
        useState("Karnataka");

    const [district, setDistrict] =
        useState("");

    const [prices, setPrices] =
        useState([]);

    const [bestPrice, setBestPrice] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searched, setSearched] =
        useState(false);


    // ========================================================
    // SEARCH
    // ========================================================

    const searchPrices = async () => {

        if (!crop.trim()) {

            setError(
                "Please select or enter a crop."
            );

            return;

        }


        setLoading(true);

        setError("");

        setSearched(true);


        try {

            const response =
                await getMarketPrices({

                    crop:
                        crop.trim(),

                    state:
                        state.trim(),

                    district:
                        district.trim(),

                    limit:
                        100

                });


            console.log(
                "MARKET PRICE RESPONSE:",
                response
            );


            if (
                response?.success
            ) {

                setPrices(
                    response.prices || []
                );

                setBestPrice(
                    response.best_price ||
                    null
                );

            } else {

                setPrices([]);

                setBestPrice(null);

                setError(
                    response?.message ||
                    "No market prices found."
                );

            }


        } catch (err) {

            console.error(
                "MARKET PRICE SEARCH ERROR:",
                err
            );


            setPrices([]);

            setBestPrice(null);

            setError(
                err?.response?.data?.message ||
                "Unable to fetch market prices."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // INITIAL SEARCH
    // ========================================================

    useEffect(() => {

        searchPrices();

    }, []);


    // ========================================================
    // FORMAT PRICE
    // ========================================================

    const formatPrice =
        (value) => {

            const number =
                Number(value || 0);

            return number.toLocaleString(
                "en-IN"
            );

        };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate =
        (date) => {

            if (!date) {

                return "Date unavailable";

            }

            const parsed =
                new Date(date);

            if (
                Number.isNaN(
                    parsed.getTime()
                )
            ) {

                return String(date);

            }

            return parsed.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div className="min-h-screen bg-[#f5f6f8]">

            <Navbar />


            <main className="max-w-7xl mx-auto px-6 py-10">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

                    <p className="text-[#ff6500] font-bold uppercase tracking-wide">
                        Smart Agriculture
                    </p>

                    <h1 className="text-4xl font-bold text-[#14213d] mt-2">
                        Market Prices
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Compare agricultural prices from
                        Government data and Form2Feature Database.
                    </p>

                </div>


                {/* =================================================
                    SEARCH BOX
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


                        {/* CROP */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Crop
                            </label>

                            <select
                                value={crop}
                                onChange={(e) =>
                                    setCrop(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            >

                                <option value="Onion">
                                    Onion
                                </option>

                                <option value="Tomato">
                                    Tomato
                                </option>

                                <option value="Potato">
                                    Potato
                                </option>

                                <option value="Maize">
                                    Maize
                                </option>

                                <option value="Cotton">
                                    Cotton
                                </option>

                                <option value="Groundnut">
                                    Groundnut
                                </option>

                            </select>

                        </div>


                        {/* STATE */}

                        <div>

                            <label className="block font-semibold mb-2">
                                State
                            </label>

                            <input
                                value={state}
                                onChange={(e) =>
                                    setState(
                                        e.target.value
                                    )
                                }
                                placeholder="Karnataka"
                                className="w-full border rounded-lg px-4 py-3"
                            />

                        </div>


                        {/* DISTRICT */}

                        <div>

                            <label className="block font-semibold mb-2">
                                District
                            </label>

                            <input
                                value={district}
                                onChange={(e) =>
                                    setDistrict(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: Haveri"
                                className="w-full border rounded-lg px-4 py-3"
                            />

                        </div>


                        {/* SEARCH */}

                        <div className="flex items-end">

                            <button
                                onClick={
                                    searchPrices
                                }
                                disabled={loading}
                                className="w-full bg-[#ff6500] hover:bg-[#e85b00] text-white px-5 py-3 rounded-lg font-bold disabled:opacity-50"
                            >

                                {loading
                                    ? "Searching..."
                                    : "🔍 Search Prices"}

                            </button>

                        </div>

                    </div>


                    <p className="text-sm text-gray-500 mt-4">
                        Searches both Government market prices
                        and your Form2Feature MySQL database.
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
                        {error}
                    </div>

                )}


                {/* =================================================
                    BEST PRICE
                ================================================= */}

                {bestPrice && (

                    <div className="bg-white border border-green-200 rounded-2xl p-6 mb-8">

                        <div className="flex items-center gap-2 text-green-700 font-bold mb-3">
                            🏆 Best Market Price
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Market
                                </p>

                                <p className="font-bold text-xl">
                                    {bestPrice.mandi_name}
                                </p>

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    Modal Price
                                </p>

                                <p className="font-bold text-2xl text-green-700">
                                    ₹{formatPrice(
                                        bestPrice.modal_price
                                    )}
                                </p>

                                <p className="text-sm text-gray-500">
                                    per quintal
                                </p>

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    District
                                </p>

                                <p className="font-semibold">
                                    {bestPrice.district ||
                                        "District unavailable"}
                                </p>

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    Source
                                </p>

                                <p className="font-semibold">
                                    {bestPrice.source}
                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    RESULTS HEADER
                ================================================= */}

                {searched && (

                    <div className="flex justify-between items-center mb-5">

                        <div>

                            <h2 className="text-2xl font-bold text-[#14213d]">
                                Market Price Results
                            </h2>

                            <p className="text-gray-500">
                                {prices.length} markets found
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    PRICE CARDS
                ================================================= */}

                {prices.length > 0 && (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {prices.map(
                            (price, index) => (

                                <div
                                    key={
                                        price.id ||
                                        index
                                    }
                                    className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                                >

                                    {/* HEADER */}

                                    <div className="flex justify-between gap-3">

                                        <div>

                                            <h3 className="text-xl font-bold text-[#14213d]">
                                                {price.mandi_name ||
                                                    price.market ||
                                                    "Market"}
                                            </h3>

                                            <p className="text-gray-500 mt-1">
                                                {price.district ||
                                                    "District unavailable"}
                                                {price.state
                                                    ? `, ${price.state}`
                                                    : ""}
                                            </p>

                                        </div>


                                        {/* SOURCE */}

                                        <span
                                            className={
                                                price.source ===
                                                "Data.gov.in"
                                                    ? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold h-fit whitespace-nowrap"
                                                    : "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold h-fit whitespace-nowrap"
                                            }
                                        >

                                            {price.source ===
                                            "Data.gov.in"
                                                ? "🇮🇳 GOVERNMENT"
                                                : "🗄️ MYSQL"}

                                        </span>

                                    </div>


                                    {/* PRICES */}

                                    <div className="grid grid-cols-3 gap-3 mt-6">

                                        <div className="bg-gray-50 rounded-lg p-3">

                                            <p className="text-xs text-gray-500">
                                                Minimum
                                            </p>

                                            <p className="font-bold mt-1">
                                                ₹{formatPrice(
                                                    price.min_price
                                                )}
                                            </p>

                                        </div>


                                        <div className="bg-green-50 rounded-lg p-3">

                                            <p className="text-xs text-gray-500">
                                                Modal
                                            </p>

                                            <p className="font-bold text-green-700 mt-1">
                                                ₹{formatPrice(
                                                    price.modal_price
                                                )}
                                            </p>

                                        </div>


                                        <div className="bg-gray-50 rounded-lg p-3">

                                            <p className="text-xs text-gray-500">
                                                Maximum
                                            </p>

                                            <p className="font-bold mt-1">
                                                ₹{formatPrice(
                                                    price.max_price
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    {/* DATE */}

                                    <div className="border-t mt-5 pt-4 text-sm text-gray-500">

                                        📅 Price Date:{" "}

                                        <span className="font-semibold text-gray-700">
                                            {formatDate(
                                                price.price_date
                                            )}
                                        </span>

                                    </div>


                                    {/* SOURCE */}

                                    <div className="mt-2 text-xs text-gray-400">

                                        Source:{" "}
                                        {price.source}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    NO RESULTS
                ================================================= */}

                {!loading &&
                    searched &&
                    prices.length === 0 &&
                    !error && (

                        <div className="bg-white border rounded-2xl p-12 text-center">

                            <div className="text-5xl mb-4">
                                📊
                            </div>

                            <h3 className="text-xl font-bold">
                                No Market Prices Found
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Try another crop or district.
                            </p>

                        </div>

                    )}

            </main>

        </div>

    );

}


export default MarketPrices;