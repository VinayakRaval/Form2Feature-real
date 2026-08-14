import { useEffect, useState } from "react";

import {
    getMarketPrices,
    getBestMarketPrice
} from "../../services/marketPriceService";

import FarmerLayout from "../../layouts/FarmerLayout";


const MarketPrices = () => {

    const [cropName, setCropName] = useState("Tomato");

    const [prices, setPrices] = useState([]);

    const [bestPrice, setBestPrice] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD MARKET PRICES
    // ==========================================

    const loadPrices = async () => {

        try {

            setLoading(true);
            setError("");

            // Clear old data while searching
            setPrices([]);
            setBestPrice(null);


            // ==========================================
            // GET ALL PRICES FOR CROP
            // ==========================================

            const result =
                await getMarketPrices(cropName);


            console.log(
                "Market Prices Result:",
                result
            );


            if (result?.success) {

                setPrices(
                    result.prices || []
                );

            } else {

                setPrices([]);

            }


            // ==========================================
            // GET BEST PRICE
            // ==========================================

            try {

                const best =
                    await getBestMarketPrice(
                        cropName
                    );


                console.log(
                    "Best Market Price:",
                    best
                );


                if (
                    best?.success &&
                    best?.best_price
                ) {

                    setBestPrice(
                        best.best_price
                    );

                } else {

                    setBestPrice(null);

                }

            } catch (bestError) {

                console.error(
                    "Best price error:",
                    bestError
                );

                setBestPrice(null);

            }


        } catch (err) {

            console.error(
                "Market price error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                setError(
                    "Your login session has expired. Please login again."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Failed to fetch market prices"
                );

            }


            setPrices([]);

            setBestPrice(null);


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD DEFAULT TOMATO PRICES
    // ==========================================

    useEffect(() => {

        loadPrices();

    }, []);


    // ==========================================
    // GOOGLE MAPS DIRECTIONS
    // ==========================================

    const getDirections = (price) => {

        if (
            price.latitude == null ||
            price.longitude == null
        ) {

            return;

        }


        const url =
            `https://www.google.com/maps/dir/?api=1` +
            `&destination=${price.latitude},${price.longitude}` +
            `&travelmode=driving`;


        window.open(
            url,
            "_blank"
        );

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <FarmerLayout>

            <div className="min-h-screen bg-gray-50 p-6">

                <div className="max-w-6xl mx-auto">


                    {/* ==================================
                        HEADER
                    =================================== */}

                    <div className="mb-6">

                        <h1 className="text-3xl font-bold text-gray-800">
                            Market Prices
                        </h1>

                        <p className="text-gray-600 mt-1">
                            Compare agricultural prices between mandis.
                        </p>

                    </div>


                    {/* ==================================
                        CROP SEARCH
                    =================================== */}

                    <div className="bg-white rounded-xl shadow p-5 mb-6">

                        <label className="block font-semibold mb-2">
                            Select Crop
                        </label>


                        <div className="flex gap-3">


                            {/* CROP SELECT */}

                            <select
                                value={cropName}
                                onChange={(e) =>
                                    setCropName(
                                        e.target.value
                                    )
                                }
                                className="border border-gray-300 rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >

                                <option value="Tomato">
                                    Tomato
                                </option>

                                <option value="Onion">
                                    Onion
                                </option>

                                <option value="Maize">
                                    Maize
                                </option>

                            </select>


                            {/* SEARCH BUTTON */}

                            <button
                                onClick={loadPrices}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >

                                {loading
                                    ? "Searching..."
                                    : "Search"}

                            </button>


                        </div>

                    </div>


                    {/* ==================================
                        LOADING
                    =================================== */}

                    {loading && (

                        <div className="bg-white rounded-xl shadow p-8 text-center mb-6">

                            <div className="text-4xl mb-3">
                                📊
                            </div>

                            <p className="text-gray-600">
                                Loading market prices...
                            </p>

                        </div>

                    )}


                    {/* ==================================
                        ERROR
                    =================================== */}

                    {!loading && error && (

                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">

                            <p className="font-medium">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* ==================================
                        BEST MARKET PRICE
                    =================================== */}

                    {!loading &&
                        bestPrice && (

                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">

                                <p className="text-green-700 font-semibold">
                                    ⭐ Best Market Price
                                </p>


                                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                                    {bestPrice.mandi_name}
                                </h2>


                                <p className="text-3xl font-bold text-green-600 mt-2">

                                    ₹
                                    {Number(
                                        bestPrice.modal_price || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </p>


                                <p className="text-gray-600">
                                    per{" "}
                                    {bestPrice.price_unit ||
                                        "quintal"}
                                </p>

                            </div>

                        )}


                    {/* ==================================
                        PRICE COMPARISON
                    =================================== */}

                    {!loading &&
                        prices.length > 0 && (

                            <>

                                <div className="flex justify-between items-center mb-4">

                                    <h2 className="text-xl font-bold text-gray-800">
                                        Mandi Price Comparison
                                    </h2>


                                    <span className="text-sm text-gray-500">
                                        {prices.length} mandi
                                        {prices.length !== 1
                                            ? "s"
                                            : ""}{" "}
                                        found
                                    </span>

                                </div>


                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">


                                    {prices.map(
                                        (price) => (

                                            <div
                                                key={
                                                    price.id
                                                }
                                                className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                                            >


                                                {/* NAME */}

                                                <div className="flex justify-between items-start gap-3">

                                                    <h3 className="text-lg font-bold text-gray-800">

                                                        {price.mandi_name ||
                                                            "Agricultural Market"}

                                                    </h3>


                                                    {/* BEST */}

                                                    {bestPrice &&
                                                        price.id ===
                                                            bestPrice.id && (

                                                            <span className="text-green-600 text-sm font-semibold whitespace-nowrap">

                                                                BEST

                                                            </span>

                                                        )}

                                                </div>


                                                {/* DISTRICT */}

                                                <p className="text-gray-500 mt-1">

                                                    {price.district ||
                                                        "District unavailable"}

                                                </p>


                                                {/* MODAL PRICE */}

                                                <div className="mt-5">

                                                    <p className="text-2xl font-bold text-green-600">

                                                        ₹
                                                        {Number(
                                                            price.modal_price ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </p>


                                                    <p className="text-gray-500">

                                                        Modal price /{" "}

                                                        {price.price_unit ||
                                                            "quintal"}

                                                    </p>

                                                </div>


                                                {/* MIN/MAX */}

                                                <div className="mt-4 text-sm text-gray-600 space-y-1">

                                                    <p>

                                                        Minimum:

                                                        <strong>

                                                            {" "}
                                                            ₹
                                                            {Number(
                                                                price.min_price ||
                                                                    0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </strong>

                                                    </p>


                                                    <p>

                                                        Maximum:

                                                        <strong>

                                                            {" "}
                                                            ₹
                                                            {Number(
                                                                price.max_price ||
                                                                    0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </strong>

                                                    </p>


                                                    <p className="mt-2">

                                                        Price Date:

                                                        {" "}

                                                        {price.price_date ||
                                                            "Not available"}

                                                    </p>

                                                </div>


                                                {/* GOOGLE MAPS */}

                                                {price.latitude != null &&
                                                    price.longitude !=
                                                        null && (

                                                        <button
                                                            onClick={() =>
                                                                getDirections(
                                                                    price
                                                                )
                                                            }
                                                            className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                                                        >

                                                            🗺 Get Directions

                                                        </button>

                                                    )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </>

                        )}


                    {/* ==================================
                        NO DATA
                    =================================== */}

                    {!loading &&
                        !error &&
                        prices.length === 0 && (

                            <div className="bg-white rounded-xl shadow p-10 text-center">

                                <div className="text-5xl mb-4">
                                    📊
                                </div>


                                <h2 className="text-xl font-bold text-gray-800">
                                    No market prices found
                                </h2>


                                <p className="text-gray-500 mt-2">
                                    Try another crop.
                                </p>

                            </div>

                        )}

                </div>

            </div>

        </FarmerLayout>

    );

};


export default MarketPrices;