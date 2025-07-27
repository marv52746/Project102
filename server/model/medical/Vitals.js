const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vitalsSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },

  date: { type: Date, default: Date.now },
  blood_pressure: String, // e.g., "120/80"
  heart_rate: Number, // bpm
  respiratory_rate: Number, // breaths per min
  temperature: Number, // °C
  weight: Number, // kg
  height: Number, // cm
  notes: String,

  created_on: { type: Date, default: Date.now },
  created_by: { type: ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: ObjectId, ref: "user" },
});

const VitalsDb = mongoose.model("vitals", vitalsSchema);
module.exports = { VitalsDb };
