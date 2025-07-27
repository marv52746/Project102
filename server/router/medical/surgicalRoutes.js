const surgicalController = require("../../controller/medical/surgicalController");
const createCrudRouter = require("../createCrudRouter");

module.exports = createCrudRouter(surgicalController);
