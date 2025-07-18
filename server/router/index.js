const express = require("express");
const router = express.Router();

// Core routes
const fileRoutes = require("./file/fileRoutes"); // If you have file upload routes
const userRoutes = require("./core/userRoutes");
const propertyRoutes = require("./core/propertyRoutes");

// Medical domain routes
const patientRoutes = require("./medical/patientRoutes");
const vitalRoutes = require("./medical/vitalRoutes");
const appointmentRoutes = require("./medical/appointmentRoutes");
const birthReportRoutes = require("./medical/birthReportRoutes");
const doctorActivityRoutes = require("./medical/doctorActivityRoutes");
const laboratoryRoutes = require("./medical/laboratoryRoutes");
const authRoutes = require("./core/authRoutes"); // ✅ ADD THIS LINE

// Finance domain routes
const billingRoutes = require("./finance/billingRoutes");
const sendReminders = require("../jobs/appointmentReminder");

// Register routes
router.use("/files", fileRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/auth", authRoutes); // ✅ REGISTER AUTH ROUTE HERE

router.use("/patients", patientRoutes);
router.use("/vitals", vitalRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/birthReport", birthReportRoutes);
router.use("/doctorActivity", doctorActivityRoutes);
router.use("/laboratory", laboratoryRoutes);

router.use("/billings", billingRoutes);

module.exports = router;
