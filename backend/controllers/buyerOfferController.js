const { pool } = require("../config/db");

// ============================================================
// CREATE BUYER OFFER
// POST /api/buyer/offers
// ============================================================

const createBuyerOffer = async (req, res) => {
    try {
        console.log("======================================");
        console.log("CREATE BUYER OFFER");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);

        // --------------------------------------------------------
        // AUTHENTICATION
        // --------------------------------------------------------

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // --------------------------------------------------------
        // BUYER ROLE
        // --------------------------------------------------------

        if (req.user.role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can create offers"
            });
        }

        // --------------------------------------------------------
        // BUYER ID
        // --------------------------------------------------------

        const buyerId = Number(req.user.id);

        if (!Number.isInteger(buyerId) || buyerId <= 0) {
            console.error("INVALID BUYER ID:", req.user.id);

            return res.status(401).json({
                success: false,
                message: "Invalid buyer authentication"
            });
        }

        // --------------------------------------------------------
        // REQUEST DATA
        // --------------------------------------------------------

        const {
            crop_id,
            offered_price,
            quantity,
            message
        } = req.body;

        const cropId = Number(crop_id);
        const offeredPrice = Number(offered_price);
        const offerQuantity = Number(quantity);

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

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
            !Number.isFinite(offeredPrice) ||
            offeredPrice <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid offered price is required"
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

        // --------------------------------------------------------
        // GET CROP
        // --------------------------------------------------------

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

        if (cropRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        const crop = cropRows[0];

        // --------------------------------------------------------
        // CROP STATUS
        // --------------------------------------------------------

        if (crop.status !== "available") {
            return res.status(400).json({
                success: false,
                message: "This crop is no longer available"
            });
        }

        // --------------------------------------------------------
        // QUANTITY CHECK
        // --------------------------------------------------------

        const availableQuantity =
            Number(crop.quantity);

        if (offerQuantity > availableQuantity) {
            return res.status(400).json({
                success: false,
                message:
                    `Maximum available quantity is ${availableQuantity} ${crop.quantity_unit || "kg"}`
            });
        }

        // --------------------------------------------------------
        // DON'T ALLOW FARMER TO BUY OWN CROP
        // --------------------------------------------------------

        if (Number(crop.farmer_id) === buyerId) {
            return res.status(400).json({
                success: false,
                message: "You cannot make an offer on your own crop"
            });
        }

        // --------------------------------------------------------
        // CHECK EXISTING PENDING OFFER
        // --------------------------------------------------------

        const [existingOffers] = await pool.execute(
            `
            SELECT id
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

        if (existingOffers.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "You already have a pending offer for this crop"
            });
        }

        // --------------------------------------------------------
        // CREATE OFFER
        // --------------------------------------------------------

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
                message && String(message).trim()
                    ? String(message).trim()
                    : null
            ]
        );

        console.log(
            "OFFER CREATED:",
            result.insertId
        );

        console.log("======================================");

        return res.status(201).json({
            success: true,
            message: "Offer sent successfully",
            offer: {
                id: result.insertId,
                buyer_id: buyerId,
                crop_id: cropId,
                offered_price: offeredPrice,
                quantity: offerQuantity,
                message:
                    message && String(message).trim()
                        ? String(message).trim()
                        : null,
                status: "pending"
            }
        });

    } catch (error) {

        console.error("======================================");
        console.error("CREATE BUYER OFFER ERROR");
        console.error(error);
        console.error("SQL MESSAGE:", error.sqlMessage);
        console.error("SQL CODE:", error.code);
        console.error("======================================");

        return res.status(500).json({
            success: false,
            message: "Server error while creating offer",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};


// ============================================================
// GET MY OFFERS
// GET /api/buyer/offers
// ============================================================

const getMyBuyerOffers = async (req, res) => {
    try {
        console.log("======================================");
        console.log("GET MY BUYER OFFERS");
        console.log("USER:", req.user);

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

        const buyerId = Number(req.user.id);

        if (!Number.isInteger(buyerId) || buyerId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid buyer authentication"
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
                c.quantity_unit,
                c.expected_price,
                c.image,
                c.harvest_date,

                u.full_name AS farmer_name,
                u.mobile AS farmer_mobile

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            LEFT JOIN users u
                ON c.farmer_id = u.id

            WHERE bo.buyer_id = ?

            ORDER BY bo.created_at DESC
            `,
            [buyerId]
        );

        console.log(
            "MY OFFERS:",
            rows.length
        );

        console.log("======================================");

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
// CANCEL OFFER
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

        const buyerId = Number(req.user.id);
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
            "CANCEL OFFER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while cancelling offer"
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    createBuyerOffer,
    getMyBuyerOffers,
    cancelBuyerOffer
};