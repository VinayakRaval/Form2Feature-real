import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    getSavedMandis,
    removeSavedMandi
} from "../../services/mandiService";

function SavedMandi() {

    const navigate =
        useNavigate();

    const [mandis, setMandis] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [removingId, setRemovingId] =
        useState(null);

    // ============================================================
    // LOAD SAVED MANDIS
    // ============================================================

    const loadSavedMandis =
        async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await getSavedMandis();

                console.log(
                    "SAVED MANDIS RESPONSE:",
                    response
                );

                const results =
                    response?.mandis ||
                    response?.savedMandis ||
                    [];

                setMandis(
                    Array.isArray(results)
                        ? results
                        : []
                );

            } catch (err) {

                console.error(
                    "FETCH SAVED MANDIS ERROR:",
                    err
                );

                setMandis([]);

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to fetch saved mandis"
                );

            } finally {

                setLoading(false);
            }
        };

    // ============================================================
    // LOAD ON PAGE OPEN
    // ============================================================

    useEffect(() => {

        loadSavedMandis();

    }, []);

    // ============================================================
    // REMOVE
    // ============================================================

    const handleRemove =
        async (mandi) => {

            const mandiId =
                String(
                    mandi.mandi_id ||
                    mandi.id ||
                    ""
                );

            if (!mandiId) {

                setError(
                    "Invalid mandi ID."
                );

                return;
            }

            const confirmed =
                window.confirm(
                    `Remove "${mandi.name || mandi.mandi_name}" from saved mandis?`
                );

            if (!confirmed) {
                return;
            }

            try {

                setRemovingId(
                    mandiId
                );

                setError("");

                await removeSavedMandi(
                    mandiId
                );

                setMandis(
                    previous =>
                        previous.filter(
                            item =>
                                String(
                                    item.mandi_id ||
                                    item.id
                                ) !== mandiId
                        )
                );

            } catch (err) {

                console.error(
                    "REMOVE SAVED MANDI ERROR:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to remove saved mandi."
                );

            } finally {

                setRemovingId(null);
            }
        };

    // ============================================================
    // MAP
    // ============================================================

    const openMap =
        (mandi) => {

            if (
                mandi.google_maps
            ) {

                window.open(
                    mandi.google_maps,
                    "_blank",
                    "noopener,noreferrer"
                );

                return;
            }

            if (
                mandi.latitude !==
                    null &&
                mandi.latitude !==
                    undefined &&
                mandi.longitude !==
                    null &&
                mandi.longitude !==
                    undefined
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
                "Location coordinates are not available."
            );
        };

    // ============================================================
    // PAGE
    // ============================================================

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>

                        <p className="text-[#ff6500] font-bold uppercase tracking-wide">
                            Smart Agriculture
                        </p>

                        <h1 className="text-4xl font-bold text-[#111827] mt-2">
                            ⭐ Saved Mandis
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Your saved agricultural markets.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/farmer/mandi"
                            )
                        }
                        className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-5 py-3 rounded-lg font-semibold"
                    >
                        🔍 Find More Mandis
                    </button>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">

                        <div className="font-semibold">
                            {error}
                        </div>

                        <button
                            type="button"
                            onClick={
                                loadSavedMandis
                            }
                            className="mt-3 text-sm underline font-semibold"
                        >
                            Try Again
                        </button>

                    </div>

                )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">

                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#ff6500]" />

                        <p className="mt-4 text-gray-600">
                            Loading saved mandis...
                        </p>

                    </div>

                )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    mandis.length === 0 && (

                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">

                        <div className="text-6xl mb-5">
                            ⭐
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            No Saved Mandis
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Find a mandi and click Save
                            to see it here.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/farmer/mandi"
                                )
                            }
                            className="mt-6 bg-[#ff6500] hover:bg-[#e85b00] text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Find Mandis
                        </button>

                    </div>

                )}

                {/* =================================================
                    SAVED RESULTS
                ================================================= */}

                {!loading &&
                    mandis.length > 0 && (

                    <div>

                        <div className="mb-5">

                            <h2 className="text-2xl font-bold text-[#111827]">
                                Saved Markets
                            </h2>

                            <p className="text-gray-500">
                                {mandis.length} saved mandi
                                {mandis.length !== 1
                                    ? "s"
                                    : ""}
                            </p>

                        </div>

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {mandis.map(
                                (mandi, index) => {

                                    const mandiId =
                                        String(
                                            mandi.mandi_id ||
                                            mandi.id ||
                                            index
                                        );

                                    return (

                                        <div
                                            key={
                                                mandiId
                                            }
                                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                                        >

                                            {/* NAME */}

                                            <h3 className="text-xl font-bold text-[#111827]">

                                                {mandi.name ||
                                                    mandi.mandi_name ||
                                                    "Agricultural Market"}

                                            </h3>

                                            {/* LOCATION */}

                                            <p className="text-sm text-gray-500 mt-2">

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

                                            {/* SOURCE */}

                                            <div className="mt-4">

                                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">

                                                    {mandi.source ||
                                                        "Form2Feature Database"}

                                                </span>

                                            </div>

                                            {/* ADDRESS */}

                                            <div className="mt-4 text-sm text-gray-600">

                                                📍{" "}

                                                {mandi.address ||
                                                    "Address unavailable"}

                                            </div>

                                            {/* CONTACT */}

                                            {mandi.contact_number && (

                                                <div className="mt-3 text-sm text-gray-600">

                                                    📞{" "}
                                                    {
                                                        mandi.contact_number
                                                    }

                                                </div>

                                            )}

                                            {/* BUTTONS */}

                                            <div className="flex gap-3 mt-5">

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
                                                    className="flex-1 bg-[#ff6500] hover:bg-[#e85b00] disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold"
                                                >
                                                    🗺 Directions
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemove(
                                                            mandi
                                                        )
                                                    }
                                                    disabled={
                                                        removingId ===
                                                        mandiId
                                                    }
                                                    className="flex-1 bg-red-50 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 px-4 py-3 rounded-lg font-semibold"
                                                >

                                                    {removingId ===
                                                    mandiId
                                                        ? "Removing..."
                                                        : "🗑 Remove"}

                                                </button>

                                            </div>

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default SavedMandi;