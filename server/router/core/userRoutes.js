const express = require("express");
const router = express.Router();
const userController = require("../../controller/core/userController");
const multer = require("multer");
const upload = require("../../middleware/upload");
const checkRole = require("../../middleware/checkRole");

router.post(
  "/",
  // checkRole("admin", "doctor", "owner", "staff"),
  upload.single("avatar"), // handles one file upload from field named 'avatar'
  userController.createUser
); // POST /user
router.get("/", userController.getAll); // GET /user
router.get("/:id", userController.getById); // GET /user/:id
router.put("/:id", upload.single("avatar"), userController.updateUser); // PUT /user/:id
router.delete("/:id", userController.delete); // DELETE /user/:id

module.exports = router;
