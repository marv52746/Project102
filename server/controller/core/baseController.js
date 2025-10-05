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

  // getAll = async (req, res) => {
  //   try {
  //     const filters = req.query;
  //     let query = this.model.find(filters);

  //     if (Array.isArray(this.populateFields) && this.populateFields.length) {
  //       this.populateFields.forEach((field) => {
  //         query = query.populate(field);
  //       });
  //     }

  //     const items = await query;
  //     res.json(items);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };

  // In your BaseController or appointmentsController
  getAll = async (req, res) => {
    try {
      const filters = { ...req.query };
      let query = this.model.find();

      // 🕗 Special handling: date=today
      if (filters.date === "today") {
        const now = new Date();

        // Compute PH start and end of the day in UTC
        const startOfDayPH = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );
        const startOfDayUTC = new Date(
          startOfDayPH.getTime() - 8 * 60 * 60 * 1000
        ); // PH -8h
        const endOfDayUTC = new Date(
          startOfDayUTC.getTime() + 24 * 60 * 60 * 1000
        );

        query = query.find({
          date: { $gte: startOfDayUTC, $lt: endOfDayUTC },
        });

        delete filters.date;
      } else if (filters.date) {
        // 🕗 optional: handle ISO string or range
        const date = new Date(filters.date);
        const start = new Date(date.setUTCHours(0, 0, 0, 0));
        const end = new Date(date.setUTCHours(23, 59, 59, 999));
        query = query.find({ date: { $gte: start, $lt: end } });
        delete filters.date;
      }

      // Apply remaining filters
      Object.keys(filters).forEach((key) => {
        query = query.where(key).equals(filters[key]);
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
      res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = BaseController;
