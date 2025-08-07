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
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  timestamp: { type: Date, default: Date.now },
});

const InventoryTransactionDb = mongoose.model(
  "InventoryTransaction",
  transactionSchema
);
module.exports = { InventoryTransactionDb };
