const express = require("express");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const router = express.Router();

let gfs;

// Wait for mongoose connection
mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

// GET /api/file/:id — stream image from GridFS
router.get("/:id", async (req, res) => {
  try {
    if (!gfs) {
      return res.status(503).json({ error: "GridFS not initialized yet." });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await gfs.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = files[0];

    // ✅ Let browser decide how to handle image
    res.set("Content-Type", file.contentType || "image/jpeg");

    const readStream = gfs.openDownloadStream(fileId);
    readStream.pipe(res);
  } catch (err) {
    console.error("GridFS stream error:", err);
    res.status(500).json({ error: "Failed to stream file." });
  }
});

module.exports = router;
