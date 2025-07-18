const { DoctorActivityDb } = require("../../model/DoctorActivityLog");
const BaseController = require("../core/baseController");

class DoctorActivityController extends BaseController {
  constructor() {
    super(DoctorActivityDb);
  }

  // Add activity-specific methods here
}

module.exports = new DoctorActivityController();
