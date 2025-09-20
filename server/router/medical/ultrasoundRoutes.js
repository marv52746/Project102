const express = require("express");
const router = express.Router();
const controller = require("../../controller/medical/Ultrasound");
const multer = require("multer");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = multer();

router.post("/", authMiddleware, upload.none(), controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware, upload.none(), controller.update);
router.delete("/:id", authMiddleware, controller.delete);

module.exports = router;
