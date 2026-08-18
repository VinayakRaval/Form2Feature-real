const { pool } = require("../config/db");

// ============================================================
// HELPER
// ============================================================

function getBuyerId(req) {
    return Number(
        req.user?.id ||
        req.user?.user_id ||
        req.user?.userId
    );
}

// ============================================================
// CREATE BUYER OFFER
// POST /api/buyer/offers
// ============================================================

const createBuyerOffer = async (req, res) => {
    try {
        console.log("================================");
        console.log("CREATE BUYER OFFER");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);
        console.log("================================");

        // ------------------------------------------------------
        // AUTHENTICATION
        // ------------------------------------------------------

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        const buyerId = getBuyerId(req);

        if (!buyerId || !Number.isInteger(buyerId)) {
            return res.status(401).json({
                success: false,
                message: "Invalid buyer authentication"
            });
        }

        // ------------------------------------------------------
        // REQUEST DATA
        // ------------------------------------------------------

        const {
            crop_id,
            quantity,
            offered_price,
            message
        } = req.body;

        const cropId = Number(crop_id);
        const offerQuantity = Number(quantity);
        const offeredPrice = Number(offered_price);

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        if (
            !Number.isInteger(cropId) ||
            cropId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid crop ID is required"
            });
        }

        if (
            !Number.isFinite(offerQuantity) ||
            offerQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            });
        }

        if (
            !Number.isFinite(offeredPrice) ||
            offeredPrice <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid offered price is required"
            });
        }

        // ------------------------------------------------------
        // GET CROP
        // ------------------------------------------------------

        const [cropRows] = await pool.execute(
            `
            SELECT
                id,
                farmer_id,
                crop_name,
                crop_variety,
                quantity,
                quantity_unit,
                expected_price,
                status
            FROM crops
            WHERE id = ?
            LIMIT 1
            `,
            [cropId]
        );

        if (!cropRows || cropRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        const crop = cropRows[0];

        // ------------------------------------------------------
        // CHECK STATUS
        // ------------------------------------------------------

        if (
            crop.status &&
            String(crop.status).toLowerCase() !== "available"
        ) {
            return res.status(400).json({
                success: false,
                message: "This crop is no longer available"
            });
        }

        // ------------------------------------------------------
        // CHECK QUANTITY
        // ------------------------------------------------------

        const availableQuantity = Number(
            crop.quantity
        );

        if (
            !Number.isFinite(availableQuantity) ||
            availableQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "This crop has no available quantity"
            });
        }

        if (offerQuantity > availableQuantity) {
            return res.status(400).json({
                success: false,
                message:
                    `Maximum available quantity is ${availableQuantity.toFixed(2)} ${crop.quantity_unit || "kg"}.`
            });
        }

        // ------------------------------------------------------
        // IMPORTANT
        //
        // farmer_id in crops is a FARMER PROFILE ID.
        // req.user.id is a USER ID.
        //
        // So DO NOT compare:
        //
        // crop.farmer_id === buyerId
        //
        // because they belong to different tables.
        // ------------------------------------------------------

        // ------------------------------------------------------
        // CHECK EXISTING PENDING OFFER
        // ------------------------------------------------------

        const [existingOffers] = await pool.execute(
            `
            SELECT
                id,
                status
            FROM buyer_offers
            WHERE buyer_id = ?
              AND crop_id = ?
              AND status = 'pending'
            LIMIT 1
            `,
            [
                buyerId,
                cropId
            ]
        );

        if (
            existingOffers &&
            existingOffers.length > 0
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "You already have a pending offer for this crop",
                offer_id: existingOffers[0].id
            });
        }

        // ------------------------------------------------------
        // CREATE OFFER
        // ------------------------------------------------------

        const [result] = await pool.execute(
            `
            INSERT INTO buyer_offers
            (
                buyer_id,
                crop_id,
                offered_price,
                quantity,
                message,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'pending')
            `,
            [
                buyerId,
                cropId,
                offeredPrice,
                offerQuantity,
                message &&
                String(message).trim()
                    ? String(message).trim()
                    : null
            ]
        );

        console.log(
            "BUYER OFFER CREATED:",
            result.insertId
        );

        return res.status(201).json({
            success: true,
            message: "Buyer offer created successfully",
            offer_id: result.insertId
        });

    } catch (error) {
        console.error(
            "================================"
        );

        console.error(
            "CREATE BUYER OFFER ERROR:",
            error
        );

        console.error(
            "================================"
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create buyer offer",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};

// ============================================================
// GET ALL BUYER OFFERS
// GET /api/buyer/offers
// ============================================================

const getBuyerOffers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        const buyerId = getBuyerId(req);

        const [rows] = await pool.execute(
            `
            SELECT
                bo.id,
                bo.buyer_id,
                bo.crop_id,
                bo.offered_price,
                bo.quantity,
                bo.message,
                bo.status,
                bo.created_at,
                bo.updated_at,

                c.crop_name,
                c.crop_variety,
                c.quantity_unit,
                c.expected_price,
                c.image,
                c.harvest_date,

                f.id AS farmer_id,

                u.full_name AS farmer_name,
                u.mobile AS farmer_mobile,
                u.email AS farmer_email

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            LEFT JOIN farmers f
                ON c.farmer_id = f.id

            LEFT JOIN users u
                ON f.user_id = u.id

            WHERE bo.buyer_id = ?

            ORDER BY bo.created_at DESC
            `,
            [buyerId]
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            offers: rows
        });

    } catch (error) {
        console.error(
            "GET BUYER OFFERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching offers",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};

// ============================================================
// GET MY BUYER OFFERS
// GET /api/buyer/offers/my
// ============================================================

const getMyBuyerOffers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        const buyerId = getBuyerId(req);

        console.log("======================================");
        console.log("GET MY BUYER OFFERS");
        console.log("BUYER ID:", buyerId);
        console.log("======================================");

        const [rows] = await pool.execute(
            `
            SELECT
                bo.id,
                bo.buyer_id,
                bo.crop_id,
                bo.offered_price,
                bo.quantity,
                bo.message,
                bo.status,
                bo.created_at,
                bo.updated_at,

                c.crop_name,
                c.crop_variety,
                c.quantity_unit,
                c.expected_price,
                c.image,
                c.harvest_date,

                f.id AS farmer_id,

                u.full_name AS farmer_name,
                u.mobile AS farmer_mobile,
                u.email AS farmer_email

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            LEFT JOIN farmers f
                ON c.farmer_id = f.id

            LEFT JOIN users u
                ON f.user_id = u.id

            WHERE bo.buyer_id = ?

            ORDER BY bo.created_at DESC
            `,
            [buyerId]
        );

        console.log(
            "MY OFFERS:",
            rows.length
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            offers: rows
        });

    } catch (error) {
        console.error(
            "GET MY BUYER OFFERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching offers",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};

// ============================================================
// GET SINGLE BUYER OFFER
// GET /api/buyer/offers/:id
// ============================================================

const getBuyerOfferById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        const buyerId = getBuyerId(req);
        const offerId = Number(req.params.id);

        if (
            !Number.isInteger(offerId) ||
            offerId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid offer ID"
            });
        }

        const [rows] = await pool.execute(
            `
            SELECT
                bo.id,
                bo.buyer_id,
                bo.crop_id,
                bo.offered_price,
                bo.quantity,
                bo.message,
                bo.status,
                bo.created_at,
                bo.updated_at,

                c.crop_name,
                c.crop_variety,
                c.quantity AS crop_quantity,
                c.quantity_unit,
                c.expected_price,
                c.quality,
                c.description,
                c.image,
                c.harvest_date,

                f.id AS farmer_id,

                u.full_name AS farmer_name,
                u.mobile AS farmer_mobile,
                u.email AS farmer_email

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            LEFT JOIN farmers f
                ON c.farmer_id = f.id

            LEFT JOIN users u
                ON f.user_id = u.id

            WHERE bo.id = ?
              AND bo.buyer_id = ?

            LIMIT 1
            `,
            [
                offerId,
                buyerId
            ]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Buyer offer not found"
            });
        }

        return res.status(200).json({
            success: true,
            offer: rows[0]
        });

    } catch (error) {
        console.error(
            "GET BUYER OFFER BY ID ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching offer",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};

// ============================================================
// UPDATE BUYER OFFER STATUS
// PATCH /api/buyer/offers/:id/status
// ============================================================

const updateBuyerOfferStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        const buyerId = getBuyerId(req);
        const offerId = Number(req.params.id);

        const status = String(
            req.body?.status || ""
        )
            .trim()
            .toLowerCase();

        if (
            !Number.isInteger(offerId) ||
            offerId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid offer ID"
            });
        }

        const allowedStatuses = [
            "pending",
            "accepted",
            "rejected",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid status. Allowed values: pending, accepted, rejected, cancelled"
            });
        }

        const [result] = await pool.execute(
            `
            UPDATE buyer_offers
            SET status = ?
            WHERE id = ?
              AND buyer_id = ?
            `,
            [
                status,
                offerId,
                buyerId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Offer status updated successfully"
        });

    } catch (error) {
        console.error(
            "UPDATE BUYER OFFER STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while updating offer status",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};

// ============================================================
// CANCEL BUYER OFFER
// PATCH /api/buyer/offers/:id/cancel
// ============================================================

const cancelBuyerOffer = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access required"
            });
        }

        const buyerId = getBuyerId(req);
        const offerId = Number(req.params.id);

        if (
            !Number.isInteger(offerId) ||
            offerId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid offer ID"
            });
        }

        const [result] = await pool.execute(
            `
            UPDATE buyer_offers
            SET status = 'cancelled'
            WHERE id = ?
              AND buyer_id = ?
              AND status = 'pending'
            `,
            [
                offerId,
                buyerId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Offer not found or cannot be cancelled"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Offer cancelled successfully"
        });

    } catch (error) {
        console.error(
            "CANCEL BUYER OFFER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while cancelling offer",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createBuyerOffer,
    getBuyerOffers,
    getMyBuyerOffers,
    getBuyerOfferById,
    updateBuyerOfferStatus,
    cancelBuyerOffer
};