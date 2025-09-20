const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pregnancySchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  appointment: { type: ObjectId, ref: "appointment" },

  is_pregnant: { type: Boolean, default: false },
  gravida: { type: Number, default: 0 }, // total pregnancies
  para: { type: Number, default: 0 }, // total births
  code: { type: String },
  lmp: { type: Date }, // Last Menstrual Period
  edd: { type: Date }, // Expected Due Date
  trimester: { type: String, enum: ["First", "Second", "Third"] },
  notes: String, // Pregnancy-related notes or risks

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const PregnancyDb = mongoose.model("pregnancy", pregnancySchema);
module.exports = { PregnancyDb };
