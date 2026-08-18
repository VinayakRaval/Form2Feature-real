const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const {
    getBuyerCrops,
    getBuyerCropById
} = require("../controllers/buyerCropController");


// ============================================================
// GET ALL BUYER CROPS
// GET /api/buyer/crops
// ============================================================

router.get(
    "/",
    authenticate,
    getBuyerCrops
);


// ============================================================
// GET SINGLE BUYER CROP
// GET /api/buyer/crops/:id
// ============================================================

router.get(
    "/:id",
    authenticate,
    getBuyerCropById
);


module.exports = router;