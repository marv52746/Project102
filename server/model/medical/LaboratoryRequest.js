const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const labRequestSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  appointment: { type: ObjectId, ref: "appointment" },

  name: { type: String, required: true }, // e.g. Complete Blood Count (CBC)
  name_custom: { type: String }, // e.g. Complete Blood Count (CBC)
  requested_on: { type: Date, default: Date.now },
  doctor: { type: ObjectId, ref: "user" },
  notes: { type: String }, // special instructions
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  result: { type: String }, // textual result / findings
  completed_on: { type: Date },

  created_on: { type: Date, default: Date.now },
  created_by: { type: ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: ObjectId, ref: "user" },
});

const LabRequestDb = mongoose.model("labrequest", labRequestSchema);
module.exports = { LabRequestDb };
