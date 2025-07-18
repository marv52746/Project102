class BaseController {
  constructor(model) {
    this.model = model;
  }

  getAll = async (req, res) => {
    try {
      const filters = req.query;
      let query = this.model.find(filters);

      // ✅ Safely check if populateFields is defined and is an array
      if (Array.isArray(this.populateFields) && this.populateFields.length) {
        this.populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const items = await query;
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      let query = this.model.findById(req.params.id);

      // ✅ Safely check if populateFields is defined and is an array
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
      const newItem = new this.model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
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
      res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = BaseController;
