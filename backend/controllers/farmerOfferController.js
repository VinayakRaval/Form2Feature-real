const { pool } = require("../config/db");

// ============================================================
// GET OFFERS RECEIVED BY FARMER
// GET /api/farmer/offers
// ============================================================

const getFarmerOffers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "farmer") {
            return res.status(403).json({
                success: false,
                message: "Farmer access required"
            });
        }

        const farmerId = Number(req.user.id);

        if (!Number.isInteger(farmerId) || farmerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid farmer ID"
            });
        }

        const [offers] = await pool.execute(
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
                c.quality,
                c.expected_price,
                c.harvest_date,
                c.status AS crop_status,

                u.full_name AS buyer_name,
                u.email AS buyer_email,
                u.mobile AS buyer_mobile

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            INNER JOIN users u
                ON bo.buyer_id = u.id

            WHERE c.farmer_id = ?

            ORDER BY bo.created_at DESC
            `,
            [farmerId]
        );

        return res.status(200).json({
            success: true,
            count: offers.length,
            offers
        });

    } catch (error) {
        console.error("GET FARMER OFFERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching offers"
        });
    }
};


// ============================================================
// GET SINGLE OFFER
// GET /api/farmer/offers/:id
// ============================================================

const getFarmerOfferById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "farmer") {
            return res.status(403).json({
                success: false,
                message: "Farmer access required"
            });
        }

        const farmerId = Number(req.user.id);
        const offerId = Number(req.params.id);

        if (!Number.isInteger(offerId) || offerId <= 0) {
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
                c.quality,
                c.expected_price,
                c.harvest_date,
                c.status AS crop_status,

                u.full_name AS buyer_name,
                u.email AS buyer_email,
                u.mobile AS buyer_mobile

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            INNER JOIN users u
                ON bo.buyer_id = u.id

            WHERE bo.id = ?
            AND c.farmer_id = ?

            LIMIT 1
            `,
            [offerId, farmerId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        return res.status(200).json({
            success: true,
            offer: rows[0]
        });

    } catch (error) {
        console.error("GET FARMER OFFER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching offer"
        });
    }
};


// ============================================================
// ACCEPT OFFER
// PUT /api/farmer/offers/:id/accept
// ============================================================

const acceptOffer = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "farmer") {
            return res.status(403).json({
                success: false,
                message: "Farmer access required"
            });
        }

        const farmerId = Number(req.user.id);
        const offerId = Number(req.params.id);

        if (!Number.isInteger(offerId) || offerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid offer ID"
            });
        }

        await connection.beginTransaction();

        // Find offer and make sure it belongs to this farmer
        const [offers] = await connection.execute(
            `
            SELECT
                bo.id,
                bo.buyer_id,
                bo.crop_id,
                bo.quantity,
                bo.status,

                c.quantity AS crop_quantity,
                c.status AS crop_status

            FROM buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            WHERE bo.id = ?
            AND c.farmer_id = ?

            FOR UPDATE
            `,
            [offerId, farmerId]
        );

        if (offers.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        const offer = offers[0];

        if (offer.status !== "pending") {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: `Offer is already ${offer.status}`
            });
        }

        if (offer.crop_status !== "available") {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Crop is no longer available"
            });
        }

        if (Number(offer.quantity) > Number(offer.crop_quantity)) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Offer quantity is greater than available crop quantity"
            });
        }

        // Accept selected offer
        await connection.execute(
            `
            UPDATE buyer_offers
            SET status = 'accepted'
            WHERE id = ?
            `,
            [offerId]
        );

        // Reject other pending offers for the same crop
        await connection.execute(
            `
            UPDATE buyer_offers
            SET status = 'rejected'
            WHERE crop_id = ?
            AND id != ?
            AND status = 'pending'
            `,
            [offer.crop_id, offerId]
        );

        // Reduce available quantity
        const remainingQuantity =
            Number(offer.crop_quantity) - Number(offer.quantity);

        if (remainingQuantity <= 0) {
            await connection.execute(
                `
                UPDATE crops
                SET quantity = 0,
                    status = 'sold'
                WHERE id = ?
                `,
                [offer.crop_id]
            );
        } else {
            await connection.execute(
                `
                UPDATE crops
                SET quantity = ?
                WHERE id = ?
                `,
                [remainingQuantity, offer.crop_id]
            );
        }

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Offer accepted successfully"
        });

    } catch (error) {
        await connection.rollback();

        console.error("ACCEPT OFFER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while accepting offer"
        });

    } finally {
        connection.release();
    }
};


// ============================================================
// REJECT OFFER
// PUT /api/farmer/offers/:id/reject
// ============================================================

const rejectOffer = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "farmer") {
            return res.status(403).json({
                success: false,
                message: "Farmer access required"
            });
        }

        const farmerId = Number(req.user.id);
        const offerId = Number(req.params.id);

        if (!Number.isInteger(offerId) || offerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid offer ID"
            });
        }

        const [result] = await pool.execute(
            `
            UPDATE buyer_offers bo

            INNER JOIN crops c
                ON bo.crop_id = c.id

            SET bo.status = 'rejected'

            WHERE bo.id = ?
            AND c.farmer_id = ?
            AND bo.status = 'pending'
            `,
            [offerId, farmerId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Pending offer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Offer rejected successfully"
        });

    } catch (error) {
        console.error("REJECT OFFER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while rejecting offer"
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getFarmerOffers,
    getFarmerOfferById,
    acceptOffer,
    rejectOffer
};