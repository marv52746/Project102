const { MedicationDb } = require("../../model/medical/Medications");
const BaseController = require("../core/baseController");

class MedicationController extends BaseController {
  constructor() {
    super(MedicationDb);
    this.populateFields = ["patient", "appointment"];
  }

  // Add medication-specific methods here if needed
}

module.exports = new MedicationController();
