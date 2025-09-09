const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const surgicalSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  appointment: { type: ObjectId, ref: "appointment" },

  name: String, // e.g., "Appendectomy"
  year: Number,
  surgeon: String,
  notes: String,

  created_on: { type: Date, default: Date.now },
  created_by: { type: ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: ObjectId, ref: "user" },
});

const SurgicalDb = mongoose.model("surgical", surgicalSchema);
module.exports = { SurgicalDb };
