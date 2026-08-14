const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;

        console.log("========== JWT DEBUG ==========");
        console.log(
            "Authorization header:",
            authHeader ? "FOUND" : "MISSING"
        );

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Authorization token required"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const token =
            authHeader.substring(7).trim();

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Authorization token required"
            });
        }

        console.log(
            "Token received:",
            token.substring(0, 20) + "..."
        );

        console.log(
            "JWT_SECRET exists:",
            !!process.env.JWT_SECRET
        );

        // ==========================================
        // VERIFY TOKEN
        // ==========================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log(
            "JWT decoded:",
            decoded
        );

        req.user = decoded;

        console.log(
            "Authenticated user:",
            req.user.id,
            req.user.role
        );

        console.log(
            "================================"
        );

        next();

    } catch (error) {

        console.error(
            "========== JWT ERROR =========="
        );

        console.error(
            "Name:",
            error.name
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "================================"
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticate;