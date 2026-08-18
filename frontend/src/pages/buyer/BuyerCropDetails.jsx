import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BuyerNavbar from "../../components/BuyerNavbar";

function BuyerCropDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token =
        localStorage.getItem("form2feature_token") ||
        localStorage.getItem("token");

    useEffect(() => {
        fetchCrop();
    }, [id]);

    const fetchCrop = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/buyer/crops/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("BUYER CROP RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to fetch crop"
                );
            }

            setCrop(data.crop);

        } catch (error) {
            console.error(
                "BUYER CROP ERROR:",
                error
            );

            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f5f7]">
                <BuyerNavbar />

                <main
                    id="main-content"
                    className="max-w-7xl mx-auto px-6 py-10"
                >
                    <div className="bg-white border rounded-2xl p-10 text-center">
                        <svg
                            className="w-10 h-10 mx-auto animate-spin text-[#f95700]"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="3"
                                opacity="0.25"
                            />

                            <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>

                        <p className="mt-4 text-gray-600">
                            Loading crop details...
                        </p>
                    </div>
                </main>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-[#f4f5f7]">
                <BuyerNavbar />

                <main
                    id="main-content"
                    className="max-w-7xl mx-auto px-6 py-10"
                >
                    <div className="bg-white border border-red-200 rounded-2xl p-10">

                        <div className="flex items-center gap-3 text-red-600">
                            <svg
                                className="w-7 h-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path
                                    d="M12 8v5"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M12 16h.01"
                                    strokeLinecap="round"
                                />
                            </svg>

                            <h2 className="text-xl font-bold">
                                Unable to load crop
                            </h2>
                        </div>

                        <p className="text-gray-600 mt-3">
                            {error}
                        </p>

                        <button
                            onClick={fetchCrop}
                            className="mt-6 bg-[#f95700] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#dc4b00]"
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </div>
        );
    }


    if (!crop) {
        return (
            <div className="min-h-screen bg-[#f4f5f7]">
                <BuyerNavbar />

                <main
                    id="main-content"
                    className="max-w-7xl mx-auto px-6 py-10"
                >
                    <div className="bg-white border rounded-2xl p-10 text-center">
                        <h2 className="text-2xl font-bold">
                            Crop Not Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            This crop may no longer be available.
                        </p>
                    </div>
                </main>
            </div>
        );
    }


    // ----------------------------------------------------------
    // IMAGE URL
    // ----------------------------------------------------------

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const cleanImage =
            image
                .replace(/\\/g, "/")
                .replace(/^\/+/, "");

        if (cleanImage.startsWith("uploads/")) {
            return `http://localhost:5000/${cleanImage}`;
        }

        return `http://localhost:5000/uploads/${cleanImage}`;
    };


    const imageUrl =
        getImageUrl(crop.image);


    return (
        <div className="min-h-screen bg-[#f4f5f7]">

            <BuyerNavbar />

            <main
                id="main-content"
                tabIndex="-1"
                className="max-w-7xl mx-auto px-6 py-10"
            >

                {/* PAGE HEADER */}

                <div className="mb-8">

                    <p className="text-[#f95700] font-bold uppercase text-sm">
                        Buyer Portal
                    </p>

                    <h1 className="text-4xl font-bold text-gray-900">
                        Crop Details
                    </h1>

                    <p className="text-gray-600 mt-2">
                        View complete information about this crop.
                    </p>

                </div>


                {/* CROP CARD */}

                <div className="bg-white border rounded-2xl overflow-hidden">

                    <div className="grid lg:grid-cols-2">

                        {/* IMAGE */}

                        <div className="bg-gray-100 min-h-[400px] flex items-center justify-center">

                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={crop.crop_name}
                                    className="w-full h-[400px] object-cover"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />
                            ) : (
                                <div className="text-center text-gray-400">

                                    <svg
                                        className="w-20 h-20 mx-auto"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <rect
                                            x="3"
                                            y="4"
                                            width="18"
                                            height="16"
                                            rx="2"
                                        />

                                        <circle
                                            cx="8.5"
                                            cy="9"
                                            r="1.5"
                                        />

                                        <path d="m21 15-5-5L5 21" />
                                    </svg>

                                    <p className="mt-3">
                                        No crop image available
                                    </p>

                                </div>
                            )}

                        </div>


                        {/* DETAILS */}

                        <div className="p-8">

                            <div className="flex justify-between items-start gap-4">

                                <div>

                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        {crop.status}
                                    </span>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-4">
                                        {crop.crop_name}
                                    </h2>

                                    {crop.crop_variety && (
                                        <p className="text-gray-500 mt-1">
                                            Variety: {crop.crop_variety}
                                        </p>
                                    )}

                                </div>

                            </div>


                            {/* DETAILS GRID */}

                            <div className="grid sm:grid-cols-2 gap-4 mt-8">

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500">
                                        Available Quantity
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {Number(
                                            crop.quantity
                                        ).toLocaleString(
                                            "en-IN"
                                        )}{" "}
                                        {crop.quantity_unit || "kg"}
                                    </p>
                                </div>


                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500">
                                        Quality
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {crop.quality || "Not specified"}
                                    </p>
                                </div>


                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500">
                                        Expected Price
                                    </p>

                                    <p className="font-bold text-lg mt-1 text-[#f95700]">
                                        ₹
                                        {Number(
                                            crop.expected_price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>


                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500">
                                        Harvest Date
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {crop.harvest_date
                                            ? new Date(
                                                crop.harvest_date
                                            ).toLocaleDateString(
                                                "en-IN"
                                            )
                                            : "Not specified"}
                                    </p>
                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="mt-6">

                                <h3 className="font-bold text-lg">
                                    Description
                                </h3>

                                <p className="text-gray-600 mt-2 leading-7">
                                    {crop.description ||
                                        "No description provided."}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* FARMER */}

                    <div className="border-t p-8">

                        <h3 className="text-xl font-bold">
                            Farmer Information
                        </h3>

                        <div className="grid md:grid-cols-3 gap-4 mt-5">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Farmer
                                </p>

                                <p className="font-semibold mt-1">
                                    {crop.farmer_name ||
                                        "Not available"}
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-gray-500">
                                    Email
                                </p>

                                <p className="font-semibold mt-1">
                                    {crop.farmer_email ||
                                        "Not available"}
                                </p>
                            </div>


                            <div>
                                <p className="text-sm text-gray-500">
                                    Mobile
                                </p>

                                <p className="font-semibold mt-1">
                                    {crop.farmer_mobile ||
                                        "Not available"}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* ACTION */}

                    <div className="border-t p-8 flex flex-wrap gap-4">

                        <button
                            onClick={() =>
                                navigate(
                                    `/buyer/offers?crop_id=${crop.id}`
                                )
                            }
                            className="bg-[#f95700] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#dc4b00] transition"
                        >
                            Make Offer
                        </button>

                        <Link
                            to="/buyer/crops"
                            className="border border-gray-300 bg-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
                        >
                            Browse Crops
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default BuyerCropDetails;