const { PregnancyDb } = require("../../model/medical/Pregnancy");
const BaseController = require("../core/baseController");

class PregnancyController extends BaseController {
  constructor() {
    super(PregnancyDb);
    this.populateFields = ["patient", "appointment"];
  }

  // Add specific methods here if needed
}

module.exports = new PregnancyController();
