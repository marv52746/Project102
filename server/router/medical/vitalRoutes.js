const express = require("express");
const router = express.Router();
const vitalController = require("../../controller/medical/vitalController");
const multer = require("multer");
const upload = multer();

router.post("/", upload.none(), vitalController.create);
router.get("/", vitalController.getAll);
router.get("/:id", vitalController.getById);
router.put("/:id", upload.none(), vitalController.update);
router.delete("/:id", vitalController.delete);

module.exports = router;
