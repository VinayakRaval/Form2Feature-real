const { pool } = require("../config/db");

// ============================================================
// CREATE DEAL
// POST /api/deals
// ============================================================

const createDeal = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            offerId,
            buyerId,
            farmerId,
            cropId,
            quantity,
            agreedPrice,
            message
        } = req.body;

        if (!offerId) {
            return res.status(400).json({
                success: false,
                message: "Offer ID is required"
            });
        }

        const [offers] = await pool.query(
            `
            SELECT *
            FROM buyer_offers
            WHERE id = ?
            `,
            [offerId]
        );

        if (offers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        const offer = offers[0];

        if (offer.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Only accepted offers can become deals"
            });
        }

        // Prevent duplicate deal
        const [existing] = await pool.query(
            `
            SELECT id
            FROM deals
            WHERE offer_id = ?
            `,
            [offerId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Deal already exists",
                dealId: existing[0].id
            });
        }

        const [result] = await pool.query(
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
                farmerId || null,
                offer.crop_id,
                offer.quantity,
                offer.offered_price,
                offer.message || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Deal created successfully",
            dealId: result.insertId
        });

    } catch (error) {
        console.error("CREATE DEAL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create deal",
            error: error.message
        });
    }
};


// ============================================================
// GET BUYER DEALS
// GET /api/deals/buyer
// ============================================================

const getBuyerDeals = async (req, res) => {
    try {
        const buyerId = req.user.id;

        console.log("================================");
        console.log("GET BUYER DEALS");
        console.log("Buyer ID:", buyerId);
        console.log("================================");

        const [deals] = await pool.query(
            `
            SELECT
                d.id,
                d.offer_id,
                d.buyer_id,
                d.farmer_id,
                d.crop_id,
                d.quantity,
                d.agreed_price,
                d.message,
                d.status,
                d.created_at,
                d.updated_at,

                c.crop_name,
                c.crop_variety,
                c.quantity_unit,
                c.quality,
                c.expected_price,
                c.harvest_date,
                c.image,

                farmer.full_name AS farmer_name,
                farmer.mobile AS farmer_mobile,

                buyer.full_name AS buyer_name

            FROM deals d

            INNER JOIN crops c
                ON d.crop_id = c.id

            INNER JOIN users farmer
                ON d.farmer_id = farmer.id

            INNER JOIN users buyer
                ON d.buyer_id = buyer.id

            WHERE d.buyer_id = ?

            ORDER BY d.created_at DESC
            `,
            [buyerId]
        );

        console.log("Buyer deals found:", deals.length);

        res.json({
            success: true,
            deals
        });

    } catch (error) {
        console.error("GET BUYER DEALS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch buyer deals",
            error: error.message
        });
    }
};


// ============================================================
// GET FARMER DEALS
// GET /api/deals/farmer
// ============================================================

const getFarmerDeals = async (req, res) => {
    try {
        const farmerId = req.user.id;

        const [deals] = await pool.query(
            `
            SELECT
                d.*,
                c.crop_name,
                c.crop_variety,
                c.quantity_unit,
                c.quality,
                c.expected_price,
                c.harvest_date,
                c.image,

                buyer.full_name AS buyer_name,
                buyer.mobile AS buyer_mobile,

                farmer.full_name AS farmer_name

            FROM deals d

            INNER JOIN crops c
                ON d.crop_id = c.id

            INNER JOIN users buyer
                ON d.buyer_id = buyer.id

            INNER JOIN users farmer
                ON d.farmer_id = farmer.id

            WHERE d.farmer_id = ?

            ORDER BY d.created_at DESC
            `,
            [farmerId]
        );

        res.json({
            success: true,
            deals
        });

    } catch (error) {
        console.error("GET FARMER DEALS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch farmer deals",
            error: error.message
        });
    }
};


// ============================================================
// GET SINGLE DEAL
// GET /api/deals/:id
// ============================================================

const getDealById = async (req, res) => {
    try {
        const userId = req.user.id;
        const dealId = req.params.id;

        const [deals] = await pool.query(
            `
            SELECT
                d.*,

                c.crop_name,
                c.crop_variety,
                c.quantity_unit,
                c.quality,
                c.expected_price,
                c.harvest_date,
                c.image,

                buyer.full_name AS buyer_name,
                buyer.mobile AS buyer_mobile,

                farmer.full_name AS farmer_name,
                farmer.mobile AS farmer_mobile

            FROM deals d

            INNER JOIN crops c
                ON d.crop_id = c.id

            INNER JOIN users buyer
                ON d.buyer_id = buyer.id

            INNER JOIN users farmer
                ON d.farmer_id = farmer.id

            WHERE d.id = ?
              AND (
                    d.buyer_id = ?
                    OR d.farmer_id = ?
              )
            `,
            [dealId, userId, userId]
        );

        if (deals.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Deal not found"
            });
        }

        res.json({
            success: true,
            deal: deals[0]
        });

    } catch (error) {
        console.error("GET DEAL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch deal",
            error: error.message
        });
    }
};


// ============================================================
// UPDATE DEAL STATUS
// PATCH /api/deals/:id/status
// ============================================================

const updateDealStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const dealId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = [
            "accepted",
            "payment_pending",
            "paid",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid deal status"
            });
        }

        const [deals] = await pool.query(
            `
            SELECT *
            FROM deals
            WHERE id = ?
              AND (
                    buyer_id = ?
                    OR farmer_id = ?
              )
            `,
            [dealId, userId, userId]
        );

        if (deals.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Deal not found"
            });
        }

        await pool.query(
            `
            UPDATE deals
            SET status = ?
            WHERE id = ?
            `,
            [status, dealId]
        );

        res.json({
            success: true,
            message: "Deal status updated successfully"
        });

    } catch (error) {
        console.error("UPDATE DEAL STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update deal status",
            error: error.message
        });
    }
};


module.exports = {
    createDeal,
    getBuyerDeals,
    getFarmerDeals,
    getDealById,
    updateDealStatus
};