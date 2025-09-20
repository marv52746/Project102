const { InventoryItemDb } = require("../../model/inventory/InventoryItem");
const BaseController = require("../core/baseController");

class InventoryItemController extends BaseController {
  constructor() {
    super(InventoryItemDb);
    this.populateFields = ["created_by", "updated_by"];
  }

  // Add supply-specific methods here
}

module.exports = new InventoryItemController();
