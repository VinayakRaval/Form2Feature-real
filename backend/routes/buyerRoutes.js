const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const {
    getBuyerProfile,
    updateBuyerProfile,
    uploadBuyerProfilePhoto
} = require("../controllers/buyerController");

const upload = require("../middleware/upload");

const { pool } = require("../config/db");


// ============================================================
// BUYER PROFILE
// ============================================================

// GET /api/buyer/profile
router.get(
    "/profile",
    authenticate,
    getBuyerProfile
);


// PUT /api/buyer/profile
router.put(
    "/profile",
    authenticate,
    updateBuyerProfile
);


// POST /api/buyer/profile/photo
router.post(
    "/profile/photo",
    authenticate,
    upload.single("profile_photo"),
    uploadBuyerProfilePhoto
);


// ============================================================
// BUYER TRANSACTIONS
// GET /api/buyer/transactions
// ============================================================

router.get(
    "/transactions",
    authenticate,
    async (req, res) => {

        try {

            console.log("======================================");
            console.log("GET BUYER TRANSACTIONS");
            console.log("USER:", req.user);
            console.log("======================================");


            // ----------------------------------------------------
            // AUTHENTICATION
            // ----------------------------------------------------

            if (!req.user) {

                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });

            }


            // ----------------------------------------------------
            // BUYER ROLE
            // ----------------------------------------------------

            if (
                req.user.role &&
                String(req.user.role).toLowerCase() !== "buyer"
            ) {

                return res.status(403).json({
                    success: false,
                    message: "Buyer access required"
                });

            }


            // ----------------------------------------------------
            // BUYER ID
            // ----------------------------------------------------

            const buyerId = Number(
                req.user.id ||
                req.user.user_id
            );


            if (
                !Number.isInteger(buyerId) ||
                buyerId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid buyer ID"
                });

            }


            console.log(
                "BUYER ID:",
                buyerId
            );


            // ====================================================
            // IMPORTANT DATABASE RELATIONSHIP
            //
            // deals.buyer_id  -> users.id
            //
            // deals.farmer_id -> farmers.id
            //
            // farmers.user_id -> users.id
            //
            // deals.crop_id   -> crops.id
            //
            // payments.farmer_id -> farmers.id
            // ====================================================


            const sql = `

                SELECT

                    /* ==========================================
                       PAYMENT
                    ========================================== */

                    p.id AS payment_id,

                    p.transaction_id,

                    p.payment_method,

                    p.amount,

                    p.status AS payment_status,

                    p.payment_date,


                    /* ==========================================
                       DEAL
                    ========================================== */

                    d.id AS deal_id,

                    d.offer_id,

                    d.buyer_id,

                    d.farmer_id,

                    d.crop_id,

                    d.quantity AS deal_quantity,

                    d.agreed_price,

                    d.status AS deal_status,

                    d.created_at AS deal_created_at,


                    /* ==========================================
                       CROP
                    ========================================== */

                    c.id AS crop_id,

                    c.crop_name,

                    c.crop_variety,

                    c.quantity AS crop_quantity,

                    c.quantity_unit,

                    c.quality,

                    c.expected_price,


                    /* ==========================================
                       FARMER
                    ========================================== */

                    f.id AS farmer_id,

                    f.user_id AS farmer_user_id,

                    f.address AS farmer_address,

                    f.village AS farmer_village,

                    f.district AS farmer_district,

                    f.state AS farmer_state,

                    f.pincode AS farmer_pincode,


                    /* ==========================================
                       FARMER USER ACCOUNT
                    ========================================== */

                    fu.id AS farmer_user_id,

                    fu.full_name AS farmer_name,

                    fu.email AS farmer_email,

                    fu.mobile AS farmer_mobile,

                    fu.profile_photo AS farmer_profile_photo,


                    /* ==========================================
                       FARMER PROFILE
                    ========================================== */

                    fp.village AS profile_village,

                    fp.district AS profile_district,

                    fp.state AS profile_state,

                    fp.farm_size,

                    fp.farm_size_unit,

                    fp.farming_type,

                    fp.crops_grown,

                    fp.profile_photo AS profile_photo


                FROM payments p


                /* ==========================================
                   DEAL
                ========================================== */

                INNER JOIN deals d

                    ON d.id = p.deal_id


                /* ==========================================
                   CROP
                ========================================== */

                LEFT JOIN crops c

                    ON c.id = d.crop_id


                /* ==========================================
                   FARMER
                ========================================== */

                LEFT JOIN farmers f

                    ON f.id = COALESCE(
                        p.farmer_id,
                        d.farmer_id
                    )


                /* ==========================================
                   FARMER USER
                ========================================== */

                LEFT JOIN users fu

                    ON fu.id = f.user_id


                /* ==========================================
                   FARMER PROFILE
                ========================================== */

                LEFT JOIN farmer_profiles fp

                    ON fp.farmer_id = f.id


                /* ==========================================
                   BUYER
                ========================================== */

                WHERE d.buyer_id = ?


                ORDER BY
                    p.payment_date DESC,
                    p.id DESC

            `;


            const [rows] =
                await pool.execute(
                    sql,
                    [buyerId]
                );


            console.log(
                "TRANSACTIONS FOUND:",
                rows.length
            );


            console.log(
                "TRANSACTIONS:",
                rows
            );


            // ----------------------------------------------------
            // SUCCESS
            // ----------------------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Buyer transactions fetched successfully",

                count: rows.length,

                transactions: rows,

                data: rows

            });


        } catch (error) {

            console.error(
                "======================================"
            );

            console.error(
                "GET BUYER TRANSACTIONS ERROR"
            );

            console.error(error);

            console.error(
                "======================================"
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load buyer transactions",

                error: error.message

            });

        }

    }
);


module.exports = router;