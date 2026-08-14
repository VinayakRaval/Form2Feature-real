import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar() {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    return (
        <>


            {/* =====================================
                TOP BAR
            ====================================== */}

            <div className="bg-[#030712] text-white">

                <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-sm">

                    <div className="flex gap-6">

                        <span>
                            Skip to main content
                        </span>

                        <span>
                            English
                        </span>

                        <span>
                            Contact us
                        </span>

                        <span>
                            Help
                        </span>

                    </div>


                    <span>
                        Smart Agriculture Platform
                    </span>

                </div>

            </div>


            {/* =====================================
                MAIN NAVBAR
            ====================================== */}

            <nav className="bg-white border-b border-gray-300 shadow-sm">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">


                    {/* =================================
                        LOGO
                    ================================== */}

                    <div
                        onClick={() =>
                            navigate("/farmer/dashboard")
                        }
                        className="text-2xl font-bold text-[#ff6500] cursor-pointer"
                    >
                        Form2Feature
                    </div>


                    {/* =================================
                        NAVIGATION
                    ================================== */}

                    <div className="hidden lg:flex items-center gap-5 text-[#111827]">


                        {/* DASHBOARD */}

                        <button
                            onClick={() =>
                                navigate("/farmer/dashboard")
                            }
                            className="hover:text-[#ff6500] transition font-medium"
                        >
                            Dashboard
                        </button>


                        {/* PROFILE */}

                        <button
                            onClick={() =>
                                navigate("/farmer/profile")
                            }
                            className="hover:text-[#ff6500] transition font-medium"
                        >
                            Profile
                        </button>


                        {/* MY CROPS */}

                        <button
                            onClick={() =>
                                navigate("/farmer/crops")
                            }
                            className="hover:text-[#ff6500] transition font-medium"
                        >
                            My Crops
                        </button>


                        {/* ADD CROP */}

                        <button
                            onClick={() =>
                                navigate("/farmer/crops/add")
                            }
                            className="bg-[#fff4ed] text-[#ff6500] border border-[#ff6500] px-4 py-2 rounded-lg font-semibold hover:bg-[#ff6500] hover:text-white transition"
                        >
                            + Add Crop
                        </button>


                        {/* MANDI */}

                        <button
                            onClick={() =>
                                navigate("/farmer/mandi")
                            }
                            className="hover:text-[#ff6500] transition font-medium"
                        >
                            Mandi Finder
                        </button>


                        {/* MARKET PRICES */}

                        {/* MARKET PRICES */}

                        <button
                            onClick={() =>
                                 navigate("/farmer/market-prices")
                          }
                          className="hover:text-[#ff6500] transition font-medium"
                        >
                              Market Prices
                        </button>


                        {/* WEATHER */}

                        <button
                            onClick={() =>
                                navigate("/farmer/weather")
                            }
                            className="hover:text-[#ff6500] transition font-medium"
                        >
                            Weather
                        </button>

                    </div>


                    {/* =================================
                        RIGHT SIDE
                    ================================== */}

                    <div className="flex items-center gap-4">


                        {/* USER */}

                        <div className="hidden md:block text-right">

                            <p className="text-sm font-semibold text-[#111827]">
                                {user?.full_name || "Farmer"}
                            </p>

                            <p className="text-xs text-gray-500">
                                Farmer
                            </p>

                        </div>


                        {/* LOGOUT */}

                        <button
                            onClick={handleLogout}
                            className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-5 py-2 rounded-lg font-semibold transition"
                        >
                            Sign out
                        </button>

                    </div>

                </div>

            </nav>

        </>
    );
}


export default Navbar;