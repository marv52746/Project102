const fs = require("fs");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const path = require("path");
const bcrypt = require("bcryptjs");
const { UserDb } = require("../../model/User");
const { PatientDb } = require("../../model/Patient");
const BaseController = require("./baseController");

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

class UserController extends BaseController {
  constructor() {
    super(UserDb);
  }

  // CREATE USER
  createUser = async (req, res) => {
    try {
      const { password, email, first_name, last_name, ...userData } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // 1. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const fullName = `${first_name || ""} ${last_name || ""}`.trim();

      // 2. Create user without avatar first
      const user = new UserDb({
        ...userData,
        first_name,
        last_name,
        name: fullName,
        email,
        username: email,
        password: hashedPassword,
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

      // res.status(201).json({
      //   ...savedUser.toObject(),
      //   avatarUrl: savedUser.avatar
      //     ? `${process.env.BASE_URL}/api/file/${savedUser.avatar}`
      //     : null,
      // });
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
      const { email, first_name, last_name, ...updates } = req.body;

      if (email) {
        updates.email = email;
        updates.username = email;
      }

      const user = await UserDb.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (first_name !== undefined) updates.first_name = first_name;
      if (last_name !== undefined) updates.last_name = last_name;

      // Set combined name field
      const newFirst = first_name ?? user.first_name ?? "";
      const newLast = last_name ?? user.last_name ?? "";
      updates.name = `${newFirst} ${newLast}`.trim();

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

      // Update user record
      const updatedUser = await UserDb.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      res.status(201).json(updatedUser);
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
