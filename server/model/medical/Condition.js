const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const conditionSchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },
  appointment: { type: ObjectId, ref: "appointment" },

  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: false, // e.g., ICD-10 code like "E11.1"
  },
  notes: {
    type: String,
  },
  diagnosed_date: {
    type: Date,
  },

  created_on: { type: Date, default: Date.now },
  created_by: { type: ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: ObjectId, ref: "user" },
});

const ConditionDb = mongoose.model("condition", conditionSchema);
module.exports = { ConditionDb };
