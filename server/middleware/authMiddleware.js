const jwt = require("jsonwebtoken");
const { UserDb } = require("../model/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log(decoded);

    // Option 1: Just attach decoded token
    // req.user = decoded;

    const userId = decoded._id || decoded.id;
    // Option 2: Fetch fresh user record from DB (safer if user roles/permissions may change)
    const user = await UserDb.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    req.currentUser = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
