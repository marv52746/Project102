const { BirthReportDb } = require("../../model/BirthReport");
const BaseController = require("../core/baseController");

class BirthReportController extends BaseController {
  constructor() {
    super(BirthReportDb);
  }

  // Add report-specific methods here
}

module.exports = new BirthReportController();
