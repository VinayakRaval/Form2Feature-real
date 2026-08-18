const express = require("express");

const router = express.Router();

const {
    createBuyerOffer,
    getBuyerOffers,
    getMyBuyerOffers,
    getBuyerOfferById,
    updateBuyerOfferStatus,
    cancelBuyerOffer
} = require("../controllers/buyerOfferController");

const authMiddleware =
    require("../middleware/authMiddleware");

// ============================================================
// BUYER OFFERS
// ============================================================

// POST /api/buyer/offers
router.post(
    "/",
    authMiddleware,
    createBuyerOffer
);

// GET /api/buyer/offers
router.get(
    "/",
    authMiddleware,
    getBuyerOffers
);

// GET /api/buyer/offers/my
router.get(
    "/my",
    authMiddleware,
    getMyBuyerOffers
);

// GET /api/buyer/offers/:id
router.get(
    "/:id",
    authMiddleware,
    getBuyerOfferById
);

// PATCH /api/buyer/offers/:id/status
router.patch(
    "/:id/status",
    authMiddleware,
    updateBuyerOfferStatus
);

// PATCH /api/buyer/offers/:id/cancel
router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelBuyerOffer
);

module.exports = router;