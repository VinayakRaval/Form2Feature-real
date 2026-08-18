import React, { useEffect, useState } from "react";
import BuyerNavbar from "../../components/BuyerNavbar";

const API_BASE_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

function BuyerCrops() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [cropType, setCropType] = useState("");

    const [selectedCrop, setSelectedCrop] = useState(null);
    const [viewCrop, setViewCrop] = useState(null);

    const [offerForm, setOfferForm] = useState({
        quantity: "",
        offered_price: "",
        message: ""
    });

    const [sendingOffer, setSendingOffer] = useState(false);
    const [offerMessage, setOfferMessage] = useState("");

    // ============================================================
    // GET CROPS
    // ============================================================

    const fetchCrops = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                return;
            }

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (cropType && cropType !== "all") {
                params.append("crop_type", cropType);
            }

            const url =
                `${API_BASE_URL}/buyer/crops` +
                (params.toString()
                    ? `?${params.toString()}`
                    : "");

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch crops"
                );
            }

            setCrops(data.crops || []);
        } catch (err) {
            console.error("FETCH CROPS ERROR:", err);

            setError(
                err.message || "Unable to load crops."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchCrops();
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCrops();
    };

    // ============================================================
    // VIEW CROP
    // ============================================================

    const handleViewCrop = (crop) => {
        setViewCrop(crop);
    };

    const closeViewCrop = () => {
        setViewCrop(null);
    };

    // ============================================================
    // MAKE OFFER
    // ============================================================

    const handleMakeOffer = (crop) => {
        setSelectedCrop(crop);

        setOfferForm({
            quantity: "",
            offered_price: "",
            message: ""
        });

        setOfferMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ============================================================
    // CLOSE OFFER FORM
    // ============================================================

    const closeOfferForm = () => {
        if (sendingOffer) return;

        setSelectedCrop(null);

        setOfferForm({
            quantity: "",
            offered_price: "",
            message: ""
        });

        setOfferMessage("");
    };

    // ============================================================
    // OFFER FORM CHANGE
    // ============================================================

    const handleOfferChange = (e) => {
        const { name, value } = e.target;

        setOfferForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ============================================================
    // SEND OFFER
    // ============================================================

    const handleSendOffer = async (e) => {
        e.preventDefault();

        if (!selectedCrop) {
            setOfferMessage("Please select a crop.");
            return;
        }

        const quantity = Number(
            offerForm.quantity
        );

        const offeredPrice = Number(
            offerForm.offered_price
        );

        const availableQuantity = Number(
            selectedCrop.quantity
        );

        // Quantity validation
        if (!quantity || quantity <= 0) {
            setOfferMessage(
                "Please enter a valid quantity."
            );
            return;
        }

        if (quantity > availableQuantity) {
            setOfferMessage(
                `Maximum available quantity is ${availableQuantity} ${selectedCrop.quantity_unit || "kg"}.`
            );
            return;
        }

        // Price validation
        if (!offeredPrice || offeredPrice <= 0) {
            setOfferMessage(
                "Please enter a valid offer price."
            );
            return;
        }

        try {
            setSendingOffer(true);
            setOfferMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                setOfferMessage(
                    "Your session has expired. Please login again."
                );
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/buyer/offers`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        crop_id: selectedCrop.id,
                        offered_price: offeredPrice,
                        quantity: quantity,
                        message:
                            offerForm.message.trim() || null
                    })
                }
            );

            const data = await response.json();

            console.log(
                "SEND OFFER RESPONSE:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to send offer."
                );
            }

            alert(
                "Offer sent successfully to the farmer!"
            );

            closeOfferForm();

        } catch (err) {
            console.error(
                "SEND OFFER ERROR:",
                err
            );

            setOfferMessage(
                err.message ||
                "Unable to send offer."
            );
        } finally {
            setSendingOffer(false);
        }
    };

    // ============================================================
    // FORMAT PRICE
    // ============================================================

    const formatPrice = (price) => {
        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {
            return "₹0.00";
        }

        return `₹${Number(price).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {
        if (!date) {
            return "Not specified";
        }

        return new Date(date).toLocaleDateString(
            "en-IN"
        );
    };

    // ============================================================
    // IMAGE URL
    // ============================================================

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `${SERVER_URL}${image}`;
        }

        return `${SERVER_URL}/${image}`;
    };

    // ============================================================
    // FALLBACK SVG
    // ============================================================

    const CropPlaceholder = () => (
        <div className="w-full h-52 bg-gray-100 flex items-center justify-center">
            <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gray-400"
            >
                <path d="M12 22C12 22 4 17 4 10C4 5.5 7.5 2 12 2C16.5 2 20 5.5 20 10C20 17 12 22 12 22Z" />
                <path d="M12 22V9" />
                <path d="M12 13C9 13 7 11 7 8" />
                <path d="M12 16C15 16 17 14 17 11" />
            </svg>
        </div>
    );

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="min-h-screen bg-[#f4f5f7]">

            <BuyerNavbar />

            <main
                id="main-content"
                tabIndex="-1"
                className="max-w-7xl mx-auto px-6 py-10"
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8">

                    <p className="text-[#f95700] font-bold uppercase text-sm">
                        Buyer Portal
                    </p>

                    <h1 className="text-4xl font-bold text-[#111827]">
                        Browse Crops
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Browse agricultural products available
                        from farmers.
                    </p>

                </div>

                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="bg-white border rounded-2xl p-6 mb-8">

                    <form
                        onSubmit={handleSearch}
                        className="grid md:grid-cols-3 gap-5"
                    >

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Search Crop
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search crop, variety or farmer..."
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#f95700]"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Type
                            </label>

                            <select
                                value={cropType}
                                onChange={(e) =>
                                    setCropType(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#f95700]"
                            >

                                <option value="">
                                    All Crops
                                </option>

                                <option value="Onion">
                                    Onion
                                </option>

                                <option value="Tomato">
                                    Tomato
                                </option>

                                <option value="Potato">
                                    Potato
                                </option>

                                <option value="Rice">
                                    Rice
                                </option>

                                <option value="Wheat">
                                    Wheat
                                </option>

                                <option value="Maize">
                                    Maize
                                </option>

                                <option value="Cotton">
                                    Cotton
                                </option>

                                <option value="Sugarcane">
                                    Sugarcane
                                </option>

                            </select>

                        </div>

                        <div className="flex items-end">

                            <button
                                type="submit"
                                className="w-full bg-[#f95700] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#dc4b00]"
                            >
                                Search Crops
                            </button>

                        </div>

                    </form>

                </div>

                {/* ==================================================
                    OFFER FORM
                ================================================== */}

                {selectedCrop && (

                    <div className="bg-white border-2 border-[#f95700] rounded-2xl p-7 mb-8">

                        <div className="flex justify-between items-start mb-6">

                            <div>

                                <p className="text-[#f95700] font-bold text-sm uppercase">
                                    Buyer Offer
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    Make an Offer
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={closeOfferForm}
                                disabled={sendingOffer}
                                className="border rounded-lg px-4 py-2 font-semibold hover:bg-gray-100"
                            >
                                Close
                            </button>

                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 mb-6">

                            <h3 className="text-xl font-bold">
                                {selectedCrop.crop_name}
                            </h3>

                            {selectedCrop.crop_variety && (
                                <p className="text-gray-600 mt-1">
                                    Variety:{" "}
                                    <strong>
                                        {selectedCrop.crop_variety}
                                    </strong>
                                </p>
                            )}

                            <div className="grid md:grid-cols-3 gap-4 mt-4">

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Available
                                    </p>

                                    <p className="font-bold">
                                        {Number(
                                            selectedCrop.quantity
                                        ).toFixed(2)}{" "}
                                        {selectedCrop.quantity_unit || "kg"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Expected Price
                                    </p>

                                    <p className="font-bold">
                                        {formatPrice(
                                            selectedCrop.expected_price
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Farmer
                                    </p>

                                    <p className="font-bold">
                                        {selectedCrop.farmer_name ||
                                            "Farmer"}
                                    </p>
                                </div>

                            </div>

                        </div>

                        <form onSubmit={handleSendOffer}>

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Quantity *
                                    </label>

                                    <div className="flex">

                                        <input
                                            type="number"
                                            name="quantity"
                                            min="0.01"
                                            max={selectedCrop.quantity}
                                            step="0.01"
                                            value={
                                                offerForm.quantity
                                            }
                                            onChange={
                                                handleOfferChange
                                            }
                                            placeholder="Enter quantity"
                                            className="w-full border rounded-l-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#f95700]"
                                            required
                                        />

                                        <span className="bg-gray-100 border border-l-0 rounded-r-lg px-4 py-3 font-semibold">
                                            {selectedCrop.quantity_unit ||
                                                "kg"}
                                        </span>

                                    </div>

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Offer Price *
                                    </label>

                                    <div className="flex">

                                        <span className="bg-gray-100 border border-r-0 rounded-l-lg px-4 py-3 font-semibold">
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            name="offered_price"
                                            min="0.01"
                                            step="0.01"
                                            value={
                                                offerForm.offered_price
                                            }
                                            onChange={
                                                handleOfferChange
                                            }
                                            placeholder="Enter price"
                                            className="w-full border rounded-r-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#f95700]"
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="mt-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message
                                </label>

                                <textarea
                                    name="message"
                                    rows="4"
                                    value={
                                        offerForm.message
                                    }
                                    onChange={
                                        handleOfferChange
                                    }
                                    placeholder="Write a message to the farmer..."
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#f95700]"
                                />

                            </div>

                            {offerMessage && (

                                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                                    {offerMessage}
                                </div>

                            )}

                            <p className="text-sm text-gray-500 mt-4">
                                Maximum available quantity is{" "}
                                {Number(
                                    selectedCrop.quantity
                                ).toFixed(2)}{" "}
                                {selectedCrop.quantity_unit || "kg"}.
                            </p>

                            <div className="flex justify-end gap-3 mt-6">

                                <button
                                    type="button"
                                    onClick={closeOfferForm}
                                    disabled={sendingOffer}
                                    className="border bg-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={sendingOffer}
                                    className="bg-[#f95700] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#dc4b00] disabled:opacity-50"
                                >
                                    {sendingOffer
                                        ? "Sending..."
                                        : "Send Offer"}
                                </button>

                            </div>

                        </form>

                    </div>

                )}

                {/* ==================================================
                    AVAILABLE CROPS
                ================================================== */}

                <div className="bg-white border rounded-2xl p-7">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <h2 className="text-2xl font-bold">
                                Available Crops
                            </h2>

                            <p className="text-gray-500 mt-1">
                                {crops.length} crop(s) available
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={fetchCrops}
                            className="border bg-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-100"
                        >
                            Refresh
                        </button>

                    </div>

                    {/* LOADING */}

                    {loading && (

                        <div className="text-center py-12">

                            <svg
                                className="animate-spin mx-auto mb-4 text-[#f95700]"
                                width="40"
                                height="40"
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
                                />
                            </svg>

                            <p className="text-gray-500">
                                Loading crops...
                            </p>

                        </div>

                    )}

                    {/* ERROR */}

                    {!loading && error && (

                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
                            {error}
                        </div>

                    )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        crops.length === 0 && (

                            <div className="border-2 border-dashed rounded-2xl p-12 text-center">

                                <svg
                                    width="70"
                                    height="70"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="mx-auto text-gray-400"
                                >
                                    <path d="M12 22C12 22 4 17 4 10C4 5.5 7.5 2 12 2C16.5 2 20 5.5 20 10C20 17 12 22 12 22Z" />
                                    <path d="M12 22V9" />
                                    <path d="M12 13C9 13 7 11 7 8" />
                                    <path d="M12 16C15 16 17 14 17 11" />
                                </svg>

                                <h3 className="text-xl font-bold mt-4">
                                    No Crops Available
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    No crops match your search.
                                </p>

                            </div>

                        )}

                    {/* CROPS */}

                    {!loading &&
                        !error &&
                        crops.length > 0 && (

                            <div className="grid md:grid-cols-2 gap-6">

                                {crops.map((crop) => (

                                    <div
                                        key={crop.id}
                                        className="border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
                                    >

                                        {/* IMAGE */}

                                        {crop.image ? (

                                            <img
                                                src={getImageUrl(crop.image)}
                                                alt={crop.crop_name}
                                                className="w-full h-52 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";

                                                    const parent =
                                                        e.currentTarget.parentElement;

                                                    if (
                                                        parent &&
                                                        !parent.querySelector(
                                                            ".image-fallback"
                                                        )
                                                    ) {
                                                        const fallback =
                                                            document.createElement(
                                                                "div"
                                                            );

                                                        fallback.className =
                                                            "image-fallback";

                                                        fallback.innerHTML = `
                                                            <div class="w-full h-52 bg-gray-100 flex items-center justify-center">
                                                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-400">
                                                                    <path d="M12 22C12 22 4 17 4 10C4 5.5 7.5 2 12 2C16.5 2 20 5.5 20 10C20 17 12 22 12 22Z"/>
                                                                    <path d="M12 22V9"/>
                                                                    <path d="M12 13C9 13 7 11 7 8"/>
                                                                    <path d="M12 16C15 16 17 14 17 11"/>
                                                                </svg>
                                                            </div>
                                                        `;

                                                        parent.prepend(
                                                            fallback
                                                        );
                                                    }
                                                }}
                                            />

                                        ) : (

                                            <CropPlaceholder />

                                        )}

                                        <div className="p-6">

                                            {/* TITLE */}

                                            <div className="flex justify-between items-start gap-3">

                                                <div>

                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {crop.crop_name}
                                                    </h3>

                                                    {crop.crop_variety && (

                                                        <p className="text-gray-500 mt-1">
                                                            Variety:{" "}
                                                            <strong>
                                                                {
                                                                    crop.crop_variety
                                                                }
                                                            </strong>
                                                        </p>

                                                    )}

                                                </div>

                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                    {crop.status}
                                                </span>

                                            </div>

                                            {/* DETAILS */}

                                            <div className="grid grid-cols-2 gap-4 mt-5">

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Available Quantity
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {Number(
                                                            crop.quantity
                                                        ).toFixed(2)}{" "}
                                                        {crop.quantity_unit ||
                                                            "kg"}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Expected Price
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {formatPrice(
                                                            crop.expected_price
                                                        )}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Quality
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {crop.quality ||
                                                            "Not specified"}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-500 text-sm">
                                                        Harvest Date
                                                    </p>

                                                    <p className="font-bold mt-1">
                                                        {formatDate(
                                                            crop.harvest_date
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* FARMER */}

                                            <div className="border-t mt-5 pt-5">

                                                <p className="text-gray-500 text-sm">
                                                    Farmer
                                                </p>

                                                <p className="font-bold mt-1">
                                                    {crop.farmer_name ||
                                                        "Unknown Farmer"}
                                                </p>

                                                {crop.farmer_mobile && (

                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {crop.farmer_mobile}
                                                    </p>

                                                )}

                                            </div>

                                            {/* DESCRIPTION */}

                                            {crop.description && (

                                                <p className="text-gray-600 text-sm mt-4">
                                                    {crop.description}
                                                </p>

                                            )}

                                            {/* BUTTONS */}

                                            <div className="grid grid-cols-2 gap-3 mt-6">

                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewCrop(
                                                            crop
                                                        )
                                                    }
                                                    className="border border-gray-300 bg-white text-gray-800 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center gap-2"
                                                >

                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        />
                                                    </svg>

                                                    View Crop

                                                </button>

                                                {/* MAKE OFFER */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleMakeOffer(
                                                            crop
                                                        )
                                                    }
                                                    className="bg-[#f95700] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#dc4b00] flex items-center justify-center gap-2"
                                                >

                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M12 2v20" />
                                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
                                                    </svg>

                                                    Make Offer

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                </div>

            </main>

            {/* ======================================================
                VIEW CROP MODAL
            ====================================================== */}

            {viewCrop && (

                <div
                    className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                    onClick={closeViewCrop}
                >

                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}

                        <div className="flex justify-between items-center p-6 border-b">

                            <div>

                                <p className="text-[#f95700] font-bold text-sm uppercase">
                                    Crop Details
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    {viewCrop.crop_name}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={closeViewCrop}
                                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
                            >

                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M6 6l12 12" />
                                    <path d="M18 6L6 18" />
                                </svg>

                            </button>

                        </div>

                        {/* IMAGE */}

                        {viewCrop.image ? (

                            <img
                                src={getImageUrl(viewCrop.image)}
                                alt={viewCrop.crop_name}
                                className="w-full h-72 object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        "none";
                                }}
                            />

                        ) : (

                            <CropPlaceholder />

                        )}

                        {/* DETAILS */}

                        <div className="p-6">

                            <div className="grid md:grid-cols-2 gap-5">

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500 text-sm">
                                        Crop Name
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {viewCrop.crop_name}
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500 text-sm">
                                        Variety
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {viewCrop.crop_variety ||
                                            "Not specified"}
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500 text-sm">
                                        Available Quantity
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {Number(
                                            viewCrop.quantity
                                        ).toFixed(2)}{" "}
                                        {viewCrop.quantity_unit ||
                                            "kg"}
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500 text-sm">
                                        Expected Price
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {formatPrice(
                                            viewCrop.expected_price
                                        )}
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500 text-sm">
                                        Quality
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {viewCrop.quality ||
                                            "Not specified"}
                                    </p>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500 text-sm">
                                        Harvest Date
                                    </p>

                                    <p className="font-bold text-lg mt-1">
                                        {formatDate(
                                            viewCrop.harvest_date
                                        )}
                                    </p>

                                </div>

                            </div>

                            {/* FARMER */}

                            <div className="border rounded-xl p-5 mt-5">

                                <div className="flex items-start gap-4">

                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#f95700]">

                                        <svg
                                            width="25"
                                            height="25"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <circle
                                                cx="12"
                                                cy="8"
                                                r="4"
                                            />

                                            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                                        </svg>

                                    </div>

                                    <div>

                                        <p className="text-gray-500 text-sm">
                                            Farmer
                                        </p>

                                        <p className="font-bold text-lg">
                                            {viewCrop.farmer_name ||
                                                "Unknown Farmer"}
                                        </p>

                                        {viewCrop.farmer_mobile && (

                                            <p className="text-gray-600 mt-1">
                                                {viewCrop.farmer_mobile}
                                            </p>

                                        )}

                                        {viewCrop.farmer_email && (

                                            <p className="text-gray-600 text-sm mt-1">
                                                {viewCrop.farmer_email}
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            <div className="mt-5">

                                <p className="text-gray-500 text-sm font-semibold">
                                    Description
                                </p>

                                <p className="text-gray-700 mt-2 leading-relaxed">
                                    {viewCrop.description ||
                                        "No description provided by the farmer."}
                                </p>

                            </div>

                            {/* ACTIONS */}

                            <div className="flex justify-end gap-3 mt-7">

                                <button
                                    type="button"
                                    onClick={closeViewCrop}
                                    className="border px-5 py-3 rounded-lg font-semibold hover:bg-gray-100"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        closeViewCrop();
                                        handleMakeOffer(viewCrop);
                                    }}
                                    className="bg-[#f95700] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#dc4b00] flex items-center gap-2"
                                >

                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 2v20" />
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>

                                    Make Offer

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default BuyerCrops;