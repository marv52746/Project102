const express = require("express");
const router = express.Router();

// Core routes
const fileRoutes = require("./file/fileRoutes"); // If you have file upload routes
const userRoutes = require("./core/userRoutes");
const propertyRoutes = require("./core/propertyRoutes");

// Medical domain routes
const patientRoutes = require("./medical/patientRoutes");
const doctorRoutes = require("./medical/doctorRoutes");
const vitalRoutes = require("./medical/vitalRoutes");
const appointmentRoutes = require("./medical/appointmentRoutes");
const calendarRoute = require("./medical/calendarRoute");
const birthReportRoutes = require("./medical/birthReportRoutes");
const doctorActivityRoutes = require("./medical/doctorActivityRoutes");
const laboratoryRoutes = require("./medical/laboratoryRoutes");
const authRoutes = require("./core/authRoutes"); // ✅ ADD THIS LINE
const billingRoutes = require("./finance/billingRoutes");
const sendReminders = require("../jobs/appointmentReminder");
const medicationRoutes = require("./medical/medicationRoutes");
const allergyRoutes = require("./medical/allergyRoutes");
const surgicalRoutes = require("./medical/surgicalRoutes");
const conditionRoutes = require("./medical/conditionRoutes");
const inventoryRoutes = require("./inventory/inventoryItemRoutes");
const inventoryLogRoutes = require("./inventory/inventoryLogRoutes");
const activityRoutes = require("./core/activityRoutes");

// Core routes
router.use("/file", fileRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/auth", authRoutes); // ✅ REGISTER AUTH ROUTE HERE
router.use("/activities", activityRoutes);

router.use("/calendar", calendarRoute);

// Medical Routes
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/conditions", conditionRoutes);
router.use("/vitals", vitalRoutes);
router.use("/medications", medicationRoutes); // ✅
router.use("/allergies", allergyRoutes); // ✅
router.use("/surgeries", surgicalRoutes); // ✅

// Management Routes
router.use("/appointments", appointmentRoutes);
router.use("/birthReport", birthReportRoutes);
router.use("/doctorActivity", doctorActivityRoutes);
router.use("/laboratory", laboratoryRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/inventoryLogs", inventoryLogRoutes);

// Finance domain routes
router.use("/billings", billingRoutes);

module.exports = router;
