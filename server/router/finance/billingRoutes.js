const express = require("express");
const router = express.Router();
const billingController = require("../../controller/finance/billingController");
const multer = require("multer");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = multer();

router.post("/", authMiddleware, upload.none(), billingController.create);
router.get("/", authMiddleware, billingController.getAll);
router.get("/:id", authMiddleware, billingController.getById);
router.put("/:id", authMiddleware, upload.none(), billingController.update);
router.delete("/:id", authMiddleware, billingController.delete);

module.exports = router;
