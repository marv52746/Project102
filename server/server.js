require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cors = require("cors");
const path = require("path");
const http = require("http"); // 👈 Needed for Socket.IO
const { Server } = require("socket.io"); // 👈 Import Socket.IO
const socketManager = require("./socket");

require("./jobs/cron"); // ✅ just import to start the cron scheduler
const PORT = process.env.PORT || 8080;

// Create express instance
const app = express();

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Initialize Socket.IO with CORS setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://kanvi.net",
      "https://bisligpremier.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// 🔥 Store globally for controllers
global.io = io;

// ✅ Initialize Socket Manager
socketManager.init(io);

// ✅ Connect to database
connect();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://kanvi.net",
      "http://localhost:3000",
      "https://bisligpremier.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// ✅ Routes
app.use("/api", require("./router/index"));

// ✅ Static file serving
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ✅ Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
// ✅ Start the server (attach both Express + Socket.IO)
server.listen(PORT, () => {
  console.log(`🚀 Server and Socket.IO running on http://localhost:${PORT}`);
});
