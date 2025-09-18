const { UltrasoundDb } = require("../../model/medical/Ultrasound");
const BaseController = require("../core/baseController");

class UltrasoundController extends BaseController {
  constructor() {
    super(UltrasoundDb);
    this.populateFields = ["patient", "appointment"];
  }

  // Add allergy-specific methods here if needed
}

module.exports = new UltrasoundController();
