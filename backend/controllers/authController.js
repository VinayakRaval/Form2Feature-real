const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// =========================================
// REGISTER FARMER
// =========================================

const registerFarmer = async (req, res) => {
    try {
        const {
            full_name,
            email,
            mobile,
            password
        } = req.body;

        if (!full_name || !email || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const [existingUser] = await pool.execute(
            "SELECT id FROM users WHERE email = ? OR mobile = ?",
            [email, mobile]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email or mobile number already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            `INSERT INTO users
            (full_name, email, mobile, password, role)
            VALUES (?, ?, ?, ?, 'farmer')`,
            [
                full_name,
                email,
                mobile,
                hashedPassword
            ]
        );

        const userId = result.insertId;

        await pool.execute(
            `INSERT INTO farmers (user_id)
             VALUES (?)`,
            [userId]
        );

        res.status(201).json({
            success: true,
            message: "Farmer registered successfully",
            userId
        });

    } catch (error) {
        console.error("Registration Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

// =========================================
// LOGIN
// =========================================

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await pool.execute(
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
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        delete user.password;

        res.json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

module.exports = {
    registerFarmer,
    login
};