import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BuyerNavbar from "../../components/BuyerNavbar";

const API_BASE_URL = "http://localhost:5000/api";

function BuyerOffers() {
    const [searchParams] = useSearchParams();

    const cropId = searchParams.get("cropId");

    const [crop, setCrop] = useState(null);
    const [offers, setOffers] = useState([]);

    const [loadingCrop, setLoadingCrop] = useState(false);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        quantity: "",
        offeredPrice: "",
        message: "",
    });

    // ============================================================
    // GET TOKEN
    // ============================================================

    const getToken = () => {
        return (
            localStorage.getItem("form2feature_token") ||
            localStorage.getItem("token")
        );
    };

    // ============================================================
    // FETCH SELECTED CROP
    // ============================================================

    const fetchCrop = async () => {
        if (!cropId) return;

        try {
            setLoadingCrop(true);
            setError("");

            const token = getToken();

            const response = await fetch(
                `${API_BASE_URL}/buyer/crops/${cropId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load crop"
                );
            }

            setCrop(data.crop);

            // Automatically set maximum available quantity
            setForm((previous) => ({
                ...previous,
                quantity: data.crop?.quantity || "",
            }));
        } catch (err) {
            console.error("FETCH CROP ERROR:", err);
            setError(err.message || "Unable to load crop");
        } finally {
            setLoadingCrop(false);
        }
    };

    // ============================================================
    // FETCH BUYER OFFERS
    // ============================================================

    const fetchOffers = async () => {
        try {
            setLoadingOffers(true);

            const token = getToken();

            const response = await fetch(
                `${API_BASE_URL}/buyer/offers`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load offers"
                );
            }

            setOffers(data.offers || []);
        } catch (err) {
            console.error("FETCH OFFERS ERROR:", err);

            // Don't destroy the selected-crop form if the
            // offers endpoint is not available yet.
            setOffers([]);
        } finally {
            setLoadingOffers(false);
        }
    };

    useEffect(() => {
        fetchCrop();
        fetchOffers();
    }, [cropId]);

    // ============================================================
    // FORM CHANGE
    // ============================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ============================================================
    // SUBMIT OFFER
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!cropId) {
            setError("Please select a crop before making an offer.");
            return;
        }

        if (!form.quantity || Number(form.quantity) <= 0) {
            setError("Please enter a valid quantity.");
            return;
        }

        if (
            crop &&
            Number(form.quantity) > Number(crop.quantity)
        ) {
            setError(
                `Maximum available quantity is ${crop.quantity} ${crop.quantity_unit || "kg"}.`
            );
            return;
        }

        if (
            !form.offeredPrice ||
            Number(form.offeredPrice) <= 0
        ) {
            setError("Please enter a valid offer price.");
            return;
        }

        try {
            setSubmitting(true);

            const token = getToken();

            const response = await fetch(
                `${API_BASE_URL}/buyer/offers`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        crop_id: Number(cropId),
                        quantity: Number(form.quantity),
                        offered_price: Number(form.offeredPrice),
                        message: form.message,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit offer"
                );
            }

            setSuccess(
                "Offer submitted successfully."
            );

            setForm({
                quantity: "",
                offeredPrice: "",
                message: "",
            });

            await fetchOffers();
        } catch (err) {
            console.error("SUBMIT OFFER ERROR:", err);

            setError(
                err.message ||
                "Unable to submit offer."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================================
    // STATUS STYLE
    // ============================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "accepted":
                return "bg-green-100 text-green-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            case "cancelled":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f5f7]">

            <BuyerNavbar />

            <main
                id="main-content"
                tabIndex="-1"
                className="max-w-7xl mx-auto px-6 py-10"
            >

                {/* ====================================================
                    PAGE HEADER
                ==================================================== */}

                <div className="mb-8">

                    <p className="text-[#f95700] font-bold uppercase text-sm">
                        Buyer Portal
                    </p>

                    <h1 className="text-4xl font-bold text-[#111827]">
                        My Offers
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage your offers and negotiate directly with farmers.
                    </p>

                </div>

                {/* ====================================================
                    SUCCESS
                ==================================================== */}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
                        {success}
                    </div>
                )}

                {/* ====================================================
                    ERROR
                ==================================================== */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* ====================================================
                    OFFER FORM
                ==================================================== */}

                {cropId && (
                    <section className="bg-white border rounded-2xl p-7 mb-8">

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <p className="text-sm text-[#f95700] font-bold uppercase">
                                    Make Offer
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    {loadingCrop
                                        ? "Loading crop..."
                                        : crop?.crop_name || "Selected Crop"}
                                </h2>

                            </div>

                            <Link
                                to="/buyer/crops"
                                className="border px-4 py-2 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Browse Crops
                            </Link>

                        </div>

                        {loadingCrop ? (

                            <div className="py-10 text-center text-gray-500">
                                Loading crop details...
                            </div>

                        ) : crop ? (

                            <div className="grid lg:grid-cols-2 gap-8">

                                {/* CROP DETAILS */}

                                <div className="border rounded-2xl p-5">

                                    <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 mb-5">

                                        {crop.image ? (
                                            <img
                                                src={
                                                    crop.image.startsWith("http")
                                                        ? crop.image
                                                        : `http://localhost:5000/uploads/${crop.image}`
                                                }
                                                alt={crop.crop_name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-400">
                                                No crop image
                                            </div>
                                        )}

                                    </div>

                                    <h3 className="text-xl font-bold">
                                        {crop.crop_name}
                                    </h3>

                                    <p className="text-gray-500">
                                        Variety:{" "}
                                        {crop.crop_variety || "N/A"}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mt-5">

                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-500">
                                                Available
                                            </p>

                                            <p className="font-bold">
                                                {crop.quantity}{" "}
                                                {crop.quantity_unit || "kg"}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-500">
                                                Expected Price
                                            </p>

                                            <p className="font-bold">
                                                ₹
                                                {Number(
                                                    crop.expected_price || 0
                                                ).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-4">

                                        <p className="text-sm text-gray-500">
                                            Farmer
                                        </p>

                                        <p className="font-semibold">
                                            {crop.farmer_name || "Farmer"}
                                        </p>

                                    </div>

                                </div>

                                {/* OFFER FORM */}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >

                                    <div>

                                        <label className="block font-semibold mb-2">
                                            Quantity *
                                        </label>

                                        <div className="flex">

                                            <input
                                                type="number"
                                                name="quantity"
                                                value={form.quantity}
                                                onChange={handleChange}
                                                min="0.01"
                                                max={crop.quantity}
                                                step="0.01"
                                                className="w-full border rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f95700]"
                                                placeholder="Enter quantity"
                                            />

                                            <span className="bg-gray-100 border border-l-0 rounded-r-lg px-4 py-3 text-gray-600">
                                                {crop.quantity_unit || "kg"}
                                            </span>

                                        </div>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Maximum available:{" "}
                                            {crop.quantity}{" "}
                                            {crop.quantity_unit || "kg"}
                                        </p>

                                    </div>

                                    <div>

                                        <label className="block font-semibold mb-2">
                                            Your Offer Price *
                                        </label>

                                        <div className="flex">

                                            <span className="bg-gray-100 border border-r-0 rounded-l-lg px-4 py-3">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                name="offeredPrice"
                                                value={form.offeredPrice}
                                                onChange={handleChange}
                                                min="1"
                                                step="0.01"
                                                className="w-full border rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f95700]"
                                                placeholder="Enter your price"
                                            />

                                        </div>

                                    </div>

                                    <div>

                                        <label className="block font-semibold mb-2">
                                            Message
                                        </label>

                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            rows="5"
                                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f95700]"
                                            placeholder="Add a message for the farmer..."
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#f95700] text-white py-3 rounded-lg font-bold hover:bg-[#dc4b00] disabled:opacity-50"
                                    >
                                        {submitting
                                            ? "Sending Offer..."
                                            : "Send Offer"}
                                    </button>

                                </form>

                            </div>

                        ) : null}

                    </section>
                )}

                {/* ====================================================
                    SUMMARY
                ==================================================== */}

                <div className="grid md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white border rounded-2xl p-6">
                        <p className="text-gray-500">
                            Total Offers
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {offers.length}
                        </h2>
                    </div>

                    <div className="bg-white border rounded-2xl p-6">
                        <p className="text-gray-500">
                            Pending Offers
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {
                                offers.filter(
                                    (offer) =>
                                        offer.status === "pending"
                                ).length
                            }
                        </h2>
                    </div>

                    <div className="bg-white border rounded-2xl p-6">
                        <p className="text-gray-500">
                            Accepted Offers
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {
                                offers.filter(
                                    (offer) =>
                                        offer.status === "accepted"
                                ).length
                            }
                        </h2>
                    </div>

                </div>

                {/* ====================================================
                    OFFER LIST
                ==================================================== */}

                <section className="bg-white border rounded-2xl p-7">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold">
                            My Crop Offers
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Your submitted offers will appear here.
                        </p>

                    </div>

                    {loadingOffers ? (

                        <div className="py-12 text-center text-gray-500">
                            Loading your offers...
                        </div>

                    ) : offers.length === 0 ? (

                        <div className="border-2 border-dashed rounded-2xl p-12 text-center">

                            <div className="flex justify-center mb-4">
                                <svg
                                    width="56"
                                    height="56"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="text-[#f95700]"
                                >
                                    <path d="M12 1v22" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold">
                                No Offers Yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                You have not made any crop offers yet.
                            </p>

                            <Link
                                to="/buyer/crops"
                                className="inline-block mt-5 bg-[#f95700] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#dc4b00]"
                            >
                                Browse Available Crops
                            </Link>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {offers.map((offer) => (

                                <div
                                    key={offer.id}
                                    className="border rounded-xl p-5"
                                >

                                    <div className="flex flex-col md:flex-row justify-between gap-4">

                                        <div>

                                            <h3 className="text-xl font-bold">
                                                {offer.crop_name ||
                                                    "Crop"}
                                            </h3>

                                            <p className="text-gray-500">
                                                Farmer:{" "}
                                                {offer.farmer_name ||
                                                    "Farmer"}
                                            </p>

                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold self-start ${getStatusClass(
                                                offer.status
                                            )}`}
                                        >
                                            {offer.status ||
                                                "pending"}
                                        </span>

                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-4 mt-5">

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Quantity
                                            </p>

                                            <p className="font-bold">
                                                {offer.quantity}{" "}
                                                {offer.quantity_unit ||
                                                    "kg"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Offered Price
                                            </p>

                                            <p className="font-bold">
                                                ₹
                                                {Number(
                                                    offer.offered_price ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Date
                                            </p>

                                            <p className="font-bold">
                                                {offer.created_at
                                                    ? new Date(
                                                          offer.created_at
                                                      ).toLocaleDateString(
                                                          "en-IN"
                                                      )
                                                    : "N/A"}
                                            </p>
                                        </div>

                                    </div>

                                    {offer.message && (
                                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-500">
                                                Message
                                            </p>

                                            <p className="mt-1">
                                                {offer.message}
                                            </p>
                                        </div>
                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default BuyerOffers;