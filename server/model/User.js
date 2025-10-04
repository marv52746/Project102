const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  password: { type: String, minlength: 8, select: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  temp_password: { type: String, select: false },
  // new flag to indicate the password was auto-generated and user should change it
  must_change_password: {
    type: Boolean,
    default: false,
  },

  username: {
    type: String,
  },
  address: {
    type: String,
  },
  fullname: {
    type: String,
  },
  clinic: [{ type: mongoose.Schema.Types.ObjectId, ref: "clinic" }],
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "uploads.files",
  },
  avatarID: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  middle_initial: {
    type: String, // e.g. "D."
    maxlength: 5,
  },
  suffix: {
    type: String, // e.g. "Jr.", "Sr.", "III"
    maxlength: 10,
  },
  date_of_birth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  phone_number: {
    // required: true,
    type: String,
  },
  emergency_contact: {
    type: String,
  },
  registration_date: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["guest", "staff", "doctor", "admin", "owner", "manager", "patient"],
    default: "patient",
  },
  additional_information: {
    type: String,
  },

  hire_date: {
    type: Date,
  },
  status: {
    type: String,
  },
  name: {
    type: String,
  },
  blood_type: {
    type: String,
  },
  googleId: {
    type: String,
  },
  picture: {
    type: String,
  },

  bio: {
    type: String,
  },

  license: {
    type: String,
  },
  specialization: {
    type: [String],
    default: [],
  },
  qualification: {
    type: [String],
    default: [],
  },
  certifications: {
    type: [String],
    default: [],
  },
  awards: {
    type: [String],
    default: [],
  },
  years_experience: {
    type: String,
  },

  facebook: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  website: { type: String },
  youtube: { type: String },

  schedule: [
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
        required: true,
      },
      morning: {
        type: String,
        default: "-", // e.g. "9:00–12:00" or "-"
      },
      afternoon: {
        type: String,
        default: "-",
      },
    },
  ],

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

userSchema.pre("save", async function (next) {
  // combine first/last name
  if (this.isModified("first_name") || this.isModified("last_name")) {
    const first = this.first_name?.trim() || "";
    const last = this.last_name?.trim() || "";
    this.fullname = `${first} ${last}`.trim();
  }
  next();
});

// 📌 Virtual field for computed age (PH timezone)
userSchema.virtual("age").get(function () {
  if (!this.date_of_birth) return null;

  // get "today" in PH timezone
  const todayPH = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );

  let age = todayPH.getFullYear() - this.date_of_birth.getFullYear();
  const m = todayPH.getMonth() - this.date_of_birth.getMonth();

  if (m < 0 || (m === 0 && todayPH.getDate() < this.date_of_birth.getDate())) {
    age--;
  }
  return age;
});

// Ensure virtuals show in JSON & Objects
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Model Export
const UserDb = mongoose.model("user", userSchema);
module.exports = { UserDb };
