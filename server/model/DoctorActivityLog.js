const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const doctorActivitySchema = new mongoose.Schema({
  doctor: { type: ObjectId, ref: "user" },
  activity_type: {
    type: String,
    enum: ["consultation", "lab-request", "prescription", "note-entry"],
  },
  reference_id: ObjectId, // Could be appointment, lab, etc.
  description: String,
  timestamp: { type: Date, default: Date.now },
});

const DoctorActivityDb = mongoose.model(
  "doctor_activity",
  doctorActivitySchema
);
module.exports = { DoctorActivityDb };
