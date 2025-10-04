const jwt = require("jsonwebtoken");
const { UserDb } = require("../model/User");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  // console.log(token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log(decoded._id);

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
    // console.error("❌ JWT Verify Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
