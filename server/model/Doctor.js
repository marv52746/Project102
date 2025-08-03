const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user", // Reference to User table
    required: true,
    unique: true, // One user should map to one doctor
  },
  specialization: {
    type: [String],
    required: true,
    default: [],
  },
  years_of_experience: {
    type: Number,
    default: 0,
  },
  qualifications: [String], // Example: ["MD", "FPCS"]
  biography: {
    type: String,
  },
  available_days: [String], // Example: ["Monday", "Wednesday", "Friday"]
  schedule: [
    {
      day: String,
      morning: String, // e.g. "9:00 AM - 12:00 PM"
      afternoon: String, // e.g. "1:00 PM - 5:00 PM"
    },
  ],
  location: {
    clinic_name: String,
    address: String,
  },
  contact: {
    phone: String,
    email: String,
  },
  documents: [
    {
      name: String,
      url: String, // If you're storing in S3 or GridFS, link or ObjectId
    },
  ],
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
});

const DoctorDb = mongoose.model("doctor", doctorSchema);
module.exports = { DoctorDb };
