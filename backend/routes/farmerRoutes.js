const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { pool } = require("../config/db");

const profileUpload = require("../middleware/profileUploadMiddleware");

const router = express.Router();


// =====================================================
// GET FARMER PROFILE
// =====================================================

router.get(
    "/profile",
    authenticate,
    authorizeRoles("farmer"),

    async (req, res) => {

        try {

            const [rows] = await pool.execute(
                `
                SELECT
                    u.id,
                    u.full_name,
                    u.email,
                    u.mobile,
                    u.role,
                    u.profile_photo,

                    f.id AS farmer_id,
                    f.address,
                    f.village,
                    f.district,
                    f.state,
                    f.pincode,
                    f.farm_size,
                    f.farm_size_unit,
                    f.farming_type,
                    f.crops_grown,
                    f.latitude,
                    f.longitude

                FROM users u

                LEFT JOIN farmers f
                    ON u.id = f.user_id

                WHERE u.id = ?
                `,
                [req.user.id]
            );


            if (rows.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Farmer not found"
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
                message: "Failed to fetch farmer profile",
                error: error.message
            });

        }

    }
);


// =====================================================
// UPDATE FARMER PROFILE
// =====================================================

router.put(
    "/profile",
    authenticate,
    authorizeRoles("farmer"),

    profileUpload.single("profile_photo"),

    async (req, res) => {

        try {

            console.log(
                "Updating farmer:",
                req.user.id
            );

            console.log(
                "Profile data:",
                req.body
            );


            // =========================================
            // GET FORM DATA
            // =========================================

            const {
                full_name,
                mobile,

                address,
                village,
                district,
                state,
                pincode,

                farm_size,
                farm_size_unit,

                farming_type,
                crops_grown,

                latitude,
                longitude

            } = req.body;


            // =========================================
            // UPDATE USERS TABLE
            // =========================================

            await pool.execute(
                `
                UPDATE users

                SET
                    full_name = ?,
                    mobile = ?

                WHERE id = ?
                `,
                [
                    full_name || null,
                    mobile || null,
                    req.user.id
                ]
            );


            // =========================================
            // PROFILE PHOTO
            // =========================================

            if (req.file) {

                const profilePhoto =
                    `/uploads/profiles/${req.file.filename}`;


                await pool.execute(
                    `
                    UPDATE users

                    SET profile_photo = ?

                    WHERE id = ?
                    `,
                    [
                        profilePhoto,
                        req.user.id
                    ]
                );

            }


            // =========================================
            // CHECK FARMER RECORD
            // =========================================

            const [farmerRows] =
                await pool.execute(
                    `
                    SELECT id

                    FROM farmers

                    WHERE user_id = ?
                    `,
                    [req.user.id]
                );


            // =========================================
            // CREATE FARMER RECORD IF MISSING
            // =========================================

            if (farmerRows.length === 0) {

                await pool.execute(
                    `
                    INSERT INTO farmers (
                        user_id
                    )

                    VALUES (?)
                    `,
                    [req.user.id]
                );

            }


            // =========================================
            // UPDATE FARMER TABLE
            // =========================================

            const [result] =
                await pool.execute(
                    `
                    UPDATE farmers

                    SET
                        address = ?,
                        village = ?,
                        district = ?,
                        state = ?,
                        pincode = ?,
                        farm_size = ?,
                        farm_size_unit = ?,
                        farming_type = ?,
                        crops_grown = ?,
                        latitude = ?,
                        longitude = ?

                    WHERE user_id = ?
                    `,
                    [

                        address || null,

                        village || null,

                        district || null,

                        state || null,

                        pincode || null,

                        farm_size || null,

                        farm_size_unit || "acres",

                        farming_type || null,

                        crops_grown || null,

                        latitude || null,

                        longitude || null,

                        req.user.id

                    ]
                );


            // =========================================
            // CHECK UPDATE
            // =========================================

            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Farmer profile could not be updated"

                });

            }


            // =========================================
            // SUCCESS
            // =========================================

            res.json({

                success: true,

                message:
                    "Farmer profile updated successfully"

            });


        } catch (error) {

            console.error(
                "Update Farmer Profile Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to update farmer profile",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;