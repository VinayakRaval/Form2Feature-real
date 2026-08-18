import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// SVG ICON COMPONENT
// ============================================================

const Icon = ({
    name,
    size = 18,
    strokeWidth = 1.8,
    className = ""
}) => {
    const props = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className
    };

    switch (name) {

        case "dashboard":
            return (
                <svg {...props}>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            );

        case "profile":
            return (
                <svg {...props}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.2 3.4-7 8-7s8 2.8 8 7" />
                </svg>
            );

        case "crops":
            return (
                <svg {...props}>
                    <path d="M12 21V10" />
                    <path d="M12 14c-4.5 0-7-2.7-7-7 4.5 0 7 2.7 7 7Z" />
                    <path d="M12 11c0-4.2 2.3-7 6.5-7C18.5 8 16.2 11 12 11Z" />
                    <path d="M8 21h8" />
                </svg>
            );

        case "plus":
            return (
                <svg {...props}>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            );

        case "market":
            return (
                <svg {...props}>
                    <path d="M3 10h18" />
                    <path d="M5 10v10" />
                    <path d="M19 10v10" />
                    <path d="M4 20h16" />
                    <path d="M4 10 6 4h12l2 6" />
                    <path d="M8 20v-6h8v6" />
                </svg>
            );

        case "star":
            return (
                <svg {...props}>
                    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                </svg>
            );

        case "money":
            return (
                <svg {...props}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M7 9h.01" />
                    <path d="M17 15h.01" />
                </svg>
            );

        case "chart":
            return (
                <svg {...props}>
                    <path d="M4 19V5" />
                    <path d="M4 19h17" />
                    <path d="m7 15 4-4 3 2 5-7" />
                    <path d="M15 6h4v4" />
                </svg>
            );

        case "saved":
            return (
                <svg {...props}>
                    <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-4-8 4V5a2 2 0 0 1 2-2Z" />
                    <path d="M9 8h6" />
                    <path d="M9 11h6" />
                </svg>
            );

        case "government":
            return (
                <svg {...props}>
                    <path d="M3 9h18" />
                    <path d="m5 9 7-5 7 5" />
                    <path d="M5 9v10" />
                    <path d="M9 9v10" />
                    <path d="M15 9v10" />
                    <path d="M19 9v10" />
                    <path d="M3 19h18" />
                    <path d="M2 21h20" />
                </svg>
            );

        case "sales":
            return (
                <svg {...props}>
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 16v-4" />
                    <path d="M12 16V8" />
                    <path d="M17 16v-6" />
                </svg>
            );

        case "offer":
            return (
                <svg {...props}>
                    <path d="M4 12l4-4 4 4" />
                    <path d="M20 12l-4-4-4 4" />
                    <path d="M8 8h8" />
                    <path d="M7 12l3 3c.8.8 2.2.8 3 0l1-1" />
                    <path d="M17 12l-3 3" />
                    <path d="M5 17l2 2" />
                    <path d="M19 17l-2 2" />
                </svg>
            );

        case "logout":
            return (
                <svg {...props}>
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                </svg>
            );

        case "language":
            return (
                <svg {...props}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3c2.5 2.7 4 5.7 4 9s-1.5 6.3-4 9" />
                    <path d="M12 3c-2.5 2.7-4 5.7-4 9s1.5 6.3 4 9" />
                </svg>
            );

        case "help":
            return (
                <svg {...props}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-.8.9-1.9 1.2-1.9 2.4" />
                    <path d="M12 16h.01" />
                </svg>
            );

        case "contact":
            return (
                <svg {...props}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                </svg>
            );

        default:
            return null;
    }
};

