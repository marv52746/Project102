const express = require("express");
const router = express.Router();
const { AppointmentDb } = require("../../model/Appointment");

router.get("/", async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1); // JS months are 0-based
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const appointments = await AppointmentDb.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("patient", "name")
      .populate("doctor", "name")
      .sort({ date: 1, time: 1 });

    const formatted = appointments.map((appt) => ({
      _id: appt._id,
      appointment_no: appt.appointment_no,
      date: appt.date,
      time: appt.time,
      reason: appt.reason,
      notes: appt.notes,
      status: appt.status,
      patient_id: appt.patient?._id,
      patient_name: appt.patient?.name,
      doctor_id: appt.doctor?._id,
      doctor_name: appt.doctor?.name,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Calendar fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
