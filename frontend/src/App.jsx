import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import Profile from "./pages/farmer/Profile";
import Crops from "./pages/farmer/Crops";
import AddCrop from "./pages/farmer/AddCrop";
import ProtectedRoute from "./components/ProtectedRoute";
import EditCrop from "./pages/farmer/EditCrop";
import MandiFinder from "./pages/farmer/MandiFinder";
import MarketPrices from "./pages/farmer/MarketPrices";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Pages */}
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

                    {/* Farmer Dashboard & Profile */}
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

                    {/* Farmer Crops */}
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
                        path="/farmer/market-prices"
                        element={
                            <ProtectedRoute role="farmer">
                                    <MarketPrices />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;