import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ============================================================
// PUBLIC PAGES
// ============================================================

import Home from "./pages/Home";
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
import GovernmentSchemes from "./pages/farmer/GovernmentSchemes";
import Sales from "./pages/farmer/Sales";
import FarmerOffers from "./pages/farmer/FarmerOffers";
import FarmerDeals from "./pages/farmer/FarmerDeals";

// ============================================================
// BUYER PAGES
// ============================================================

import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import BuyerCrops from "./pages/buyer/BuyerCrops";
import BuyerOffers from "./pages/buyer/BuyerOffers";
import BuyerDeals from "./pages/buyer/BuyerDeals";
import BuyerTransactions from "./pages/buyer/BuyerTransactions";
import BuyerCropDetails from "./pages/buyer/BuyerCropDetails";

// ============================================================
// APP
// ============================================================

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* ==================================================
                        PUBLIC ROUTES
                    ================================================== */}

                    <Route
                        path="/"
                        element={<Home />}
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
                        FARMER ROUTES
                    ================================================== */}

                    <Route
                        path="/farmer/dashboard"
                        element={
                            <ProtectedRoute role="farmer">
                                <FarmerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/profile"
                        element={
                            <ProtectedRoute role="farmer">
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

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

                    <Route
                        path="/farmer/market-prices"
                        element={
                            <ProtectedRoute role="farmer">
                                <MarketPrices />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/weather"
                        element={
                            <ProtectedRoute role="farmer">
                                <Weather />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/profit"
                        element={
                            <ProtectedRoute role="farmer">
                                <ProfitCalculator />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/saved-profits"
                        element={
                            <ProtectedRoute role="farmer">
                                <SavedProfits />
                            </ProtectedRoute>
                        }
                    />

                    {/* Old profit history URL */}
                    <Route
                        path="/farmer/profit-history"
                        element={
                            <Navigate
                                to="/farmer/saved-profits"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/farmer/government-schemes"
                        element={
                            <ProtectedRoute role="farmer">
                                <GovernmentSchemes />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/farmer/sales"
                        element={
                            <ProtectedRoute role="farmer">
                                <Sales />
                            </ProtectedRoute>
                        }
                    />

                    {/* FARMER OFFERS */}

                    <Route
                        path="/farmer/offers"
                        element={
                            <ProtectedRoute role="farmer">
                                <FarmerOffers />
                            </ProtectedRoute>
                        }
                    />

                    {/* FARMER DEALS */}

                    <Route
                        path="/farmer/deals"
                        element={
                            <ProtectedRoute role="farmer">
                                <FarmerDeals />
                            </ProtectedRoute>
                        }
                    />

                    {/* ==================================================
                        BUYER ROUTES
                    ================================================== */}

                    <Route
                        path="/buyer/dashboard"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/buyer/profile"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* BUYER CROPS */}

                    <Route
                        path="/buyer/crops"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerCrops />
                            </ProtectedRoute>
                        }
                    />

                    {/* BUYER CROP DETAILS */}

                    <Route
                        path="/buyer/crops/:id"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerCropDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* BUYER OFFERS */}

                    <Route
                        path="/buyer/offers"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerOffers />
                            </ProtectedRoute>
                        }
                    />

                    {/* BUYER DEALS */}

                    <Route
                        path="/buyer/deals"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerDeals />
                            </ProtectedRoute>
                        }
                    />

                    {/* BUYER TRANSACTIONS */}

                    <Route
                        path="/buyer/transactions"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerTransactions />
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
                                to="/"
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