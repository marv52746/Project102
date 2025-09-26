const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./jobs/cron"); // ✅ just import to start the cron scheduler
const PORT = process.env.PORT || 8080;

// Create express instance
const app = express();

// ✅ Connect to database
connect();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Routes
app.use("/api", require("./router/index"));

// ✅ Static file serving
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
