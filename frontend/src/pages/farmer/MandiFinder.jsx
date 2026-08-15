import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    getNearbyMandis,
    searchMandisByLocation,
    saveMandi,
    getSavedMandis
} from "../../services/mandiService";

function MandiFinder() {

    const navigate = useNavigate();

    // ============================================================
    // STATE
    // ============================================================

    const [location, setLocation] = useState("");

    // IMPORTANT:
    // Default radius MUST be None
    const [radius, setRadius] = useState("none");

    const [userLocation, setUserLocation] = useState(null);

    const [mandis, setMandis] = useState([]);

    const [savedIds, setSavedIds] = useState(
        new Set()
    );

    const [loading, setLoading] = useState(false);

    const [savingId, setSavingId] = useState(null);

    const [error, setError] = useState("");

    const [searched, setSearched] = useState(false);

    const [searchType, setSearchType] = useState("");

    // ============================================================
    // LOAD SAVED MANDIS
    // ============================================================

    useEffect(() => {

        const loadSavedMandis = async () => {

            try {

                const response =
                    await getSavedMandis();

                console.log(
                    "SAVED MANDIS:",
                    response
                );

                const saved =
                    response?.mandis ||
                    response?.savedMandis ||
                    response?.saved ||
                    [];

                const ids = new Set();

                saved.forEach((item) => {

                    if (item.id !== undefined) {
                        ids.add(
                            String(item.id)
                        );
                    }

                    if (item.mandi_id !== undefined) {
                        ids.add(
                            String(item.mandi_id)
                        );
                    }
                });

                setSavedIds(ids);

            } catch (err) {

                console.error(
                    "LOAD SAVED MANDIS ERROR:",
                    err
                );

                // Do not show an error on page load.
                // User can still search mandis.
            }
        };

        loadSavedMandis();

    }, []);

    // ============================================================
    // DETECT CURRENT LOCATION
    // IMPORTANT:
    // This ONLY detects location.
    // It does NOT automatically search.
    // ============================================================

    useEffect(() => {

        if (!navigator.geolocation) {

            console.log(
                "Geolocation is not supported."
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setUserLocation({

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude

                });

                console.log(
                    "GPS LOCATION:",
                    position.coords.latitude,
                    position.coords.longitude
                );
            },

            (geoError) => {

                console.log(
                    "GPS permission:",
                    geoError.message
                );

                setUserLocation(null);
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );

    }, []);

    // ============================================================
    // CLEAR RESULTS
    // ============================================================

    const clearResults = () => {

        setMandis([]);

        setError("");

        setSearched(false);

        setSearchType("");
    };

    // ============================================================
    // LOCATION SEARCH
    //
    // Example:
    // Haveri
    // Mysore
    // Dharwad
    // Karnataka
    //
    // Backend should return:
    // MySQL + OpenStreetMap
    // ============================================================

    const handleLocationSearch = async () => {

        const value =
            location.trim();

        if (!value) {

            setError(
                "Please enter a city, district or state."
            );

            return;
        }

        setLoading(true);

        setError("");

        setSearched(true);

        setSearchType("location");

        setMandis([]);

        try {

            console.log(
                "LOCATION SEARCH:",
                value
            );

            const response =
                await searchMandisByLocation(
                    value
                );

            console.log(
                "LOCATION SEARCH RESPONSE:",
                response
            );

            const results =
                response?.mandis || [];

            setMandis(results);

            if (results.length === 0) {

                setError(
                    `No mandis found for "${value}". Try another location.`
                );
            }

        } catch (err) {

            console.error(
                "LOCATION SEARCH ERROR:",
                err
            );

            setMandis([]);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to search mandis."
            );

        } finally {

            setLoading(false);
        }
    };

    // ============================================================
    // RADIUS SEARCH
    //
    // Radius = None by default.
    // ============================================================

    const handleRadiusSearch = async () => {

        if (radius === "none") {

            setError(
                "Please select a search radius."
            );

            return;
        }

        if (!userLocation) {

            setError(
                "Unable to detect your current location. Please allow location access and try again."
            );

            return;
        }

        setLoading(true);

        setError("");

        setSearched(true);

        setSearchType("radius");

        setMandis([]);

        try {

            console.log(
                "RADIUS SEARCH:",
                radius
            );

            const response =
                await getNearbyMandis(

                    userLocation.latitude,

                    userLocation.longitude,

                    Number(radius)

                );

            console.log(
                "RADIUS SEARCH RESPONSE:",
                response
            );

            const results =
                response?.mandis || [];

            setMandis(results);

            if (results.length === 0) {

                setError(
                    `No mandis found within ${radius} km.`
                );
            }

        } catch (err) {

            console.error(
                "RADIUS SEARCH ERROR:",
                err
            );

            setMandis([]);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to fetch nearby mandis."
            );

        } finally {

            setLoading(false);
        }
    };

    // ============================================================
    // SAVE MANDI
    // ============================================================

    const handleSave = async (mandi) => {

        const mandiId =
            String(
                mandi.mandi_id ||
                mandi.id ||
                ""
            );

        if (!mandiId) {

            setError(
                "This mandi does not have a valid ID."
            );

            return;
        }

        // Already saved
        if (
            savedIds.has(mandiId)
        ) {
            return;
        }

        try {

            setSavingId(mandiId);

            setError("");

            console.log(
                "SAVING MANDI:",
                mandi
            );

            const response =
                await saveMandi({

                    // Keep both fields for compatibility
                    id:
                        mandi.id,

                    mandi_id:
                        mandi.mandi_id ||
                        mandi.id,

                    name:
                        mandi.name ||
                        mandi.mandi_name ||
                        "Agricultural Market",

                    mandi_name:
                        mandi.mandi_name ||
                        mandi.name ||
                        "Agricultural Market",

                    address:
                        mandi.address ||
                        "",

                    district:
                        mandi.district ||
                        "",

                    state:
                        mandi.state ||
                        "",

                    latitude:
                        mandi.latitude ??
                        null,

                    longitude:
                        mandi.longitude ??
                        null,

                    contact_number:
                        mandi.contact_number ||
                        null,

                    google_maps:
                        mandi.google_maps ||
                        null,

                    source:
                        mandi.source ||
                        "Form2Feature Database"
                });

            console.log(
                "SAVE MANDI RESPONSE:",
                response
            );

            if (
                response?.success ||
                response?.already_saved
            ) {

                setSavedIds(
                    previous => {

                        const next =
                            new Set(
                                previous
                            );

                        next.add(
                            mandiId
                        );

                        if (
                            mandi.id !==
                            undefined
                        ) {

                            next.add(
                                String(
                                    mandi.id
                                )
                            );
                        }

                        if (
                            mandi.mandi_id !==
                            undefined
                        ) {

                            next.add(
                                String(
                                    mandi.mandi_id
                                )
                            );
                        }

                        return next;
                    }
                );

            } else {

                throw new Error(
                    response?.message ||
                    "Unable to save mandi."
                );
            }

        } catch (err) {

            console.error(
                "SAVE MANDI ERROR:",
                err
            );

            console.error(
                "SERVER RESPONSE:",
                err.response?.data
            );

            if (
                err.response?.status === 409
            ) {

                setSavedIds(
                    previous => {

                        const next =
                            new Set(
                                previous
                            );

                        next.add(
                            mandiId
                        );

                        return next;
                    }
                );

                return;
            }

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to save mandi."
            );

        } finally {

            setSavingId(null);
        }
    };

    // ============================================================
    // OPEN GOOGLE MAPS
    // ============================================================

    const openMap = (mandi) => {

        if (mandi.google_maps) {

            window.open(
                mandi.google_maps,
                "_blank",
                "noopener,noreferrer"
            );

            return;
        }

        if (
            mandi.latitude !== null &&
            mandi.latitude !== undefined &&
            mandi.longitude !== null &&
            mandi.longitude !== undefined
        ) {

            const url =
                `https://www.google.com/maps/dir/?api=1&destination=${mandi.latitude},${mandi.longitude}&travelmode=driving`;

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            return;
        }

        alert(
            "Location coordinates are not available for this mandi."
        );
    };

    // ============================================================
    // SOURCE LABEL
    // ============================================================

    const getSourceLabel = (source) => {

        const value =
            String(
                source || ""
            ).toLowerCase();

        if (
            value.includes(
                "openstreetmap"
            ) ||
            value.includes("osm")
        ) {

            return {
                label: "🌍 Real OSM Mandi",
                className:
                    "bg-green-100 text-green-700"
            };
        }

        if (
            value.includes(
                "data.gov"
            )
        ) {

            return {
                label: "🏛 Data.gov.in",
                className:
                    "bg-blue-100 text-blue-700"
            };
        }

        return {
            label:
                "🗄️ Form2Feature Database",
            className:
                "bg-orange-100 text-orange-700"
        };
    };

    // ============================================================
    // CHECK SAVED
    // ============================================================

    const isMandiSaved = (mandi) => {

        const id1 =
            mandi.id !== undefined
                ? String(mandi.id)
                : null;

        const id2 =
            mandi.mandi_id !== undefined
                ? String(mandi.mandi_id)
                : null;

        return (
            (id1 &&
                savedIds.has(id1)) ||
            (id2 &&
                savedIds.has(id2))
        );
    };

    // ============================================================
    // PAGE
    // ============================================================

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* ====================================================
                    HEADER
                ==================================================== */}

                <div className="mb-8">

                    <p className="text-[#ff6500] font-bold uppercase tracking-wide">
                        Smart Agriculture
                    </p>

                    <h1 className="text-4xl font-bold text-[#111827] mt-2">
                        Nearby Mandi Finder
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Search agricultural markets by location
                        or find mandis near your current location.
                    </p>

                </div>

                {/* ====================================================
                    SEARCH CARD
                ==================================================== */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* =================================================
                            LOCATION SEARCH
                        ================================================= */}

                        <div>

                            <label className="block font-bold text-gray-800 mb-2">
                                Search Location
                            </label>

                            <p className="text-sm text-gray-500 mb-3">
                                Type a city, district or state.
                            </p>

                            <div className="flex gap-3">

                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(
                                            e.target.value
                                        );

                                        if (
                                            error
                                        ) {
                                            setError("");
                                        }
                                    }}
                                    onKeyDown={(e) => {

                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {

                                            e.preventDefault();

                                            handleLocationSearch();
                                        }
                                    }}
                                    placeholder="Example: Haveri, Mysore, Dharwad"
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff6500] focus:ring-1 focus:ring-[#ff6500]"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleLocationSearch
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="bg-[#ff6500] hover:bg-[#e85b00] disabled:opacity-60 text-white px-5 py-3 rounded-lg font-semibold whitespace-nowrap"
                                >
                                    🔍 Search
                                </button>

                            </div>

                            <p className="text-xs text-gray-500 mt-3">
                                Searches both real OpenStreetMap
                                mandis and your MySQL database.
                            </p>

                        </div>

                        {/* =================================================
                            RADIUS SEARCH
                        ================================================= */}

                        <div>

                            <label className="block font-bold text-gray-800 mb-2">
                                Search Radius
                            </label>

                            <p className="text-sm text-gray-500 mb-3">
                                Uses your current GPS location.
                            </p>

                            <div className="flex gap-3">

                                <select
                                    value={radius}
                                    onChange={(e) => {

                                        setRadius(
                                            e.target.value
                                        );

                                        setError("");

                                    }}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#ff6500]"
                                >

                                    {/* DEFAULT */}
                                    <option value="none">
                                        None
                                    </option>

                                    <option value="5">
                                        Within 5 km
                                    </option>

                                    <option value="10">
                                        Within 10 km
                                    </option>

                                    <option value="25">
                                        Within 25 km
                                    </option>

                                    <option value="50">
                                        Within 50 km
                                    </option>

                                    <option value="100">
                                        Within 100 km
                                    </option>

                                </select>

                                <button
                                    type="button"
                                    onClick={
                                        handleRadiusSearch
                                    }
                                    disabled={
                                        loading ||
                                        radius ===
                                            "none"
                                    }
                                    className="bg-[#ff6500] hover:bg-[#e85b00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-semibold whitespace-nowrap"
                                >
                                    📍 Find Nearby
                                </button>

                            </div>

                            {/* GPS STATUS */}

                            {userLocation ? (

                                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">

                                    <div className="font-semibold">
                                        ✓ Location detected
                                    </div>

                                    <div className="mt-1">
                                        {userLocation.latitude.toFixed(
                                            5
                                        )}
                                        ,{" "}
                                        {userLocation.longitude.toFixed(
                                            5
                                        )}
                                    </div>

                                </div>

                            ) : (

                                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">

                                    📍 Location not detected.
                                    Allow browser location
                                    access to use radius
                                    search.

                                </div>

                            )}

                        </div>

                    </div>

                    {/* ====================================================
                        OR
                    ==================================================== */}

                    <div className="flex items-center gap-4 my-6">

                        <div className="flex-1 h-px bg-gray-200" />

                        <span className="text-sm font-bold text-gray-400">
                            OR
                        </span>

                        <div className="flex-1 h-px bg-gray-200" />

                    </div>

                    <div className="text-sm text-gray-500">

                        <b>Location search</b> and{" "}

                        <b>Search Radius</b>{" "}

                        work independently.
                        Use either one.

                    </div>

                </div>

                {/* ====================================================
                    ERROR
                ==================================================== */}

                {error && (

                    <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">

                        <div className="font-semibold">
                            {error}
                        </div>

                    </div>

                )}

                {/* ====================================================
                    LOADING
                ==================================================== */}

                {loading && (

                    <div className="mt-8 text-center">

                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#ff6500]" />

                        <p className="mt-3 text-gray-600">
                            Finding real and database mandis...
                        </p>

                    </div>

                )}

                {/* ====================================================
                    RESULTS
                ==================================================== */}

                {!loading &&
                    mandis.length > 0 && (

                    <div className="mt-8">

                        {/* HEADER */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

                            <div>

                                <h2 className="text-2xl font-bold text-[#111827]">
                                    Mandi Results
                                </h2>

                                <p className="text-gray-500">

                                    {mandis.length} mandi
                                    {mandis.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    found

                                    {searchType ===
                                        "location" &&
                                        location && (
                                            <>
                                                {" "}
                                                for "
                                                {location}"
                                            </>
                                        )}

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/farmer/saved-mandis"
                                    )
                                }
                                className="text-[#ff6500] font-semibold hover:underline"
                            >
                                ⭐ View Saved Mandis
                            </button>

                        </div>

                        {/* CARDS */}

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {mandis.map(
                                (mandi, index) => {

                                    const saved =
                                        isMandiSaved(
                                            mandi
                                        );

                                    const source =
                                        getSourceLabel(
                                            mandi.source
                                        );

                                    const key =
                                        String(
                                            mandi.id ||
                                            mandi.mandi_id ||
                                            `mandi-${index}`
                                        );

                                    return (

                                        <div
                                            key={key}
                                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                                        >

                                            {/* NAME */}

                                            <div className="flex items-start justify-between gap-3">

                                                <div>

                                                    <h3 className="text-xl font-bold text-[#111827]">

                                                        {mandi.name ||
                                                            mandi.mandi_name ||
                                                            "Agricultural Market"}

                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">

                                                        {mandi.district ||
                                                            "District unavailable"}

                                                        {mandi.state && (
                                                            <>
                                                                ,{" "}
                                                                {
                                                                    mandi.state
                                                                }
                                                            </>
                                                        )}

                                                    </p>

                                                </div>

                                                {mandi.source ===
                                                    "OpenStreetMap" && (

                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap font-semibold">
                                                        REAL
                                                    </span>

                                                )}

                                            </div>

                                            {/* SOURCE */}

                                            <div className="mt-4">

                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${source.className}`}
                                                >
                                                    {
                                                        source.label
                                                    }
                                                </span>

                                            </div>

                                            {/* ADDRESS */}

                                            <div className="mt-4 text-sm text-gray-600">

                                                📍{" "}

                                                {mandi.address ||
                                                    "Address unavailable"}

                                            </div>

                                            {/* DISTANCE */}

                                            {mandi.distance_km !==
                                                null &&
                                                mandi.distance_km !==
                                                    undefined && (

                                                <div className="mt-3 text-sm font-semibold text-gray-700">

                                                    📏{" "}
                                                    {
                                                        mandi.distance_km
                                                    }{" "}
                                                    km

                                                </div>

                                            )}

                                            {/* CONTACT */}

                                            {mandi.contact_number && (

                                                <div className="mt-2 text-sm text-gray-600">

                                                    📞{" "}
                                                    {
                                                        mandi.contact_number
                                                    }

                                                </div>

                                            )}

                                            {/* BUTTONS */}

                                            <div className="flex gap-3 mt-5">

                                                {/* SAVE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSave(
                                                            mandi
                                                        )
                                                    }
                                                    disabled={
                                                        saved ||
                                                        savingId ===
                                                            String(
                                                                mandi.mandi_id ||
                                                                mandi.id
                                                            )
                                                    }
                                                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                                                        saved
                                                            ? "bg-green-100 text-green-700 cursor-default"
                                                            : savingId ===
                                                                String(
                                                                    mandi.mandi_id ||
                                                                    mandi.id
                                                                )
                                                                ? "bg-gray-200 text-gray-500 cursor-wait"
                                                                : "bg-[#fff4ed] text-[#ff6500] border border-[#ff6500] hover:bg-[#ff6500] hover:text-white"
                                                    }`}
                                                >

                                                    {saved
                                                        ? "✓ Saved"
                                                        : savingId ===
                                                            String(
                                                                mandi.mandi_id ||
                                                                mandi.id
                                                            )
                                                            ? "Saving..."
                                                            : "☆ Save"}

                                                </button>

                                                {/* DIRECTIONS */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openMap(
                                                            mandi
                                                        )
                                                    }
                                                    disabled={
                                                        mandi.latitude ===
                                                            null ||
                                                        mandi.latitude ===
                                                            undefined ||
                                                        mandi.longitude ===
                                                            null ||
                                                        mandi.longitude ===
                                                            undefined
                                                    }
                                                    className="flex-1 bg-[#ff6500] hover:bg-[#e85b00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold"
                                                >
                                                    🗺 Directions
                                                </button>

                                            </div>

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    </div>

                )}

                {/* ====================================================
                    NO RESULTS
                ==================================================== */}

                {!loading &&
                    searched &&
                    mandis.length === 0 &&
                    error === "" && (

                    <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-12 text-center">

                        <div className="text-5xl mb-4">
                            🔍
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            No Mandi Results
                        </h2>

                        <p className="text-gray-500 mt-2">
                            {searchType ===
                                "location"
                                ? `No mandis found for "${location}". Try another location.`
                                : `No mandis found within ${radius} km.`}
                        </p>

                    </div>

                )}

                {/* ====================================================
                    INITIAL STATE
                ==================================================== */}

                {!searched &&
                    !loading &&
                    mandis.length === 0 && (

                    <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-10 text-center">

                        <div className="text-5xl mb-4">
                            🏪
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            Find Agricultural Mandis
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Search a city or district, or choose
                            a radius to find nearby mandis.
                        </p>

                    </div>

                )}

            </main>

        </div>
    );
}

export default MandiFinder;