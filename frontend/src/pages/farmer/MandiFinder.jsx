import { useState } from "react";
import FarmerLayout from "../../layouts/FarmerLayout";
import { getNearbyMandis } from "../../services/mandiService";

function MandiFinder() {
    const [mandis, setMandis] = useState([]);
    const [location, setLocation] = useState(null);
    const [radius, setRadius] = useState("50");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // FIND NEARBY MANDIS
    // ==========================================

    const findNearbyMandis = () => {
        setError("");
        setMandis([]);
        setLoading(true);

        if (!navigator.geolocation) {
            setError("GPS is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    setLocation({
                        latitude,
                        longitude
                    });

                    console.log("GPS:", latitude, longitude);

                    const result = await getNearbyMandis(
                        latitude,
                        longitude,
                        Number(radius)
                    );

                    console.log("Mandi API Result:", result);

                    if (!result.success) {
                        setError(
                            result.message ||
                            "Unable to find nearby mandis."
                        );
                        return;
                    }

                    const mandiList = result.mandis || [];

                    const sortedMandis = mandiList
                        .filter(
                            (mandi) =>
                                mandi.latitude != null &&
                                mandi.longitude != null
                        )
                        .sort(
                            (a, b) =>
                                Number(a.distance_km || 0) -
                                Number(b.distance_km || 0)
                        );

                    setMandis(sortedMandis);

                    if (sortedMandis.length === 0) {
                        setError(
                            `No real agricultural markets found within ${radius} km. Try a larger radius.`
                        );
                    }

                } catch (err) {
                    console.error("Mandi Finder Error:", err);

                    if (err.response?.status === 401) {
                        setError(
                            "Your login session has expired. Please login again."
                        );
                    } else if (err.code === "ECONNABORTED") {
                        setError(
                            "Mandi search is taking too long. Please try again."
                        );
                    } else {
                        setError(
                            err.response?.data?.message ||
                            "Failed to find nearby mandis."
                        );
                    }

                } finally {
                    setLoading(false);
                }
            },

            (gpsError) => {
                console.error("GPS Error:", gpsError);

                let message = "Unable to get your location.";

                if (gpsError.code === 1) {
                    message =
                        "Location permission was denied. Please allow location access.";
                } else if (gpsError.code === 2) {
                    message =
                        "Your location is currently unavailable.";
                } else if (gpsError.code === 3) {
                    message =
                        "Location request timed out.";
                }

                setError(message);
                setLoading(false);
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    };

    // ==========================================
    // GOOGLE MAPS
    // ==========================================

    const openMap = (mandi) => {
        const url =
            `https://www.google.com/maps/search/?api=1&query=${mandi.latitude},${mandi.longitude}`;

        window.open(url, "_blank");
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <FarmerLayout>

            <div className="min-h-screen bg-[#f3f4f6] py-10 px-5">

                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}

                    <div className="mb-8">

                        <p className="text-[#ff6500] font-bold text-sm uppercase tracking-wider">
                            Smart Agriculture
                        </p>

                        <h1 className="text-4xl font-bold text-[#111827]">
                            Nearby Mandi Finder
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Find real agricultural markets near your current location.
                        </p>

                    </div>


                    {/* SEARCH */}

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">

                        <div className="grid md:grid-cols-3 gap-5 items-end">

                            {/* RADIUS */}

                            <div>

                                <label className="form-label">
                                    Search Radius
                                </label>

                                <select
                                    value={radius}
                                    onChange={(e) =>
                                        setRadius(e.target.value)
                                    }
                                    className="form-input"
                                >
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

                                    <option value="200">
                                        Within 200 km
                                    </option>
                                </select>

                            </div>


                            {/* BUTTON */}

                            <div>

                                <button
                                    onClick={findNearbyMandis}
                                    disabled={loading}
                                    className="w-full bg-[#ff6500] hover:bg-[#e85b00] disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition"
                                >

                                    {loading
                                        ? "📍 Finding..."
                                        : "📍 Find Nearby Mandis"}

                                </button>

                            </div>


                            {/* LOCATION */}

                            <div>

                                {location ? (

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">

                                        <p className="font-bold text-green-700">
                                            ✓ Location detected
                                        </p>

                                        <p className="text-green-600 mt-1">
                                            {location.latitude.toFixed(5)},
                                            {" "}
                                            {location.longitude.toFixed(5)}
                                        </p>

                                    </div>

                                ) : (

                                    <div className="bg-gray-50 rounded-lg p-3 text-gray-500">
                                        Location not detected yet.
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
                            {error}
                        </div>

                    )}


                    {/* RESULTS */}

                    {mandis.length > 0 && (

                        <>

                            <div className="flex justify-between items-center mb-5">

                                <h2 className="text-2xl font-bold text-[#111827]">
                                    Nearby Real Mandis
                                </h2>

                                <span className="text-sm text-gray-500">
                                    {mandis.length} market(s) found
                                </span>

                            </div>


                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {mandis.map((mandi) => (

                                    <div
                                        key={`${mandi.id}-${mandi.latitude}-${mandi.longitude}`}
                                        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition"
                                    >

                                        {/* NAME + DISTANCE */}

                                        <div className="flex items-start justify-between gap-3">

                                            <div>

                                                <div className="text-3xl mb-3">
                                                    🏪
                                                </div>

                                                <h3 className="text-xl font-bold text-[#111827]">
                                                    {mandi.name ||
                                                        "Agricultural Market"}
                                                </h3>

                                            </div>

                                            <div className="bg-orange-50 text-[#ff6500] px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap">

                                                {Number(
                                                    mandi.distance_km || 0
                                                ).toFixed(1)} km

                                            </div>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="mt-5 space-y-3 text-sm">

                                            {/* ADDRESS */}

                                            <p>
                                                <span className="text-gray-500">
                                                    📍 Address
                                                </span>

                                                <br />

                                                <span className="font-medium">
                                                    {mandi.address ||
                                                        "Address unavailable"}
                                                </span>
                                            </p>


                                            {/* DISTRICT */}

                                            {mandi.district && (

                                                <p>
                                                    <span className="text-gray-500">
                                                        🏘 District:
                                                    </span>{" "}
                                                    <span className="font-medium">
                                                        {mandi.district}
                                                    </span>
                                                </p>

                                            )}


                                            {/* STATE */}

                                            {mandi.state && (

                                                <p>
                                                    <span className="text-gray-500">
                                                        🗺 State:
                                                    </span>{" "}
                                                    <span className="font-medium">
                                                        {mandi.state}
                                                    </span>
                                                </p>

                                            )}


                                            {/* CONTACT */}

                                            {mandi.contact_number && (

                                                <p>
                                                    <span className="text-gray-500">
                                                        📞 Contact:
                                                    </span>{" "}
                                                    <span className="font-medium">
                                                        {mandi.contact_number}
                                                    </span>
                                                </p>

                                            )}


                                            {/* OPENING HOURS */}

                                            {mandi.opening_hours && (

                                                <p>
                                                    <span className="text-gray-500">
                                                        🕐 Opening Hours:
                                                    </span>{" "}
                                                    <span className="font-medium">
                                                        {mandi.opening_hours}
                                                    </span>
                                                </p>

                                            )}

                                        </div>


                                        {/* MAP BUTTON */}

                                        <button
                                            onClick={() =>
                                                openMap(mandi)
                                            }
                                            className="w-full mt-6 border border-[#ff6500] text-[#ff6500] hover:bg-[#ff6500] hover:text-white py-3 rounded-lg font-bold transition"
                                        >
                                            🗺 Open in Google Maps
                                        </button>

                                    </div>

                                ))}

                            </div>

                        </>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        mandis.length === 0 && (

                            <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">

                                <div className="text-7xl mb-5">
                                    🏪
                                </div>

                                <h2 className="text-2xl font-bold text-[#111827]">
                                    Find Your Nearest Mandi
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Allow GPS access to find real agricultural markets near you.
                                </p>

                            </div>

                        )}

                </div>

            </div>

        </FarmerLayout>
    );
}

export default MandiFinder;