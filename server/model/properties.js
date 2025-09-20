// eslint-disable-next-line no-undef
const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed, // Can store string, number, boolean, object, etc.
    required: true,
  },
  type: {
    type: String,
    enum: ["string", "number", "boolean", "json", "file"],
    default: "string",
  },
  description: {
    type: String,
  },

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

// Middleware to update the lastUpdated field before saving
propertySchema.pre("save", function (next) {
  if (!this.isNew) {
    this.updated_on = Date.now();
  }
  next();
});

const PropertyDb = mongoose.model("Property", propertySchema);

module.exports = { PropertyDb };
