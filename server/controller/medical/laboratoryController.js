const { LaboratoryRecordDb } = require("../../model/LaboratoryRecord");
const BaseController = require("../core/baseController");

class LaboratoryController extends BaseController {
  constructor() {
    super(LaboratoryRecordDb);
  }

  // Add lab-specific methods here
}

module.exports = new LaboratoryController();
