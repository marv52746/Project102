const { AppointmentDb } = require("../../model/Appointment");
const { UserDb } = require("../../model/User");
const {
  createNotificationService,
} = require("../../service/notificationService");
const BaseController = require("../core/baseController");

class AppointmentController extends BaseController {
  constructor() {
    super(AppointmentDb);
    this.populateFields = ["patient", "doctor"];
    // super(AppointmentDb, ["patient", "doctor"]);
  }

  // Add appointment-specific methods here
  create = async (req, res) => {
    try {
      const newItem = new this.model(req.body);
      const savedItem = await newItem.save();

      await this.logActivity("create", savedItem, req.user?._id);

      // ✅ Notification conditions

      // ✅ Query patient + doctor from their respective tables
      const patient = await UserDb.findById(savedItem.patient);
      const doctor = await UserDb.findById(savedItem.doctor);

      // Extract emails from their linked `user` object
      const patientEmail = patient?.email;
      const doctorEmail = doctor?.email;

      // Created New Appointment (always send immediate notification)
      await createNotificationService({
        category: "patient",
        type: "create",
        data: {
          date: savedItem.date,
          time: savedItem.time,
          reason: savedItem.reason,
          patient: patient,
          doctor: doctor,
        },
        recipients: [patientEmail],
        cc: [doctorEmail, "marv52746@gmail.com"],
        status: "immediate",
      });

      // ✅ Only create reminder if the date is not today
      const appointmentDate = new Date(savedItem.date);
      const today = new Date();

      const isSameDay =
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate();

      if (!isSameDay) {
        await createNotificationService({
          category: "patient",
          type: "appointmentReminder",
          data: {
            date: savedItem.date,
            time: savedItem.time,
            reason: savedItem.reason,
            patient: patient,
            doctor: doctor,
          },
          recipients: [patientEmail],
          cc: [doctorEmail, "marv52746@gmail.com"],
          status: "pending",
        });
      }

      res.status(201).json(savedItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new AppointmentController();
