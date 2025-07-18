const { UserDb } = require("../model/User"); // Adjust path if needed

// Middleware: check role by userId from session
const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const currentUser = req.session.user; // ✅ Use session

      if (!currentUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await UserDb.findById(currentUser._id);

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: Access Denied" });
      }

      // Optional: attach user object if you need it later
      req.currentUser = user;

      next();
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = checkRole;
