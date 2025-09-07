// services/notificationTemplates.js
const templates = {
  staff: {
    upcomingAppointments: (data) =>
      `You have ${data.count} upcoming appointments today.`,
    stockAlerts: (data) =>
      `Stock Alert: ${data.itemName} is running low (only ${data.quantity} left).`,
  },
  patient: {
    scheduleReminders: (data) =>
      `Reminder: Your appointment is scheduled on ${data.date}.`,
  },
  emergency: {
    alert: (data) => `🚨 Emergency Alert: ${data.message}`,
  },
};

module.exports = templates;
