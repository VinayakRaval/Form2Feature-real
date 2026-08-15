import axios from "axios";

// =====================================================
// AXIOS API INSTANCE
// =====================================================

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

// =====================================================
// ADD JWT TOKEN TO EVERY REQUEST
// =====================================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        console.log(
            "================================="
        );

        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            config.baseURL + config.url
        );

        console.log(
            "API TOKEN:",
            token
                ? "Token found"
                : "NO TOKEN"
        );

        // Add JWT
        if (token) {

            config.headers = config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {

        console.error(
            "REQUEST INTERCEPTOR ERROR:",
            error
        );

        return Promise.reject(error);
    }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

    (response) => {

        console.log(
            "API RESPONSE:",
            response.status,
            response.config.url
        );

        return response;
    },

    (error) => {

        console.error(
            "================================="
        );

        console.error(
            "API ERROR"
        );

        console.error(
            "URL:",
            error.config?.url
        );

        console.error(
            "STATUS:",
            error.response?.status
        );

        console.error(
            "DATA:",
            error.response?.data
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        // =================================================
        // 401 - JWT FAILED
        // =================================================

        if (
            error.response?.status === 401
        ) {

            console.error(
                "JWT authentication failed."
            );

            console.error(
                "Please login again."
            );

            // Optional:
            // localStorage.removeItem("token");
        }

        // =================================================
        // 403 - ROLE FAILED
        // =================================================

        if (
            error.response?.status === 403
        ) {

            console.error(
                "Access denied."
            );

            console.error(
                "User may not have farmer role."
            );
        }

        // =================================================
        // 404 - ROUTE NOT FOUND
        // =================================================

        if (
            error.response?.status === 404
        ) {

            console.error(
                "API route not found."
            );
        }

        // =================================================
        // 500 - SERVER ERROR
        // =================================================

        if (
            error.response?.status === 500
        ) {

            console.error(
                "Backend server error."
            );
        }

        return Promise.reject(error);
    }
);

export default api;