const fs = require("fs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const path = require("path");
const bcrypt = require("bcryptjs");
const { UserDb } = require("../../model/User");
const { PatientDb } = require("../../model/Patient");
const { DoctorDb } = require("../../model/Doctor");
const BaseController = require("./baseController");

const sendEmail = require("../../jobs/sendEmail");
const {
  createNotificationService,
} = require("../../service/notificationService");

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

// helper: generate a secure temporary password
function generateTempPassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
  let ret = "";
  // Use crypto.randomBytes for secure randomness
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    // map byte to index in charset
    ret += charset[bytes[i] % charset.length];
  }
  return ret;
}

class UserController extends BaseController {
  constructor() {
    super(UserDb);
  }

  // CREATE USER
  create = async (req, res) => {
    try {
      const {
        password,
        email,
        first_name,
        middle_initial,
        last_name,
        googleId, // if supplied in body
        suffix,
        ...userData
      } = req.body;

      console.log(req.body);

      if (!email) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      let finalPassword = null;
      let mustChange = false;

      // If password provided in payload -> use it
      if (password) {
        finalPassword = password;
      } else {
        // If NOT Google-created (no googleId) then generate a temp password
        if (!googleId) {
          finalPassword = generateTempPassword(12); // 12 char secure temp password
          mustChange = true; // mark that user should change password on first login
        } else {
          // Created by Google (or other OAuth) - leave password null
          finalPassword = null;
        }
      }

      // 1. Hash password
      let hashedPassword = null;
      if (finalPassword) {
        hashedPassword = await bcrypt.hash(finalPassword, 10);
      }

      // 2. Build full name
      const fullName =
        [first_name, middle_initial ? middle_initial + "." : null, last_name]
          .filter(Boolean)
          .join(" ")
          .trim() + (suffix ? `, ${suffix}` : "");

      const fullNameOnly = [
        first_name,
        middle_initial ? middle_initial + "." : null,
        last_name,
      ]
        .filter(Boolean)
        .join(" ");

      // 2. Create user without avatar first
      const user = new UserDb({
        ...userData,
        first_name,
        middle_initial,
        last_name,
        suffix,
        name: fullName,
        fullname: fullNameOnly,
        email,
        username: email,
        password: hashedPassword,
        must_change_password: mustChange,
        googleId: googleId || undefined,
        avatar: null,
      });

      const savedUser = await user.save();

      // 3. Upload avatar to GridFS (if present)
      if (req.file && req.file.buffer) {
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null); // signal end of stream

        const uploadStream = gfs.openUploadStream(`${savedUser._id}`);

        readableStream.pipe(uploadStream);

        const fileId = await new Promise((resolve, reject) => {
          uploadStream.on("finish", () => resolve(uploadStream.id));
          uploadStream.on("error", reject);
        });

        // 4. Update user with GridFS file ID
        savedUser.avatar = fileId;
        await savedUser.save();
      }

      // ✅ Handle created_by / updated_by
      if (req.currentUser?._id) {
        savedUser.created_by = req.currentUser._id;
        savedUser.updated_by = req.currentUser._id;
      } else {
        // Signup case: self-reference
        savedUser.created_by = savedUser._id;
        savedUser.updated_by = savedUser._id;
      }
      await savedUser.save();

      // If we generated a temp password, email it to the user
      if (!password && !googleId && finalPassword) {
        await createNotificationService({
          category: "user_password",
          type: "create",
          data: {
            password: finalPassword,
            user: savedUser,
          },
          recipients: [savedUser.email],
          status: "immediate",
        });
      }

      // ✅ Log Activity
      await this.logActivity("create", savedUser, req.currentUser?._id);

      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Create User Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // UPDATE USER
  update = async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        email,
        first_name,
        middle_initial,
        last_name,
        suffix,
        ...updates
      } = req.body;

      if (email) {
        updates.email = email;
        updates.username = email;
      }

      const user = await UserDb.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (first_name !== undefined) updates.first_name = first_name;
      if (middle_initial !== undefined) updates.middle_initial = middle_initial;
      if (last_name !== undefined) updates.last_name = last_name;
      if (suffix !== undefined) updates.suffix = suffix;

      // Build new name field
      const newFirst = first_name ?? user.first_name ?? "";
      const newMI = middle_initial ?? user.middle_initial ?? "";
      const newLast = last_name ?? user.last_name ?? "";
      const newSuffix = suffix ?? user.suffix ?? "";

      updates.name =
        [newFirst, newMI ? newMI + "." : null, newLast]
          .filter(Boolean)
          .join(" ") + (newSuffix ? `, ${newSuffix}` : "");

      updates.fullname = [newFirst, newMI ? newMI + "." : null, newLast]
        .filter(Boolean)
        .join(" ");

      // ✅ If new avatar is uploaded
      if (req.file && req.file.buffer) {
        // Delete old avatar from GridFS
        if (user.avatar) {
          try {
            await gfs.delete(new mongoose.Types.ObjectId(user.avatar));
          } catch (err) {
            console.warn("Old avatar delete failed or not found:", err.message);
          }
        }

        // Upload new avatar to GridFS
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        const uploadStream = gfs.openUploadStream(`${userId}`);

        readableStream.pipe(uploadStream);

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", () => {
            updates.avatar = uploadStream.id;
            resolve();
          });
          uploadStream.on("error", reject);
        });
      }

      // ✅ Track updater
      updates.updated_by = req.currentUser?._id || user.updated_by;

      // Update user record
      const updatedUser = await UserDb.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      res.status(201).json(updatedUser);
    } catch (error) {
      console.error("Update User Error:", error);
      return res.status(500).json({
        error: error.message,
        stack: error.stack,
        body: req.body,
      });
    }
  };

  delete = async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await UserDb.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 1. Delete linked patient if user is a patient
      if (user.role === "patient") {
        await PatientDb.deleteOne({ user: userId });
      }

      // 2. Delete linked doctor if user is a doctor
      if (user.role === "doctor") {
        await DoctorDb.deleteOne({ user: userId });
      }

      // 3. Delete user avatar in GridFS (if exists)
      if (user.avatar) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(user.avatar));
        } catch (err) {
          console.warn("Failed to delete avatar from GridFS:", err.message);
        }
      }

      // 4. Delete user
      await UserDb.findByIdAndDelete(userId);

      // ✅ Log Activity
      await this.logActivity("delete", user, req.currentUser?._id);

      res.status(200).json({ message: "User and related records deleted." });
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserDb.findOne({ email });
      if (!user)
        return res.status(404).json({ error: "No user with that email" });

      const token = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset</p>
             <p><a href="${resetURL}">Click here to reset</a></p>`,
      });

      res.json({ message: "Password reset link sent" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await UserDb.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user)
        return res.status(400).json({ error: "Invalid or expired token" });

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Password has been reset successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}

module.exports = new UserController();
