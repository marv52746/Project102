const cron = require("node-cron");
const { NotificationDb } = require("../model/notifications/Notification");
const sendEmail = require("./sendEmail");

// run every minute
cron.schedule("* 6 * * *", async () => {
  try {
    // get today's start and end
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // fetch only pending + today's date
    const pending = await NotificationDb.find({
      status: "pending",
      sendAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // const pending = await NotificationDb.find({ status: "pending" });
    if (!pending.length) return;

    console.log(
      `📧 Cron found ${pending.length} pending notifications for today.`
    );
    for (let notif of pending) {
      await sendEmail(notif);
      notif.status = "sent";
      await notif.save();
    }
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});
