const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { testDatabase } = require("./config/db");

// =========================================
// LOAD ENVIRONMENT VARIABLES
// =========================================

dotenv.config();

// =========================================
// CREATE APP
// =========================================

const app = express();

const PORT = process.env.PORT || 5000;

// =========================================
// ROUTES
// =========================================

const authRoutes = require("./routes/authRoutes");

const farmerRoutes = require("./routes/farmerRoutes");

const cropRoutes = require("./routes/cropRoutes");

const mandiRoutes = require("./routes/mandiRoutes");

const marketPriceRoutes =
    require("./routes/marketPriceRoutes");

// =========================================
// MIDDLEWARE
// =========================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// =========================================
// STATIC UPLOADS
// =========================================

const uploadsPath =
    path.join(__dirname, "uploads");

console.log(
    "Uploads directory:",
    uploadsPath
);

app.use(
    "/uploads",
    express.static(uploadsPath)
);

// =========================================
// API ROUTES
// =========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/farmer",
    farmerRoutes
);

app.use(
    "/api/crops",
    cropRoutes
);

app.use(
    "/api/mandis",
    mandiRoutes
);

app.use(
    "/api/market-prices",
    marketPriceRoutes
);

// =========================================
// HEALTH CHECK
// =========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Form2Feature API is running",
        version: "1.0.0"
    });

});

// =========================================
// TEST UPLOAD DIRECTORY
// =========================================

app.get("/uploads-test", (req, res) => {

    res.json({
        success: true,
        message: "Upload server is working",
        uploads_url:
            `http://localhost:${PORT}/uploads`
    });

});

// =========================================
// 404 HANDLER
// =========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});

// =========================================
// START SERVER
// =========================================

app.listen(
    PORT,
    async () => {

        console.log("");

        console.log(
            "================================="
        );

        console.log(
            "     Form2Feature Backend"
        );

        console.log(
            "================================="
        );

        console.log(
            `🚀 Server: http://localhost:${PORT}`
        );

        console.log(
            `🏪 Mandi API: http://localhost:${PORT}/api/mandis`
        );

        console.log(
            `💰 Market Price API: http://localhost:${PORT}/api/market-prices`
        );

        console.log(
            `📸 Uploads: http://localhost:${PORT}/uploads`
        );

        console.log(
            "================================="
        );

        await testDatabase();

    }
);