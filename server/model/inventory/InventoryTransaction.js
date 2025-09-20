const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InventoryItem",
    required: true,
  },
  type: {
    type: String,
    enum: ["Stock in", "Stock out", "Adjustment"],
    required: true,
  },
  quantity: { type: Number, required: true },
  unit: { type: String },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const InventoryTransactionDb = mongoose.model(
  "InventoryTransaction",
  transactionSchema
);
module.exports = { InventoryTransactionDb };
