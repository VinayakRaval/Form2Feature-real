import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",

    // 0 = no Axios timeout
    timeout: 0
});

// ==========================================
// ADD JWT TOKEN TO EVERY REQUEST
// ==========================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            config.url
        );

        console.log(
            "API TOKEN:",
            token
                ? "Token found"
                : "NO TOKEN"
        );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {

        return Promise.reject(error);

    }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        console.error(
            "API ERROR:",
            error.response?.status,
            error.response?.data ||
            error.message
        );

        if (error.response?.status === 401) {

            console.error(
                "JWT authentication failed"
            );

            console.error(
                "Server response:",
                error.response?.data
            );

        }

        return Promise.reject(error);

    }
);


export default api;