const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { UserDb } = require("../../model/User");
const { PatientDb } = require("../../model/Patient");
const BaseController = require("./baseController");

class UserController extends BaseController {
  constructor() {
    super(UserDb);
  }

  // CREATE USER
  createUser = async (req, res) => {
    try {
      const { password, email, ...userData } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // 1. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 2. Temporarily get filename (rename after saving user)
      const tempAvatar = req.file ? req.file.filename : null;

      // 3. Create user
      const user = new UserDb({
        ...userData,
        email,
        username: email,
        password: hashedPassword,
        avatar: null, // set later
      });
      const savedUser = await user.save();

      // 4. Rename file if uploaded
      if (tempAvatar) {
        const ext = path.extname(tempAvatar);
        const newFilename = `${savedUser._id}${ext}`;
        const uploadDir = path.join(__dirname, "../../uploads/avatars");

        const oldPath = path.join(uploadDir, tempAvatar);
        const newPath = path.join(uploadDir, newFilename);
        fs.renameSync(oldPath, newPath);

        savedUser.avatar = `/uploads/avatars/${newFilename}`;
        await savedUser.save();
      }

      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Create User Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // UPDATE USER
  updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { email, ...updates } = req.body;

      if (email) {
        updates.email = email;
        updates.username = email;
      }

      const user = await UserDb.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (req.file) {
        // 1. Delete old avatar if it exists
        if (user.avatar) {
          const oldAvatarPath = path.join(__dirname, `../../${user.avatar}`);
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }

        // 2. Rename new uploaded file
        const ext = path.extname(req.file.originalname);
        const newFileName = `${userId}${ext}`;
        const uploadDir = path.join(__dirname, "../../uploads/avatars");

        const oldPath = path.join(uploadDir, req.file.filename);
        const newPath = path.join(uploadDir, newFileName);
        fs.renameSync(oldPath, newPath);

        updates.avatar = `/uploads/avatars/${newFileName}`;
      }

      const updatedUser = await UserDb.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update User Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // CREATE PATIENT
  createPatient = async (req, res) => {
    try {
      const { medical_notes, email, password, ...userData } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserDb({
        ...userData,
        email,
        username: email,
        password: hashedPassword,
      });
      const savedUser = await user.save();

      const patient = new PatientDb({
        user: savedUser._id,
        medical_notes,
      });

      const savedPatient = await patient.save();

      res.status(201).json(savedPatient);
    } catch (error) {
      console.error("Create Patient Error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new UserController();
