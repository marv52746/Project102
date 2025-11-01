const { DoctorDb } = require("../../model/Doctor");
const { UserDb } = require("../../model/User");
const BaseController = require("../core/baseController");

class DoctorController extends BaseController {
  constructor() {
    super(DoctorDb);
    this.populateFields = ["user"];
  }

  // CREATE DOCTOR
  createDoctor = async (req, res) => {
    try {
      const { user, ...doctorData } = req.body;

      if (typeof user !== "object") {
        return res.status(400).json({ message: "Invalid user input" });
      }

      const { _id, first_name, last_name, ...rest } = user;

      const userPayload = {
        ...rest,
        first_name,
        last_name,
        role: "doctor",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
      };

      let savedUser;

      if (_id) {
        const existingUser = await UserDb.findById(_id);

        if (existingUser) {
          savedUser = await UserDb.findByIdAndUpdate(_id, userPayload, {
            new: true,
            runValidators: true,
          });
        } else {
          savedUser = new UserDb({ _id, ...userPayload });
          await savedUser.save();
        }
      } else {
        // If _id is missing, create a new user
        savedUser = new UserDb(userPayload);
        await savedUser.save();
      }

      // Create doctor linked to the saved user
      const newDoctor = new DoctorDb({
        ...doctorData,
        user: savedUser._id,
        created_by: req.currentUser?._id || null, // ✅ track creator
        updated_by: req.currentUser?._id || null, // ✅ initialize updated_by too
      });

      const savedDoctor = await newDoctor.save();

      // ✅ Log Activity
      // await this.logActivity("create", savedDoctor, req.currentUser?._id);

      res.status(201).json(savedDoctor);
    } catch (error) {
      console.error("Create Doctor Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // UPDATE DOCTOR
  update = async (req, res) => {
    try {
      const { user, ...doctorData } = req.body;

      // Add updated_by
      doctorData.updated_by = req.currentUser?._id || null;

      // Update Doctor record
      const updatedDoctor = await DoctorDb.findByIdAndUpdate(
        req.params.id,
        doctorData,
        { new: true, runValidators: true }
      );

      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // ✅ Update linked User record only if valid
      if (user && typeof user === "object" && user._id) {
        const { _id, first_name, last_name, ...userFields } = user;

        await UserDb.findByIdAndUpdate(
          _id,
          {
            ...userFields,
            first_name,
            last_name,
            role: "doctor",
            name: `${first_name || ""} ${last_name || ""}`.trim(),
          },
          { new: true, runValidators: true }
        );
      }

      res.json(updatedDoctor);
    } catch (error) {
      console.error("Update Doctor Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // DELETE DOCTOR
  deleteDoctor = async (req, res) => {
    try {
      const doctorId = req.params.id;

      const doctorRecord = await DoctorDb.findById(doctorId);
      if (!doctorRecord) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      await UserDb.findByIdAndUpdate(
        doctorRecord.user,
        { role: "guest" },
        { new: true, runValidators: true }
      );

      const deletedDoctor = await DoctorDb.findByIdAndDelete(doctorId);

      // ✅ Log Activity
      // await this.logActivity("delete", deletedDoctor, req.currentUser?._id);

      res.json({ message: "Doctor deleted successfully", deletedDoctor });
    } catch (error) {
      console.error("Delete Doctor Error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new DoctorController();
