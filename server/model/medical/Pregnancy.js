const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pregnancySchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  doctor: { type: ObjectId, ref: "user" },
  ultrasound: { type: ObjectId, ref: "ultrasound" },

  gravida_para: { type: String }, // Example: "G3P1(1011)"
  lmp: { type: Date }, // Last Menstrual Period
  edd: { type: Date }, // Expected Due Date
  aog: { type: String }, // Age of Gestation ex. "21W 4D"
  day_of_cycle: { type: String },

  // 🧾 Notes and status
  status: {
    type: String,
    enum: ["active", "delivered", "archived"],
    default: "active",
  },
  notes: { type: String },

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const PregnancyDb = mongoose.model("pregnancy", pregnancySchema);
module.exports = { PregnancyDb };
