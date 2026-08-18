import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ============================================================
   SVG ICONS
============================================================ */

const Icons = {
    dashboard: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),

    profile: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
        </svg>
    ),

    crops: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <path d="M12 21V9" />
            <path d="M12 13c-4 0-7-2.5-7-7 4 0 7 2.5 7 7Z" />
            <path d="M12 17c4 0 7-2.5 7-7-4 0-7 2.5-7 7Z" />
        </svg>
    ),

    offers: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
            <path d="M2 7h20v5H2z" />
            <path d="M12 7v14" />
            <path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5C10 6 12 7 12 7Z" />
            <path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5C14 6 12 7 12 7Z" />
        </svg>
    ),

    deals: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <path d="M3 7h18v13H3z" />
            <path d="M3 7l3-4h12l3 4" />
            <path d="M8 11h8" />
            <path d="M8 15h5" />
        </svg>
    ),

    transactions: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 10h18" />
            <path d="M7 15h3" />
        </svg>
    ),

    market: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="m7 15 4-4 3 2 5-6" />
        </svg>
    ),

    mandi: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    ),

    logout: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
        >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 3v18" />
        </svg>
    ),

    menu: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
        >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
        </svg>
    ),

    close: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
        >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
        </svg>
    ),

    chevron: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    ),

    language: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4 h-4"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21" />
            <path d="M12 3C9.5 5.5 8.5 8.5 8.5 12s1 6.5 3.5 9" />
        </svg>
    )
};

/* ============================================================
   NAVIGATION ITEMS
============================================================ */

const navigationItems = [
    {
        name: "Dashboard",
        path: "/buyer/dashboard",
        icon: Icons.dashboard
    },
    {
        name: "Profile",
        path: "/buyer/profile",
        icon: Icons.profile
    },
    {
        name: "Browse Crops",
        path: "/buyer/crops",
        icon: Icons.crops
    },
    {
        name: "My Offers",
        path: "/buyer/offers",
        icon: Icons.offers
    },
    {
        name: "Deals",
        path: "/buyer/deals",
        icon: Icons.deals
    },
    {
        name: "Transactions",
        path: "/buyer/transactions",
        icon: Icons.transactions
    },
    {
        name: "Market Prices",
        path: "/buyer/market-prices",
        icon: Icons.market
    },
    {
        name: "Mandi Finder",
        path: "/buyer/mandi",
        icon: Icons.mandi
    }
];

/* ============================================================
   BUYER NAVBAR
============================================================ */

function BuyerNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /* ========================================================
       LOAD USER
    ======================================================== */

    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem(
                    "form2feature_user"
                );

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser || {});
                } else {
                    setUser({});
                }
            } catch (error) {
                console.error("Failed to load buyer:", error);
                setUser({});
            }
        };

        loadUser();

        window.addEventListener("storage", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
        };
    }, []);

    /* ========================================================
       LOGOUT
    ======================================================== */

    const handleLogout = () => {
        localStorage.removeItem("form2feature_token");
        localStorage.removeItem("form2feature_user");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser({});
        setMobileMenuOpen(false);

        navigate("/login", {
            replace: true
        });
    };

    /* ========================================================
       ACTIVE LINK
    ======================================================== */

    const isActive = (path) => {
        return location.pathname === path;
    };

    /* ========================================================
       USER NAME
    ======================================================== */

    const userName =
        user?.full_name ||
        user?.name ||
        user?.username ||
        "Buyer";

    const firstLetter = userName
        .trim()
        .charAt(0)
        .toUpperCase() || "B";

    /* ========================================================
       CLOSE MOBILE MENU
    ======================================================== */

    const handleNavigation = () => {
        setMobileMenuOpen(false);
    };

    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <>
            {/* ==================================================
                TOP INFORMATION BAR
            ================================================== */}

            <div className="bg-[#0b1320] text-gray-300 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    document
                                        .getElementById("main-content")
                                        ?.focus();
                                }}
                                className="hover:text-white transition"
                            >
                                Skip to main content
                            </button>

                            <span className="flex items-center gap-1">
                                {Icons.language}
                                English
                            </span>

                            <span className="hidden sm:inline">
                                Contact us
                            </span>

                            <span className="hidden sm:inline">
                                Help
                            </span>
                        </div>

                        <span className="hidden md:block">
                            Smart Agriculture Platform
                        </span>
                    </div>
                </div>
            </div>

            {/* ==================================================
                MAIN HEADER
            ================================================== */}

            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">

                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    <div className="h-20 flex items-center justify-between">

                        {/* LOGO */}

                        <Link
                            to="/buyer/dashboard"
                            onClick={handleNavigation}
                            className="flex items-center gap-3"
                        >
                            <div className="w-11 h-11 rounded-xl bg-[#fff7f2] text-[#f95700] flex items-center justify-center border border-orange-100">
                                {Icons.crops}
                            </div>

                            <div>
                                <div className="text-2xl font-extrabold text-[#f95700]">
                                    Form2Feature
                                </div>

                                <div className="hidden sm:block text-xs text-gray-500">
                                    Smart Agriculture Platform
                                </div>
                            </div>
                        </Link>

                        {/* DESKTOP USER */}

                        <div className="hidden md:flex items-center gap-4">

                            <div className="text-right">
                                <p className="font-bold text-gray-900">
                                    {userName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Buyer
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-full bg-[#fff7f2] text-[#f95700] border border-orange-100 flex items-center justify-center font-bold">
                                {firstLetter}
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-[#f95700] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#dc4b00] transition"
                            >
                                {Icons.logout}
                                Sign out
                            </button>
                        </div>

                        {/* MOBILE MENU BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(!mobileMenuOpen)
                            }
                            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                            aria-label="Toggle navigation"
                        >
                            {mobileMenuOpen
                                ? Icons.close
                                : Icons.menu}
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    DESKTOP NAVIGATION
                ================================================== */}

                <nav className="hidden md:block border-t border-gray-100 bg-white">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6">

                        <div className="flex items-center gap-1 overflow-x-auto py-2">

                            {navigationItems.map((item) => {
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={
                                            active
                                                ? "flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-lg bg-[#fff7f2] text-[#f95700] font-semibold"
                                                : "flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 hover:text-[#f95700] transition"
                                        }
                                    >
                                        {item.icon}
                                        <span>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            </header>

            {/* ==================================================
                MOBILE NAVIGATION
            ================================================== */}

            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-lg relative z-30">

                    <div className="px-4 py-4">

                        {/* MOBILE USER */}

                        <div className="flex items-center gap-3 pb-4 mb-3 border-b">

                            <div className="w-11 h-11 rounded-full bg-[#fff7f2] text-[#f95700] border border-orange-100 flex items-center justify-center font-bold">
                                {firstLetter}
                            </div>

                            <div>
                                <p className="font-bold text-gray-900">
                                    {userName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Buyer
                                </p>
                            </div>
                        </div>

                        {/* MOBILE LINKS */}

                        <div className="space-y-1">

                            {navigationItems.map((item) => {
                                const active = isActive(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleNavigation}
                                        className={
                                            active
                                                ? "flex items-center justify-between px-4 py-3 rounded-lg bg-[#fff7f2] text-[#f95700] font-semibold"
                                                : "flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold transition"
                                        }
                                    >
                                        <span className="flex items-center gap-3">
                                            {item.icon}
                                            {item.name}
                                        </span>

                                        {Icons.chevron}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* MOBILE LOGOUT */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#f95700] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#dc4b00] transition"
                        >
                            {Icons.logout}
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default BuyerNavbar;