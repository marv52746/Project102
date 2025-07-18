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
  created_by: {
    _id: { type: ObjectId, ref: "user" },
    fullname: String,
    email: String,
  },
});

const SupplyItemDb = mongoose.model("supply_item", supplyItemSchema);
module.exports = { SupplyItemDb };
