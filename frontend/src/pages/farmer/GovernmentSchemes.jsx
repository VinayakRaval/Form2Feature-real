import {
    useEffect,
    useMemo,
    useState
} from "react";

import FarmerLayout
    from "../../layouts/FarmerLayout";

import {
    getGovernmentSchemes
} from "../../services/governmentSchemeService";


// ============================================================
// GOVERNMENT SCHEMES
// ============================================================

function GovernmentSchemes() {

    const [schemes, setSchemes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [selectedScheme, setSelectedScheme] =
        useState(null);


    // ========================================================
    // LOAD SCHEMES
    // ========================================================

    const loadSchemes = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getGovernmentSchemes();

            console.log(
                "Government Schemes:",
                response
            );

            if (response?.success) {

                setSchemes(
                    Array.isArray(
                        response.schemes
                    )
                        ? response.schemes
                        : []
                );

            } else {

                setSchemes([]);

                setError(
                    response?.message ||
                    "Unable to load government schemes."
                );

            }

        } catch (err) {

            console.error(
                "Government Schemes Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load government schemes."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // PAGE LOAD
    // ========================================================

    useEffect(() => {

        loadSchemes();

    }, []);


    // ========================================================
    // FILTER
    // ========================================================

    const filteredSchemes =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return schemes;
            }

            return schemes.filter(
                scheme => {

                    const text =
                        [
                            scheme.scheme_name,
                            scheme.description,
                            scheme.eligibility,
                            scheme.benefits
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();

                    return text.includes(
                        keyword
                    );
                }
            );

        }, [schemes, search]);


    // ========================================================
    // OPEN SCHEME
    // ========================================================

    const openScheme = (scheme) => {

        setSelectedScheme(
            scheme
        );

    };


    // ========================================================
    // CLOSE MODAL
    // ========================================================

    const closeScheme = () => {

        setSelectedScheme(
            null
        );

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <FarmerLayout>

            <div className="min-h-screen bg-gray-50">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="mb-8">

                        <p className="text-orange-600 font-bold text-sm uppercase tracking-wider">
                            GOVERNMENT SUPPORT
                        </p>

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
                            Government Schemes
                        </h1>

                        <p className="text-gray-600 mt-2 max-w-3xl">
                            Discover government schemes and financial
                            support programs available for farmers.
                        </p>

                    </div>


                    {/* ==================================================
                        SEARCH
                    ================================================== */}

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-7">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Search Schemes
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">

                            <div className="relative flex-1">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search by scheme name, eligibility or benefits..."
                                    className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />

                            </div>


                            {search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="border border-gray-300 px-5 py-3 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    Clear
                                </button>

                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-7">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                <div>

                                    <p className="font-semibold">
                                        Unable to load schemes
                                    </p>

                                    <p className="text-sm mt-1">
                                        {error}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={loadSchemes}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    Retry
                                </button>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading ? (

                        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">

                            <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto">
                            </div>

                            <p className="text-gray-600 mt-4">
                                Loading government schemes...
                            </p>

                        </div>

                    ) : filteredSchemes.length === 0 ? (

                        /* ==================================================
                            EMPTY
                        ================================================== */

                        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">

                            <div className="text-6xl">
                                📋
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mt-4">
                                No Schemes Found
                            </h2>

                            <p className="text-gray-500 mt-2">
                                {search
                                    ? "Try another search term."
                                    : "No government schemes are available yet."
                                }
                            </p>

                        </div>

                    ) : (

                        /* ==================================================
                            SCHEME GRID
                        ================================================== */

                        <>

                            <div className="flex items-center justify-between mb-5">

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Available Schemes
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {filteredSchemes.length} scheme
                                        {filteredSchemes.length !== 1
                                            ? "s"
                                            : ""}
                                    </p>

                                </div>

                            </div>


                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {filteredSchemes.map(
                                    (scheme) => (

                                        <div
                                            key={
                                                scheme.id
                                            }
                                            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
                                        >

                                            {/* TOP */}

                                            <div className="bg-gray-950 p-6 text-white">

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                                                        🌾
                                                    </div>

                                                    <span className="text-xs bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full">
                                                        Government Scheme
                                                    </span>

                                                </div>


                                                <h3 className="text-xl font-bold mt-5">
                                                    {
                                                        scheme.scheme_name
                                                    }
                                                </h3>

                                            </div>


                                            {/* BODY */}

                                            <div className="p-6">

                                                <p className="text-gray-600 text-sm leading-6 line-clamp-3">
                                                    {
                                                        scheme.description ||
                                                        "No description available."
                                                    }
                                                </p>


                                                {/* ELIGIBILITY */}

                                                <div className="mt-5">

                                                    <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                                                        Eligibility
                                                    </p>

                                                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                                                        {
                                                            scheme.eligibility ||
                                                            "Eligibility details not available."
                                                        }
                                                    </p>

                                                </div>


                                                {/* BENEFITS */}

                                                <div className="mt-5">

                                                    <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                                                        Benefits
                                                    </p>

                                                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                                                        {
                                                            scheme.benefits ||
                                                            "Benefit details not available."
                                                        }
                                                    </p>

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="flex gap-3 mt-6">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openScheme(
                                                                scheme
                                                            )
                                                        }
                                                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold transition"
                                                    >
                                                        View Details
                                                    </button>


                                                    {scheme.official_link && (

                                                        <a
                                                            href={
                                                                scheme.official_link
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                                                        >
                                                            Official ↗
                                                        </a>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </>

                    )}

                </div>

            </div>


            {/* ==========================================================
                DETAILS MODAL
            =========================================================== */}

            {selectedScheme && (

                <div
                    className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                    onClick={closeScheme}
                >

                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="bg-gray-950 text-white p-6">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <p className="text-orange-400 text-sm font-semibold">
                                        GOVERNMENT SCHEME
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        {
                                            selectedScheme.scheme_name
                                        }
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        closeScheme
                                    }
                                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-xl"
                                >
                                    ×
                                </button>

                            </div>

                        </div>


                        {/* DETAILS */}

                        <div className="p-6 space-y-6">

                            <div>

                                <h3 className="font-bold text-gray-900">
                                    Description
                                </h3>

                                <p className="text-gray-600 mt-2 leading-7">
                                    {
                                        selectedScheme.description ||
                                        "No description available."
                                    }
                                </p>

                            </div>


                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                                <h3 className="font-bold text-blue-900">
                                    Who is eligible?
                                </h3>

                                <p className="text-blue-800 mt-2 leading-7">
                                    {
                                        selectedScheme.eligibility ||
                                        "Eligibility information is not available."
                                    }
                                </p>

                            </div>


                            <div className="bg-green-50 border border-green-100 rounded-xl p-5">

                                <h3 className="font-bold text-green-900">
                                    Benefits
                                </h3>

                                <p className="text-green-800 mt-2 leading-7">
                                    {
                                        selectedScheme.benefits ||
                                        "Benefit information is not available."
                                    }
                                </p>

                            </div>


                            <div className="flex flex-col sm:flex-row gap-3">

                                {selectedScheme.official_link && (

                                    <a
                                        href={
                                            selectedScheme.official_link
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-semibold"
                                    >
                                        Visit Official Website ↗
                                    </a>

                                )}


                                <button
                                    type="button"
                                    onClick={
                                        closeScheme
                                    }
                                    className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </FarmerLayout>

    );

}


export default GovernmentSchemes;