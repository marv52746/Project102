const { BillingDb } = require("../../model/Billing");
const BaseController = require("../core/baseController");

class BillingController extends BaseController {
  constructor() {
    super(BillingDb);
  }

  // Add billing-specific methods here
}

module.exports = new BillingController();
