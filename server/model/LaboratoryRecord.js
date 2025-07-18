const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const laboratoryRecordSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "patient" },
  test_type: String,
  requested_by: { type: ObjectId, ref: "user" },
  result: String,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  date_requested: { type: Date, default: Date.now },
  date_completed: Date,
  file_attachment: String,
});

const LaboratoryRecordDb = mongoose.model(
  "laboratory_record",
  laboratoryRecordSchema
);
module.exports = { LaboratoryRecordDb };
