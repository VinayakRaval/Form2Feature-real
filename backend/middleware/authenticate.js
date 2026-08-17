const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

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

        const token = authHeader
            .substring(7)
            .trim();

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                success: false,
                message: "JWT configuration error"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        console.log(
            "Authenticated:",
            req.user.id,
            req.user.role
        );

        next();

    } catch (error) {

        console.error(
            "JWT ERROR:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticate;