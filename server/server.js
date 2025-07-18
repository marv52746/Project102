const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const sendReminders = require("./jobs/appointmentReminder");

require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT || 8080;

// Create express instance
const app = express();

// ✅ Connect to database
connect();

// Run every day at 8 AM
cron.schedule("0 8 * * *", () => {
  console.log("Running daily SMS reminder task");
  sendReminders();
});

// ✅ Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors)
app.use(
  cors({
    origin: "*",
  })
);

// CORS middleware
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// ✅ Routes
app.use("/api", require("./router/index"));

// ✅ Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:4000`);
});
