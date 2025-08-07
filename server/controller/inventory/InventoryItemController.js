const { InventoryItemDb } = require("../../model/inventory/InventoryItem");
const BaseController = require("../core/baseController");

class InventoryItemController extends BaseController {
  constructor() {
    super(InventoryItemDb);
  }

  // Add supply-specific methods here
}

module.exports = new InventoryItemController();
