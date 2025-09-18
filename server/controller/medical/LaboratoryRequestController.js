const { LabRequestDb } = require("../../model/medical/LaboratoryRequest");
const BaseController = require("../core/baseController");

class LaboratoryRequestController extends BaseController {
  constructor() {
    super(LabRequestDb);
    this.populateFields = ["patient", "appointment"];
  }

  // Add allergy-specific methods here if needed
}

module.exports = new LaboratoryRequestController();
