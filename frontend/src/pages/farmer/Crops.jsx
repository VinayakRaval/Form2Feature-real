import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FarmerLayout from "../../layouts/FarmerLayout";

import {
    getMyCrops,
    deleteCrop
} from "../../services/cropService";

// ============================================================
// BACKEND URL
// ============================================================
//
// LOCAL:
// Frontend: http://localhost:5173
// Backend:  http://localhost:5000
//
// KUBERNETES:
// Frontend: http://<EC2-IP>:30080
// Backend is accessed internally through Kubernetes service.
// ============================================================

const getBackendUrl = () => {

    // Local development
    if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
    ) {
        return "http://localhost:5000";
    }

    // Kubernetes / production
    // Empty string means use the same host.
    return window.location.origin;
};


// ============================================================
// CROPS COMPONENT
// ============================================================

function Crops() {

    const navigate = useNavigate();

    const [crops, setCrops] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD CROPS
    // ========================================================

    const loadCrops = async () => {

        try {

            setLoading(true);

            setError("");

            const result = await getMyCrops();


            if (result.success) {

                setCrops(
                    result.crops || []
                );

            } else {

                setError(
                    result.message ||
                    "Failed to load crops."
                );

            }

        } catch (err) {

            console.error(
                "Load Crops Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load crops."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // LOAD CROPS ON PAGE LOAD
    // ========================================================

    useEffect(() => {

        loadCrops();

    }, []);


    // ========================================================
    // DELETE CROP
    // ========================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this crop?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const result =
                await deleteCrop(id);


            if (result.success) {

                setCrops(previous =>
                    previous.filter(
                        crop => crop.id !== id
                    )
                );

            } else {

                alert(
                    result.message ||
                    "Failed to delete crop."
                );

            }

        } catch (err) {

            console.error(
                "Delete Crop Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to delete crop."
            );

        }

    };


    // ========================================================
    // IMAGE URL
    // ========================================================

    const getImageUrl = (image) => {

        // No image
        if (!image) {
            return null;
        }


        // If backend already returns a complete URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }


        // Remove accidental spaces
        const cleanImage =
            image.trim();


        // Backend URL depending on environment
        const backendUrl =
            getBackendUrl();


        // Make sure image starts with /
        const imagePath =
            cleanImage.startsWith("/")
                ? cleanImage
                : `/${cleanImage}`;


        return `${backendUrl}${imagePath}`;

    };


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <FarmerLayout>

            <div className="min-h-screen bg-[#f3f4f6] py-10 px-5">

                <div className="max-w-7xl mx-auto">


                    {/* ==================================================
                        HEADER
                    =================================================== */}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                        <div>

                            <p className="text-[#ff6500] font-bold text-sm uppercase tracking-wider">
                                Crop Management
                            </p>

                            <h1 className="text-4xl font-bold text-[#111827] mt-1">
                                My Crops
                            </h1>

                            <p className="text-gray-600 mt-2">
                                Manage your crop listings and selling information.
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/farmer/crops/add")
                            }
                            className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-6 py-3 rounded-lg font-bold transition"
                        >
                            + Add Crop
                        </button>

                    </div>


                    {/* ==================================================
                        ERROR
                    =================================================== */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

                            {error}

                        </div>

                    )}


                    {/* ==================================================
                        LOADING
                    =================================================== */}

                    {loading ? (

                        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">

                            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#ff6500] rounded-full animate-spin mx-auto mb-4">
                            </div>

                            <p className="text-gray-600">
                                Loading your crops...
                            </p>

                        </div>

                    ) : crops.length === 0 ? (

                        /* ==================================================
                           EMPTY STATE
                        =================================================== */

                        <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">

                            <div className="text-7xl mb-5">
                                🌾
                            </div>

                            <h2 className="text-2xl font-bold text-[#111827]">
                                No Crops Added
                            </h2>

                            <p className="text-gray-500 mt-2 mb-7">
                                Start by adding your first crop listing.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/farmer/crops/add")
                                }
                                className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-7 py-3 rounded-lg font-bold transition"
                            >
                                + Add Your First Crop
                            </button>

                        </div>

                    ) : (

                        /* ==================================================
                           CROP GRID
                        =================================================== */

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {crops.map((crop) => (

                                <div
                                    key={crop.id}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition"
                                >


                                    {/* ==================================================
                                        IMAGE
                                    =================================================== */}

                                    <div className="h-56 bg-gray-100">

                                        {crop.image ? (

                                            <img
                                                src={getImageUrl(crop.image)}
                                                alt={crop.crop_name || "Crop"}
                                                className="w-full h-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />

                                        ) : (

                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">

                                                <span className="text-6xl">
                                                    🌾
                                                </span>

                                                <span className="text-sm mt-2">
                                                    No crop image
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    {/* ==================================================
                                        CONTENT
                                    =================================================== */}

                                    <div className="p-5">


                                        {/* ==================================================
                                            NAME + STATUS
                                        =================================================== */}

                                        <div className="flex items-start justify-between gap-3">

                                            <div>

                                                <h2 className="text-xl font-bold text-[#111827] capitalize">
                                                    {crop.crop_name}
                                                </h2>


                                                {crop.crop_variety && (

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Variety: {crop.crop_variety}
                                                    </p>

                                                )}

                                            </div>


                                            <span
                                                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                                    crop.status === "available"
                                                        ? "bg-green-100 text-green-700"
                                                        : crop.status === "sold"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {crop.status || "unknown"}
                                            </span>

                                        </div>


                                        {/* ==================================================
                                            DETAILS
                                        =================================================== */}

                                        <div className="mt-5 space-y-3 text-sm">


                                            {/* Quantity */}

                                            <div className="flex justify-between">

                                                <span className="text-gray-500">
                                                    Quantity
                                                </span>

                                                <span className="font-semibold text-gray-900">

                                                    {crop.quantity ?? "—"}{" "}

                                                    {crop.quantity_unit || ""}

                                                </span>

                                            </div>


                                            {/* Quality */}

                                            <div className="flex justify-between">

                                                <span className="text-gray-500">
                                                    Quality
                                                </span>

                                                <span className="font-semibold text-gray-900">
                                                    {crop.quality || "Not specified"}
                                                </span>

                                            </div>


                                            {/* Expected Price */}

                                            <div className="flex justify-between">

                                                <span className="text-gray-500">
                                                    Expected Price
                                                </span>

                                                <span className="font-bold text-[#ff6500]">

                                                    ₹

                                                    {crop.expected_price
                                                        ? Number(
                                                            crop.expected_price
                                                        ).toLocaleString("en-IN")
                                                        : "—"}

                                                </span>

                                            </div>


                                            {/* Harvest Date */}

                                            <div className="flex justify-between">

                                                <span className="text-gray-500">
                                                    Harvest Date
                                                </span>

                                                <span className="font-semibold text-gray-900">

                                                    {crop.harvest_date

                                                        ? new Date(
                                                            crop.harvest_date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )

                                                        : "Not specified"}

                                                </span>

                                            </div>


                                        </div>


                                        {/* ==================================================
                                            DESCRIPTION
                                        =================================================== */}

                                        {crop.description && (

                                            <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                                                {crop.description}
                                            </p>

                                        )}


                                        {/* ==================================================
                                            ACTIONS
                                        =================================================== */}

                                        <div className="grid grid-cols-2 gap-3 mt-6">


                                            {/* EDIT */}

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/farmer/crops/edit/${crop.id}`
                                                    )
                                                }
                                                className="border border-gray-300 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition"
                                            >
                                                ✏️ Edit
                                            </button>


                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    handleDelete(crop.id)
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition"
                                            >
                                                🗑 Delete
                                            </button>

                                        </div>


                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </FarmerLayout>

    );

}


export default Crops;