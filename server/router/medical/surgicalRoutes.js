const surgicalController = require("../../controller/medical/SurgicalController");
const createCrudRouter = require("../createCrudRouter");

module.exports = createCrudRouter(surgicalController);
