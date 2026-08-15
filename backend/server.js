const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ============================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ============================================================

dotenv.config();

// ============================================================
// DATABASE
// ============================================================

const { testDatabase } = require("./config/db");

// ============================================================
// CREATE APP
// ============================================================

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// CORS
// ============================================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// ============================================================
// BODY PARSER
// ============================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ============================================================
// STATIC UPLOADS
// ============================================================

const uploadsPath = path.join(
    __dirname,
    "uploads"
);

console.log(
    "Uploads directory:",
    uploadsPath
);

app.use(
    "/uploads",
    express.static(uploadsPath)
);

// ============================================================
// ROUTES
// ============================================================

const authRoutes =
    require("./routes/authRoutes");

const farmerRoutes =
    require("./routes/farmerRoutes");

const cropRoutes =
    require("./routes/cropRoutes");

const mandiRoutes =
    require("./routes/mandiRoutes");

const savedMandiRoutes =
    require("./routes/savedMandiRoutes");

const marketPriceRoutes =
    require("./routes/marketPriceRoutes");

const profitCalculatorRoutes =
    require("./routes/profitCalculatorRoutes");

// ============================================================
// API ROUTES
// ============================================================

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
    "/api/saved-mandis",
    savedMandiRoutes
);

app.use(
    "/api/market-prices",
    marketPriceRoutes
);

// ============================================================
// PROFIT CALCULATOR
// ============================================================
// POST   /api/profit-calculations
// GET    /api/profit-calculations
// DELETE /api/profit-calculations/:id
// ============================================================

app.use(
    "/api/profit-calculations",
    profitCalculatorRoutes
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,
            message: "Form2Feature API is running",
            version: "1.0.0"
        });

    }
);

// ============================================================
// API TEST
// ============================================================

app.get(
    "/api/test",
    (req, res) => {

        res.json({
            success: true,
            message: "API is working"
        });

    }
);

// ============================================================
// DATABASE TEST
// ============================================================

app.get(
    "/api/db-test",
    async (req, res) => {

        try {

            const { pool } =
                require("./config/db");

            const [rows] =
                await pool.execute(
                    "SELECT 1 AS test"
                );

            res.json({
                success: true,
                message:
                    "Database connection working",
                result: rows
            });

        } catch (error) {

            console.error(
                "Database test error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Database connection failed",
                error:
                    error.message
            });

        }

    }
);

// ============================================================
// UPLOAD TEST
// ============================================================

app.get(
    "/uploads-test",
    (req, res) => {

        res.json({
            success: true,
            message:
                "Upload server is working",

            uploads_url:
                `http://localhost:${PORT}/uploads`
        });

    }
);

// ============================================================
// 404 HANDLER
// ============================================================

app.use(
    (req, res) => {

        res.status(404).json({
            success: false,
            message:
                "API route not found",
            path:
                req.originalUrl
        });

    }
);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "GLOBAL ERROR:",
            err
        );

        res.status(
            err.status || 500
        ).json({

            success: false,

            message:
                err.message ||
                "Internal server error"

        });

    }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
    PORT,
    async () => {

        console.log("");

        console.log(
            "================================="
        );

        console.log(
            "       Form2Feature Backend"
        );

        console.log(
            "================================="
        );

        console.log(
            `🚀 Server: http://localhost:${PORT}`
        );

        console.log(
            `🔐 Auth API: http://localhost:${PORT}/api/auth`
        );

        console.log(
            `👨‍🌾 Farmer API: http://localhost:${PORT}/api/farmer`
        );

        console.log(
            `🌱 Crop API: http://localhost:${PORT}/api/crops`
        );

        console.log(
            `🏪 Mandi API: http://localhost:${PORT}/api/mandis`
        );

        console.log(
            `📍 Nearby Mandi API: http://localhost:${PORT}/api/mandis/nearby`
        );

        console.log(
            `💰 Market Price API: http://localhost:${PORT}/api/market-prices`
        );

        console.log(
            `💰 Profit Calculator API: http://localhost:${PORT}/api/profit-calculations`
        );

        console.log(
            `📸 Uploads: http://localhost:${PORT}/uploads`
        );

        console.log(
            "================================="
        );

        try {

            await testDatabase();

            console.log(
                "✅ Database test completed"
            );

        } catch (error) {

            console.error(
                "❌ Database test failed:",
                error.message
            );

        }

        console.log(
            "================================="
        );

    }
);