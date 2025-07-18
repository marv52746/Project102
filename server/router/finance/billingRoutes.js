const express = require("express");
const router = express.Router();
const billingController = require("../../controller/finance/billingController");
const multer = require("multer");
const upload = multer();

router.post("/", upload.none(), billingController.create);
router.get("/", billingController.getAll);
router.get("/:id", billingController.getById);
router.put("/:id", upload.none(), billingController.update);
router.delete("/:id", billingController.delete);

module.exports = router;
