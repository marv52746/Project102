const { VitalsDb } = require("../../model/medical/Vitals");
const BaseController = require("../core/baseController");

class VitalController extends BaseController {
  constructor() {
    super(VitalsDb);
    this.populateFields = ["patient", "appointment"];
  }

  // Add vital-specific methods here
}

module.exports = new VitalController();
