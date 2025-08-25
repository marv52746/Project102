const cron = require("node-cron");
const { NotificationDb } = require("../model/notifications/Notification");
const sendEmail = require("./sendEmail");

// run every minute
cron.schedule("* * * * *", async () => {
  try {
    const pending = await NotificationDb.find({ status: "pending" });
    if (!pending.length) return;

    console.log(`📧 Cron found ${pending.length} pending notifications.`);
    for (let notif of pending) {
      await sendEmail(notif);
      notif.status = "sent";
      await notif.save();
    }
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});
