const express = require("express");
const router = express.Router();
const appointmentController = require("../../controller/medical/appointmentController");
const multer = require("multer");
const sendReminders = require("../../jobs/appointmentReminder");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = multer();

router.post("/send", async (req, res) => {
  try {
    await sendReminders();
    res.send("Reminders sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send reminders");
  }
});

// router.post("/", upload.none(), appointmentController.create);
// router.get("/", appointmentController.getAll);
// router.get("/:id", appointmentController.getById);
// router.put("/:id", upload.none(), appointmentController.update);
// router.delete("/:id", appointmentController.delete);

router.post("/", authMiddleware, upload.none(), appointmentController.create);
router.get("/", authMiddleware, appointmentController.getAll);
router.get("/:id", authMiddleware, appointmentController.getById);
router.put("/:id", authMiddleware, upload.none(), appointmentController.update);
router.delete("/:id", authMiddleware, appointmentController.delete);

module.exports = router;
