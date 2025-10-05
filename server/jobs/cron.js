const cron = require("node-cron");
const moment = require("moment-timezone");
const { NotificationDb } = require("../model/notifications/Notification");
const sendEmail = require("./sendEmail");

// run every minute
cron.schedule("* 6 * * *", async () => {
  try {
    // 🔹 Get start & end of *today* in PH timezone
    const startOfDayPH = moment.tz("Asia/Manila").startOf("day");
    const endOfDayPH = moment.tz("Asia/Manila").endOf("day");

    // 🔹 Convert them to UTC for querying (since sendAt is stored in UTC)
    const startUTC = startOfDayPH.clone().utc().toDate();
    const endUTC = endOfDayPH.clone().utc().toDate();

    // 🔹 Find all pending notifications scheduled up to now (UTC)
    const pending = await NotificationDb.find({
      status: "pending",
      sendAt: { $gte: startUTC, $lte: endUTC },
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
