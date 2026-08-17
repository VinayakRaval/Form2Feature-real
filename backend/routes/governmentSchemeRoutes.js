const express = require("express");

const router =
    express.Router();

const {
    getGovernmentSchemes,
    getGovernmentSchemeById,
    searchGovernmentSchemes
} = require(
    "../controllers/governmentSchemeController"
);


// ============================================================
// GET ALL SCHEMES
// ============================================================

router.get(
    "/",
    getGovernmentSchemes
);


// ============================================================
// SEARCH SCHEMES
// ============================================================

router.get(
    "/search",
    searchGovernmentSchemes
);


// ============================================================
// GET SINGLE SCHEME
// ============================================================

router.get(
    "/:id",
    getGovernmentSchemeById
);


module.exports = router;