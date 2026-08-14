const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    getMandis,
    getNearbyMandis
} = require("../controllers/mandiController");

const router = express.Router();


// ==========================================
// GET ALL MANDIS
// ==========================================

router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getMandis
);


// ==========================================
// GET NEARBY REAL MANDIS
// ==========================================

router.get(
    "/nearby",
    authenticate,
    authorizeRoles("farmer"),
    getNearbyMandis
);


module.exports = router;