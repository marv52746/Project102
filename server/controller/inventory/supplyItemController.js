const { SupplyItemDb } = require("../../model/SupplyItem");
const BaseController = require("../core/baseController");

class SupplyItemController extends BaseController {
  constructor() {
    super(SupplyItemDb);
  }

  // Add supply-specific methods here
}

module.exports = new SupplyItemController();
