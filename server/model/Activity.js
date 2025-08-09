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
  dataSnapshot: { type: Object }, // optional: store old/new data
  createdAt: { type: Date, default: Date.now },
});

const ActivityDb = mongoose.model("activity", activitySchema);
module.exports = { ActivityDb };
