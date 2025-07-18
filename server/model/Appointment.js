const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    appointment_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^APT-\d{4}$/, // Optional validation
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true, // faster queries
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // optional validation HH:mm
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show", "rescheduled"],
      default: "scheduled",
    },
    // rescheduled_from: {
    //   type: Schema.Types.ObjectId,
    //   ref: "appointment",
    //   default: null,
    // },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);

// Auto-generate appointment_no before saving (optional)
appointmentSchema.pre("validate", async function (next) {
  if (this.isNew && !this.appointment_no) {
    try {
      const lastAppointment = await AppointmentDb.findOne({}).sort({
        created_on: -1,
      });

      const lastNumber =
        lastAppointment?.appointment_no?.split("-")[1] || "0000";
      const nextNumber = String(parseInt(lastNumber) + 1).padStart(4, "0");

      this.appointment_no = `APT-${nextNumber}`;
    } catch (err) {
      return next(err);
    }
  }

  next();
});

// Optional: Add a compound index for date + doctor to prevent double-booking
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

const AppointmentDb = mongoose.model("appointment", appointmentSchema);
module.exports = { AppointmentDb };
