const { InventoryItemDb } = require("../../model/inventory/InventoryItem");
const {
  InventoryTransactionDb,
} = require("../../model/inventory/InventoryTransaction");
const {
  createNotificationService,
} = require("../../service/notificationService");
const { logActivity } = require("../../utils/activityLogger");
const BaseController = require("../core/baseController");

class InventoryTransactionController extends BaseController {
  constructor() {
    super(InventoryTransactionDb);
    this.populateFields = ["item", "created_by", "updated_by"];
  }

  // Stock in/out/adjustment
  create = async (req, res) => {
    try {
      const { item, type, quantity, reason } = req.body;

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
      // console.log(req.currentUser);

      const transaction = new InventoryTransactionDb({
        item,
        type,
        quantity,
        reason,
        created_by: req.currentUser?._id || null, // ✅ renamed
        updated_by: req.currentUser?._id || null, // ✅ renamed
      });
      await transaction.save();

      // ✅ Log Activity
      await this.logActivity("create", transaction, req.currentUser?._id);

      // Staff stock alert
      if (inventoryItem.quantity <= inventoryItem.reorderLevel) {
        await createNotificationService({
          category: "staff",
          type: "stockAlerts",
          data: inventoryItem,
          recipients: ["admin@clinic.com"],
          cc: ["marv52746@gmail.com"],
          status: "immediate",
        });
      }

      res.json({ item: inventoryItem, transaction });
    } catch (error) {
      console.error("Update Transaction Error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new InventoryTransactionController();
