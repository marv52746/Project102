const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      default: process.env.CLINIC_EMAIL, // fallback to system email
    },
    to: {
      type: [String],
      required: true,
    },
    replyTo: {
      type: [String],
    },
    cc: {
      type: [String],
    },
    bcc: {
      type: [String],
    },
    subject: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    html: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "immediate"],
      default: "pending",
    },
    sendAt: {
      type: Date,
      default: Date.now, // can schedule later
    },

    created_on: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    updated_on: { type: Date, default: Date.now },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const NotificationDb = mongoose.model("notification", NotificationSchema);
module.exports = { NotificationDb };
