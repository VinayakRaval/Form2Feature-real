const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    saveProfitCalculation,
    getProfitCalculations,
    deleteProfitCalculation
} = require("../controllers/profitCalculatorController");

// ============================================================
// GET SAVED PROFIT CALCULATIONS
// GET /api/profit-calculator
// ============================================================

router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getProfitCalculations
);

// ============================================================
// SAVE PROFIT CALCULATION
// POST /api/profit-calculator
// ============================================================

router.post(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    saveProfitCalculation
);

// ============================================================
// DELETE PROFIT CALCULATION
// DELETE /api/profit-calculator/:id
// ============================================================

router.delete(
    "/:id",
    authenticate,
    authorizeRoles("farmer"),
    deleteProfitCalculation
);

module.exports = router;