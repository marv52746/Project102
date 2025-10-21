const { createNotificationService } = require("./service/notificationService");

(async () => {
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

  console.log("Notification created:", result);
})();
