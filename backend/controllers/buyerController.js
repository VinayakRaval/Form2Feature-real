const { pool } = require("../config/db");

// ============================================================
// GET BUYER PROFILE
// ============================================================

const getBuyerProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        console.log("GET BUYER PROFILE:", userId);

        const [rows] = await pool.execute(
            `
            SELECT
                u.id,
                u.full_name,
                u.email,
                u.mobile,
                u.role,
                u.is_verified,
                u.profile_photo,

                bp.business_name,
                bp.buyer_type,
                bp.address,
                bp.city,
                bp.state,
                bp.pincode,
                bp.gst_number

            FROM users u

            LEFT JOIN buyer_profiles bp
                ON bp.user_id = u.id

            WHERE u.id = ?
            AND u.role = 'buyer'

            LIMIT 1
            `,
            [userId]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Buyer profile not found"
            });

        }

        const buyer = rows[0];

        res.json({
            success: true,
            user: buyer
        });

    } catch (error) {

        console.error(
            "GET BUYER PROFILE ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load buyer profile"
        });

    }
};


// ============================================================
// UPDATE BUYER PROFILE
// ============================================================

const updateBuyerProfile = async (req, res) => {

    const connection = await pool.getConnection();

    try {

        const userId = req.user.id;

        const {
            full_name,
            mobile,
            business_name,
            buyer_type,
            address,
            city,
            state,
            pincode,
            gst_number
        } = req.body;

        console.log(
            "UPDATE BUYER PROFILE:",
            userId
        );

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!full_name || !full_name.trim()) {

            connection.release();

            return res.status(400).json({
                success: false,
                message: "Full name is required"
            });

        }

        if (!mobile || !mobile.trim()) {

            connection.release();

            return res.status(400).json({
                success: false,
                message: "Mobile number is required"
            });

        }

        if (!/^[0-9]{10}$/.test(mobile.trim())) {

            connection.release();

            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid 10-digit mobile number"
            });

        }

        if (
            pincode &&
            pincode.trim() &&
            !/^[0-9]{6}$/.test(pincode.trim())
        ) {

            connection.release();

            return res.status(400).json({
                success: false,
                message: "Pincode must contain 6 digits"
            });

        }

        // =====================================================
        // CHECK USER
        // =====================================================

        const [users] = await connection.execute(
            `
            SELECT id, role
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [userId]
        );

        if (users.length === 0) {

            connection.release();

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        if (users[0].role !== "buyer") {

            connection.release();

            return res.status(403).json({
                success: false,
                message: "This account is not a buyer account"
            });

        }

        // =====================================================
        // START TRANSACTION
        // =====================================================

        await connection.beginTransaction();

        // =====================================================
        // UPDATE USERS
        // =====================================================

        await connection.execute(
            `
            UPDATE users
            SET
                full_name = ?,
                mobile = ?
            WHERE id = ?
            `,
            [
                full_name.trim(),
                mobile.trim(),
                userId
            ]
        );

        // =====================================================
        // CHECK BUYER PROFILE
        // =====================================================

        const [existingProfile] =
            await connection.execute(
                `
                SELECT id
                FROM buyer_profiles
                WHERE user_id = ?
                LIMIT 1
                `,
                [userId]
            );

        // =====================================================
        // INSERT OR UPDATE BUYER PROFILE
        // =====================================================

        if (existingProfile.length === 0) {

            await connection.execute(
                `
                INSERT INTO buyer_profiles
                (
                    user_id,
                    business_name,
                    buyer_type,
                    address,
                    city,
                    state,
                    pincode,
                    gst_number
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    userId,
                    business_name?.trim() || null,
                    buyer_type || "Individual",
                    address?.trim() || null,
                    city?.trim() || null,
                    state?.trim() || null,
                    pincode?.trim() || null,
                    gst_number?.trim() || null
                ]
            );

        } else {

            await connection.execute(
                `
                UPDATE buyer_profiles
                SET
                    business_name = ?,
                    buyer_type = ?,
                    address = ?,
                    city = ?,
                    state = ?,
                    pincode = ?,
                    gst_number = ?
                WHERE user_id = ?
                `,
                [
                    business_name?.trim() || null,
                    buyer_type || "Individual",
                    address?.trim() || null,
                    city?.trim() || null,
                    state?.trim() || null,
                    pincode?.trim() || null,
                    gst_number?.trim() || null,
                    userId
                ]
            );

        }

        // =====================================================
        // COMMIT
        // =====================================================

        await connection.commit();

        // =====================================================
        // GET UPDATED PROFILE
        // =====================================================

        const [updatedRows] =
            await connection.execute(
                `
                SELECT
                    u.id,
                    u.full_name,
                    u.email,
                    u.mobile,
                    u.role,
                    u.is_verified,
                    u.profile_photo,

                    bp.business_name,
                    bp.buyer_type,
                    bp.address,
                    bp.city,
                    bp.state,
                    bp.pincode,
                    bp.gst_number

                FROM users u

                LEFT JOIN buyer_profiles bp
                    ON bp.user_id = u.id

                WHERE u.id = ?

                LIMIT 1
                `,
                [userId]
            );

        connection.release();

        res.json({
            success: true,
            message: "Buyer profile updated successfully",
            user: updatedRows[0]
        });

    } catch (error) {

        await connection.rollback();

        connection.release();

        console.error(
            "UPDATE BUYER PROFILE ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update buyer profile"
        });

    }

};


// ============================================================
// UPLOAD BUYER PROFILE PHOTO
// ============================================================

const uploadBuyerProfilePhoto = async (req, res) => {

    try {

        const userId = req.user.id;

        console.log(
            "UPLOAD BUYER PHOTO:",
            userId
        );

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Profile photo is required"
            });

        }

        // =====================================================
        // FILE PATH
        // =====================================================

        const profilePhoto =
            `/uploads/profiles/${req.file.filename}`;

        // =====================================================
        // UPDATE USERS
        // =====================================================

        await pool.execute(
            `
            UPDATE users
            SET profile_photo = ?
            WHERE id = ?
            AND role = 'buyer'
            `,
            [
                profilePhoto,
                userId
            ]
        );

        // =====================================================
        // GET UPDATED USER
        // =====================================================

        const [rows] =
            await pool.execute(
                `
                SELECT
                    u.id,
                    u.full_name,
                    u.email,
                    u.mobile,
                    u.role,
                    u.is_verified,
                    u.profile_photo,

                    bp.business_name,
                    bp.buyer_type,
                    bp.address,
                    bp.city,
                    bp.state,
                    bp.pincode,
                    bp.gst_number

                FROM users u

                LEFT JOIN buyer_profiles bp
                    ON bp.user_id = u.id

                WHERE u.id = ?

                LIMIT 1
                `,
                [userId]
            );

        res.json({
            success: true,
            message: "Profile photo uploaded successfully",
            user: rows[0]
        });

    } catch (error) {

        console.error(
            "BUYER PHOTO UPLOAD ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to upload profile photo"
        });

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getBuyerProfile,
    updateBuyerProfile,
    uploadBuyerProfilePhoto
};