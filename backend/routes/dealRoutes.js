const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createDeal,
  getBuyerDeals,
  getFarmerDeals,
  getDealById,
  updateDealStatus,
} = require("../controllers/dealController");

// ============================================================
// CREATE DEAL
// POST /api/deals
// ============================================================

router.post(
  "/",
  authenticate,
  authorizeRoles("buyer", "farmer"),
  createDeal
);

// ============================================================
// GET BUYER DEALS
// GET /api/deals/buyer
// ============================================================

router.get(
  "/buyer",
  authenticate,
  authorizeRoles("buyer"),
  getBuyerDeals
);

// ============================================================
// GET FARMER DEALS
// GET /api/deals/farmer
// ============================================================

router.get(
  "/farmer",
  authenticate,
  authorizeRoles("farmer"),
  getFarmerDeals
);

// ============================================================
// GET SINGLE DEAL
// GET /api/deals/:id
// ============================================================

router.get(
  "/:id",
  authenticate,
  authorizeRoles("buyer", "farmer"),
  getDealById
);

// ============================================================
// UPDATE DEAL STATUS
// PATCH /api/deals/:id/status
// ============================================================

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("buyer", "farmer"),
  updateDealStatus
);

module.exports = router;