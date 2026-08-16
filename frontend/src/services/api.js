import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================
//
// Local:
// http://localhost:5173
//       ↓
// http://localhost:5000/api
//
// Kubernetes:
// http://EC2-IP:30080
//       ↓
// /api
//       ↓
// Nginx → backend:5000
// =====================================================

const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "/api";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// =====================================================
// JWT TOKEN
// =====================================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        console.log("=================================");
        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            `${config.baseURL}${config.url}`
        );

        console.log(
            "API TOKEN:",
            token ? "Token found" : "NO TOKEN"
        );

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error("REQUEST INTERCEPTOR ERROR:", error);
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
        console.error("=================================");
        console.error("API ERROR");
        console.error("URL:", error.config?.url);
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
        console.error("MESSAGE:", error.message);

        if (error.response?.status === 401) {
            console.error("JWT authentication failed.");
        }

        if (error.response?.status === 403) {
            console.error("Access denied.");
        }

        if (error.response?.status === 404) {
            console.error("API route not found.");
        }

        if (error.response?.status === 500) {
            console.error("Backend server error.");
        }

        return Promise.reject(error);
    }
);

export default api;