const { PropertyDb } = require("../../model/properties"); // Adjust the path as needed
const BaseController = require("./baseController");

class PropertyController extends BaseController {
  constructor() {
    super(PropertyDb);
  }

  // You can add user-specific methods here if needed
}

module.exports = new PropertyController();
