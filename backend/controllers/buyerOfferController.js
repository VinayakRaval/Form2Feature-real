const { pool } = require("../config/db");

// ============================================================
// CREATE BUYER OFFER
// POST /api/buyer/offers
// ============================================================

const createBuyerOffer = async (req, res) => {
    try {
        const buyerId = req.user.id;

        const {
            cropId,
            quantity,
            offeredPrice,
            message
        } = req.body;

        console.log("================================");
        console.log("CREATE BUYER OFFER");
        console.log("Buyer ID:", buyerId);
        console.log("Crop ID:", cropId);
        console.log("Quantity:", quantity);
        console.log("Offered Price:", offeredPrice);
        console.log("================================");

        // ----------------------------------------------------
        // Validate input
        // ----------------------------------------------------

        if (!cropId || !quantity || !offeredPrice) {
            return res.status(400).json({
                success: false,
                message: "Crop, quantity and offer price are required"
            });
        }

        const offerQuantity = Number(quantity);
        const offerPrice = Number(offeredPrice);

        if (offerQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        if (offerPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Offer price must be greater than 0"
            });
        }

        // ----------------------------------------------------
        // Get crop
        // ----------------------------------------------------

        const [crops] = await pool.query(
            `
            SELECT
                id,
                farmer_id,
                crop_name,
                quantity,
                quantity_unit,
                expected_price,
                status
            FROM crops
            WHERE id = ?
            `,
            [cropId]
        );

        if (crops.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        const crop = crops[0];

        // ----------------------------------------------------
        // Crop must be available
        // ----------------------------------------------------

        if (crop.status !== "available") {
            return res.status(400).json({
                success: false,
                message: "This crop is no longer available"
            });
        }

        // ----------------------------------------------------
        // Buyer cannot offer on own crop
        // ----------------------------------------------------

        if (Number(crop.farmer_id) === Number(buyerId)) {
            return res.status(400).json({
                success: false,
                message: "You cannot make an offer on your own crop"
            });
        }

        // ----------------------------------------------------
        // Quantity validation
        // ----------------------------------------------------

        if (offerQuantity > Number(crop.quantity)) {
            return res.status(400).json({
                success: false,
                message: `Maximum available quantity is ${Number(
                    crop.quantity
                ).toFixed(2)} ${crop.quantity_unit || "kg"}.`
            });
        }

        // ----------------------------------------------------
        // Check existing active offer
        // ----------------------------------------------------

        const [existingOffers] = await pool.query(
            `
            SELECT id, quantity, status
            FROM buyer_offers
            WHERE buyer_id = ?
              AND crop_id = ?
              AND status IN ('pending', 'accepted')
            `,
            [buyerId, cropId]
        );

        if (existingOffers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You already have an active offer for this crop"
            });
        }

        // ----------------------------------------------------
        // Create offer
        // ----------------------------------------------------

        const [result] = await pool.query(
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
                offerPrice,
                offerQuantity,
                message || null
            ]
        );

        console.log("✅ BUYER OFFER CREATED:", result.insertId);

        res.status(201).json({
            success: true,
            message: "Buyer offer created successfully",
            offer: {
                id: result.insertId,
                buyer_id: buyerId,
                crop_id: cropId,
                quantity: offerQuantity,
                offered_price: offerPrice,
                message: message || null,
                status: "pending"
            }
        });

    } catch (error) {
        console.error("CREATE BUYER OFFER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create buyer offer",
            error: error.message
        });
    }
};


// ============================================================
// GET ALL BUYER OFFERS
// GET /api/buyer/offers
// ============================================================

const getBuyerOffers = async (req, res) => {
    try {
        const buyerId = req.user.id;

        const [offers] = await pool.query(
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
                c.farmer_id,

                u.full_name AS farmer_name,
                u.mobile AS farmer_mobile

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            INNER JOIN users u
                ON c.farmer_id = u.id

            WHERE bo.buyer_id = ?

            ORDER BY bo.created_at DESC
            `,
            [buyerId]
        );

        res.json({
            success: true,
            offers
        });

    } catch (error) {
        console.error("GET BUYER OFFERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch buyer offers"
        });
    }
};


// ============================================================
// GET MY BUYER OFFERS
// GET /api/buyer/offers/my
// ============================================================

const getMyBuyerOffers = async (req, res) => {
    try {
        const buyerId = req.user.id;

        const [offers] = await pool.query(
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

                c.crop_name,
                c.crop_variety,

                u.full_name AS farmer_name,
                u.mobile AS farmer_mobile

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            INNER JOIN users u
                ON c.farmer_id = u.id

            WHERE bo.buyer_id = ?

            ORDER BY bo.created_at DESC
            `,
            [buyerId]
        );

        res.json({
            success: true,
            offers
        });

    } catch (error) {
        console.error("GET MY BUYER OFFERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch my offers"
        });
    }
};


