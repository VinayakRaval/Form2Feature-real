const { pool } = require("../config/db");


// ============================================
// GET FARMER PROFILE
// ============================================

const getProfile = async (req, res) => {

    try {

        const [rows] = await pool.execute(
            `
            SELECT
                u.id AS user_id,
                u.full_name,
                u.email,
                u.mobile,

                f.id AS farmer_id,

                fp.village,
                fp.district,
                fp.state,
                fp.farm_size,
                fp.farm_size_unit,
                fp.farming_type,
                fp.crops_grown,
                fp.latitude,
                fp.longitude,
                fp.profile_photo

            FROM users u

            INNER JOIN farmers f
                ON f.user_id = u.id

            LEFT JOIN farmer_profiles fp
                ON fp.farmer_id = f.id

            WHERE u.id = ?
            `,
            [req.user.id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Farmer profile not found"
            });

        }

        res.json({
            success: true,
            profile: rows[0]
        });

    } catch (error) {

        console.error(
            "Get Farmer Profile Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load farmer profile"
        });

    }
};


// ============================================
// UPDATE FARMER PROFILE
// ============================================

const updateProfile = async (req, res) => {

    try {

        const {
            full_name,
            mobile,
            village,
            district,
            state,
            farm_size,
            farm_size_unit,
            farming_type,
            crops_grown,
            latitude,
            longitude
        } = req.body;


        // Find farmer
        const [farmers] = await pool.execute(
            `
            SELECT id
            FROM farmers
            WHERE user_id = ?
            `,
            [req.user.id]
        );


        if (farmers.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Farmer not found"
            });

        }


        const farmerId = farmers[0].id;


        // Update user information

        await pool.execute(
            `
            UPDATE users

            SET
                full_name = ?,
                mobile = ?

            WHERE id = ?
            `,
            [
                full_name,
                mobile,
                req.user.id
            ]
        );


        // Profile photo

        let profilePhoto = null;

        if (req.file) {

            profilePhoto =
                `/uploads/profiles/${req.file.filename}`;

        }


        // Insert/update profile

        await pool.execute(
            `
            INSERT INTO farmer_profiles
            (
                farmer_id,
                village,
                district,
                state,
                farm_size,
                farm_size_unit,
                farming_type,
                crops_grown,
                latitude,
                longitude,
                profile_photo
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            ON DUPLICATE KEY UPDATE

                village = VALUES(village),
                district = VALUES(district),
                state = VALUES(state),
                farm_size = VALUES(farm_size),
                farm_size_unit = VALUES(farm_size_unit),
                farming_type = VALUES(farming_type),
                crops_grown = VALUES(crops_grown),
                latitude = VALUES(latitude),
                longitude = VALUES(longitude),

                profile_photo =
                    COALESCE(
                        VALUES(profile_photo),
                        profile_photo
                    )
            `,
            [
                farmerId,
                village || null,
                district || null,
                state || "Karnataka",
                farm_size || null,
                farm_size_unit || "acre",
                farming_type || null,
                crops_grown || null,
                latitude || null,
                longitude || null,
                profilePhoto
            ]
        );


        res.json({
            success: true,
            message: "Profile updated successfully"
        });


    } catch (error) {

        console.error(
            "Update Farmer Profile Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });

    }
};


module.exports = {
    getProfile,
    updateProfile
};