// models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["create", "update", "delete", "view"], // you can add more
    required: true,
  },
  table: { type: String, required: true }, // e.g., "patients", "appointments"
  recordId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the affected document
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // who did it
  description: { type: String },
  dataSnapshot: {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // ✅ tell Mongoose this is a ref
    // any other fields you expect
  },

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const ActivityDb = mongoose.model("activity", activitySchema);
module.exports = { ActivityDb };
