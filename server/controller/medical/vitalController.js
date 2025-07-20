const { VitalDb } = require("../../model/Vital");
const BaseController = require("../core/baseController");

class VitalController extends BaseController {
  constructor() {
    super(VitalDb);
    this.populateFields = ["patient", "recorded_by"];
  }

  // Add vital-specific methods here
}

module.exports = new VitalController();
