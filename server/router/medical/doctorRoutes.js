const express = require("express");
const router = express.Router();
const multer = require("multer");
const doctorController = require("../../controller/medical/doctorController");
const upload = multer();

router.post("/", upload.none(), doctorController.createDoctor);
router.get("/", doctorController.getAll);
router.get("/:id", doctorController.getById);
router.put("/:id", upload.none(), doctorController.update);
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;
