const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    saveMandi,
    getSavedMandis,
    removeSavedMandi
} = require("../controllers/savedMandiController");


const router = express.Router();


// ============================================================
// SAVE MANDI
// POST /api/saved-mandis
// ============================================================

router.post(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    saveMandi
);


// ============================================================
// GET SAVED MANDIS
// GET /api/saved-mandis
// ============================================================

router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getSavedMandis
);


// ============================================================
// DELETE SAVED MANDI
// DELETE /api/saved-mandis/:mandiId
// ============================================================

router.delete(
    "/:mandiId",
    authenticate,
    authorizeRoles("farmer"),
    removeSavedMandi
);


module.exports = router;