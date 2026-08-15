import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

// ============================================================
// PUBLIC PAGES
// ============================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// ============================================================
// FARMER PAGES
// ============================================================

import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import Profile from "./pages/farmer/Profile";
import Crops from "./pages/farmer/Crops";
import AddCrop from "./pages/farmer/AddCrop";
import EditCrop from "./pages/farmer/EditCrop";

import MandiFinder from "./pages/farmer/MandiFinder";
import SavedMandi from "./pages/farmer/SavedMandi";
import MarketPrices from "./pages/farmer/MarketPrices";
import Weather from "./pages/farmer/Weather";

import ProfitCalculator from "./pages/farmer/ProfitCalculator";
import SavedProfits from "./pages/farmer/SavedProfits";

// ============================================================
// PROTECTED ROUTE
// ============================================================

import ProtectedRoute from "./components/ProtectedRoute";

// ============================================================
// APP
// ============================================================

function App() {
    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* ==================================================
                        PUBLIC
                    ================================================== */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />


                    {/* ==================================================
                        FARMER DASHBOARD
                    ================================================== */}

                    <Route
                        path="/farmer/dashboard"
                        element={
                            <ProtectedRoute role="farmer">
                                <FarmerDashboard />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        PROFILE
                    ================================================== */}

                    <Route
                        path="/farmer/profile"
                        element={
                            <ProtectedRoute role="farmer">
                                <Profile />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        CROPS
                    ================================================== */}

                    <Route
                        path="/farmer/crops"
                        element={
                            <ProtectedRoute role="farmer">
                                <Crops />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/crops/add"
                        element={
                            <ProtectedRoute role="farmer">
                                <AddCrop />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/crops/edit/:id"
                        element={
                            <ProtectedRoute role="farmer">
                                <EditCrop />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        MANDI
                    ================================================== */}

                    <Route
                        path="/farmer/mandi"
                        element={
                            <ProtectedRoute role="farmer">
                                <MandiFinder />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/saved-mandis"
                        element={
                            <ProtectedRoute role="farmer">
                                <SavedMandi />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        MARKET PRICES
                    ================================================== */}

                    <Route
                        path="/farmer/market-prices"
                        element={
                            <ProtectedRoute role="farmer">
                                <MarketPrices />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        WEATHER
                    ================================================== */}

                    <Route
                        path="/farmer/weather"
                        element={
                            <ProtectedRoute role="farmer">
                                <Weather />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        PROFIT CALCULATOR
                    ================================================== */}

                    <Route
                        path="/farmer/profit"
                        element={
                            <ProtectedRoute role="farmer">
                                <ProfitCalculator />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        SAVED PROFITS
                    ================================================== */}

                    <Route
                        path="/farmer/profit-history"
                        element={
                            <ProtectedRoute role="farmer">
                                <SavedProfits />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        UNKNOWN ROUTE
                    ================================================== */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;