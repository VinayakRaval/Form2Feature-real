import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();

    // ============================================================
    // USER NAME
    // ============================================================

    const userName =
        user?.full_name ||
        user?.name ||
        user?.username ||
        "Farmer";

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = () => {
        try {
            logout();
        } catch (error) {
            console.error("Logout error:", error);
        }

        navigate("/login", {
            replace: true
        });
    };

    // ============================================================
    // SKIP TO MAIN CONTENT
    // ============================================================

    const handleSkipToContent = () => {
        const element = document.getElementById("main-content");

        if (element) {
            element.focus();

            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    // ============================================================
    // CHECK ACTIVE ROUTE
    // ============================================================

    const isActive = (path) => {
        return location.pathname === path;
    };

    // ============================================================
    // DESKTOP NAV STYLE
    // ============================================================

    const navClass = (path) => `
        text-sm
        font-medium
        whitespace-nowrap
        transition
        ${
            isActive(path)
                ? "text-[#ff6500] font-semibold"
                : "text-gray-800 hover:text-[#ff6500]"
        }
    `;

    // ============================================================
    // MOBILE NAV STYLE
    // ============================================================

    const mobileNavClass = (path) => `
        px-3
        py-2
        rounded-lg
        text-sm
        font-medium
        transition
        whitespace-nowrap
        ${
            isActive(path)
                ? "bg-orange-50 text-[#ff6500]"
                : "bg-gray-50 text-gray-800 hover:bg-orange-50 hover:text-[#ff6500]"
        }
    `;

    return (
        <>
            {/* ========================================================
                TOP BLACK BAR
            ======================================================== */}

            <div className="bg-[#030712] text-white">

                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-10 flex items-center justify-between text-sm">

                        {/* LEFT */}

                        <div className="flex items-center gap-4 sm:gap-6">

                            <button
                                type="button"
                                onClick={handleSkipToContent}
                                className="hover:text-gray-300 transition"
                            >
                                Skip to main content
                            </button>

                            <span>
                                English
                            </span>

                            <span className="hidden sm:inline">
                                Contact us
                            </span>

                            <span className="hidden sm:inline">
                                Help
                            </span>

                        </div>

                        {/* RIGHT */}

                        <span className="hidden lg:block">
                            Smart Agriculture Platform
                        </span>

                    </div>

                </div>

            </div>


            {/* ========================================================
                MAIN NAVBAR
            ======================================================== */}

            <nav className="bg-white border-b border-gray-300 shadow-sm">

                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ==================================================
                        MAIN ROW
                    ================================================== */}

                    <div className="min-h-[78px] flex items-center gap-4">

                        {/* ==================================================
                            LOGO
                        ================================================== */}

                        <Link
                            to="/farmer/dashboard"
                            className="
                                text-xl
                                lg:text-2xl
                                font-bold
                                text-[#ff6500]
                                hover:text-[#e85b00]
                                transition
                                whitespace-nowrap
                                shrink-0
                            "
                        >
                            Form2Feature
                        </Link>


                        {/* ==================================================
                            DESKTOP NAVIGATION
                        ================================================== */}

                        <div
                            className="
                                hidden
                                xl:flex
                                items-center
                                justify-center
                                gap-3
                                2xl:gap-4
                                flex-1
                                min-w-0
                            "
                        >

                            {/* Dashboard */}

                            <Link
                                to="/farmer/dashboard"
                                className={navClass("/farmer/dashboard")}
                            >
                                Dashboard
                            </Link>


                            {/* Profile */}

                            <Link
                                to="/farmer/profile"
                                className={navClass("/farmer/profile")}
                            >
                                Profile
                            </Link>


                            {/* My Crops */}

                            <Link
                                to="/farmer/crops"
                                className={navClass("/farmer/crops")}
                            >
                                My Crops
                            </Link>


                            {/* Add Crop */}

                            <Link
                                to="/farmer/crops/add"
                                className="
                                    bg-[#fff4ed]
                                    text-[#ff6500]
                                    border
                                    border-[#ff6500]
                                    px-3
                                    py-2
                                    rounded-lg
                                    font-semibold
                                    text-sm
                                    hover:bg-[#ff6500]
                                    hover:text-white
                                    transition
                                    whitespace-nowrap
                                "
                            >
                                + Add Crop
                            </Link>


                            {/* Mandi Finder */}

                            <Link
                                to="/farmer/mandi"
                                className={navClass("/farmer/mandi")}
                            >
                                🏪 Mandi Finder
                            </Link>


                            {/* Saved Mandis */}

                            <Link
                                to="/farmer/saved-mandis"
                                className={navClass("/farmer/saved-mandis")}
                            >
                                ⭐ Saved Mandis
                            </Link>


                            {/* Market Prices */}

                            <Link
                                to="/farmer/market-prices"
                                className={navClass("/farmer/market-prices")}
                            >
                                💰 Market Prices
                            </Link>


                            {/* Profit Calculator */}

                            <Link
                                to="/farmer/profit"
                                className={navClass("/farmer/profit")}
                            >
                                📊 Profit Calculator
                            </Link>


                            {/* Saved Profits */}

                            <Link
                                to="/farmer/profit-history"
                                className={navClass("/farmer/profit-history")}
                            >
                                💾 Saved Profits
                            </Link>

                        </div>


                        {/* ==================================================
                            DESKTOP USER AREA

                            IMPORTANT:
                            hidden on mobile/tablet so there is no
                            duplicate Sign out button.
                        ================================================== */}

                        <div
                            className="
                                hidden
                                xl:flex
                                items-center
                                gap-3
                                shrink-0
                            "
                        >

                            {/* USER */}

                            <div className="text-right leading-tight max-w-[120px]">

                                <p
                                    className="
                                        text-sm
                                        font-bold
                                        text-gray-900
                                        truncate
                                    "
                                    title={userName}
                                >
                                    {userName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Farmer
                                </p>

                            </div>


                            {/* SIGN OUT */}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    bg-[#ff6500]
                                    hover:bg-[#e85b00]
                                    active:bg-[#d94f00]
                                    text-white
                                    px-4
                                    py-2
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    transition
                                    whitespace-nowrap
                                "
                            >
                                Sign out
                            </button>

                        </div>

                    </div>


                    {/* ========================================================
                        MOBILE / TABLET NAVIGATION
                    ======================================================== */}

                    <div className="xl:hidden border-t border-gray-200 py-4">

                        <div className="flex flex-wrap items-center gap-2">

                            {/* Dashboard */}

                            <Link
                                to="/farmer/dashboard"
                                className={mobileNavClass(
                                    "/farmer/dashboard"
                                )}
                            >
                                Dashboard
                            </Link>


                            {/* Profile */}

                            <Link
                                to="/farmer/profile"
                                className={mobileNavClass(
                                    "/farmer/profile"
                                )}
                            >
                                Profile
                            </Link>


                            {/* My Crops */}

                            <Link
                                to="/farmer/crops"
                                className={mobileNavClass(
                                    "/farmer/crops"
                                )}
                            >
                                My Crops
                            </Link>


                            {/* Add Crop */}

                            <Link
                                to="/farmer/crops/add"
                                className="
                                    px-3
                                    py-2
                                    rounded-lg
                                    bg-orange-50
                                    text-[#ff6500]
                                    border
                                    border-orange-200
                                    text-sm
                                    font-semibold
                                    hover:bg-[#ff6500]
                                    hover:text-white
                                    transition
                                "
                            >
                                + Add Crop
                            </Link>


                            {/* Mandi Finder */}

                            <Link
                                to="/farmer/mandi"
                                className={mobileNavClass(
                                    "/farmer/mandi"
                                )}
                            >
                                🏪 Mandi Finder
                            </Link>


                            {/* Saved Mandis */}

                            <Link
                                to="/farmer/saved-mandis"
                                className={mobileNavClass(
                                    "/farmer/saved-mandis"
                                )}
                            >
                                ⭐ Saved Mandis
                            </Link>


                            {/* Market Prices */}

                            <Link
                                to="/farmer/market-prices"
                                className={mobileNavClass(
                                    "/farmer/market-prices"
                                )}
                            >
                                💰 Market Prices
                            </Link>


                            {/* Profit Calculator */}

                            <Link
                                to="/farmer/profit"
                                className={mobileNavClass(
                                    "/farmer/profit"
                                )}
                            >
                                📊 Profit Calculator
                            </Link>


                            {/* Saved Profits */}

                            <Link
                                to="/farmer/profit-history"
                                className={mobileNavClass(
                                    "/farmer/profit-history"
                                )}
                            >
                                💾 Saved Profits
                            </Link>


                            {/* ==================================================
                                MOBILE USER + SIGN OUT

                                This is the ONLY sign-out button on
                                mobile/tablet.
                            ================================================== */}

                            <div
                                className="
                                    ml-auto
                                    flex
                                    items-center
                                    gap-3
                                    mt-2
                                    sm:mt-0
                                "
                            >

                                {/* USER */}

                                <div className="hidden sm:block text-right leading-tight">

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                            text-gray-900
                                        "
                                    >
                                        {userName}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Farmer
                                    </p>

                                </div>


                                {/* SIGN OUT */}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="
                                        bg-[#ff6500]
                                        hover:bg-[#e85b00]
                                        active:bg-[#d94f00]
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                        text-sm
                                        font-semibold
                                        transition
                                        whitespace-nowrap
                                    "
                                >
                                    Sign out
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </nav>
        </>
    );
}

export default Navbar;