// routes/medical/vital.js
const vitalController = require("../../controller/medical/vitalController");
const createCrudRouter = require("../../router/createCrudRouter");

module.exports = createCrudRouter(vitalController);
