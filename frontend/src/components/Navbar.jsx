import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// NAVBAR
// ============================================================

function Navbar() {
    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();

    // ========================================================
    // USER NAME
    // ========================================================

    const userName =
        user?.full_name ||
        user?.name ||
        user?.username ||
        "Farmer";

    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {
        logout();

        navigate("/login", {
            replace: true
        });
    };

    // ========================================================
    // SKIP TO CONTENT
    // ========================================================

    const handleSkipToContent = () => {
        const element =
            document.getElementById(
                "main-content"
            );

        if (element) {
            element.focus();
            element.scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    // ========================================================
    // NAVIGATION ITEM
    // ========================================================

    const navClass =
        "hover:text-[#ff6500] transition font-medium whitespace-nowrap";

    // ========================================================
    // COMPONENT
    // ========================================================

    return (
        <>
            {/* ==================================================
                TOP BLACK BAR
            ================================================== */}

            <div className="bg-[#030712] text-white">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-sm">

                    {/* LEFT */}

                    <div className="flex items-center gap-4 sm:gap-6">

                        <button
                            type="button"
                            onClick={
                                handleSkipToContent
                            }
                            className="hover:text-gray-300 transition"
                        >
                            Skip to main content
                        </button>

                        <span>
                            English
                        </span>

                        {/* Contact is displayed but does not
                            navigate to an undefined route */}

                        <span className="hidden sm:inline">
                            Contact us
                        </span>

                        <span className="hidden sm:inline">
                            Help
                        </span>

                    </div>

                    {/* RIGHT */}

                    <span className="hidden md:block">
                        Smart Agriculture Platform
                    </span>

                </div>

            </div>


            {/* ==================================================
                MAIN NAVBAR
            ================================================== */}

            <nav className="bg-white border-b border-gray-300 shadow-sm">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                    <div className="flex items-center justify-between gap-5">


                        {/* ==================================================
                            LOGO
                        ================================================== */}

                        <Link
                            to="/farmer/dashboard"
                            className="text-2xl font-bold text-[#ff6500] whitespace-nowrap hover:text-[#e85b00] transition"
                        >
                            Form2Feature
                        </Link>


                        {/* ==================================================
                            DESKTOP NAVIGATION
                        ================================================== */}

                        <div className="hidden xl:flex items-center gap-5 text-[#111827]">

                            {/* DASHBOARD */}

                            <Link
                                to="/farmer/dashboard"
                                className={navClass}
                            >
                                Dashboard
                            </Link>


                            {/* PROFILE */}

                            <Link
                                to="/farmer/profile"
                                className={navClass}
                            >
                                Profile
                            </Link>


                            {/* MY CROPS */}

                            <Link
                                to="/farmer/crops"
                                className={navClass}
                            >
                                My Crops
                            </Link>


                            {/* ADD CROP */}

                            <Link
                                to="/farmer/crops/add"
                                className="bg-[#fff4ed] text-[#ff6500] border border-[#ff6500] px-4 py-2 rounded-lg font-semibold hover:bg-[#ff6500] hover:text-white transition whitespace-nowrap"
                            >
                                + Add Crop
                            </Link>


                            {/* MANDI FINDER */}

                            <Link
                                to="/farmer/mandi"
                                className={navClass}
                            >
                                Mandi Finder
                            </Link>


                            {/* SAVED MANDIS */}

                            <Link
                                to="/farmer/saved-mandis"
                                className={navClass}
                            >
                                ⭐ Saved Mandis
                            </Link>


                            {/* MARKET PRICES */}

                            <Link
                                to="/farmer/market-prices"
                                className={navClass}
                            >
                                Market Prices
                            </Link>

                        </div>


                        {/* ==================================================
                            RIGHT SIDE
                        ================================================== */}

                        <div className="flex items-center gap-3">


                            {/* USER */}

                            <div className="hidden sm:block text-right">

                                <p className="text-sm font-semibold text-[#111827]">
                                    {userName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Farmer
                                </p>

                            </div>


                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                className="bg-[#ff6500] hover:bg-[#e85b00] active:bg-[#d94f00] text-white px-4 sm:px-5 py-2 rounded-lg font-semibold transition whitespace-nowrap"
                            >
                                Sign out
                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        MOBILE NAVIGATION
                    ================================================== */}

                    <div className="xl:hidden mt-4 pt-4 border-t border-gray-200">

                        <div className="flex flex-wrap gap-2">

                            <Link
                                to="/farmer/dashboard"
                                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-[#ff6500] text-sm font-medium transition"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/farmer/profile"
                                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-[#ff6500] text-sm font-medium transition"
                            >
                                Profile
                            </Link>

                            <Link
                                to="/farmer/crops"
                                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-[#ff6500] text-sm font-medium transition"
                            >
                                My Crops
                            </Link>

                            <Link
                                to="/farmer/crops/add"
                                className="px-3 py-2 rounded-lg bg-orange-50 text-[#ff6500] border border-orange-200 text-sm font-semibold transition"
                            >
                                + Add Crop
                            </Link>

                            <Link
                                to="/farmer/mandi"
                                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-[#ff6500] text-sm font-medium transition"
                            >
                                🏪 Mandi Finder
                            </Link>

                            <Link
                                to="/farmer/saved-mandis"
                                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-[#ff6500] text-sm font-medium transition"
                            >
                                ⭐ Saved Mandis
                            </Link>

                            <Link
                                to="/farmer/market-prices"
                                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-[#ff6500] text-sm font-medium transition"
                            >
                                💰 Market Prices
                            </Link>

                        </div>

                    </div>

                </div>

            </nav>
        </>
    );
}

export default Navbar;