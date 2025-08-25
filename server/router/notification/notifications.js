const express = require("express");
const router = express.Router();
const notificationController = require("../../controller/notification/notificationController");
const multer = require("multer");
const upload = multer();

router.post("/", upload.none(), notificationController.createNotification);
router.post(
  "/pending",
  upload.none(),
  notificationController.sendPendingNotifications
);
router.post("/:id", upload.none(), notificationController.sendNotificationById);

module.exports = router;
