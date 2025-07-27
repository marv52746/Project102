const medicationController = require("../../controller/medical/MedicationController");
const createCrudRouter = require("../createCrudRouter");

module.exports = createCrudRouter(medicationController);
