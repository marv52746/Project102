const { AppointmentDb } = require("../../model/Appointment");
const BaseController = require("../core/baseController");

class AppointmentController extends BaseController {
  constructor() {
    super(AppointmentDb);
    this.populateFields = ["patient", "doctor"];
    // super(AppointmentDb, ["patient", "doctor"]);
  }

  // Add appointment-specific methods here
}

module.exports = new AppointmentController();
