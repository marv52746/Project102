const express = require("express");
const router = express.Router();
const patientController = require("../../controller/medical/patientController");
const userController = require("../../controller/core/userController");
const multer = require("multer");
const upload = multer();
const checkRole = require("../../middleware/checkRole");

// router.post(
//   "/",
//   upload.none(),
//   //   checkRole("admin", "doctor", "owner", "staff"), // not working in postman
//   userController.create
// );
// router.get("/", patientController.getAllPatient);
// router.get("/:id", patientController.getByIdPatient);
// router.put("/:id", upload.none(), patientController.update);
// router.delete("/:id", patientController.delete);

router.post("/", upload.none(), patientController.create);
router.get("/", patientController.getAll);
router.get("/:id", patientController.getById);
router.put("/:id", upload.none(), patientController.update);
router.delete("/:id", patientController.delete);

module.exports = router;
