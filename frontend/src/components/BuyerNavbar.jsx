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

        // ----------------------------------------------------
        // DASHBOARD
        // ----------------------------------------------------

        case "dashboard":
            return (
                <svg {...props}>
                    <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                    />
                    <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                    />
                    <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                    />
                    <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                    />
                </svg>
            );

        // ----------------------------------------------------
        // PROFILE
        // ----------------------------------------------------

        case "profile":
            return (
                <svg {...props}>
                    <circle
                        cx="12"
                        cy="8"
                        r="4"
                    />

                    <path
                        d="M4 21c0-4.2 3.4-7 8-7s8 2.8 8 7"
                    />
                </svg>
            );

        // ----------------------------------------------------
        // CROPS
        // ----------------------------------------------------

        case "crops":
            return (
                <svg {...props}>

                    <path d="M12 21V10" />

                    <path
                        d="M12 14c-4.5 0-7-2.7-7-7 4.5 0 7 2.7 7 7Z"
                    />

                    <path
                        d="M12 11c0-4.2 2.3-7 6.5-7C18.5 8 16.2 11 12 11Z"
                    />

                    <path d="M8 21h8" />

                </svg>
            );

        // ----------------------------------------------------
        // OFFERS / MONEY
        // ----------------------------------------------------

        case "money":
            return (
                <svg {...props}>

                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                    />

                    <circle
                        cx="12"
                        cy="12"
                        r="3"
                    />

                    <path d="M7 9h.01" />

                    <path d="M17 15h.01" />

                </svg>
            );

        // ----------------------------------------------------
        // DEALS
        // ----------------------------------------------------

        case "deals":
            return (
                <svg {...props}>

                    <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />

                    <path d="M2 7h20v5H2z" />

                    <path d="M12 7v14" />

                    <path
                        d="M12 7H7.5a2.5 2.5 0 1 1 0-5C10 2 12 7 12 7Z"
                    />

                    <path
                        d="M12 7h4.5a2.5 2.5 0 1 0 0-5C14 2 12 7 12 7Z"
                    />

                </svg>
            );

        // ----------------------------------------------------
        // TRANSACTIONS
        // ----------------------------------------------------

        case "transactions":
            return (
                <svg {...props}>

                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="16"
                        rx="2"
                    />

                    <path d="M7 16v-4" />

                    <path d="M12 16V8" />

                    <path d="M17 16v-6" />

                </svg>
            );

        // ----------------------------------------------------
        // MARKET
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // SEARCH
        // ----------------------------------------------------

        case "search":
            return (
                <svg {...props}>

                    <circle
                        cx="11"
                        cy="11"
                        r="7"
                    />

                    <path d="m20 20-4-4" />

                </svg>
            );

        // ----------------------------------------------------
        // LOGOUT
        // ----------------------------------------------------

        case "logout":
            return (
                <svg {...props}>

                    <path d="M10 17l5-5-5-5" />

                    <path d="M15 12H3" />

                    <path
                        d="M21 19V5a2 2 0 0 0-2-2h-6"
                    />

                </svg>
            );

        // ----------------------------------------------------
        // LANGUAGE
        // ----------------------------------------------------

        case "language":
            return (
                <svg {...props}>

                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />

                    <path d="M3 12h18" />

                    <path
                        d="M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9"
                    />

                    <path
                        d="M12 3c-3 3-4.5 6-4.5 9s1.5 6 4.5 9"
                    />

                </svg>
            );

        // ----------------------------------------------------
        // HELP
        // ----------------------------------------------------

        case "help":
            return (
                <svg {...props}>

                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    />

                    <path
                        d="M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-.8.9-1.9 1.2-1.9 2.4"
                    />

                    <path d="M12 16h.01" />

                </svg>
            );

        // ----------------------------------------------------
        // CONTACT
        // ----------------------------------------------------

        case "contact":
            return (
                <svg {...props}>

                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                    />

                    <path d="m3 7 9 6 9-6" />

                </svg>
            );

        default:
            return null;
    }
};


// ============================================================
// BUYER NAVBAR
// ============================================================

