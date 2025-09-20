const { PatientDb } = require("../../model/Patient");
const { UserDb } = require("../../model/User");
const BaseController = require("../core/baseController");

class PatientController extends BaseController {
  constructor() {
    super(PatientDb);
    this.populateFields = ["user"];
  }

  // Custom create method linking Patient to a User

  createPatient = async (req, res) => {
    try {
      const { user, ...patientData } = req.body;

      if (typeof user !== "object") {
        return res.status(400).json({ message: "Invalid user input" });
      }

      const { _id, first_name, last_name, ...rest } = user;

      const userPayload = {
        ...rest,
        first_name,
        last_name,
        role: "patient",
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
        // If no _id, create new user
        savedUser = new UserDb(userPayload);
        await savedUser.save();
      }

      const newPatient = new PatientDb({
        ...patientData,
        user: savedUser._id,
        created_by: req.currentUser?._id || null,
        updated_by: req.currentUser?._id || null,
      });

      const savedPatient = await newPatient.save();

      // ✅ Log Activity
      await this.logActivity("create", savedPatient, req.currentUser?._id);

      res.status(201).json(savedPatient);
    } catch (error) {
      console.error("Create Patient Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { user, ...patientData } = req.body;

      // ✅ track updater
      patientData.updated_by = req.currentUser?._id || null;

      // Update Patient data
      const updatedPatient = await PatientDb.findByIdAndUpdate(
        req.params.id,
        patientData,
        { new: true, runValidators: true }
      );

      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // ✅ Update linked User record
      if (user && typeof user === "object" && user._id) {
        const { _id, first_name, last_name, ...userFields } = user;

        await UserDb.findByIdAndUpdate(
          _id,
          {
            ...userFields,
            first_name,
            last_name,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
          },
          { new: true, runValidators: true }
        );
      }

      res.json(updatedPatient);
    } catch (error) {
      console.error("Update Patient Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  deletePatient = async (req, res) => {
    try {
      const patientId = req.params.id;

      // 1. Find the Patient record first
      const patientRecord = await PatientDb.findById(patientId);
      if (!patientRecord) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // 2. Update associated user's role to "guest"
      await UserDb.findByIdAndUpdate(
        patientRecord.user, // assumes your schema has 'user' as user reference
        { role: "guest" },
        { new: true, runValidators: true }
      );

      // 3. Delete the patient record
      const deletedItem = await PatientDb.findByIdAndDelete(patientId);

      // ✅ Log Activity
      await this.logActivity("delete", deletedItem, req.currentUser?._id);

      res.json({ message: "Patient deleted successfully", deletedItem });
    } catch (error) {
      console.error("Delete Patient Error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new PatientController();
