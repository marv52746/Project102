const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const supplyItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  unit: String,
  quantity_available: Number,
  reorder_level: Number,
  supplier: String,
  expiration_date: Date,
  last_restocked: Date,

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const SupplyItemDb = mongoose.model("supply_item", supplyItemSchema);
module.exports = { SupplyItemDb };
