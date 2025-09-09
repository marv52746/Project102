const { AllergyDb } = require("../../model/medical/Allergies");
const BaseController = require("../core/baseController");

class AllergyController extends BaseController {
  constructor() {
    super(AllergyDb);
    this.populateFields = ["patient", "appointment"];
  }

  // Add allergy-specific methods here if needed
}

module.exports = new AllergyController();
