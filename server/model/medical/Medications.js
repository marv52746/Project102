const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const medicationSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  appointment: { type: ObjectId, ref: "appointment" },

  name: String,
  dose: String, // e.g., "500mg"
  frequency: String, // e.g., "BID", "QD"
  start_date: Date,
  end_date: Date,
  notes: String,

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const MedicationDb = mongoose.model("medication", medicationSchema);
module.exports = { MedicationDb };
