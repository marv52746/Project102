const { ConditionDb } = require("../../model/medical/Condition");
const BaseController = require("../core/baseController");

class ConditionController extends BaseController {
  constructor() {
    super(ConditionDb);
    this.populateFields = ["patient"];
  }

  // Add condition-specific methods here if needed
}

module.exports = new ConditionController();
