const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vitalSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "patient", required: true },
  recorded_by: { type: ObjectId, ref: "user" },
  date_recorded: { type: Date, default: Date.now },
  blood_pressure: String,
  heart_rate: Number,
  temperature: Number,
  oxygen_saturation: Number,
  respiratory_rate: Number,
  weight: Number,
  height: Number,
});

const VitalDb = mongoose.model("vital", vitalSchema);
module.exports = { VitalDb };
