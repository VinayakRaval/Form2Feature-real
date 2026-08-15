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

                    {/* =================================================
                        ROOT
                        Do NOT load Home.jsx for now.
                        Go to Login.
                    ================================================= */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                    {/* =================================================
                        PUBLIC ROUTES
                    ================================================= */}

                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />

                    <Route
                        path="/forgot-password"
                        element={
                            <ForgotPassword />
                        }
                    />


                    {/* =================================================
                        FARMER DASHBOARD
                    ================================================= */}

                    <Route
                        path="/farmer/dashboard"
                        element={
                            <ProtectedRoute role="farmer">
                                <FarmerDashboard />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        FARMER PROFILE
                    ================================================= */}

                    <Route
                        path="/farmer/profile"
                        element={
                            <ProtectedRoute role="farmer">
                                <Profile />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        MY CROPS
                    ================================================= */}

                    <Route
                        path="/farmer/crops"
                        element={
                            <ProtectedRoute role="farmer">
                                <Crops />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        ADD CROP
                    ================================================= */}

                    <Route
                        path="/farmer/crops/add"
                        element={
                            <ProtectedRoute role="farmer">
                                <AddCrop />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        EDIT CROP
                    ================================================= */}

                    <Route
                        path="/farmer/crops/edit/:id"
                        element={
                            <ProtectedRoute role="farmer">
                                <EditCrop />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        MANDI FINDER
                    ================================================= */}

                    <Route
                        path="/farmer/mandi"
                        element={
                            <ProtectedRoute role="farmer">
                                <MandiFinder />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        SAVED MANDIS
                    ================================================= */}

                    <Route
                        path="/farmer/saved-mandis"
                        element={
                            <ProtectedRoute role="farmer">
                                <SavedMandi />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        MARKET PRICES
                    ================================================= */}

                    <Route
                        path="/farmer/market-prices"
                        element={
                            <ProtectedRoute role="farmer">
                                <MarketPrices />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        WEATHER
                    ================================================= */}

                    <Route
                        path="/farmer/weather"
                        element={
                            <ProtectedRoute role="farmer">
                                <Weather />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        UNKNOWN URL
                    ================================================= */}

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