// ============================================================
// GET SINGLE OFFER
// GET /api/buyer/offers/:id
// ============================================================

const getBuyerOfferById = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const offerId = req.params.id;

        const [offers] = await pool.query(
            `
            SELECT
                bo.*,
                c.crop_name,
                c.crop_variety,
                c.quantity_unit,
                c.farmer_id,
                u.full_name AS farmer_name,
                u.mobile AS farmer_mobile
            FROM buyer_offers bo
            INNER JOIN crops c
                ON bo.crop_id = c.id
            INNER JOIN users u
                ON c.farmer_id = u.id
            WHERE bo.id = ?
              AND bo.buyer_id = ?
            `,
            [offerId, buyerId]
        );

        if (offers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        res.json({
            success: true,
            offer: offers[0]
        });

    } catch (error) {
        console.error("GET BUYER OFFER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch offer"
        });
    }
};


// ============================================================
// UPDATE OFFER STATUS
// PATCH /api/buyer/offers/:id/status
// ============================================================

const updateBuyerOfferStatus = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const offerId = req.params.id;
        const { status } = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid offer status"
            });
        }

        await connection.beginTransaction();

        // ----------------------------------------------------
        // Get offer + crop
        // ----------------------------------------------------

        const [offers] = await connection.query(
            `
            SELECT
                bo.*,
                c.farmer_id,
                c.quantity AS crop_quantity,
                c.status AS crop_status
            FROM buyer_offers bo
            INNER JOIN crops c
                ON bo.crop_id = c.id
            WHERE bo.id = ?
            FOR UPDATE
            `,
            [offerId]
        );

        if (offers.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        const offer = offers[0];

        // ----------------------------------------------------
        // If farmer accepts
        // ----------------------------------------------------

        if (status === "accepted") {

            if (Number(offer.quantity) > Number(offer.crop_quantity)) {
                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message: "Offer quantity is greater than available crop quantity"
                });
            }

            // Accept offer
            await connection.query(
                `
                UPDATE buyer_offers
                SET status = 'accepted'
                WHERE id = ?
                `,
                [offerId]
            );

            // Reject other pending offers for same crop
            await connection.query(
                `
                UPDATE buyer_offers
                SET status = 'rejected'
                WHERE crop_id = ?
                  AND id != ?
                  AND status = 'pending'
                `,
                [offer.crop_id, offerId]
            );

            // ------------------------------------------------
            // CREATE DEAL automatically
            // ------------------------------------------------

            const [existingDeals] = await connection.query(
                `
                SELECT id
                FROM deals
                WHERE offer_id = ?
                `,
                [offerId]
            );

            if (existingDeals.length === 0) {

                await connection.query(
                    `
                    INSERT INTO deals
                    (
                        offer_id,
                        buyer_id,
                        farmer_id,
                        crop_id,
                        quantity,
                        agreed_price,
                        message,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'accepted')
                    `,
                    [
                        offer.id,
                        offer.buyer_id,
                        offer.farmer_id,
                        offer.crop_id,
                        offer.quantity,
                        offer.offered_price,
                        offer.message || null
                    ]
                );

                console.log(
                    `✅ Deal created automatically for offer ${offerId}`
                );
            }
        } else {

            await connection.query(
                `
                UPDATE buyer_offers
                SET status = ?
                WHERE id = ?
                `,
                [status, offerId]
            );
        }

        await connection.commit();

        res.json({
            success: true,
            message: `Offer ${status} successfully`
        });

    } catch (error) {
        await connection.rollback();

        console.error("UPDATE BUYER OFFER STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update offer status",
            error: error.message
        });

    } finally {
        connection.release();
    }
};


// ============================================================
// CANCEL OFFER
// PATCH /api/buyer/offers/:id/cancel
// ============================================================

const cancelBuyerOffer = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const offerId = req.params.id;

        const [result] = await pool.query(
            `
            UPDATE buyer_offers
            SET status = 'cancelled'
            WHERE id = ?
              AND buyer_id = ?
              AND status = 'pending'
            `,
            [offerId, buyerId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Offer cannot be cancelled"
            });
        }

        res.json({
            success: true,
            message: "Offer cancelled successfully"
        });

    } catch (error) {
        console.error("CANCEL BUYER OFFER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to cancel offer"
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