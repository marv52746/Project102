// utils/createCrudRouter.js
const express = require("express");
const multer = require("multer");
const upload = multer();

const createCrudRouter = (controller) => {
  const router = express.Router();

  router.post("/", upload.none(), controller.create);
  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);
  router.put("/:id", upload.none(), controller.update);
  router.delete("/:id", controller.delete);

  return router;
};

module.exports = createCrudRouter;
