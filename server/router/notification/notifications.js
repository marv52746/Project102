const express = require("express");
const router = express.Router();
const notificationController = require("../../controller/notification/notificationController");
const multer = require("multer");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = multer();

router.post(
  "/",
  authMiddleware,
  upload.none(),
  notificationController.createNotification
);
router.post(
  "/pending",
  authMiddleware,
  upload.none(),
  notificationController.sendPendingNotifications
);
router.post(
  "/:id",
  authMiddleware,
  upload.none(),
  notificationController.sendNotificationById
);

module.exports = router;
