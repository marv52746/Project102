const express = require("express");
const router = express.Router();
const authController = require("../../controller/core/authController");
const multer = require("multer");
const authMiddleware = require("../../middleware/authMiddleware");

const upload = multer();

// Login route for credentials
router.post("/login", upload.none(), authController.login);

router.post("/forgot-password", upload.none(), authController.forgotPassword);

// POST /api/auth/change-password
router.post(
  "/change-password",
  authMiddleware,
  upload.none(),
  authController.changePassword
);

// Google login route
router.post("/google", upload.none(), authController.googleLogin);

// Signup route
router.post("/signup", upload.none(), authController.signup);

module.exports = router;
