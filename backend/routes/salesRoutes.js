const express = require("express");

const router = express.Router();

const {
    getSales,
    getSalesSummary,
    getSaleById,
    addSale,
    updateSale,
    deleteSale
} = require("../controllers/salesController");

const authenticate =
    require("../middleware/authenticate");


// GET ALL SALES
router.get(
    "/",
    authenticate,
    getSales
);


// GET SALES SUMMARY
// MUST BE BEFORE /:id
router.get(
    "/summary",
    authenticate,
    getSalesSummary
);


// ADD SALE
router.post(
    "/",
    authenticate,
    addSale
);


// UPDATE SALE
router.put(
    "/:id",
    authenticate,
    updateSale
);


// DELETE SALE
router.delete(
    "/:id",
    authenticate,
    deleteSale
);


// GET SINGLE SALE
// MUST BE AFTER /summary
router.get(
    "/:id",
    authenticate,
    getSaleById
);


module.exports = router;