const { InventoryItemDb } = require("../../model/inventory/InventoryItem");
const {
  InventoryTransactionDb,
} = require("../../model/inventory/InventoryTransaction");
const BaseController = require("../core/baseController");

class InventoryTransactionController extends BaseController {
  constructor() {
    super(InventoryTransactionDb);
    this.populateFields = ["item", "performedBy"];
  }

  // Stock in/out/adjustment
  create = async (req, res) => {
    try {
      const { item, type, quantity, reason, performedBy } = req.body;

      const inventoryItem = await InventoryItemDb.findById(item);
      if (!inventoryItem)
        return res.status(404).json({ error: "Item not found" });

      if (type === "Stock out" && inventoryItem.quantity < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      const parsedQuantity = parseFloat(quantity);
      if (type === "Stock in") inventoryItem.quantity += parsedQuantity;
      if (type === "Stock out") inventoryItem.quantity -= parsedQuantity;
      if (type === "Adjustment") inventoryItem.quantity = parsedQuantity;

      await inventoryItem.save();

      const transaction = new InventoryTransactionDb({
        item,
        type,
        quantity,
        reason,
        performedBy,
      });
      await transaction.save();

      res.json({ item: inventoryItem, transaction });
    } catch (error) {
      console.error("Update Transaction Error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new InventoryTransactionController();
