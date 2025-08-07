const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["Medicine", "Supply", "Equipment", "Vaccine", "Others"],
    required: true,
  },
  unit: { type: String },
  quantity: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  expiryDate: { type: Date },
  supplier: { type: String },
  batchNumber: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const InventoryItemDb = mongoose.model("InventoryItem", inventoryItemSchema);
module.exports = { InventoryItemDb };
