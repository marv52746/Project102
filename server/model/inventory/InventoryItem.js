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

  created_on: { type: Date, default: Date.now },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updated_on: { type: Date, default: Date.now },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const InventoryItemDb = mongoose.model("InventoryItem", inventoryItemSchema);
module.exports = { InventoryItemDb };
