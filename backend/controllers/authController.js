const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// ============================================================
// REGISTER USER
// Supports:
// farmer
// buyer
// ============================================================

const registerUser = async (req, res) => {
    try {
        const {
            full_name,
            email,
            mobile,
            password,
            role
        } = req.body;

        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            !full_name ||
            !email ||
            !mobile ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // ----------------------------------------------------
        // NORMALIZE ROLE
        // ----------------------------------------------------

        const userRole =
            String(role || "farmer")
                .trim()
                .toLowerCase();

        // Only these two roles are allowed
        if (
            userRole !== "farmer" &&
            userRole !== "buyer"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Choose farmer or buyer."
            });
        }

        // ----------------------------------------------------
        // CHECK EXISTING USER
        // ----------------------------------------------------

        const [existingUser] =
            await pool.execute(
                `SELECT id
                 FROM users
                 WHERE email = ?
                    OR mobile = ?`,
                [
                    email.trim(),
                    mobile.trim()
                ]
            );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Email or mobile number already registered"
            });
        }

        // ----------------------------------------------------
        // HASH PASSWORD
        // ----------------------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // ----------------------------------------------------
        // CREATE USER
        // ----------------------------------------------------

        const [result] =
            await pool.execute(
                `INSERT INTO users
                (
                    full_name,
                    email,
                    mobile,
                    password,
                    role
                )
                VALUES (?, ?, ?, ?, ?)`,
                [
                    full_name.trim(),
                    email.trim(),
                    mobile.trim(),
                    hashedPassword,
                    userRole
                ]
            );

        const userId =
            result.insertId;

        // ----------------------------------------------------
        // CREATE FARMER RECORD ONLY FOR FARMERS
        // ----------------------------------------------------

        if (userRole === "farmer") {

            await pool.execute(
                `INSERT INTO farmers
                (user_id)
                VALUES (?)`,
                [userId]
            );

        }

        // ----------------------------------------------------
        // BUYERS DO NOT GO INTO farmers TABLE
        // ----------------------------------------------------

        return res.status(201).json({
            success: true,

            message:
                userRole === "farmer"
                    ? "Farmer registered successfully"
                    : "Buyer registered successfully",

            userId,

            role: userRole
        });

    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during registration"
        });
    }
};


// ============================================================
// REGISTER FARMER
// ============================================================

const registerFarmer = async (req, res) => {

    req.body.role = "farmer";

    return registerUser(
        req,
        res
    );
};


// ============================================================
// REGISTER BUYER
// ============================================================

const registerBuyer = async (req, res) => {

    req.body.role = "buyer";

    return registerUser(
        req,
        res
    );
};


// ============================================================
// LOGIN
// ============================================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });

        }

        // ----------------------------------------------------
        // FIND USER
        // ----------------------------------------------------

        const [users] =
            await pool.execute(
                `SELECT
                    id,
                    full_name,
                    email,
                    mobile,
                    password,
                    role,
                    is_verified,
                    profile_photo
                 FROM users
                 WHERE email = ?`,
                [
                    email.trim()
                ]
            );

        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });

        }

        const user =
            users[0];

        // ----------------------------------------------------
        // CHECK PASSWORD
        // ----------------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });

        }

        // ----------------------------------------------------
        // NORMALIZE ROLE
        // ----------------------------------------------------

        const userRole =
            String(user.role || "")
                .trim()
                .toLowerCase();

        // ----------------------------------------------------
        // ONLY FARMER / BUYER
        // ----------------------------------------------------

        if (
            userRole !== "farmer" &&
            userRole !== "buyer"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Invalid user role"
            });

        }

        // ----------------------------------------------------
        // CREATE JWT
        // ----------------------------------------------------

        const token =
            jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: userRole
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

        // ----------------------------------------------------
        // NEVER SEND PASSWORD
        // ----------------------------------------------------

        delete user.password;

        // Make sure frontend receives normalized role
        user.role =
            userRole;

        // ----------------------------------------------------
        // RESPONSE
        // ----------------------------------------------------

        return res.json({
            success: true,
            message:
                "Login successful",

            token,

            user
        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during login"
        });

    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    registerUser,
    registerFarmer,
    registerBuyer,
    login

};