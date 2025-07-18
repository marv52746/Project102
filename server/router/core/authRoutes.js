const express = require("express");
const router = express.Router();
const authController = require("../../controller/core/authController");
const multer = require("multer");

const upload = multer();

// Login route for credentials
router.post("/login", upload.none(), authController.login);

// Google login route
router.post("/google", upload.none(), authController.googleLogin);

// Signup route
router.post("/signup", upload.none(), authController.signup);

module.exports = router;
