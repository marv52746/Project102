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

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const DoctorActivityDb = mongoose.model(
  "doctor_activity",
  doctorActivitySchema
);
module.exports = { DoctorActivityDb };
