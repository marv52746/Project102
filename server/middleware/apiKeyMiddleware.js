// middleware/apiKeyMiddleware.js
require("dotenv").config();

module.exports = function (req, res, next) {
  // Skip API key check for file streaming route
  if (req.path.startsWith("/file")) {
    return next();
  }

  const clientKey =
    req.headers["x-api-key"] || req.query.apiKey || req.body.apiKey;

  if (!clientKey) {
    return res.status(401).json({
      success: false,
      message: "Missing API key",
    });
  }

  if (clientKey !== process.env.PUBLIC_API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
};
