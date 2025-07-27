const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const allergySchema = new mongoose.Schema({
  patient: { type: ObjectId, ref: "user", required: true },

  name: String, // e.g., "Penicillin"
  reaction: String, // e.g., "Rash"
  severity: String, // e.g., "Mild", "Moderate", "Severe"
  notes: String,

  created_on: { type: Date, default: Date.now },
  created_by: { type: ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: ObjectId, ref: "user" },
});

const AllergyDb = mongoose.model("allergy", allergySchema);
module.exports = { AllergyDb };
