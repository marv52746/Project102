const { UserDb } = require("../../model/User");
const {
  createNotificationService,
} = require("../../service/notificationService");
const { logActivity } = require("../../utils/activityLogger");

class BaseController {
  constructor(model, tableName) {
    this.model = model;
    this.tableName = tableName || model.modelName; // fallback to Mongoose model name
    this.modelName = model.modelName?.toLowerCase(); // ✅ keep a lowercase model name for comparisons
  }

  // ✅ Centralized logging method so we don't repeat tableName
  async logActivity(action, record, userId) {
    try {
      await logActivity(action, this.tableName, record, userId);
    } catch (err) {
      console.error("❌ Activity Log Error:", err.message);
    }
  }
  // ✅ Reusable broadcast method
  broadcastChange(event, data) {
    try {
      if (global.io) {
        // More flexible than global.emitAppointmentUpdate
        global.io.emit(event, {
          table: this.tableName,
          model: this.modelName,
          data,
        });
        console.log(`📢 Broadcasted [${event}] for ${this.tableName}`);
      } else if (global.emitAppointmentUpdate) {
        // backward compatibility if you used global.emitAppointmentUpdate
        global.emitAppointmentUpdate(data);
      } else {
        console.warn("⚠️ No socket.io instance found for broadcast");
      }
    } catch (err) {
      console.error("❌ Broadcast Error:", err.message);
    }
  }

  // In your BaseController or appointmentsController
  getAll = async (req, res) => {
    try {
      const filters = { ...req.query };
      let query = this.model.find();
      const moment = require("moment-timezone");

      // 🕗 Special handling: date=today
      if (filters.date === "today") {
        // PH timezone
        const timezone = "Asia/Manila";

        // Start and end of today in PH time
        const startOfDayPH = moment().tz(timezone).startOf("day"); // 00:00:00 PH
        const endOfDayPH = moment().tz(timezone).endOf("day"); // 23:59:59 PH

        // Convert to UTC for MongoDB query
        const startOfDayUTC = startOfDayPH.utc().toDate();
        const endOfDayUTC = endOfDayPH.utc().toDate();

        // MongoDB query
        query = query.find({
          date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
        });
        delete filters.date;
      } else if (filters.date) {
        // Handle arbitrary date string
        const timezone = "Asia/Manila";
        const datePH = moment.tz(filters.date, timezone);

        const startOfDayPH = datePH.startOf("day");
        const endOfDayPH = datePH.endOf("day");

        query = query.find({
          date: {
            $gte: startOfDayPH.utc().toDate(),
            $lte: endOfDayPH.utc().toDate(),
          },
        });

        delete filters.date;
      }

      const mongoose = require("mongoose");

      // Apply remaining filters
      // Object.keys(filters).forEach((key) => {
      //   let value = filters[key];

      //   // ✅ Auto-convert string IDs to ObjectId for these fields
      //   if (["doctor", "patient", "created_by", "updated_by"].includes(key)) {
      //     try {
      //       value = mongoose.Types.ObjectId(value);
      //     } catch (err) {
      //       console.warn(`Invalid ObjectId for ${key}:`, value);
      //     }
      //   }
      //   query = query.where(key).equals(filters[key]);
      // });
      Object.keys(filters).forEach((key) => {
        let value = filters[key];

        // ✅ Only treat as ObjectId if value looks valid
        if (
          ["doctor", "patient", "created_by", "updated_by"].includes(key) &&
          typeof value === "string" &&
          /^[0-9a-fA-F]{24}$/.test(value)
        ) {
          value = new mongoose.Types.ObjectId(value); // ✅ FIXED
        } else if (
          ["doctor", "patient", "created_by", "updated_by"].includes(key)
        ) {
          console.warn(`⚠️ Skipping invalid ObjectId for ${key}: ${value}`);
          return; // skip invalid filter
        }

        query = query.where(key).equals(value);
      });

      // Populate as before
      if (Array.isArray(this.populateFields) && this.populateFields.length) {
        this.populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const items = await query;
      res.json(items);
    } catch (error) {
      console.error("Error in getAll:", error);
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      let query = this.model.findById(req.params.id);

      if (Array.isArray(this.populateFields) && this.populateFields.length) {
        this.populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const item = await query;

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req, res) => {
    try {
      // const newItem = new this.model(req.body);
      const newItem = new this.model({
        ...req.body,
        created_by: req.currentUser?._id || null, // ✅ auto-set creator
        updated_by: req.currentUser?._id || null, // ✅ auto-set creator
      });
      const savedItem = await newItem.save();
      await this.logActivity("create", savedItem, req.currentUser?._id);

      // 🔥 Emit "created" event
      this.broadcastChange(`${this.modelName}_created`, savedItem);

      res.status(201).json(savedItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          updated_by: req.currentUser?._id || null, // only update this field
        },
        { new: true, runValidators: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      await this.logActivity("update", updatedItem, req.currentUser?._id);

      // 🔥 Emit "updated" event
      this.broadcastChange(`${this.modelName}_updated`, updatedItem);

      res.json(updatedItem);
    } catch (error) {
      console.error("❌ Update Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const deletedItem = await this.model.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      await this.logActivity("delete", deletedItem, req.currentUser?._id);

      // 🔥 Emit "deleted" event
      this.broadcastChange(`${this.modelName}_deleted`, deletedItem);

      res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = BaseController;
