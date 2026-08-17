const express = require("express");

const router =
    express.Router();


// ============================================================
// CONTROLLERS
// ============================================================

const {
    registerUser,
    registerFarmer,
    registerBuyer,
    login
} = require("../controllers/authController");


// ============================================================
// CHECK CONTROLLERS
// ============================================================

console.log(
    "AUTH CONTROLLERS:",
    {
        registerUser:
            typeof registerUser,

        registerFarmer:
            typeof registerFarmer,

        registerBuyer:
            typeof registerBuyer,

        login:
            typeof login
    }
);


// ============================================================
// REGISTER USER
//
// POST /api/auth/register
//
// Body:
// {
//   "full_name": "Charan",
//   "email": "charan@gmail.com",
//   "mobile": "9901815624",
//   "password": "123456",
//   "role": "buyer"
// }
// ============================================================

router.post(
    "/register",
    registerUser
);


// ============================================================
// REGISTER FARMER
//
// POST /api/auth/register-farmer
// ============================================================

router.post(
    "/register-farmer",
    registerFarmer
);


// ============================================================
// REGISTER BUYER
//
// POST /api/auth/register-buyer
// ============================================================

router.post(
    "/register-buyer",
    registerBuyer
);


// ============================================================
// LOGIN
//
// POST /api/auth/login
// ============================================================

router.post(
    "/login",
    login
);


// ============================================================
// EXPORT
// ============================================================

module.exports =
    router;