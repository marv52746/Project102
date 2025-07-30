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
    default: "guest",
  },
  additional_information: {
    type: String,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  created_by: { type: ObjectId, ref: "user" },
  updated_on: {
    type: Date,
  },
  updated_by: { type: ObjectId, ref: "user" },
  hire_date: {
    type: Date,
  },
  status: {
    type: String,
  },
  name: {
    type: String,
  },
  googleId: {
    type: String,
  },
  picture: {
    type: String,
  },
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
