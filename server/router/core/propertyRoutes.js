const express = require("express");
const router = express.Router();
const propertyController = require("../../controller/core/propertyController");
const multer = require("multer");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = multer();

router.post("/", authMiddleware, upload.none(), propertyController.create); // POST /property
router.get("/", authMiddleware, propertyController.getAll); // GET /property
router.get("/:id", authMiddleware, propertyController.getById); // GET /property/:id
router.put("/:id", authMiddleware, upload.none(), propertyController.update); // PUT /property/:id
router.delete("/:id", authMiddleware, propertyController.delete); // DELETE /property/:id

module.exports = router;
