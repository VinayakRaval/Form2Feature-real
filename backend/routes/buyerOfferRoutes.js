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

const authMiddleware = require("../middleware/authMiddleware");

// ============================================================
// BUYER OFFERS
// ============================================================

// Create offer
router.post(
    "/",
    authMiddleware,
    createBuyerOffer
);

// Get all offers
router.get(
    "/",
    authMiddleware,
    getBuyerOffers
);

// Get my offers
router.get(
    "/my",
    authMiddleware,
    getMyBuyerOffers
);

// Get single offer
router.get(
    "/:id",
    authMiddleware,
    getBuyerOfferById
);

// Update offer status
router.patch(
    "/:id/status",
    authMiddleware,
    updateBuyerOfferStatus
);

// Cancel offer
router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelBuyerOffer
);

module.exports = router;