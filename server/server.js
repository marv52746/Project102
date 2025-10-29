require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./database/connection");
const cors = require("cors");
const path = require("path");
const http = require("http"); // 👈 Needed for Socket.IO
const { Server } = require("socket.io"); // 👈 Import Socket.IO
const socketManager = require("./socket");
const rateLimit = require("express-rate-limit");
const apiKeyMiddleware = require("./middleware/apiKeyMiddleware");

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
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
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

const allowedOrigins = [
  "https://kanvi.net",
  "https://bisligpremier.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (like from mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

// ✅ Rate Limiter Middleware
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500, // Limit each IP to 150 requests per minute
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all /api routes
app.use("/api/", apiLimiter);

// ✅ Apply API key middleware to all /api routes
app.use("/api/", apiKeyMiddleware);

// Handle preflight requests
app.options("*", cors());

// ✅ Routes
app.use("/api", require("./router/index"));

// ✅ Static file serving
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ✅ Start the server (attach both Express + Socket.IO)
server.listen(PORT, () => {
  console.log(`🚀 Server and Socket.IO running on http://localhost:${PORT}`);
});
