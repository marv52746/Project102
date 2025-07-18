const { AppointmentDb } = require("../model/Appointment");
const { sendSMS } = require("../utils/semaphoreService");
const dayjs = require("dayjs");

async function sendReminders() {
  console.log("reminder triggered");
  const tomorrow = dayjs().add(1, "day").startOf("day");

  const appointments = await AppointmentDb.find({
    date: { $gte: tomorrow.toDate(), $lt: tomorrow.endOf("day").toDate() },
  }).populate("patient");

  for (const appt of appointments) {
    if (!appt.patient?.phone_number) continue;

    const message = `Reminder: You have an appointment on ${dayjs(
      appt.date
    ).format("MMM D, YYYY")} at ${appt.time}. - Clinic Name`;
    await sendSMS(appt.patient.phone_number, message);
  }
}

module.exports = sendReminders;
