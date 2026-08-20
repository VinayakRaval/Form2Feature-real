const express = require("express");

const router = express.Router();

const {
    createPayment,
    getBuyerPayments,
    getPaymentById
} = require("../controllers/paymentController");

const authenticate =
    require("../middleware/authenticate");

// ============================================================
// CREATE PAYMENT
// POST /api/payments
// ============================================================

router.post(
    "/",
    authenticate,
    createPayment
);

// ============================================================
// BUYER PAYMENT HISTORY
// GET /api/payments/buyer
// ============================================================

router.get(
    "/buyer",
    authenticate,
    getBuyerPayments
);

// ============================================================
// SINGLE PAYMENT
// GET /api/payments/:id
// ============================================================

router.get(
    "/:id",
    authenticate,
    getPaymentById
);

module.exports = router;