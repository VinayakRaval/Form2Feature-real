import axios from "axios";

// ============================================================
// FORM2FEATURE API CONFIGURATION
// ============================================================
//
// LOCAL DEVELOPMENT
//
// Frontend:
// http://localhost:5173
//
// Backend:
// http://localhost:5000
//
// API:
// http://localhost:5000/api
//
// ============================================================
//
// EC2 / KUBERNETES PRODUCTION
//
// Frontend:
// http://EC2-IP
//
// API:
// /api
//
// Nginx:
// /api  ---> backend:5000
//
// ============================================================


// ============================================================
// ENVIRONMENT INFORMATION
// ============================================================

const hostname = window.location.hostname;
const protocol = window.location.protocol;
const port = window.location.port;


// ============================================================
// API BASE URL
// ============================================================

let API_BASE_URL;


// ============================================================
// LOCALHOST
// ============================================================

if (
    hostname === "localhost" ||
    hostname === "127.0.0.1"
) {

    API_BASE_URL =
        "http://localhost:5000/api";

}


// ============================================================
// VITE DEVELOPMENT SERVER ON EC2 / LOCAL NETWORK
// ============================================================
//
// Example:
//
// http://3.110.83.154:5173
//
// Backend:
//
// http://3.110.83.154:5000
//
// ============================================================

else if (port === "5173") {

    API_BASE_URL =
        `${protocol}//${hostname}:5000/api`;

}


// ============================================================
// PRODUCTION / KUBERNETES
// ============================================================
//
// Example:
//
// http://3.110.83.154
//
// Frontend requests:
//
// /api/...
//
// Nginx forwards:
//
// /api ---> backend:5000
//
// ============================================================

else {

    API_BASE_URL = "/api";

}


// ============================================================
// DEBUG CONFIGURATION
// ============================================================

console.log(
    "================================="
);

console.log(
    "FORM2FEATURE API CONFIG"
);

console.log(
    "Hostname:",
    hostname
);

console.log(
    "Protocol:",
    protocol
);

console.log(
    "Port:",
    port
);

console.log(
    "API BASE URL:",
    API_BASE_URL
);

console.log(
    "================================="
);


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({

    baseURL: API_BASE_URL,

    timeout: 30000,

    headers: {
        Accept: "application/json"
    }

});


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(

    (config) => {

        // ----------------------------------------------------
        // GET JWT TOKEN
        // ----------------------------------------------------

        const token =
            localStorage.getItem("token");


        // ----------------------------------------------------
        // DEBUG
        // ----------------------------------------------------

        console.log(
            "================================="
        );

        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            `${config.baseURL}${config.url}`
        );

        console.log(
            "API TOKEN:",
            token
                ? "Token found"
                : "NO TOKEN"
        );


        // ----------------------------------------------------
        // ADD JWT
        // ----------------------------------------------------

        if (token) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        // ----------------------------------------------------
        // DON'T FORCE JSON FOR FORMDATA
        // ----------------------------------------------------
        //
        // Axios automatically sets the correct
        // multipart/form-data Content-Type and boundary.
        //
        // This is important for:
        //
        // Crop image upload
        // Crop update image
        // Profile image
        //
        // ----------------------------------------------------

        if (
            config.data instanceof FormData
        ) {

            if (config.headers) {

                delete config.headers[
                    "Content-Type"
                ];

            }

        }

        else {

            config.headers =
                config.headers || {};

            config.headers[
                "Content-Type"
            ] = "application/json";

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


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

    // ========================================================
    // SUCCESS
    // ========================================================

    (response) => {

        console.log(
            "API RESPONSE:",
            response.status,
            response.config.url
        );

        return response;

    },


    // ========================================================
    // ERROR
    // ========================================================

    (error) => {

        console.error(
            "================================="
        );

        console.error(
            "API ERROR"
        );


        console.error(
            "METHOD:",
            error.config?.method
        );


        console.error(
            "BASE URL:",
            error.config?.baseURL
        );


        console.error(
            "URL:",
            error.config?.url
        );


        console.error(
            "FULL URL:",
            error.config
                ? `${error.config.baseURL}${error.config.url}`
                : "Unknown"
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


        // ====================================================
        // NETWORK ERROR
        // ====================================================

        if (
            !error.response
        ) {

            console.error(
                "NETWORK ERROR: Backend server may be offline."
            );

        }


        // ====================================================
        // 401 UNAUTHORIZED
        // ====================================================

        if (
            error.response?.status === 401
        ) {

            console.error(
                "JWT authentication failed."
            );

        }


        // ====================================================
        // 403 FORBIDDEN
        // ====================================================

        if (
            error.response?.status === 403
        ) {

            console.error(
                "Access denied."
            );

        }


        // ====================================================
        // 404 NOT FOUND
        // ====================================================

        if (
            error.response?.status === 404
        ) {

            console.error(
                "API route not found."
            );

        }


        // ====================================================
        // 500 SERVER ERROR
        // ====================================================

        if (
            error.response?.status === 500
        ) {

            console.error(
                "Backend server error."
            );

        }


        console.error(
            "================================="
        );


        return Promise.reject(error);

    }

);


// ============================================================
// EXPORT
// ============================================================

export default api;