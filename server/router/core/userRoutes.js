const express = require("express");
const router = express.Router();
const userController = require("../../controller/core/userController");
const upload = require("../../middleware/uploadMemory"); // 👈 memory-based multer
const authMiddleware = require("../../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  upload.single("avatar"), // handles one file upload from field named 'avatar'
  userController.create
); // POST /user
router.get("/", userController.getAll); // GET /user
router.get("/:id", authMiddleware, userController.getById); // GET /user/:id
router.put(
  "/:id",
  authMiddleware,
  upload.single("avatar"),
  userController.update
); // PUT /user/:id
router.delete("/:id", authMiddleware, userController.delete); // DELETE /user/:id

module.exports = router;
