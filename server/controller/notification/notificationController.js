const sendEmail = require("../../jobs/sendEmail");
const { NotificationDb } = require("../../model/notifications/Notification");

// controller methods
const notificationController = {
  // create a new notification (to be sent later or immediately)
  createNotification: async (req, res) => {
    try {
      const notification = new NotificationDb(req.body);
      await notification.save();

      // ✅ Check status before sending
      if (notification.status === "immediate") {
        await sendEmail(notification);
      }

      res.status(201).json(notification);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // send all pending notifications
  sendPendingNotifications: async (req, res) => {
    try {
      const pending = await NotificationDb.find({ status: "pending" });
      if (!pending.length) {
        console.log("ℹ️ No pending email notifications.");
        return;
      }
      console.log(`📧 Found ${pending.length} pending notifications.`);
      for (let notif of pending) {
        await sendEmail(notif);
      }
      res.json({ message: "Processed pending notifications." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // manually send a specific notification
  sendNotificationById: async (req, res) => {
    try {
      const notif = await NotificationDb.findById(req.params.id);
      if (!notif)
        return res.status(404).json({ error: "Notification not found" });

      await sendEmail(notif);
      res.json({ message: "Notification sent", notif });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = notificationController;
