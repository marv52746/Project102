const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    appointment_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^APT-\d{7}$/, // Format: APT-0000001
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
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
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:mm format
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    diagnosis: {
      type: String,
    },
    amount: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "cancelled",
        "no-show",
        "rescheduled",
        "ready",
      ],
      default: "scheduled",
    },

    // ✅ References to clinical records
    vitals: [{ type: Schema.Types.ObjectId, ref: "vitals" }],
    medication: [{ type: Schema.Types.ObjectId, ref: "medication" }],
    allergy: [{ type: Schema.Types.ObjectId, ref: "allergy" }],
    condition: [{ type: Schema.Types.ObjectId, ref: "condition" }],
    surgical: [{ type: Schema.Types.ObjectId, ref: "surgical" }],
    pregnancy: [{ type: Schema.Types.ObjectId, ref: "pregnancy" }],
    labrequest: [{ type: Schema.Types.ObjectId, ref: "labrequest" }],
    ultrasound: [{ type: Schema.Types.ObjectId, ref: "ultrasound" }],

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

// Compound index to prevent double-booking
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

// Auto-generate appointment_no before saving
appointmentSchema.pre("validate", async function (next) {
  if (this.isNew && !this.appointment_no) {
    try {
      const lastAppointment = await this.constructor
        .findOne({})
        .sort({ created_on: -1 })
        .lean();

      const lastNumber =
        lastAppointment?.appointment_no?.split("-")[1] || "0000001";
      const nextNumber = String(parseInt(lastNumber, 10) + 1).padStart(7, "0");

      this.appointment_no = `APT-${nextNumber}`;
    } catch (err) {
      return next(err);
    }
  }

  next();
});

const AppointmentDb = mongoose.model("appointment", appointmentSchema);
module.exports = { AppointmentDb };
