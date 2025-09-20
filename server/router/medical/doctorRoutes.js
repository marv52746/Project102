const express = require("express");
const router = express.Router();
const multer = require("multer");
const doctorController = require("../../controller/medical/doctorController");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = multer();

router.post("/", authMiddleware, upload.none(), doctorController.createDoctor);
router.get("/", authMiddleware, doctorController.getAll);
router.get("/:id", authMiddleware, doctorController.getById);
router.put("/:id", authMiddleware, upload.none(), doctorController.update);
router.delete("/:id", authMiddleware, doctorController.deleteDoctor);

module.exports = router;
