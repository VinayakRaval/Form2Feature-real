import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FarmerLayout from "../../layouts/FarmerLayout";

import {
    getCropById,
    updateCrop
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

    // EC2 / Kubernetes / production
    return window.location.origin;
};

// ============================================================
// IMAGE URL
// ============================================================

const getImageUrl = (image) => {

    if (!image) {
        return null;
    }

    const cleanImage = String(image).trim();

    if (!cleanImage) {
        return null;
    }

    // Already a complete URL
    if (
        cleanImage.startsWith("http://") ||
        cleanImage.startsWith("https://")
    ) {
        return cleanImage;
    }

    const backendUrl = getBackendUrl();

    let imagePath = cleanImage;

    // Remove leading slash
    imagePath = imagePath.replace(/^\/+/, "");

    // If backend already returned "uploads/..."
    if (imagePath.startsWith("uploads/")) {
        return `${backendUrl}/${imagePath}`;
    }

    // If backend returned "upload/..."
    if (imagePath.startsWith("upload/")) {
        return `${backendUrl}/${imagePath}`;
    }

    // Otherwise assume the image belongs inside uploads
    return `${backendUrl}/uploads/${imagePath}`;
};

// ============================================================
// COMPONENT
// ============================================================

function EditCrop() {

    const navigate = useNavigate();

    const { id } = useParams();

    // ========================================================
    // FORM STATE
    // ========================================================

    const [formData, setFormData] = useState({

        crop_name: "",
        crop_variety: "",
        quantity: "",
        quantity_unit: "kg",
        quality: "premium",
        expected_price: "",
        harvest_date: "",
        status: "available",
        description: ""

    });

    // ========================================================
    // IMAGE STATE
    // ========================================================

    const [currentImage, setCurrentImage] =
        useState(null);

    const [newImage, setNewImage] =
        useState(null);

    const [newImagePreview, setNewImagePreview] =
        useState(null);

    // ========================================================
    // PAGE STATE
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ========================================================
    // LOAD CROP
    // ========================================================

    useEffect(() => {

        const loadCrop = async () => {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "Loading crop:",
                    id
                );

                const result =
                    await getCropById(id);

                console.log(
                    "EDIT CROP RESPONSE:",
                    result
                );

                if (!result?.success) {

                    setError(
                        result?.message ||
                        "Failed to load crop."
                    );

                    return;
                }

                // Backend may return:
                // result.crop
                // result.data
                // result.cropData

                const crop =
                    result.crop ||
                    result.data ||
                    result.cropData;

                if (!crop) {

                    setError(
                        "Crop information was not found."
                    );

                    return;
                }

                // ==================================================
                // SET FORM
                // ==================================================

                setFormData({

                    crop_name:
                        crop.crop_name || "",

                    crop_variety:
                        crop.crop_variety || "",

                    quantity:
                        crop.quantity ?? "",

                    quantity_unit:
                        crop.quantity_unit ||
                        "kg",

                    quality:
                        crop.quality ||
                        "premium",

                    expected_price:
                        crop.expected_price ?? "",

                    harvest_date:
                        crop.harvest_date
                            ? String(
                                crop.harvest_date
                            ).substring(0, 10)
                            : "",

                    status:
                        crop.status ||
                        "available",

                    description:
                        crop.description ||
                        ""

                });

                // ==================================================
                // CURRENT IMAGE
                // ==================================================

                const image =
                    crop.image ||
                    crop.image_url ||
                    crop.image_path ||
                    crop.crop_image ||
                    null;

                console.log(
                    "CURRENT IMAGE FROM DATABASE:",
                    image
                );

                const imageUrl =
                    getImageUrl(image);

                console.log(
                    "FINAL IMAGE URL:",
                    imageUrl
                );

                setCurrentImage(
                    imageUrl
                );

            } catch (err) {

                console.error(
                    "LOAD EDIT CROP ERROR:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load crop."
                );

            } finally {

                setLoading(false);

            }

        };

        if (id) {
            loadCrop();
        }

    }, [id]);

    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            previous => ({
                ...previous,
                [name]: value
            })
        );

    };

    // ============================================================
    // IMAGE CHANGE
    // ============================================================

    const handleImageChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        // Only image files
        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image file."
            );

            return;
        }

        // Maximum 5 MB
        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Image size must be less than 5 MB."
            );

            return;
        }

        setError("");

        setNewImage(file);

        const previewUrl =
            URL.createObjectURL(file);

        setNewImagePreview(
            previewUrl
        );

    };

    // ============================================================
    // CLEAN PREVIEW URL
    // ============================================================

    useEffect(() => {

        return () => {

            if (newImagePreview) {

                URL.revokeObjectURL(
                    newImagePreview
                );

            }

        };

    }, [newImagePreview]);

    // ============================================================
    // UPDATE CROP
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // ========================================================
        // VALIDATION
        // ========================================================

        if (
            !formData.crop_name ||
            !formData.crop_name.trim()
        ) {

            setError(
                "Crop name is required."
            );

            return;
        }

        if (
            formData.quantity === "" ||
            Number(formData.quantity) <= 0
        ) {

            setError(
                "Please enter a valid quantity."
            );

            return;
        }

        if (
            formData.expected_price === "" ||
            Number(formData.expected_price) < 0
        ) {

            setError(
                "Please enter a valid expected price."
            );

            return;
        }

        try {

            setSaving(true);

            // ====================================================
            // FORM DATA
            // ====================================================

            const data =
                new FormData();

            data.append(
                "crop_name",
                formData.crop_name.trim()
            );

            data.append(
                "crop_variety",
                formData.crop_variety.trim()
            );

            data.append(
                "quantity",
                formData.quantity
            );

            data.append(
                "quantity_unit",
                formData.quantity_unit
            );

            data.append(
                "quality",
                formData.quality
            );

            data.append(
                "expected_price",
                formData.expected_price
            );

            data.append(
                "harvest_date",
                formData.harvest_date
            );

            data.append(
                "status",
                formData.status
            );

            data.append(
                "description",
                formData.description
            );

            // ====================================================
            // NEW IMAGE
            // ====================================================

            if (newImage) {

                data.append(
                    "image",
                    newImage
                );

            }

            console.log(
                "UPDATING CROP:",
                id
            );

            const result =
                await updateCrop(
                    id,
                    data
                );

            console.log(
                "UPDATE CROP RESPONSE:",
                result
            );

            if (!result?.success) {

                setError(
                    result?.message ||
                    "Failed to update crop."
                );

                return;
            }

            setSuccess(
                "Crop updated successfully."
            );

            // ====================================================
            // REDIRECT AFTER UPDATE
            // ====================================================

            setTimeout(() => {

                navigate(
                    "/farmer/crops"
                );

            }, 1000);

        } catch (err) {

            console.error(
                "UPDATE CROP ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update crop."
            );

        } finally {

            setSaving(false);

        }

    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <FarmerLayout>

                <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">

                    <div className="text-center">

                        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#ff6500] rounded-full animate-spin mx-auto">
                        </div>

                        <p className="text-gray-600 mt-4">
                            Loading crop information...
                        </p>

                    </div>

                </div>

            </FarmerLayout>

        );

    }

    // ============================================================
    // PAGE
    // ============================================================

    return (

        <FarmerLayout>

            <div className="min-h-screen bg-[#f3f4f6] py-10 px-5">

                <div className="max-w-4xl mx-auto">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="mb-8">

                        <p className="text-[#ff6500] font-bold text-sm uppercase tracking-wider">
                            Crop Management
                        </p>

                        <h1 className="text-4xl font-bold text-[#111827] mt-1">
                            Edit Crop
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Update your crop information.
                        </p>

                    </div>

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

                            ⚠️ {error}

                        </div>

                    )}

                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (

                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">

                            ✅ {success}

                        </div>

                    )}

                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
                    >

                        <h2 className="text-2xl font-bold text-[#111827] mb-6">
                            Crop Information
                        </h2>

                        {/* ==================================================
                            CROP NAME
                        ================================================== */}

                        <div className="mb-5">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Name *
                            </label>

                            <input
                                type="text"
                                name="crop_name"
                                value={formData.crop_name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                            />

                        </div>

                        {/* ==================================================
                            VARIETY
                        ================================================== */}

                        <div className="mb-5">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Variety
                            </label>

                            <input
                                type="text"
                                name="crop_variety"
                                value={formData.crop_variety}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                            />

                        </div>

                        {/* ==================================================
                            QUANTITY + UNIT
                        ================================================== */}

                        <div className="grid md:grid-cols-2 gap-5 mb-5">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Quantity Unit
                                </label>

                                <select
                                    name="quantity_unit"
                                    value={formData.quantity_unit}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                                >

                                    <option value="kg">
                                        Kilogram (kg)
                                    </option>

                                    <option value="quintal">
                                        Quintal
                                    </option>

                                    <option value="ton">
                                        Ton
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* ==================================================
                            QUALITY + PRICE
                        ================================================== */}

                        <div className="grid md:grid-cols-2 gap-5 mb-5">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Quality
                                </label>

                                <select
                                    name="quality"
                                    value={formData.quality}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                                >

                                    <option value="premium">
                                        Premium
                                    </option>

                                    <option value="good">
                                        Good
                                    </option>

                                    <option value="average">
                                        Average
                                    </option>

                                    <option value="poor">
                                        Poor
                                    </option>

                                </select>

                            </div>

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expected Price ₹
                                </label>

                                <input
                                    type="number"
                                    name="expected_price"
                                    value={formData.expected_price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            HARVEST DATE + STATUS
                        ================================================== */}

                        <div className="grid md:grid-cols-2 gap-5 mb-5">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Harvest Date
                                </label>

                                <input
                                    type="date"
                                    name="harvest_date"
                                    value={formData.harvest_date}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                                >

                                    <option value="available">
                                        Available
                                    </option>

                                    <option value="sold">
                                        Sold
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* ==================================================
                            CURRENT IMAGE
                        ================================================== */}

                        <div className="mb-6">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Crop Image
                            </label>

                            {currentImage ? (

                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100">

                                    <img
                                        src={currentImage}
                                        alt={
                                            formData.crop_name ||
                                            "Current crop"
                                        }
                                        className="w-full h-72 object-cover"
                                        onLoad={() => {
                                            console.log(
                                                "Current crop image loaded:",
                                                currentImage
                                            );
                                        }}
                                        onError={(event) => {

                                            console.error(
                                                "CURRENT IMAGE FAILED:",
                                                currentImage
                                            );

                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>

                            ) : (

                                <div className="h-48 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-400">

                                    <span className="text-5xl">
                                        🌾
                                    </span>

                                    <p className="mt-2">
                                        No current crop image
                                    </p>

                                </div>

                            )}

                        </div>

                        {/* ==================================================
                            NEW IMAGE
                        ================================================== */}

                        <div className="mb-6">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Change Crop Image
                            </label>

                            <input
                                id="crop-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            <label
                                htmlFor="crop-image"
                                className="inline-flex items-center gap-2 cursor-pointer border border-[#ff6500] text-[#ff6500] px-5 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
                            >
                                📷 Choose New Image
                            </label>

                            {newImage && (

                                <p className="text-sm text-gray-600 mt-2">
                                    Selected:{" "}
                                    <strong>
                                        {newImage.name}
                                    </strong>
                                </p>

                            )}

                            {newImagePreview && (

                                <div className="mt-4">

                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        New Image Preview
                                    </p>

                                    <img
                                        src={newImagePreview}
                                        alt="New crop preview"
                                        className="w-full h-64 object-cover rounded-xl border"
                                    />

                                </div>

                            )}

                        </div>

                        {/* ==================================================
                            DESCRIPTION
                        ================================================== */}

                        <div className="mb-8">

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-[#ff6500] focus:ring-2 focus:ring-orange-100"
                                placeholder="Enter crop description..."
                            />

                        </div>

                        {/* ==================================================
                            BUTTONS
                        ================================================== */}

                        <div className="flex flex-col sm:flex-row gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/farmer/crops")
                                }
                                disabled={saving}
                                className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-[#ff6500] hover:bg-[#e85b00] text-white py-3 rounded-lg font-bold transition disabled:opacity-60"
                            >

                                {saving
                                    ? "Updating..."
                                    : "💾 Update Crop"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </FarmerLayout>

    );

}

export default EditCrop;