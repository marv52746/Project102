const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const birthReportSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "patient" },
  doctor: { type: ObjectId, ref: "user" },
  birth_date: Date,
  time_of_birth: String,
  place_of_birth: String,
  baby_weight: Number,
  baby_length: Number,
  complications: String,
  notes: String,

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const BirthReportDb = mongoose.model("birth_report", birthReportSchema);
module.exports = { BirthReportDb };
