const { PregnancyDb } = require("../../model/medical/Pregnancy");
const BaseController = require("../core/baseController");

class PregnancyController extends BaseController {
  constructor() {
    super(PregnancyDb);
    this.populateFields = ["patient", "ultrasound"];
  }

  // Add specific methods here if needed
}

module.exports = new PregnancyController();
