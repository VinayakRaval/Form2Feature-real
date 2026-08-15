const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    getMandis,
    getNearbyMandis,
    searchMandisByLocation
} = require("../controllers/mandiController");

const router = express.Router();

// ============================================================
// ALL MYSQL MANDIS
// ============================================================

router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getMandis
);

// ============================================================
// LOCATION SEARCH
// IMPORTANT: BEFORE /:ANYTHING ROUTES
// ============================================================

router.get(
    "/search",
    authenticate,
    authorizeRoles("farmer"),
    searchMandisByLocation
);

// ============================================================
// GPS + RADIUS
// ============================================================

router.get(
    "/nearby",
    authenticate,
    authorizeRoles("farmer"),
    getNearbyMandis
);

module.exports = router;