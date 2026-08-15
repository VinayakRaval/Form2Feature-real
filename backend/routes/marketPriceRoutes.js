const express =
    require("express");

const authenticate =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");


const {
    getMarketPrices,
    getLocalMarketPrices,
    getGovernmentPrices
} =
    require("../controllers/marketPriceController");


const router =
    express.Router();


// ============================================================
// COMBINED
// ============================================================

router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getMarketPrices
);


// ============================================================
// MYSQL ONLY
// ============================================================

router.get(
    "/local",
    authenticate,
    authorizeRoles("farmer"),
    getLocalMarketPrices
);


// ============================================================
// GOVERNMENT ONLY
// ============================================================

router.get(
    "/government",
    authenticate,
    authorizeRoles("farmer"),
    getGovernmentPrices
);


module.exports =
    router;