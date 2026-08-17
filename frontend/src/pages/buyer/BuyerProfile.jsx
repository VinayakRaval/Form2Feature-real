import React, { useEffect, useRef, useState } from "react";
import BuyerLayout from "../../layouts/BuyerLayout";
import api from "../../services/api";

function BuyerProfile() {

    // ============================================================
    // USER
    // ============================================================

    const [user, setUser] = useState(null);

    // ============================================================
    // FORM
    // ============================================================

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        mobile: "",
        business_name: "",
        buyer_type: "Individual",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gst_number: ""
    });

    // ============================================================
    // PHOTO
    // ============================================================

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const fileInputRef = useRef(null);

    // ============================================================
    // STATUS
    // ============================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ============================================================
    // LOAD PROFILE
    // ============================================================

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/buyer/profile");

            console.log(
                "BUYER PROFILE:",
                response.data
            );

            const data =
                response.data?.user ||
                response.data?.data ||
                response.data;

            if (data) {

                const buyerData = {
                    ...data,
                    role: "buyer"
                };

                setUser(buyerData);

                setForm({
                    full_name:
                        buyerData.full_name || "",

                    email:
                        buyerData.email || "",

                    mobile:
                        buyerData.mobile || "",

                    business_name:
                        buyerData.business_name || "",

                    buyer_type:
                        buyerData.buyer_type ||
                        "Individual",

                    address:
                        buyerData.address || "",

                    city:
                        buyerData.city || "",

                    state:
                        buyerData.state || "",

                    pincode:
                        buyerData.pincode || "",

                    gst_number:
                        buyerData.gst_number || ""
                });

                localStorage.setItem(
                    "form2feature_user",
                    JSON.stringify(buyerData)
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(buyerData)
                );

            }

        } catch (err) {

            console.error(
                "BUYER PROFILE ERROR:",
                err
            );

            // ====================================================
            // FALLBACK
            // ====================================================

            try {

                const storedUser =
                    localStorage.getItem(
                        "form2feature_user"
                    );

                if (storedUser) {

                    const parsedUser =
                        JSON.parse(storedUser);

                    const buyerData = {
                        ...parsedUser,
                        role: "buyer"
                    };

                    setUser(buyerData);

                    setForm({
                        full_name:
                            buyerData.full_name || "",

                        email:
                            buyerData.email || "",

                        mobile:
                            buyerData.mobile || "",

                        business_name:
                            buyerData.business_name || "",

                        buyer_type:
                            buyerData.buyer_type ||
                            "Individual",

                        address:
                            buyerData.address || "",

                        city:
                            buyerData.city || "",

                        state:
                            buyerData.state || "",

                        pincode:
                            buyerData.pincode || "",

                        gst_number:
                            buyerData.gst_number || ""
                    });

                }

            } catch (storageError) {

                console.error(
                    "STORAGE ERROR:",
                    storageError
                );

            }

            setError(
                err.response?.data?.message ||
                "Unable to load buyer profile"
            );

        } finally {

            setLoading(false);

        }

    };

    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setMessage("");
        setError("");

    };

    // ============================================================
    // PHOTO SELECT
    // ============================================================

    const handlePhotoChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        // Maximum 5 MB
        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Profile photo must be less than 5 MB"
            );

            event.target.value = "";

            return;
        }

        // Image validation
        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image"
            );

            event.target.value = "";

            return;
        }

        setSelectedPhoto(file);

        setPhotoPreview(
            URL.createObjectURL(file)
        );

        setMessage("");
        setError("");

    };

    // ============================================================
    // UPLOAD PHOTO
    // ============================================================

    const uploadPhoto = async () => {

        if (!selectedPhoto) {
            return null;
        }

        try {

            setUploadingPhoto(true);

            const formData =
                new FormData();

            formData.append(
                "profile_photo",
                selectedPhoto
            );

            const response =
                await api.post(
                    "/buyer/profile/photo",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

            console.log(
                "PHOTO UPLOAD:",
                response.data
            );

            const uploadedUser =
                response.data?.user ||
                response.data?.data;

            if (uploadedUser) {

                const finalUser = {
                    ...uploadedUser,
                    role: "buyer"
                };

                setUser(finalUser);

                localStorage.setItem(
                    "form2feature_user",
                    JSON.stringify(finalUser)
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(finalUser)
                );

                setSelectedPhoto(null);

                return finalUser;

            }

            return null;

        } catch (err) {

            console.error(
                "PHOTO UPLOAD ERROR:",
                err
            );

            throw new Error(
                err.response?.data?.message ||
                "Profile photo upload failed"
            );

        } finally {

            setUploadingPhoto(false);

        }

    };

    // ============================================================
    // SAVE PROFILE
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        // ========================================================
        // VALIDATION
        // ========================================================

        if (!form.full_name.trim()) {

            setError(
                "Full name is required"
            );

            return;
        }

        if (!form.mobile.trim()) {

            setError(
                "Mobile number is required"
            );

            return;
        }

        if (
            !/^[0-9]{10}$/.test(
                form.mobile.trim()
            )
        ) {

            setError(
                "Please enter a valid 10-digit mobile number"
            );

            return;
        }

        if (
            form.pincode.trim() &&
            !/^[0-9]{6}$/.test(
                form.pincode.trim()
            )
        ) {

            setError(
                "Pincode must contain 6 digits"
            );

            return;
        }

        try {

            setSaving(true);

            // ====================================================
            // UPDATE PROFILE
            // ====================================================

            const response =
                await api.put(
                    "/buyer/profile",
                    {
                        full_name:
                            form.full_name.trim(),

                        mobile:
                            form.mobile.trim(),

                        business_name:
                            form.business_name.trim(),

                        buyer_type:
                            form.buyer_type,

                        address:
                            form.address.trim(),

                        city:
                            form.city.trim(),

                        state:
                            form.state.trim(),

                        pincode:
                            form.pincode.trim(),

                        gst_number:
                            form.gst_number.trim()
                    }
                );

            console.log(
                "PROFILE UPDATE:",
                response.data
            );

            let updatedUser =
                response.data?.user ||
                response.data?.data ||
                {
                    ...user,
                    ...form
                };

            updatedUser = {
                ...updatedUser,
                role: "buyer"
            };

            // ====================================================
            // UPLOAD PHOTO IF SELECTED
            // ====================================================

            if (selectedPhoto) {

                const photoUser =
                    await uploadPhoto();

                if (photoUser) {
                    updatedUser = {
                        ...updatedUser,
                        ...photoUser
                    };
                }

            }

            // ====================================================
            // UPDATE STATE
            // ====================================================

            setUser(updatedUser);

            // ====================================================
            // UPDATE LOCAL STORAGE
            // ====================================================

            localStorage.setItem(
                "form2feature_user",
                JSON.stringify(updatedUser)
            );

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            // ====================================================
            // UPDATE FORM
            // ====================================================

            setForm({
                full_name:
                    updatedUser.full_name || "",

                email:
                    updatedUser.email ||
                    form.email,

                mobile:
                    updatedUser.mobile || "",

                business_name:
                    updatedUser.business_name ||
                    "",

                buyer_type:
                    updatedUser.buyer_type ||
                    "Individual",

                address:
                    updatedUser.address ||
                    "",

                city:
                    updatedUser.city ||
                    "",

                state:
                    updatedUser.state ||
                    "",

                pincode:
                    updatedUser.pincode ||
                    "",

                gst_number:
                    updatedUser.gst_number ||
                    ""
            });

            setMessage(
                "Buyer profile updated successfully"
            );

        } catch (err) {

            console.error(
                "SAVE PROFILE ERROR:",
                err
            );

            setError(
                err.message ||
                err.response?.data?.message ||
                "Failed to update buyer profile"
            );

        } finally {

            setSaving(false);

        }

    };

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "form2feature_token"
        );

        localStorage.removeItem(
            "form2feature_user"
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

    };

    // ============================================================
    // PROFILE IMAGE
    // ============================================================

    const getProfileImage = () => {

        if (photoPreview) {
            return photoPreview;
        }

        if (!user?.profile_photo) {
            return null;
        }

        const photo =
            String(
                user.profile_photo
            ).trim();

        if (!photo) {
            return null;
        }

        if (
            photo.startsWith("http://") ||
            photo.startsWith("https://")
        ) {
            return photo;
        }

        if (
            photo.startsWith("/uploads/")
        ) {
            return `http://localhost:5000${photo}`;
        }

        if (
            photo.startsWith("uploads/")
        ) {
            return `http://localhost:5000/${photo}`;
        }

        return `http://localhost:5000/uploads/${photo}`;

    };

    // ============================================================
    // INITIAL
    // ============================================================

    const getInitial = () => {

        const name =
            user?.full_name ||
            form.full_name ||
            "Buyer";

        return name
            .charAt(0)
            .toUpperCase();

    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <BuyerLayout>

                <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">

                    <div className="text-center">

                        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#f95700] rounded-full animate-spin mx-auto mb-4">
                        </div>

                        <p className="text-gray-600 font-medium">
                            Loading buyer profile...
                        </p>

                    </div>

                </div>

            </BuyerLayout>

        );

    }

    // ============================================================
    // PAGE
    // ============================================================

    return (

        <BuyerLayout>

            <div className="min-h-screen bg-[#f4f5f7]">

                <main
                    id="main-content"
                    tabIndex="-1"
                    className="max-w-7xl mx-auto px-6 py-10 outline-none"
                >

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="mb-8">

                        <p className="text-[#f95700] font-bold uppercase text-sm tracking-wide">
                            Buyer Account
                        </p>

                        <h1 className="text-4xl font-bold text-[#111827] mt-1">
                            My Profile
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Manage your buyer account and business information.
                        </p>

                    </div>


                    {/* ==================================================
                        ALERTS
                    ================================================== */}

                    {message && (

                        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
                            ✓ {message}
                        </div>

                    )}

                    {error && (

                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                            ⚠️ {error}
                        </div>

                    )}


                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* ==================================================
                            LEFT PROFILE CARD
                        ================================================== */}

                        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

                            <div className="flex flex-col items-center text-center">

                                {/* PHOTO */}

                                <div className="relative">

                                    <div className="w-32 h-32 rounded-full bg-[#fff7f2] border-4 border-orange-100 flex items-center justify-center overflow-hidden">

                                        {getProfileImage() ? (

                                            <img
                                                src={getProfileImage()}
                                                alt="Buyer profile"
                                                className="w-full h-full object-cover"
                                            />

                                        ) : (

                                            <span className="text-5xl font-bold text-[#f95700]">
                                                {getInitial()}
                                            </span>

                                        )}

                                    </div>


                                    {/* CAMERA BUTTON */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#f95700] text-white flex items-center justify-center border-4 border-white hover:bg-[#dc4b00] transition"
                                        title="Upload profile photo"
                                    >
                                        📷
                                    </button>

                                </div>


                                {/* HIDDEN FILE INPUT */}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />


                                <p className="text-xs text-gray-400 mt-3">
                                    JPG, PNG or WEBP
                                </p>

                                <p className="text-xs text-gray-400">
                                    Maximum 5 MB
                                </p>


                                {/* NAME */}

                                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                                    {user?.full_name ||
                                        form.full_name ||
                                        "Buyer"}
                                </h2>


                                {/* EMAIL */}

                                <p className="text-gray-500 mt-1 break-all">
                                    {user?.email ||
                                        form.email ||
                                        "No email"}
                                </p>


                                {/* ROLE */}

                                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#f95700]">

                                    <span className="w-2 h-2 rounded-full bg-[#f95700]">
                                    </span>

                                    Buyer Account

                                </div>

                            </div>


                            {/* ACCOUNT DETAILS */}

                            <div className="mt-7 border-t border-gray-100 pt-6">

                                <div className="flex justify-between mb-5">

                                    <span className="text-sm text-gray-500">
                                        Account ID
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        #{user?.id || "—"}
                                    </span>

                                </div>


                                <div className="flex justify-between mb-5">

                                    <span className="text-sm text-gray-500">
                                        Status
                                    </span>

                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        Active
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-sm text-gray-500">
                                        Role
                                    </span>

                                    <span className="font-semibold">
                                        Buyer
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            RIGHT FORM
                        ================================================== */}

                        <div className="lg:col-span-2">

                            <form
                                onSubmit={handleSubmit}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                            >

                                <div className="bg-[#111827] text-white px-7 py-6 border-b-4 border-[#f95700]">

                                    <h2 className="text-2xl font-bold">
                                        Buyer Information
                                    </h2>

                                    <p className="text-gray-300 mt-1">
                                        Keep your account details up to date.
                                    </p>

                                </div>


                                <div className="p-7">

                                    {/* ==================================================
                                        BASIC INFORMATION
                                    ================================================== */}

                                    <h3 className="text-lg font-bold text-gray-900 mb-5">
                                        Basic Information
                                    </h3>


                                    <div className="grid md:grid-cols-2 gap-5">

                                        {/* NAME */}

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name *
                                            </label>

                                            <input
                                                type="text"
                                                name="full_name"
                                                value={form.full_name}
                                                onChange={handleChange}
                                                placeholder="Enter full name"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                            />

                                        </div>


                                        {/* MOBILE */}

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Mobile Number *
                                            </label>

                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={form.mobile}
                                                onChange={handleChange}
                                                maxLength="10"
                                                inputMode="numeric"
                                                placeholder="10-digit mobile"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                            />

                                        </div>


                                        {/* EMAIL */}

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                value={form.email}
                                                disabled
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />

                                        </div>


                                        {/* BUYER TYPE */}

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Buyer Type *
                                            </label>

                                            <select
                                                name="buyer_type"
                                                value={form.buyer_type}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                            >

                                                <option value="Individual">
                                                    Individual
                                                </option>

                                                <option value="Wholesaler">
                                                    Wholesaler
                                                </option>

                                                <option value="Retailer">
                                                    Retailer
                                                </option>

                                                <option value="Trader">
                                                    Trader
                                                </option>

                                                <option value="Restaurant">
                                                    Restaurant
                                                </option>

                                                <option value="Exporter">
                                                    Exporter
                                                </option>

                                                <option value="Company">
                                                    Company
                                                </option>

                                            </select>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        BUSINESS
                                    ================================================== */}

                                    <div className="border-t border-gray-100 mt-8 pt-7">

                                        <h3 className="text-lg font-bold text-gray-900 mb-5">
                                            Business Information
                                        </h3>


                                        <div className="grid md:grid-cols-2 gap-5">

                                            <div>

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Business / Company Name
                                                </label>

                                                <input
                                                    type="text"
                                                    name="business_name"
                                                    value={form.business_name}
                                                    onChange={handleChange}
                                                    placeholder="Enter business name"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                                />

                                            </div>


                                            <div>

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    GST Number
                                                </label>

                                                <input
                                                    type="text"
                                                    name="gst_number"
                                                    value={form.gst_number}
                                                    onChange={handleChange}
                                                    placeholder="Enter GST number"
                                                    maxLength="15"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 uppercase outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                                />

                                            </div>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        ADDRESS
                                    ================================================== */}

                                    <div className="border-t border-gray-100 mt-8 pt-7">

                                        <h3 className="text-lg font-bold text-gray-900 mb-5">
                                            Address Information
                                        </h3>


                                        <div className="space-y-5">

                                            <div>

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Address
                                                </label>

                                                <textarea
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    placeholder="Enter complete address"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                                />

                                            </div>


                                            <div className="grid md:grid-cols-3 gap-5">

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        City
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={form.city}
                                                        onChange={handleChange}
                                                        placeholder="City"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                                    />

                                                </div>


                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        State
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={form.state}
                                                        onChange={handleChange}
                                                        placeholder="State"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                                    />

                                                </div>


                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Pincode
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={form.pincode}
                                                        onChange={handleChange}
                                                        maxLength="6"
                                                        inputMode="numeric"
                                                        placeholder="6-digit pincode"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#f95700] focus:ring-2 focus:ring-orange-100"
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        ACTIONS
                                    ================================================== */}

                                    <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row gap-3">

                                        <button
                                            type="submit"
                                            disabled={
                                                saving ||
                                                uploadingPhoto
                                            }
                                            className="flex-1 bg-[#f95700] hover:bg-[#dc4b00] text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        >

                                            {saving ? (

                                                <span className="flex items-center justify-center gap-2">

                                                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin">
                                                    </span>

                                                    {uploadingPhoto
                                                        ? "Uploading Photo..."
                                                        : "Saving..."}

                                                </span>

                                            ) : (

                                                "Save Profile"

                                            )}

                                        </button>


                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="border border-red-200 bg-white hover:bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold transition"
                                        >
                                            Sign Out
                                        </button>

                                    </div>

                                </div>

                            </form>

                        </div>

                    </div>

                </main>

            </div>

        </BuyerLayout>

    );
}

export default BuyerProfile;