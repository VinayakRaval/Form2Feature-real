const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createDeal,
    getBuyerDeals,
    getFarmerDeals,
    getDealById,
    updateDealStatus
} = require("../controllers/dealController");

router.post(
    "/",
    authenticate,
    authorizeRoles("buyer", "farmer"),
    createDeal
);

router.get(
    "/buyer",
    authenticate,
    authorizeRoles("buyer"),
    getBuyerDeals
);

router.get(
    "/farmer",
    authenticate,
    authorizeRoles("farmer"),
    getFarmerDeals
);

router.get(
    "/:id",
    authenticate,
    authorizeRoles("buyer", "farmer"),
    getDealById
);

router.patch(
    "/:id/status",
    authenticate,
    authorizeRoles("buyer", "farmer"),
    updateDealStatus
);

module.exports = router;