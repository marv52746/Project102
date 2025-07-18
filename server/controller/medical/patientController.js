const { PatientDb } = require("../../model/Patient");
const { UserDb } = require("../../model/User");
const BaseController = require("../core/baseController");

class PatientController extends BaseController {
  constructor() {
    super(PatientDb);
  }

  // Custom create method linking Patient to a User
  createLinkedToUser = async (req, res) => {
    try {
      const { userId, medical_notes } = req.body;

      // Validate user exists
      const user = await UserDb.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create the patient record
      const patient = new PatientDb({
        user: user._id,
        medical_notes,
        // add other fields as needed
      });

      const savedPatient = await patient.save();
      res.status(201).json(savedPatient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllPatient = async (req, res) => {
    try {
      const patients = await PatientDb.find().populate("user"); // ← Populates user info
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getByIdPatient = async (req, res) => {
    try {
      const patient = await PatientDb.findById(req.params.id).populate("user");
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new PatientController();
