const { AppointmentDb } = require("../../model/Appointment");
const { UserDb } = require("../../model/User");
const {
  createNotificationService,
} = require("../../service/notificationService");
const BaseController = require("../core/baseController");

class AppointmentController extends BaseController {
  constructor() {
    super(AppointmentDb);
    this.populateFields = [
      "patient",
      "doctor",
      "vitals",
      "medication",
      "allergy",
      "condition",
      "surgical",
      "pregnancy",
      "labrequest",
      "ultrasound",
    ];
    // super(AppointmentDb, ["patient", "doctor"]);
  }

  // ✅ Reusable broadcast method
  broadcastChange(event, data) {
    console.log("broadcastChange triggered");
    try {
      if (global.io) {
        // More flexible than global.emitAppointmentUpdate
        global.io.emit(event, {
          table: this.tableName,
          model: this.modelName,
          data,
        });
        console.log(`📢 Broadcasted [${event}] for ${this.tableName}`);
      } else {
        console.warn("⚠️ No socket.io instance found for broadcast");
      }
    } catch (err) {
      console.error("❌ Broadcast Error:", err.message);
    }
  }

  // Add appointment-specific methods here
  create = async (req, res) => {
    try {
      // const newItem = new this.model(req.body);
      const newItem = new this.model({
        ...req.body,
        created_by: req.currentUser?._id || null, // ✅ auto-set creator
      });
      const savedItem = await newItem.save();

      await this.logActivity("create", savedItem, req.currentUser?._id);

      // 🔥 Emit "created" event
      this.broadcastChange(`${this.modelName}_created`, savedItem);

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
        cc: [doctorEmail],
        status: "immediate",
      });

      // ✅ Only create reminder if the date is not today
      // const appointmentDate = new Date(savedItem.date);
      // const today = new Date();

      // const isSameDay =
      //   appointmentDate.getFullYear() === today.getFullYear() &&
      //   appointmentDate.getMonth() === today.getMonth() &&
      //   appointmentDate.getDate() === today.getDate();

      const moment = require("moment-timezone");
      const appointmentDatePH = moment(savedItem.date).tz("Asia/Manila");
      const todayPH = moment().tz("Asia/Manila");
      const isSameDay = appointmentDatePH.isSame(todayPH, "day");

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
          cc: [doctorEmail],
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
