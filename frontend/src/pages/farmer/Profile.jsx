import {
    useEffect,
    useRef,
    useState
} from "react";

import FarmerLayout from "../../layouts/FarmerLayout";

import {
    getFarmerProfile,
    updateFarmerProfile
} from "../../services/farmerService";


const BACKEND_URL = window.location.origin;


function Profile() {

    const fileInputRef = useRef(null);

    // ==========================================
    // PROFILE
    // ==========================================

    const [profile, setProfile] = useState({

        full_name: "",
        email: "",
        mobile: "",

        address: "",
        village: "",
        district: "",
        state: "Karnataka",
        pincode: "",

        farm_size: "",
        farm_size_unit: "acre",

        farming_type: "",

        crops_grown: "",

        latitude: "",
        longitude: "",

        profile_photo: ""

    });


    // ==========================================
    // EDIT MODE
    // ==========================================

    const [isEditing, setIsEditing] =
        useState(false);

    const [originalProfile, setOriginalProfile] =
        useState(null);


    // ==========================================
    // PHOTO
    // ==========================================

    const [selectedPhoto, setSelectedPhoto] =
        useState(null);

    const [previewPhoto, setPreviewPhoto] =
        useState("");

    const [photoError, setPhotoError] =
        useState(false);

    const [photoVersion, setPhotoVersion] =
        useState(Date.now());


    // ==========================================
    // CROPS
    // ==========================================

    const [cropList, setCropList] =
        useState([]);


    // ==========================================
    // STATUS
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // ==========================================
    // AVAILABLE CROPS
    // ==========================================

    const availableCrops = [

        "Tomato",
        "Onion",
        "Potato",
        "Maize",
        "Cotton",
        "Sugarcane",
        "Paddy",
        "Wheat",
        "Groundnut",
        "Turmeric",
        "Chilli",
        "Brinjal",
        "Cabbage",
        "Cauliflower",
        "Carrot",
        "Beans",
        "Ragi",
        "Jowar",
        "Bajra",
        "Soybean",
        "Sunflower",
        "Other"

    ];


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    const loadProfile = async () => {

        try {

            setLoading(true);

            setError("");

            const result =
                await getFarmerProfile();

            console.log(
                "PROFILE RESPONSE:",
                result
            );


            if (!result?.success) {

                throw new Error(
                    result?.message ||
                    "Failed to load profile"
                );

            }


            const data =
                result.profile ||
                result.farmer ||
                {};


            const loadedProfile = {

                full_name:
                    data.full_name || "",

                email:
                    data.email || "",

                mobile:
                    data.mobile || "",


                address:
                    data.address || "",

                village:
                    data.village || "",

                district:
                    data.district || "",

                state:
                    data.state ||
                    "Karnataka",

                pincode:
                    data.pincode || "",


                farm_size:
                    data.farm_size !== null &&
                    data.farm_size !== undefined
                        ? String(data.farm_size)
                        : "",


                farm_size_unit:
                    data.farm_size_unit ||
                    "acre",


                farming_type:
                    data.farming_type || "",


                crops_grown:
                    data.crops_grown || "",


                latitude:
                    data.latitude !== null &&
                    data.latitude !== undefined
                        ? String(data.latitude)
                        : "",


                longitude:
                    data.longitude !== null &&
                    data.longitude !== undefined
                        ? String(data.longitude)
                        : "",


                profile_photo:
                    data.profile_photo || ""

            };


            console.log(
                "PROFILE PHOTO:",
                loadedProfile.profile_photo
            );


            setProfile(
                loadedProfile
            );


            setOriginalProfile(
                loadedProfile
            );


            // ==================================
            // LOAD CROPS
            // ==================================

            if (
                loadedProfile.crops_grown
            ) {

                const crops =
                    loadedProfile.crops_grown
                        .split(",")
                        .map(
                            (crop) =>
                                crop.trim()
                        )
                        .filter(Boolean);

                setCropList(crops);

            } else {

                setCropList([]);

            }


            setPhotoError(false);

            setPhotoVersion(
                Date.now()
            );


        } catch (err) {

            console.error(
                "LOAD PROFILE ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load farmer profile."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        loadProfile();

    }, []);


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = () => {

        setOriginalProfile({
            ...profile
        });

        setMessage("");

        setError("");

        setPhotoError(false);

        setIsEditing(true);

    };


    // ==========================================
    // CANCEL
    // ==========================================

    const handleCancel = () => {

        if (originalProfile) {

            setProfile({
                ...originalProfile
            });


            if (
                originalProfile.crops_grown
            ) {

                setCropList(
                    originalProfile.crops_grown
                        .split(",")
                        .map(
                            (crop) =>
                                crop.trim()
                        )
                        .filter(Boolean)
                );

            } else {

                setCropList([]);

            }

        }


        setSelectedPhoto(null);

        setPreviewPhoto("");

        setPhotoError(false);

        if (fileInputRef.current) {

            fileInputRef.current.value =
                "";

        }


        setMessage("");

        setError("");

        setIsEditing(false);

    };


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfile(
            (previous) => ({

                ...previous,

                [name]: value

            })
        );

    };


    // ==========================================
    // ADD CROP
    // ==========================================

    const handleAddCrop = (e) => {

        const crop =
            e.target.value;


        if (!crop) {
            return;
        }


        if (
            !cropList.includes(crop)
        ) {

            const updatedCrops = [
                ...cropList,
                crop
            ];


            setCropList(
                updatedCrops
            );


            setProfile(
                (previous) => ({

                    ...previous,

                    crops_grown:
                        updatedCrops.join(", ")

                })
            );

        }


        e.target.value = "";

    };


    // ==========================================
    // REMOVE CROP
    // ==========================================

    const handleRemoveCrop = (cropToRemove) => {

        const updatedCrops =
            cropList.filter(
                (crop) =>
                    crop !== cropToRemove
            );


        setCropList(
            updatedCrops
        );


        setProfile(
            (previous) => ({

                ...previous,

                crops_grown:
                    updatedCrops.join(", ")

            })
        );

    };


    // ==========================================
    // PHOTO SELECT
    // ==========================================

    const handlePhotoChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setError(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            return;

        }


        if (
            file.size >
            5 * 1024 * 1024
        ) {

            setError(
                "Profile photo must be less than 5 MB."
            );

            return;

        }


        setError("");

        setPhotoError(false);

        setSelectedPhoto(file);


        const objectUrl =
            URL.createObjectURL(file);


        setPreviewPhoto(
            objectUrl
        );

    };


    // ==========================================
    // REMOVE NEW PHOTO
    // ==========================================

    const removeSelectedPhoto = () => {

        setSelectedPhoto(null);

        setPreviewPhoto("");

        setPhotoError(false);


        if (fileInputRef.current) {

            fileInputRef.current.value =
                "";

        }

    };


    // ==========================================
    // GPS LOCATION
    // ==========================================

    const getLocation = () => {

        setMessage("");

        setError("");


        if (
            !navigator.geolocation
        ) {

            setError(
                "GPS is not supported by your browser."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude
                        .toFixed(7);

                const longitude =
                    position.coords.longitude
                        .toFixed(7);


                setProfile(
                    (previous) => ({

                        ...previous,

                        latitude,

                        longitude

                    })
                );


                setMessage(
                    "GPS location detected successfully."
                );

            },


            (err) => {

                console.error(
                    "GPS ERROR:",
                    err
                );


                setError(
                    "Unable to access your location. Please allow location permission."
                );

            },


            {

                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0

            }

        );

    };


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!isEditing) {
            return;
        }


        setSaving(true);

        setMessage("");

        setError("");


        try {

            // ==================================
            // CREATE FORMDATA
            // ==================================

            const formData =
                new FormData();


            formData.append(
                "full_name",
                profile.full_name
            );


            formData.append(
                "mobile",
                profile.mobile
            );


            formData.append(
                "address",
                profile.address
            );


            formData.append(
                "village",
                profile.village
            );


            formData.append(
                "district",
                profile.district
            );


            formData.append(
                "state",
                profile.state
            );


            formData.append(
                "pincode",
                profile.pincode
            );


            formData.append(
                "farm_size",
                profile.farm_size
            );


            formData.append(
                "farm_size_unit",
                profile.farm_size_unit
            );


            formData.append(
                "farming_type",
                profile.farming_type
            );


            formData.append(
                "crops_grown",
                cropList.join(", ")
            );


            formData.append(
                "latitude",
                profile.latitude
            );


            formData.append(
                "longitude",
                profile.longitude
            );


            // ==================================
            // PHOTO
            // ==================================

            if (selectedPhoto) {

                formData.append(
                    "profile_photo",
                    selectedPhoto
                );

            }


            console.log(
                "UPDATING FARMER PROFILE..."
            );


            const result =
                await updateFarmerProfile(
                    formData
                );


            console.log(
                "UPDATE RESPONSE:",
                result
            );


            if (
                !result?.success
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to update profile"
                );

            }


            // ==================================
            // SUCCESS
            // ==================================

            setMessage(
                "Profile updated successfully!"
            );


            setSelectedPhoto(null);

            setPreviewPhoto("");

            setPhotoError(false);


            if (fileInputRef.current) {

                fileInputRef.current.value =
                    "";

            }


            // ==================================
            // LOAD UPDATED PROFILE
            // ==================================

            await loadProfile();


            setPhotoVersion(
                Date.now()
            );


            setIsEditing(false);


        } catch (err) {

            console.error(
                "UPDATE PROFILE ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update farmer profile."
            );


        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // GET PHOTO URL
    // ==========================================

    const getPhotoUrl = () => {

        // New image preview
        if (previewPhoto) {

            return previewPhoto;

        }


        // No database image
        if (
            !profile.profile_photo
        ) {

            return "";

        }


        let photo =
            String(
                profile.profile_photo
            ).trim();


        // Already full URL
        if (
            photo.startsWith(
                "http://"
            ) ||
            photo.startsWith(
                "https://"
            )
        ) {

            return `${photo}?v=${photoVersion}`;

        }


        // /uploads/profiles/...
        if (
            photo.startsWith("/")
        ) {

            return `${BACKEND_URL}${photo}?v=${photoVersion}`;

        }


        // uploads/profiles/...
        if (
            photo.startsWith(
                "uploads/"
            )
        ) {

            return `${BACKEND_URL}/${photo}?v=${photoVersion}`;

        }


        // filename only
        return `${BACKEND_URL}/uploads/profiles/${photo}?v=${photoVersion}`;

    };


    // ==========================================
    // PHOTO ERROR
    // ==========================================

    const handlePhotoError = () => {

        console.error(
            "Unable to load profile photo:",
            getPhotoUrl()
        );


        setPhotoError(true);

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <FarmerLayout>

                <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">

                    <div className="text-center">

                        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#ff6500] rounded-full animate-spin mx-auto mb-4"></div>

                        <p className="text-gray-600 font-medium">
                            Loading profile...
                        </p>

                    </div>

                </div>

            </FarmerLayout>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <FarmerLayout>

            <div className="min-h-screen bg-[#f3f4f6] py-10 px-5">

                <div className="max-w-6xl mx-auto">


                    {/* ==================================
                        HEADER
                    ================================== */}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

                        <div>

                            <p className="text-[#ff6500] font-bold text-sm uppercase tracking-wide">
                                Farmer Account
                            </p>


                            <h1 className="text-4xl font-bold text-[#111827]">
                                My Profile
                            </h1>


                            <p className="text-gray-600 mt-2">
                                {isEditing
                                    ? "Edit your personal and farming information."
                                    : "View your personal and farming information."
                                }
                            </p>

                        </div>


                        {!isEditing && (

                            <button
                                type="button"
                                onClick={handleEdit}
                                className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-7 py-3 rounded-xl font-bold shadow-md transition"
                            >
                                ✏️ Edit Profile
                            </button>

                        )}

                    </div>


                    {/* ==================================
                        SUCCESS
                    ================================== */}

                    {message && (

                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 font-medium">

                            ✓ {message}

                        </div>

                    )}


                    {/* ==================================
                        ERROR
                    ================================== */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">

                            ⚠️ {error}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >


                        {/* ==================================
                            PERSONAL DETAILS
                        ================================== */}

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                            <div className="bg-[#111827] text-white px-7 py-6 border-b-4 border-[#ff6500]">

                                <h2 className="text-2xl font-bold">
                                    Personal Details
                                </h2>

                                <p className="text-gray-300 mt-1">
                                    Your basic account information
                                </p>

                            </div>


                            <div className="p-7">


                                {/* ==================================
                                    PROFILE PHOTO
                                ================================== */}

                                <div className="flex flex-col sm:flex-row items-center gap-7 pb-8 mb-8 border-b border-gray-200">


                                    <div className="w-36 h-36 rounded-full border-4 border-[#ff6500] bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">

                                        {getPhotoUrl() &&
                                        !photoError ? (

                                            <img
                                                src={getPhotoUrl()}
                                                alt="Farmer profile"
                                                className="w-full h-full object-cover"
                                                onError={
                                                    handlePhotoError
                                                }
                                            />

                                        ) : (

                                            <div className="text-center">

                                                <div className="text-5xl">
                                                    👨‍🌾
                                                </div>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    No Photo
                                                </p>

                                            </div>

                                        )}

                                    </div>


                                    <div className="flex-1">

                                        <h3 className="text-xl font-bold text-[#111827]">
                                            Profile Photo
                                        </h3>


                                        <p className="text-gray-500 text-sm mt-1 mb-4">
                                            JPG, PNG or WEBP • Maximum 5 MB
                                        </p>


                                        {isEditing && (

                                            <>

                                                <input
                                                    ref={
                                                        fileInputRef
                                                    }
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={
                                                        handlePhotoChange
                                                    }
                                                    className="hidden"
                                                />


                                                <div className="flex flex-wrap gap-3">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                        className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-5 py-2.5 rounded-lg font-bold transition"
                                                    >
                                                        📷 Choose Photo
                                                    </button>


                                                    {selectedPhoto && (

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                removeSelectedPhoto
                                                            }
                                                            className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-semibold"
                                                        >
                                                            Remove
                                                        </button>

                                                    )}

                                                </div>


                                                {selectedPhoto && (

                                                    <p className="text-sm text-green-600 mt-3">
                                                        ✓ Selected:{" "}
                                                        {selectedPhoto.name}
                                                    </p>

                                                )}

                                            </>

                                        )}

                                    </div>

                                </div>


                                {/* ==================================
                                    NAME EMAIL MOBILE
                                ================================== */}

                                <div className="grid md:grid-cols-2 gap-6">


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="full_name"
                                            value={
                                                profile.full_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50 disabled:text-gray-600"
                                            placeholder="Enter full name"
                                        />

                                    </div>


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={
                                                profile.email
                                            }
                                            disabled
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />

                                        <p className="text-xs text-gray-500 mt-1">
                                            Email cannot be changed here.
                                        </p>

                                    </div>


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Mobile Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={
                                                profile.mobile
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            maxLength="10"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                            placeholder="Enter mobile number"
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ==================================
                            LOCATION DETAILS
                        ================================== */}

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                            <div className="bg-[#111827] text-white px-7 py-6 border-b-4 border-[#ff6500]">

                                <h2 className="text-2xl font-bold">
                                    Location Details
                                </h2>

                                <p className="text-gray-300 mt-1">
                                    Your farming location
                                </p>

                            </div>


                            <div className="p-7">

                                <div className="grid md:grid-cols-2 gap-6">


                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            value={
                                                profile.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50 resize-y"
                                            placeholder="Enter complete farm address"
                                        />

                                    </div>


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Village
                                        </label>

                                        <input
                                            type="text"
                                            name="village"
                                            value={
                                                profile.village
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                            placeholder="Enter village"
                                        />

                                    </div>


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            District
                                        </label>

                                        <input
                                            type="text"
                                            name="district"
                                            value={
                                                profile.district
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                            placeholder="Enter district"
                                        />

                                    </div>


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            State
                                        </label>

                                        <select
                                            name="state"
                                            value={
                                                profile.state
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                        >

                                            <option value="Karnataka">
                                                Karnataka
                                            </option>

                                            <option value="Maharashtra">
                                                Maharashtra
                                            </option>

                                            <option value="Goa">
                                                Goa
                                            </option>

                                            <option value="Tamil Nadu">
                                                Tamil Nadu
                                            </option>

                                            <option value="Andhra Pradesh">
                                                Andhra Pradesh
                                            </option>

                                            <option value="Telangana">
                                                Telangana
                                            </option>

                                            <option value="Kerala">
                                                Kerala
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            value={
                                                profile.pincode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            maxLength="6"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                            placeholder="Enter pincode"
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ==================================
                            FARMING DETAILS
                        ================================== */}

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                            <div className="bg-[#111827] text-white px-7 py-6 border-b-4 border-[#ff6500]">

                                <h2 className="text-2xl font-bold">
                                    Farming Details
                                </h2>

                                <p className="text-gray-300 mt-1">
                                    Information about your farm
                                </p>

                            </div>


                            <div className="p-7">

                                <div className="grid md:grid-cols-2 gap-6">


                                    {/* FARM SIZE */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Farm Size
                                        </label>

                                        <div className="grid grid-cols-[1fr_150px] gap-3">

                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                name="farm_size"
                                                value={
                                                    profile.farm_size
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    !isEditing
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                                placeholder="Farm size"
                                            />


                                            <select
                                                name="farm_size_unit"
                                                value={
                                                    profile.farm_size_unit
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    !isEditing
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                            >

                                                <option value="acre">
                                                    Acre
                                                </option>

                                                <option value="acres">
                                                    Acres
                                                </option>

                                                <option value="hectare">
                                                    Hectare
                                                </option>

                                                <option value="gunta">
                                                    Gunta
                                                </option>

                                                <option value="cent">
                                                    Cent
                                                </option>

                                            </select>

                                        </div>

                                    </div>


                                    {/* FARMING TYPE */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Farming Type
                                        </label>

                                        <select
                                            name="farming_type"
                                            value={
                                                profile.farming_type
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                        >

                                            <option value="">
                                                Select farming type
                                            </option>

                                            <option value="Organic">
                                                Organic Farming
                                            </option>

                                            <option value="Natural Farming">
                                                Natural Farming
                                            </option>

                                            <option value="Conventional">
                                                Conventional Farming
                                            </option>

                                            <option value="Mixed Farming">
                                                Mixed Farming
                                            </option>

                                            <option value="Contract Farming">
                                                Contract Farming
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    {/* CROPS */}

                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Crops Grown
                                        </label>


                                        {isEditing && (

                                            <select
                                                defaultValue=""
                                                onChange={
                                                    handleAddCrop
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] mb-4"
                                            >

                                                <option value="">
                                                    + Add Crop
                                                </option>

                                                {availableCrops
                                                    .filter(
                                                        (crop) =>
                                                            !cropList.includes(
                                                                crop
                                                            )
                                                    )
                                                    .map(
                                                        (crop) => (

                                                            <option
                                                                key={
                                                                    crop
                                                                }
                                                                value={
                                                                    crop
                                                                }
                                                            >
                                                                {crop}
                                                            </option>

                                                        )
                                                    )}

                                            </select>

                                        )}


                                        {/* SELECTED CROPS */}

                                        {cropList.length > 0 ? (

                                            <div className="flex flex-wrap gap-2 mb-4">

                                                {cropList.map(
                                                    (crop) => (

                                                        <div
                                                            key={
                                                                crop
                                                            }
                                                            className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-[#ff6500] px-3 py-2 rounded-full font-semibold"
                                                        >

                                                            <span>
                                                                🌱 {crop}
                                                            </span>


                                                            {isEditing && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveCrop(
                                                                            crop
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-700 font-bold"
                                                                >
                                                                    ×
                                                                </button>

                                                            )}

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        ) : (

                                            <div className="border border-dashed border-gray-300 rounded-lg p-5 text-gray-500 text-center">

                                                No crops added yet.

                                            </div>

                                        )}


                                        {/* HIDDEN TEXT VALUE */}

                                        {!isEditing && (

                                            <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 min-h-[50px]">

                                                {profile.crops_grown ||
                                                    "No crops added"}

                                            </div>

                                        )}


                                        {isEditing && (

                                            <p className="text-xs text-gray-500">
                                                Select multiple crops from the list. Click × to remove a crop.
                                            </p>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ==================================
                            GPS
                        ================================== */}

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                            <div className="bg-[#111827] text-white px-7 py-6 border-b-4 border-[#ff6500]">

                                <h2 className="text-2xl font-bold">
                                    GPS Location
                                </h2>

                                <p className="text-gray-300 mt-1">
                                    Used for nearby mandi recommendations
                                </p>

                            </div>


                            <div className="p-7">


                                {isEditing && (

                                    <button
                                        type="button"
                                        onClick={
                                            getLocation
                                        }
                                        className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-6 py-3 rounded-lg font-bold transition"
                                    >
                                        📍 Detect My Location
                                    </button>

                                )}


                                <div className="grid md:grid-cols-2 gap-6 mt-6">


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Latitude
                                        </label>

                                        <input
                                            type="text"
                                            name="latitude"
                                            value={
                                                profile.latitude
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                            placeholder="Example: 11.92510"
                                        />

                                    </div>


                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Longitude
                                        </label>

                                        <input
                                            type="text"
                                            name="longitude"
                                            value={
                                                profile.longitude
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6500] disabled:bg-gray-50"
                                            placeholder="Example: 76.93474"
                                        />

                                    </div>

                                </div>


                                {profile.latitude &&
                                profile.longitude && (

                                    <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">

                                        ✓ GPS coordinates saved:

                                        <strong className="ml-2">

                                            {profile.latitude},{" "}
                                            {profile.longitude}

                                        </strong>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* ==================================
                            SAVE / CANCEL
                        ================================== */}

                        {isEditing && (

                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-2 pb-10">

                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-8 py-3 rounded-xl font-bold shadow-md transition disabled:opacity-50"
                                >

                                    {saving
                                        ? "⏳ Saving..."
                                        : "💾 Save Changes"}

                                </button>

                            </div>

                        )}

                    </form>

                </div>

            </div>

        </FarmerLayout>

    );

}


export default Profile;