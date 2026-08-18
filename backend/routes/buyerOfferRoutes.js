const express = require("express");

const router = express.Router();

const authenticate =
    require("../middleware/authenticate");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    createBuyerOffer,
    getMyBuyerOffers,
    cancelBuyerOffer
} = require("../controllers/buyerOfferController");


// ============================================================
// GET MY OFFERS
// GET /api/buyer/offers
// ============================================================

router.get(
    "/",
    authenticate,
    authorizeRoles("buyer"),
    getMyBuyerOffers
);


// ============================================================
// CREATE OFFER
// POST /api/buyer/offers
// ============================================================

router.post(
    "/",
    authenticate,
    authorizeRoles("buyer"),
    createBuyerOffer
);


// ============================================================
// CANCEL OFFER
// PATCH /api/buyer/offers/:id/cancel
// ============================================================

router.patch(
    "/:id/cancel",
    authenticate,
    authorizeRoles("buyer"),
    cancelBuyerOffer
);


module.exports = router;