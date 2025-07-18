const express = require("express");
const router = express.Router();
const propertyController = require("../../controller/core/propertyController");
const multer = require("multer");
const upload = multer();

router.post("/", upload.none(), propertyController.create); // POST /property
router.get("/", propertyController.getAll); // GET /property
router.get("/:id", propertyController.getById); // GET /property/:id
router.put("/:id", upload.none(), propertyController.update); // PUT /property/:id
router.delete("/:id", propertyController.delete); // DELETE /property/:id

module.exports = router;
