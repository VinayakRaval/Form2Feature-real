import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {

    const {
        user,
        isAuthenticated
    } = useAuth();

    // User is not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // User doesn't have required role
    if (role && user?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;