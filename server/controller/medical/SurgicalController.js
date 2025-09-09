const { SurgicalDb } = require("../../model/medical/Surgical");
const BaseController = require("../core/baseController");

class SurgicalController extends BaseController {
  constructor() {
    super(SurgicalDb);
    this.populateFields = ["patient", "appointment"];
  }

  // Add surgical-specific methods here if needed
}

module.exports = new SurgicalController();
