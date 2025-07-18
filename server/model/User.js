const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

// Employee Schema
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
    // unique: true,
  },
  address: {
    type: String,
  },
  fullname: {
    type: String,
  },
  avatar: {
    type: String,
  },
  // avatar: {
  //   data: Buffer,
  //   contentType: String,
  // },
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
    required: true,
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
  created_by: {
    _id: {
      type: ObjectId,
      ref: "user",
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  updated_on: {
    type: Date,
  },
  updated_by: {
    _id: {
      type: ObjectId,
      ref: "user",
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  hire_date: {
    type: Date,
  },

  status: {
    type: String,
  },
  name: { type: String },
  googleId: { type: String },
  picture: { type: String },
});

// Password hash on save
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Models
const UserDb = mongoose.model("user", userSchema);

module.exports = { UserDb };
