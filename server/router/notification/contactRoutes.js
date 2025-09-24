const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createNotificationService,
} = require("../../service/notificationService");
const upload = multer();

// will not work .no authorization for senders email to send to us
router.post("/", upload.none(), async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required." });
    }

    await createNotificationService({
      category: "contact",
      type: "message",
      data: { name, email, message },
      recipients: [process.env.CLINIC_EMAIL], // Clinic email
      status: "immediate",
    });

    res
      .status(200)
      .json({ success: true, message: "Your message has been sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
