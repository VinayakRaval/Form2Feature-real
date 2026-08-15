import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

function Weather() {
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    // ============================================================
    // GET WEATHER
    // ============================================================

    const getWeather = async (city) => {
        if (!city || !city.trim()) {
            setError("Please enter a location.");
            return;
        }

        setLoading(true);
        setError("");
        setWeather(null);

        try {
            /*
             * Replace this with your own backend weather endpoint
             * when your weather backend is ready.
             *
             * Example:
             * GET /api/weather?location=Mysore
             */

            const response = await fetch(
                `http://localhost:5000/api/weather?location=${encodeURIComponent(
                    city.trim()
                )}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to fetch weather"
                );
            }

            setWeather(data);

        } catch (err) {
            console.error("WEATHER ERROR:", err);

            setError(
                err.message ||
                "Unable to fetch weather information."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // GET USER LOCATION
    // ============================================================

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        setLoading(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                try {
                    /*
                     * If your backend supports coordinates,
                     * use:
                     *
                     * /api/weather?latitude=...&longitude=...
                     */

                    const response = await fetch(
                        `http://localhost:5000/api/weather?latitude=${latitude}&longitude=${longitude}`
                    );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Unable to fetch weather"
                        );
                    }

                    setWeather(data);

                } catch (err) {

                    console.error(
                        "LOCATION WEATHER ERROR:",
                        err
                    );

                    setError(
                        err.message ||
                        "Unable to fetch weather."
                    );

                } finally {
                    setLoading(false);
                }
            },

            (err) => {

                console.error(
                    "GEOLOCATION ERROR:",
                    err
                );

                setLoading(false);

                setError(
                    "Unable to detect your location. Please enter a city manually."
                );
            }
        );
    };

    // ============================================================
    // ENTER KEY
    // ============================================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            getWeather(location);
        }
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

                <div className="mb-8">

                    <p className="text-[#ff6500] font-bold uppercase tracking-wide">
                        Smart Agriculture
                    </p>

                    <h1 className="text-4xl font-bold text-[#111827] mt-2">
                        Weather
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Check current weather conditions for your
                        farming location.
                    </p>

                </div>

                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    <div className="grid md:grid-cols-[1fr_auto_auto] gap-4">

                        <input
                            type="text"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Enter city, e.g. Mysore"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#ff6500] focus:ring-1 focus:ring-[#ff6500]"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                getWeather(location)
                            }
                            disabled={loading}
                            className="bg-[#ff6500] hover:bg-[#e85b00] disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            {loading
                                ? "Loading..."
                                : "🔍 Search"}
                        </button>

                        <button
                            type="button"
                            onClick={detectLocation}
                            disabled={loading}
                            className="border border-[#ff6500] text-[#ff6500] hover:bg-[#fff4ed] disabled:opacity-60 px-6 py-3 rounded-lg font-semibold"
                        >
                            📍 My Location
                        </button>

                    </div>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4">
                        {error}
                    </div>
                )}

                {/* =================================================
                    WEATHER RESULT
                ================================================= */}

                {weather && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Location
                                </p>

                                <h2 className="text-3xl font-bold text-[#111827]">
                                    {weather.city ||
                                        weather.location ||
                                        weather.name ||
                                        "Weather"}
                                </h2>

                                <p className="text-gray-600 mt-1">
                                    {weather.description ||
                                        weather.weather ||
                                        "Current conditions"}
                                </p>

                            </div>

                            <div className="text-right">

                                <p className="text-5xl font-bold text-[#ff6500]">
                                    {weather.temperature ??
                                        weather.temp ??
                                        "--"}
                                    {weather.temperature !== undefined ||
                                    weather.temp !== undefined
                                        ? "°C"
                                        : ""}
                                </p>

                            </div>

                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

                            <div className="bg-gray-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    💧 Humidity
                                </p>

                                <p className="text-xl font-bold mt-2">
                                    {weather.humidity ??
                                        "--"}
                                    {weather.humidity !== undefined
                                        ? "%"
                                        : ""}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    💨 Wind Speed
                                </p>

                                <p className="text-xl font-bold mt-2">
                                    {weather.wind_speed ??
                                        weather.windSpeed ??
                                        "--"}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    🌡️ Feels Like
                                </p>

                                <p className="text-xl font-bold mt-2">
                                    {weather.feels_like ??
                                        weather.feelsLike ??
                                        "--"}
                                    {(weather.feels_like !== undefined ||
                                        weather.feelsLike !== undefined)
                                        ? "°C"
                                        : ""}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    ☁️ Condition
                                </p>

                                <p className="text-xl font-bold mt-2">
                                    {weather.condition ||
                                        weather.description ||
                                        "--"}
                                </p>
                            </div>

                        </div>

                    </div>
                )}

                {/* =================================================
                    DEFAULT MESSAGE
                ================================================= */}

                {!weather && !loading && !error && (
                    <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-10 text-center">

                        <div className="text-5xl mb-4">
                            🌤️
                        </div>

                        <h2 className="text-2xl font-bold text-[#111827]">
                            Check Your Weather
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Enter your city or use your current
                            location to get weather information.
                        </p>

                    </div>
                )}

            </main>

        </div>
    );
}

// ============================================================
// IMPORTANT
// ============================================================

export default Weather;