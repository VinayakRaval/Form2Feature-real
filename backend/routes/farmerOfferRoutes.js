const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getFarmerOffers,
    getFarmerOfferById,
    acceptOffer,
    rejectOffer
} = require("../controllers/farmerOfferController");

// ============================================================
// FARMER OFFERS
// ============================================================

// Get all offers received by farmer
router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getFarmerOffers
);

// Get single offer
router.get(
    "/:id",
    authenticate,
    authorizeRoles("farmer"),
    getFarmerOfferById
);

// Accept offer
router.put(
    "/:id/accept",
    authenticate,
    authorizeRoles("farmer"),
    acceptOffer
);

// Reject offer
router.put(
    "/:id/reject",
    authenticate,
    authorizeRoles("farmer"),
    rejectOffer
);

module.exports = router;