const express = require("express");

const {
    registerFarmer,
    login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerFarmer);

router.post("/login", login);

module.exports = router;