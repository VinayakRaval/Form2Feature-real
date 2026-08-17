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
// PROTECTED ROUTE
// ============================================================

import ProtectedRoute from "./components/ProtectedRoute";

// ============================================================
// FARMER PAGES
// ============================================================

import FarmerDashboard
    from "./pages/farmer/FarmerDashboard";

import Profile
    from "./pages/farmer/Profile";

import Crops
    from "./pages/farmer/Crops";

import AddCrop
    from "./pages/farmer/AddCrop";

import EditCrop
    from "./pages/farmer/EditCrop";

import MandiFinder
    from "./pages/farmer/MandiFinder";

import SavedMandi
    from "./pages/farmer/SavedMandi";

import MarketPrices
    from "./pages/farmer/MarketPrices";

import Weather
    from "./pages/farmer/Weather";

import ProfitCalculator
    from "./pages/farmer/ProfitCalculator";

import SavedProfits
    from "./pages/farmer/SavedProfits";

import GovernmentSchemes
    from "./pages/farmer/GovernmentSchemes";

import Sales
    from "./pages/farmer/Sales";

// ============================================================
// BUYER PAGES
// ============================================================

import BuyerDashboard
    from "./pages/buyer/BuyerDashboard";

import BuyerProfile
    from "./pages/buyer/BuyerProfile";

import BuyerCrops
    from "./pages/buyer/BuyerCrops";

import BuyerOffers
    from "./pages/buyer/BuyerOffers";

import BuyerDeals
    from "./pages/buyer/BuyerDeals";

import BuyerTransactions
    from "./pages/buyer/BuyerTransactions";

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
                        FARMER PROFILE
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
                        FARMER CROPS
                    ================================================== */}

                    <Route
                        path="/farmer/crops"
                        element={
                            <ProtectedRoute role="farmer">
                                <Crops />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        ADD CROP
                    ================================================== */}

                    <Route
                        path="/farmer/crops/add"
                        element={
                            <ProtectedRoute role="farmer">
                                <AddCrop />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        EDIT CROP
                    ================================================== */}

                    <Route
                        path="/farmer/crops/edit/:id"
                        element={
                            <ProtectedRoute role="farmer">
                                <EditCrop />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        MANDI FINDER
                    ================================================== */}

                    <Route
                        path="/farmer/mandi"
                        element={
                            <ProtectedRoute role="farmer">
                                <MandiFinder />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        SAVED MANDIS
                    ================================================== */}

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
                        GOVERNMENT SCHEMES
                    ================================================== */}

                    <Route
                        path="/farmer/government-schemes"
                        element={
                            <ProtectedRoute role="farmer">
                                <GovernmentSchemes />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        SALES & TRANSACTIONS
                    ================================================== */}

                    <Route
                        path="/farmer/sales"
                        element={
                            <ProtectedRoute role="farmer">
                                <Sales />
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
                        path="/farmer/saved-profits"
                        element={
                            <ProtectedRoute role="farmer">
                                <SavedProfits />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        OLD PROFIT HISTORY URL
                    ================================================== */}

                    <Route
                        path="/farmer/profit-history"
                        element={
                            <Navigate
                                to="/farmer/saved-profits"
                                replace
                            />
                        }
                    />


                    {/* ==================================================
                        BUYER DASHBOARD
                    ================================================== */}

                    <Route
                        path="/buyer/dashboard"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerDashboard />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        BUYER PROFILE
                    ================================================== */}

                    <Route
                        path="/buyer/profile"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerProfile />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        BUYER BROWSE CROPS
                    ================================================== */}

                    <Route
                        path="/buyer/crops"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerCrops />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        BUYER OFFERS
                    ================================================== */}

                    <Route
                        path="/buyer/offers"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerOffers />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        BUYER DEALS
                    ================================================== */}

                    <Route
                        path="/buyer/deals"
                        element={
                            <ProtectedRoute role="buyer">
                                <BuyerDeals />
                            </ProtectedRoute>
                        }
                    />


                    {/* ==================================================
                        BUYER TRANSACTIONS
                    ================================================== */}

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