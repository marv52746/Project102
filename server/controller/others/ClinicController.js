const ClinicDb = require("../../model/Clinic");
const BaseController = require("../core/baseController");

class ClinicController extends BaseController {
  constructor() {
    super(ClinicDb);
    this.populateFields = ["doctors", "created_by"];
  }

  // Add specific methods here if needed
}

module.exports = new ClinicController();
