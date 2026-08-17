import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BuyerNavbar from "../../components/BuyerNavbar";
import api from "../../services/api";

function BuyerCrops() {

    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [cropType, setCropType] = useState("");

    useEffect(() => {
        loadCrops();
    }, []);

    const loadCrops = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/crops");

            console.log("BUYER CROPS RESPONSE:", response.data);

            if (response.data?.success) {

                const data =
                    response.data.crops ||
                    response.data.data ||
                    [];

                setCrops(Array.isArray(data) ? data : []);

            } else {

                setCrops([]);

            }

        } catch (err) {

            console.error("BUYER CROPS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load available crops"
            );

        } finally {

            setLoading(false);

        }
    };


    const filteredCrops = crops.filter((crop) => {

        const name =
            String(
                crop.crop_name ||
                crop.name ||
                crop.crop ||
                ""
            ).toLowerCase();

        const location =
            String(
                crop.location ||
                crop.village ||
                crop.district ||
                ""
            ).toLowerCase();

        const searchText =
            search.toLowerCase();

        const matchesSearch =
            !searchText ||
            name.includes(searchText) ||
            location.includes(searchText);

        const type =
            String(
                crop.crop_name ||
                crop.name ||
                crop.crop ||
                ""
            ).toLowerCase();

        const matchesType =
            !cropType ||
            type === cropType.toLowerCase();

        return matchesSearch && matchesType;
    });


    return (

        <div className="min-h-screen bg-[#f4f5f7]">

            <BuyerNavbar />

            <main
                id="main-content"
                tabIndex="-1"
                className="max-w-7xl mx-auto px-6 py-10"
            >

                {/* HEADER */}

                <div className="mb-8">

                    <p className="text-[#f95700] font-bold uppercase text-sm">
                        Buyer Portal
                    </p>

                    <h1 className="text-4xl font-bold text-[#111827]">
                        Browse Crops
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Browse agricultural products available from farmers.
                    </p>

                </div>


                {/* SEARCH */}

                <div className="bg-white border rounded-2xl p-6 mb-8">

                    <div className="grid md:grid-cols-2 gap-4">

                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Search Crop
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search crop or location..."
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#f95700]"
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Crop Type
                            </label>

                            <select
                                value={cropType}
                                onChange={(e) =>
                                    setCropType(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#f95700]"
                            >

                                <option value="">
                                    All Crops
                                </option>

                                <option value="onion">
                                    Onion
                                </option>

                                <option value="tomato">
                                    Tomato
                                </option>

                                <option value="potato">
                                    Potato
                                </option>

                                <option value="rice">
                                    Rice
                                </option>

                                <option value="wheat">
                                    Wheat
                                </option>

                                <option value="maize">
                                    Maize
                                </option>

                                <option value="cotton">
                                    Cotton
                                </option>

                                <option value="sugarcane">
                                    Sugarcane
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">

                        {error}

                    </div>

                )}


                {/* CROPS */}

                <div className="bg-white border rounded-2xl p-7">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <h2 className="text-2xl font-bold">
                                Available Crops
                            </h2>

                            <p className="text-gray-500 mt-1">
                                {filteredCrops.length} crop(s) available
                            </p>

                        </div>

                        <button
                            onClick={loadCrops}
                            className="border px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
                        >
                            Refresh
                        </button>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="text-center py-12">

                            <div className="text-4xl mb-3">
                                🌾
                            </div>

                            <p className="text-gray-500">
                                Loading available crops...
                            </p>

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        filteredCrops.length === 0 && (

                            <div className="border-2 border-dashed rounded-2xl p-12 text-center">

                                <div className="text-6xl mb-4">
                                    🌾
                                </div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    No Crops Available
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    No crops match your search.
                                </p>

                            </div>

                        )}


                    {/* CROP CARDS */}

                    {!loading &&
                        filteredCrops.length > 0 && (

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                                {filteredCrops.map((crop) => {

                                    const id =
                                        crop.id ||
                                        crop.crop_id;

                                    const name =
                                        crop.crop_name ||
                                        crop.name ||
                                        crop.crop ||
                                        "Crop";

                                    const quantity =
                                        crop.quantity ??
                                        crop.available_quantity ??
                                        0;

                                    const price =
                                        crop.price_per_unit ??
                                        crop.price ??
                                        crop.expected_price ??
                                        0;

                                    const location =
                                        crop.location ||
                                        crop.village ||
                                        crop.district ||
                                        "Location not specified";

                                    return (

                                        <div
                                            key={id}
                                            className="border rounded-2xl p-6 hover:border-[#f95700] hover:shadow-md transition"
                                        >

                                            <div className="text-4xl mb-4">
                                                🌾
                                            </div>

                                            <h3 className="text-xl font-bold">
                                                {name}
                                            </h3>

                                            <div className="mt-4 space-y-2 text-sm">

                                                <p>
                                                    <span className="font-semibold">
                                                        Available:
                                                    </span>{" "}
                                                    {quantity}
                                                </p>

                                                <p>
                                                    <span className="font-semibold">
                                                        Price:
                                                    </span>{" "}
                                                    ₹{Number(price).toLocaleString("en-IN")}
                                                </p>

                                                <p>
                                                    <span className="font-semibold">
                                                        Location:
                                                    </span>{" "}
                                                    {location}
                                                </p>

                                            </div>


                                            <button
                                                type="button"
                                                className="w-full mt-5 bg-[#f95700] text-white py-3 rounded-lg font-semibold hover:bg-[#dc4b00]"
                                                onClick={() => {
                                                    alert(
                                                        "Offer feature will be connected next."
                                                    );
                                                }}
                                            >
                                                Make Offer
                                            </button>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                </div>


                {/* BACK */}

                <div className="mt-6">

                    <Link
                        to="/buyer/dashboard"
                        className="inline-block border bg-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-100"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </main>

        </div>

    );
}

export default BuyerCrops;