// middleware/gridfsUpload.js

const multer = require("multer");
const { Readable } = require("stream");
const mongoose = require("mongoose");
const slugify = require("slugify");

let gfs;

mongoose.connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Only JPEG, JPG, PNG are allowed."));
  },
});

// Main upload handler for single avatar
const uploadAvatarToGridFS = async (req, res, next) => {
  try {
    if (!req.file) return next();

    if (!gfs) throw new Error("GridFS is not initialized");

    const filename = `${slugify(req.body.imageName || "avatar")}-${Date.now()}`;

    // Optional: Delete old avatar if exists
    if (req.body.avatar) {
      try {
        await gfs.delete(new mongoose.Types.ObjectId(req.body.avatar));
        console.log("Old avatar deleted");
      } catch (err) {
        console.warn("Failed to delete old avatar:", err.message);
      }
    }

    // Upload new file
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gfs.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("error", (err) => {
      return next(err);
    });

    uploadStream.on("finish", (file) => {
      req.body.avatar = file._id; // Attach file ID to request body
      next();
    });
  } catch (error) {
    next(error);
  }
};

// Multiple file upload handler (for future use)
const uploadMultipleToGridFS = async (req, res, next) => {
  try {
    if (!req.files || !req.files.length) return next();

    if (!gfs) throw new Error("GridFS is not initialized");

    const uploadResults = [];

    for (const file of req.files) {
      const filename = `${slugify(file.originalname)}-${Date.now()}`;

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      const uploadStream = gfs.openUploadStream(filename, {
        contentType: file.mimetype,
      });

      readableStream.pipe(uploadStream);

      const uploaded = await new Promise((resolve, reject) => {
        uploadStream.on("error", reject);
        uploadStream.on("finish", resolve);
      });

      uploadResults.push(uploaded._id);
    }

    req.body.uploadedFileIds = uploadResults;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  uploadAvatarToGridFS,
  uploadMultipleToGridFS,
};
