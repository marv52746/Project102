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

  // ✅ Reusable broadcast method
  broadcastChange(event, data, transaction) {
    console.log("broadcastChange triggered");
    try {
      if (global.io) {
        // More flexible than global.emitAppointmentUpdate
        global.io.emit(event, {
          table: this.tableName,
          model: this.modelName,
          data,
          transaction,
        });
        console.log(`📢 Broadcasted [${event}] for ${this.tableName}`);
      } else {
        console.warn("⚠️ No socket.io instance found for broadcast");
      }
    } catch (err) {
      console.error("❌ Broadcast Error:", err.message);
    }
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

      // 🔥 Emit "created" event
      this.broadcastChange(
        `${this.modelName}_created`,
        inventoryItem,
        transaction
      );

      // Staff stock alert
      if (inventoryItem.quantity <= inventoryItem.reorderLevel) {
        await createNotificationService({
          category: "staff",
          type: "stockAlerts",
          data: inventoryItem,
          recipients: [process.env.CLINIC_EMAIL, process.env.INVENTORYADMIN],
          cc: [],
          status: "immediate",
        });
      }

      res.json({ item: inventoryItem, transaction });
    } catch (error) {
      console.error("Update Transaction Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // ✅ Update existing transaction and re-sync item quantity
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const { type, quantity, reason } = req.body;

      const transaction = await InventoryTransactionDb.findById(id);
      if (!transaction)
        return res.status(404).json({ error: "Transaction not found" });

      const inventoryItem = await InventoryItemDb.findById(transaction.item);
      if (!inventoryItem)
        return res.status(404).json({ error: "Item not found" });

      const oldQuantity = parseFloat(transaction.quantity);
      const newQuantity = parseFloat(quantity);
      const oldType = transaction.type;
      const newType = type;

      // ✅ Revert old transaction effect
      if (oldType === "Stock in") inventoryItem.quantity -= oldQuantity;
      if (oldType === "Stock out") inventoryItem.quantity += oldQuantity;
      if (oldType === "Adjustment") {
        // For adjustments, we cannot "revert" — instead, we re-apply the new value
        // by using the previous known baseline if stored, or skip revert
      }

      // ✅ Apply new transaction logic
      if (newType === "Stock in") inventoryItem.quantity += newQuantity;
      if (newType === "Stock out") {
        if (inventoryItem.quantity < newQuantity) {
          return res.status(400).json({ error: "Insufficient stock" });
        }
        inventoryItem.quantity -= newQuantity;
      }
      if (newType === "Adjustment") inventoryItem.quantity = newQuantity;

      // ✅ Save updated item and transaction
      transaction.type = newType;
      transaction.quantity = newQuantity;
      transaction.reason = reason || transaction.reason;
      transaction.updated_by = req.currentUser?._id || null;

      await inventoryItem.save();
      await transaction.save();

      await this.logActivity("update", transaction, req.currentUser?._id);

      this.broadcastChange(
        `${this.modelName}_updated`,
        inventoryItem,
        transaction
      );

      // Check reorder level again
      if (inventoryItem.quantity <= inventoryItem.reorderLevel) {
        await createNotificationService({
          category: "staff",
          type: "stockAlerts",
          data: inventoryItem,
          recipients: [process.env.CLINIC_EMAIL, process.env.INVENTORYADMIN],
          cc: [],
          status: "immediate",
        });
      }

      res.json({
        message: "Transaction and inventory updated successfully",
        item: inventoryItem,
        transaction,
      });
    } catch (error) {
      console.error("Update Transaction Error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new InventoryTransactionController();
