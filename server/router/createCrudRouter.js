// utils/createCrudRouter.js
const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const upload = multer();

const createCrudRouter = (controller) => {
  const router = express.Router();

  router.post("/", authMiddleware, upload.none(), controller.create);
  router.get("/", authMiddleware, controller.getAll);
  router.get("/:id", authMiddleware, controller.getById);
  router.put("/:id", authMiddleware, upload.none(), controller.update);
  router.delete("/:id", authMiddleware, controller.delete);

  return router;
};

module.exports = createCrudRouter;
