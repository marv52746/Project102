const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: { type: String },
    phone_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
    },
    schedule: {
      type: String,
    },
    time: {
      type: String,
    },
    services: [
      {
        type: String,
      },
    ],
    operating_hours: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        open: { type: String, default: "-" }, // e.g. "09:00"
        close: { type: String, default: "-" }, // e.g. "17:00"
      },
    ],
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // reference doctors
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // admin user
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ClinicDb = mongoose.model("clinic", clinicSchema);

module.exports = ClinicDb;
