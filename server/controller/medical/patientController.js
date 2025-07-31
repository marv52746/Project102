const { PatientDb } = require("../../model/Patient");
const { UserDb } = require("../../model/User");
const BaseController = require("../core/baseController");

class PatientController extends BaseController {
  constructor() {
    super(PatientDb);
    this.populateFields = ["patient"];
  }

  // Custom create method linking Patient to a User
  createPatient = async (req, res) => {
    try {
      const { patient, first_name, last_name, ...patientData } = req.body;

      let user = await UserDb.findById(patient);

      // 1. If user doesn't exist, create one
      if (!user) {
        user = new UserDb({
          _id: patient, // optional: only if you're passing a specific ObjectId
          role: "patient",
          first_name,
          last_name,
          name: `${first_name} ${last_name}`.trim(),
          ...patientData,
        });

        await user.save();
      } else {
        // 2. If user exists, ensure role is 'patient'
        await UserDb.findByIdAndUpdate(
          patient,
          { role: "patient" },
          { new: true, runValidators: true }
        );
      }

      // 3. Create patient record linked to user
      const newPatient = new PatientDb({
        ...patientData,
        patient: user._id, // assumes PatientDb schema has `patient` as user ref
      });

      const savedPatient = await newPatient.save();
      res.status(201).json(savedPatient);
    } catch (error) {
      console.error("Create Patient Error:", error);
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
        patientRecord.patient, // assumes your schema has 'patient' as user reference
        { role: "guest" },
        { new: true, runValidators: true }
      );

      // 3. Delete the patient record
      const deletedItem = await PatientDb.findByIdAndDelete(patientId);

      res.json({ message: "Patient deleted successfully", deletedItem });
    } catch (error) {
      console.error("Delete Patient Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // getAllPatient = async (req, res) => {
  //   try {
  //     const patients = await PatientDb.find().populate("user"); // ← Populates user info
  //     res.json(patients);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };

  // getByIdPatient = async (req, res) => {
  //   try {
  //     const patient = await PatientDb.findById(req.params.id).populate("user");
  //     if (!patient) {
  //       return res.status(404).json({ message: "Patient not found" });
  //     }
  //     res.json(patient);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };
}

module.exports = new PatientController();
