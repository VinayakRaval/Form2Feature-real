import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";


// ==========================================
// CREATE CONTEXT
// ==========================================

const AuthContext = createContext(null);


// ==========================================
// AUTH PROVIDER
// ==========================================

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);

    const [loading, setLoading] =
        useState(true);


    // ======================================
    // CHECK EXISTING LOGIN
    // ======================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const savedUser =
            localStorage.getItem("user");


        if (token && savedUser) {

            try {

                setUser(
                    JSON.parse(savedUser)
                );

                setIsAuthenticated(true);

            } catch (error) {

                console.error(
                    "Invalid saved user:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);
                setIsAuthenticated(false);
            }

        }


        setLoading(false);

    }, []);


    // ======================================
    // LOGIN
    // ======================================

    const login = async (
        email,
        password
    ) => {

        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );


            const data =
                response.data;


            if (!data.success) {

                return {
                    success: false,
                    message:
                        data.message ||
                        "Login failed"
                };

            }


            // SAVE TOKEN

            localStorage.setItem(
                "token",
                data.token
            );


            // SAVE USER

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            setUser(data.user);

            setIsAuthenticated(true);


            return {

                success: true,

                user: data.user

            };


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            return {

                success: false,

                message:
                    error.response?.data?.message ||
                    "Authentication failed. Please try again."

            };

        }

    };


    // ======================================
    // LOGOUT
    // ======================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        setUser(null);

        setIsAuthenticated(false);

    };


    // ======================================
    // CONTEXT VALUE
    // ======================================

    const value = {

        user,

        isAuthenticated,

        loading,

        login,

        logout

    };


    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

}


// ==========================================
// useAuth HOOK
// ==========================================

export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

}