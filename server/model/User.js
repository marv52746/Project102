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
  password: {
    type: String,
    minlength: 8,
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

// // 🔐 Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }

//   // Combine first_name and last_name into name
//   if (this.isModified("first_name") || this.isModified("last_name")) {
//     const first = this.first_name?.trim() || "";
//     const last = this.last_name?.trim() || "";
//     this.name = `${first} ${last}`.trim();
//   }

//   next();
// });

// // 🔁 Hash password & combine name during update
// userSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();

//   // Combine first_name + last_name -> name
//   if (update.first_name || update.last_name) {
//     const first = update.first_name?.trim() || "";
//     const last = update.last_name?.trim() || "";
//     update.name = `${first} ${last}`.trim();
//   }

//   // Hash password if included in update
//   if (update.password) {
//     const salt = await bcrypt.genSalt(10);
//     update.password = await bcrypt.hash(update.password, salt);
//   }

//   this.setUpdate(update);
//   next();
// });

// Model Export
const UserDb = mongoose.model("user", userSchema);
module.exports = { UserDb };
