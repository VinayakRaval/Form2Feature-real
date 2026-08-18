const express = require("express");

const router = express.Router();

const authenticate =
    require("../middleware/authenticate");

const {
    getBuyerProfile,
    updateBuyerProfile,
    uploadBuyerProfilePhoto
} = require("../controllers/buyerController");

const upload =
    require("../middleware/upload");

// ============================================================
// GET BUYER PROFILE
// GET /api/buyer/profile
// ============================================================

router.get(
    "/profile",
    authenticate,
    getBuyerProfile
);


// ============================================================
// UPDATE BUYER PROFILE
// PUT /api/buyer/profile
// ============================================================

router.put(
    "/profile",
    authenticate,
    updateBuyerProfile
);


// ============================================================
// UPLOAD PROFILE PHOTO
// POST /api/buyer/profile/photo
// ============================================================

router.post(
    "/profile/photo",
    authenticate,
    upload.single("profile_photo"),
    uploadBuyerProfilePhoto
);


module.exports = router;