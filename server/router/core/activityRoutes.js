const express = require("express");
const mongoose = require("mongoose");
const { ActivityDb } = require("../../model/Activity");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      userId,
      patientId,
      table,
      action,
      recordId,
      startDate,
      endDate,
      limit = 50,
      ...snapshotFilters
    } = req.query;

    const filter = {};

    // Top-level filters
    if (recordId) filter.recordId = recordId;
    if (userId) filter.userId = userId;
    if (patientId) filter["dataSnapshot.patient"] = patientId; // ✅ Fix here
    if (table) filter.table = table;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.created_on = {};
      if (startDate) filter.created_on.$gte = new Date(startDate);
      if (endDate) filter.created_on.$lte = new Date(endDate);
    }

    // Filters for fields inside dataSnapshot
    for (const [key, value] of Object.entries(snapshotFilters)) {
      if (
        ![
          "recordId",
          "userId",
          "table",
          "action",
          "startDate",
          "endDate",
          "limit",
        ].includes(key)
      ) {
        // Try converting to ObjectId if it looks like one
        if (mongoose.Types.ObjectId.isValid(value)) {
          filter[`dataSnapshot.${key}`] = new mongoose.Types.ObjectId(value);
        } else {
          filter[`dataSnapshot.${key}`] = value;
        }
      }
    }

    const activities = await ActivityDb.find(filter)
      .populate("userId", "name email")
      .populate("dataSnapshot.patient", "name") // ✅ Populate patient
      .sort({ created_on: -1 })
      .limit(parseInt(limit));

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