// ============================================================
// FARMER NAVBAR
// ============================================================

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();

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
        try {
            logout();
        } catch (error) {
            console.error("Logout error:", error);
        }

        navigate("/login", {
            replace: true
        });
    };

    // ========================================================
    // SKIP TO CONTENT
    // ========================================================

    const handleSkipToContent = () => {

        const element =
            document.getElementById("main-content");

        if (element) {

            element.focus();

            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    // ========================================================
    // ACTIVE ROUTE
    // ========================================================

    const isActive = (path) => {

        if (path === "/farmer/dashboard") {
            return location.pathname === path;
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    // ========================================================
    // DESKTOP NAV CLASS
    // ========================================================

    const navClass = (path) => {

        return `
            inline-flex
            items-center
            justify-center
            gap-1.5
            px-3
            py-2
            rounded-lg
            text-sm
            font-medium
            whitespace-nowrap
            transition
            flex-shrink-0
            ${
                isActive(path)
                    ? "bg-orange-50 text-[#ff6500] font-semibold"
                    : "text-gray-800 hover:bg-orange-50 hover:text-[#ff6500]"
            }
        `;
    };

    // ========================================================
    // MOBILE NAV CLASS
    // ========================================================

    const mobileNavClass = (path) => {

        return `
            inline-flex
            items-center
            gap-1.5
            px-3
            py-2
            rounded-lg
            text-sm
            font-medium
            whitespace-nowrap
            transition
            ${
                isActive(path)
                    ? "bg-orange-50 text-[#ff6500] font-semibold"
                    : "bg-gray-50 text-gray-800 hover:bg-orange-50 hover:text-[#ff6500]"
            }
        `;
    };

    // ========================================================
    // NAVIGATION ITEMS
    // ========================================================

    const navigationItems = [

        {
            path: "/farmer/dashboard",
            label: "Dashboard",
            icon: "dashboard"
        },

        {
            path: "/farmer/profile",
            label: "Profile",
            icon: "profile"
        },

        {
            path: "/farmer/crops",
            label: "My Crops",
            icon: "crops"
        },

        {
            path: "/farmer/mandi",
            label: "Mandi Finder",
            icon: "market"
        },

        {
            path: "/farmer/saved-mandis",
            label: "Saved Mandis",
            icon: "star"
        },

        {
            path: "/farmer/market-prices",
            label: "Market Prices",
            icon: "money"
        },

        {
            path: "/farmer/profit",
            label: "Profit Calculator",
            icon: "chart"
        },

        {
            path: "/farmer/profit-history",
            label: "Saved Profits",
            icon: "saved"
        },

        // ====================================================
        // BUYER OFFERS
        // ====================================================

        {
            path: "/farmer/offers",
            label: "Buyer Offers",
            icon: "offer"
        },

        // ====================================================
        // FARMER DEALS
        // ====================================================

        {
            path: "/farmer/deals",
            label: "Deals",
            icon: "offer"
        },

        // ====================================================
        // SALES
        // ====================================================

        {
            path: "/farmer/sales",
            label: "Sales & Transactions",
            icon: "sales"
        },

        // ====================================================
        // GOVERNMENT SCHEMES
        // ====================================================

        {
            path: "/farmer/government-schemes",
            label: "Government Schemes",
            icon: "government"
        }
    ];

    return (
        <>
            {/* ==================================================
                TOP BLACK BAR
            ================================================== */}

            <div className="bg-[#030712] text-white">

                <div className="
                    max-w-[1500px]
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                ">

                    <div className="
                        min-h-[40px]
                        flex
                        items-center
                        justify-between
                        gap-4
                        text-sm
                    ">

                        <div className="
                            flex
                            items-center
                            gap-4
                            sm:gap-5
                            min-w-0
                        ">

                            <button
                                type="button"
                                onClick={handleSkipToContent}
                                className="
                                    hover:text-gray-300
                                    transition
                                    whitespace-nowrap
                                "
                            >
                                Skip to main content
                            </button>

                            <span className="
                                inline-flex
                                items-center
                                gap-1.5
                                whitespace-nowrap
                            ">
                                <Icon
                                    name="language"
                                    size={15}
                                />

                                English
                            </span>

                            <span className="
                                hidden
                                sm:inline-flex
                                items-center
                                gap-1.5
                                whitespace-nowrap
                            ">
                                <Icon
                                    name="contact"
                                    size={15}
                                />

                                Contact us
                            </span>

                            <span className="
                                hidden
                                sm:inline-flex
                                items-center
                                gap-1.5
                                whitespace-nowrap
                            ">
                                <Icon
                                    name="help"
                                    size={15}
                                />

                                Help
                            </span>

                        </div>

                        <span className="
                            hidden
                            md:block
                            whitespace-nowrap
                        ">
                            Smart Agriculture Platform
                        </span>

                    </div>
                </div>
            </div>

            {/* ==================================================
                MAIN NAVBAR
            ================================================== */}

            <nav className="
                bg-white
                border-b
                border-gray-300
                shadow-sm
                relative
                z-50
            ">

                <div className="
                    max-w-[1500px]
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                ">

                    {/* ==================================================
                        FIRST ROW
                    ================================================== */}

                    <div className="
                        min-h-[72px]
                        flex
                        items-center
                        justify-between
                        gap-5
                    ">

                        {/* LOGO */}

                        <Link
                            to="/farmer/dashboard"
                            className="
                                text-2xl
                                lg:text-3xl
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

                        {/* USER + LOGOUT */}

                        <div className="
                            flex
                            items-center
                            gap-3
                            sm:gap-4
                        ">

                            <div className="
                                hidden
                                sm:block
                                text-right
                                leading-tight
                            ">

                                <p
                                    className="
                                        text-sm
                                        lg:text-base
                                        font-bold
                                        text-gray-900
                                        max-w-[180px]
                                        truncate
                                    "
                                    title={userName}
                                >
                                    {userName}
                                </p>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    Farmer
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-[#ff6500]
                                    hover:bg-[#e85b00]
                                    active:bg-[#d94f00]
                                    text-white
                                    px-4
                                    sm:px-5
                                    py-2.5
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    transition
                                    whitespace-nowrap
                                "
                            >

                                <Icon
                                    name="logout"
                                    size={17}
                                />

                                Sign out

                            </button>

                        </div>
                    </div>

                    {/* ==================================================
                        DESKTOP NAVIGATION
                    ================================================== */}

                    <div className="
                        hidden
                        lg:block
                        border-t
                        border-gray-100
                    ">

                        <div className="
                            flex
                            items-center
                            justify-start
                            gap-1
                            py-2
                            overflow-x-auto
                            overflow-y-hidden
                            whitespace-nowrap
                        ">

                            {/* DASHBOARD */}

                            <Link
                                to="/farmer/dashboard"
                                className={navClass(
                                    "/farmer/dashboard"
                                )}
                            >
                                <Icon
                                    name="dashboard"
                                    size={17}
                                />

                                Dashboard
                            </Link>

                            {/* PROFILE */}

                            <Link
                                to="/farmer/profile"
                                className={navClass(
                                    "/farmer/profile"
                                )}
                            >
                                <Icon
                                    name="profile"
                                    size={17}
                                />

                                Profile
                            </Link>

                            {/* MY CROPS */}

                            <Link
                                to="/farmer/crops"
                                className={navClass(
                                    "/farmer/crops"
                                )}
                            >
                                <Icon
                                    name="crops"
                                    size={17}
                                />

                                My Crops
                            </Link>

                            {/* ADD CROP */}

                            <Link
                                to="/farmer/crops/add"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-1
                                    px-3
                                    py-2
                                    rounded-lg
                                    bg-[#fff4ed]
                                    text-[#ff6500]
                                    border
                                    border-[#ff6500]
                                    text-sm
                                    font-semibold
                                    whitespace-nowrap
                                    flex-shrink-0
                                    hover:bg-[#ff6500]
                                    hover:text-white
                                    transition
                                "
                            >

                                <Icon
                                    name="plus"
                                    size={16}
                                />

                                Add Crop

                            </Link>

                            {/* MANDI FINDER */}

                            <Link
                                to="/farmer/mandi"
                                className={navClass(
                                    "/farmer/mandi"
                                )}
                            >
                                <Icon
                                    name="market"
                                    size={17}
                                />

                                Mandi Finder
                            </Link>

                            {/* SAVED MANDIS */}

                            <Link
                                to="/farmer/saved-mandis"
                                className={navClass(
                                    "/farmer/saved-mandis"
                                )}
                            >
                                <Icon
                                    name="star"
                                    size={17}
                                />

                                Saved Mandis
                            </Link>

                            {/* MARKET PRICES */}

                            <Link
                                to="/farmer/market-prices"
                                className={navClass(
                                    "/farmer/market-prices"
                                )}
                            >
                                <Icon
                                    name="money"
                                    size={17}
                                />

                                Market Prices
                            </Link>

                            {/* PROFIT CALCULATOR */}

                            <Link
                                to="/farmer/profit"
                                className={navClass(
                                    "/farmer/profit"
                                )}
                            >
                                <Icon
                                    name="chart"
                                    size={17}
                                />

                                Profit Calculator
                            </Link>

                            {/* SAVED PROFITS */}

                            <Link
                                to="/farmer/profit-history"
                                className={navClass(
                                    "/farmer/profit-history"
                                )}
                            >
                                <Icon
                                    name="saved"
                                    size={17}
                                />

                                Saved Profits
                            </Link>

                            {/* ==================================================
                                BUYER OFFERS
                            ================================================== */}

                            <Link
                                to="/farmer/offers"
                                className={navClass(
                                    "/farmer/offers"
                                )}
                            >
                                <Icon
                                    name="offer"
                                    size={17}
                                />

                                Buyer Offers
                            </Link>

                            {/* ==================================================
                                FARMER DEALS - NEW
                            ================================================== */}

                            <Link
                                to="/farmer/deals"
                                className={navClass(
                                    "/farmer/deals"
                                )}
                            >
                                <Icon
                                    name="offer"
                                    size={17}
                                />

                                Deals
                            </Link>

                            {/* SALES */}

                            <Link
                                to="/farmer/sales"
                                className={navClass(
                                    "/farmer/sales"
                                )}
                            >
                                <Icon
                                    name="sales"
                                    size={17}
                                />

                                Sales & Transactions
                            </Link>

                            {/* GOVERNMENT SCHEMES */}

                            <Link
                                to="/farmer/government-schemes"
                                className={navClass(
                                    "/farmer/government-schemes"
                                )}
                            >
                                <Icon
                                    name="government"
                                    size={17}
                                />

                                Government Schemes
                            </Link>

                        </div>
                    </div>

                    {/* ==================================================
                        MOBILE / TABLET NAVIGATION
                    ================================================== */}

                    <div className="
                        lg:hidden
                        border-t
                        border-gray-200
                        py-4
                    ">

                        <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        ">

                            {navigationItems.map((item) => (

                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={mobileNavClass(
                                        item.path
                                    )}
                                >

                                    <Icon
                                        name={item.icon}
                                        size={16}
                                    />

                                    {item.label}

                                </Link>

                            ))}

                            {/* MOBILE USER */}

                            <div className="
                                w-full
                                flex
                                items-center
                                justify-between
                                border-t
                                border-gray-200
                                pt-3
                                mt-2
                            ">

                                <div className="min-w-0">

                                    <p className="
                                        text-sm
                                        font-bold
                                        text-gray-900
                                        truncate
                                    ">
                                        {userName}
                                    </p>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                    ">
                                        Farmer
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        bg-[#ff6500]
                                        hover:bg-[#e85b00]
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

                                    <Icon
                                        name="logout"
                                        size={16}
                                    />

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