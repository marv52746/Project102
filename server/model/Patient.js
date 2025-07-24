const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const patientSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user" }, // if linked to user login
  blood_type: String,
  emergency_contact: String,
  medical_notes: String,
  registration_date: { type: Date, default: Date.now },
  created_on: { type: Date, default: Date.now },
  created_by: { type: ObjectId, ref: "user" },

  updated_on: { type: Date, default: Date.now },
  updated_by: { type: ObjectId, ref: "user" },
});

const PatientDb = mongoose.model("patient", patientSchema);
module.exports = { PatientDb };
