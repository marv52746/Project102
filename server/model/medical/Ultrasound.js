const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ultrasoundSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  appointment: { type: ObjectId, ref: "appointment" },

  type: { type: String, required: true }, // e.g., OB Ultrasound, Pelvic, Abdominal
  type_custom: { type: String },
  findings: { type: String }, // descriptive text of findings
  impression: { type: String }, // summary or conclusion
  image_url: { type: String }, // optional file path / URL to image

  date: { type: Date, default: Date.now }, // date of ultrasound
  radiologist: { type: String },
  notes: { type: String },

  created_on: { type: Date, default: Date.now },
  created_by: { type: ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: ObjectId, ref: "user" },
});

const UltrasoundDb = mongoose.model("ultrasound", ultrasoundSchema);
module.exports = { UltrasoundDb };
