require("dotenv").config();
const connect = require("../database/connection"); // <-- make sure path matches your folder
const { createNotificationService } = require("../service/notificationService");

(async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connect(); // ✅ ensure DB connection for this script

    console.log("✅ Connected. Creating notification...");
    const result = await createNotificationService({
      category: "patient",
      type: "create",
      data: {
        patient: { first_name: "Test" },
        date: new Date(),
        time: "10:00",
        doctor: { name: "Dr. Smith" },
        reason: "Routine check-up",
      },
      recipients: ["your_email@gmail.com"],
      status: "immediate",
    });

    console.log("✅ Notification created:", result);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
