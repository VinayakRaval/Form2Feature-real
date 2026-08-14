const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    getMarketPrices,
    getBestMarketPrice
} = require("../controllers/marketPriceController");

const router = express.Router();


// GET MARKET PRICES

router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getMarketPrices
);


// GET BEST PRICE

router.get(
    "/best",
    authenticate,
    authorizeRoles("farmer"),
    getBestMarketPrice
);


module.exports = router;