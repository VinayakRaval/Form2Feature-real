const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const cropUpload =
    require("../middleware/cropUploadMiddleware");

const {
    getMyCrops,
    addCrop,
    updateCrop,
    deleteCrop
} = require("../controllers/cropController");


const router = express.Router();


// ==========================================
// GET MY CROPS
// ==========================================

router.get(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    getMyCrops
);


// ==========================================
// ADD CROP
// ==========================================

router.post(
    "/",
    authenticate,
    authorizeRoles("farmer"),
    cropUpload.single("image"),
    addCrop
);


// ==========================================
// UPDATE CROP
// ==========================================

router.put(
    "/:id",
    authenticate,
    authorizeRoles("farmer"),
    cropUpload.single("image"),
    updateCrop
);


// ==========================================
// DELETE CROP
// ==========================================

router.delete(
    "/:id",
    authenticate,
    authorizeRoles("farmer"),
    deleteCrop
);


module.exports = router;