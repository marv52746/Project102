const allergyController = require("../../controller/medical/AllergyController");
const createCrudRouter = require("../createCrudRouter");

module.exports = createCrudRouter(allergyController);