function BuyerNavbar() {

    const navigate = useNavigate();

    const location = useLocation();

    const {
        user,
        logout
    } = useAuth();


    // ========================================================
    // BUYER NAME
    // ========================================================

    const buyerName =
        user?.full_name ||
        user?.name ||
        user?.username ||
        "Buyer";


    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {

        try {

            logout();

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

        navigate(
            "/login",
            {
                replace: true
            }
        );
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
                behavior: "smooth",
                block: "start"
            });

        }
    };


    // ========================================================
    // ACTIVE ROUTE
    // ========================================================

    const isActive = (path) => {

        return (
            location.pathname === path ||
            location.pathname.startsWith(
                `${path}/`
            )
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
    // BUYER NAVIGATION ITEMS
    // ========================================================

    const navigationItems = [

        {
            path: "/buyer/dashboard",
            label: "Dashboard",
            icon: "dashboard"
        },

        {
            path: "/buyer/profile",
            label: "Profile",
            icon: "profile"
        },

        {
            path: "/buyer/crops",
            label: "Browse Crops",
            icon: "crops"
        },

        {
            path: "/buyer/offers",
            label: "My Offers",
            icon: "money"
        },

        {
            path: "/buyer/deals",
            label: "Deals",
            icon: "deals"
        },

        {
            path: "/buyer/transactions",
            label: "Transactions",
            icon: "transactions"
        },

        {
            path: "/buyer/market-prices",
            label: "Market Prices",
            icon: "money"
        },

        {
            path: "/buyer/mandi",
            label: "Mandi Finder",
            icon: "market"
        }

    ];


    return (

        <>

            {/* ==================================================
                TOP BLACK BAR
            ================================================== */}

            <div className="bg-[#030712] text-white">

                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="min-h-[40px] flex items-center justify-between gap-4 text-sm">

                        {/* LEFT */}

                        <div className="flex items-center gap-4 sm:gap-5 min-w-0">

                            <button
                                type="button"
                                onClick={
                                    handleSkipToContent
                                }
                                className="
                                    hover:text-gray-300
                                    transition
                                    whitespace-nowrap
                                "
                            >
                                Skip to main content
                            </button>


                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">

                                <Icon
                                    name="language"
                                    size={15}
                                />

                                English

                            </span>


                            <span className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap">

                                <Icon
                                    name="contact"
                                    size={15}
                                />

                                Contact us

                            </span>


                            <span className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap">

                                <Icon
                                    name="help"
                                    size={15}
                                />

                                Help

                            </span>

                        </div>


                        {/* RIGHT */}

                        <span className="hidden md:block whitespace-nowrap">

                            Smart Agriculture Platform

                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================================
                MAIN NAVBAR
            ================================================== */}

            <nav className="bg-white border-b border-gray-300 shadow-sm relative z-50">

                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">


                    {/* ==================================================
                        FIRST ROW
                    ================================================== */}

                    <div className="min-h-[72px] flex items-center justify-between gap-5">


                        {/* LOGO */}

                        <Link
                            to="/buyer/dashboard"
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

                        <div className="flex items-center gap-3 sm:gap-4">


                            {/* USER */}

                            <div className="hidden sm:block text-right leading-tight">

                                <p
                                    className="
                                        text-sm
                                        lg:text-base
                                        font-bold
                                        text-gray-900
                                        max-w-[180px]
                                        truncate
                                    "
                                    title={buyerName}
                                >
                                    {buyerName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Buyer
                                </p>

                            </div>


                            {/* AVATAR */}

                            <div
                                className="
                                    h-10
                                    w-10
                                    rounded-full
                                    bg-orange-50
                                    text-[#ff6500]
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                    border
                                    border-orange-100
                                "
                            >
                                {buyerName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>


                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
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

                                <span>
                                    Sign out
                                </span>

                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        DESKTOP NAVIGATION
                    ================================================== */}

                    <div className="hidden lg:block border-t border-gray-100">

                        <div
                            className="
                                flex
                                items-center
                                justify-start
                                gap-1
                                py-2
                                overflow-x-auto
                                overflow-y-hidden
                                whitespace-nowrap
                            "
                        >

                            {navigationItems.map(
                                (item) => (

                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={navClass(
                                            item.path
                                        )}
                                    >

                                        <Icon
                                            name={item.icon}
                                            size={17}
                                        />

                                        {item.label}

                                    </Link>

                                )
                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        MOBILE / TABLET NAVIGATION
                    ================================================== */}

                    <div className="lg:hidden border-t border-gray-200 py-4">

                        <div className="flex flex-wrap items-center gap-2">

                            {navigationItems.map(
                                (item) => (

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

                                )
                            )}


                            {/* MOBILE USER */}

                            <div className="w-full flex items-center justify-between border-t border-gray-200 pt-3 mt-2">


                                <div className="min-w-0">

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                            text-gray-900
                                            truncate
                                        "
                                    >
                                        {buyerName}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Buyer
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
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

export default BuyerNavbar;