const { UserDb } = require("../../model/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library"); // ✅ Import this
const {
  createNotificationService,
} = require("../../service/notificationService");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // ✅ Initialize the client

// helper: generate a secure temporary password
function generateTempPassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
  let ret = "";
  // Use crypto.randomBytes for secure randomness
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    // map byte to index in charset
    ret += charset[bytes[i] % charset.length];
  }
  return ret;
}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserDb.findOne({ email }).select(
      "+password +temp_password"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let isMatch = false;

    // First check the real password
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    // If not matching, check temp_password
    if (!isMatch && user.temp_password) {
      isMatch = await bcrypt.compare(password, user.temp_password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.fullname,
        fullname: user.fullname,
        role: user.role,
        type: user.user_type,
        avatar: user.avatar,
        must_change_password: user.must_change_password,
      },
      JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // console.log(ticket);
    const payload = ticket.getPayload();

    const { sub, email, given_name, family_name, name } = payload;

    // Check if user already exists
    let user = await UserDb.findOne({ email });

    if (!user) {
      // Create new user (default role: guest/patient)
      user = new UserDb({
        email,
        first_name: given_name,
        last_name: family_name,
        username: email,
        googleId: sub,
        fullname: name,
        name: name,
        // avatar: picture,
      });
      await user.save();
    }

    // Create your own JWT
    const appToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        type: user.user_type,
        fullname: user.fullname,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    // console.log({
    //   id: user._id,
    //   email: user.email,
    //   role: user.role,
    //   type: user.user_type,
    //   fullname: user.fullname,
    //   avatar: user.avatar,
    // });

    res.status(200).json({ token: appToken });
  } catch (err) {
    console.error("Google login error", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

const signup = async (req, res) => {
  try {
    const { email, password, ...userObject } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await UserDb.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (default role = "guest", update this as needed)
    const newUser = new UserDb({
      ...userObject,
      email,
      password: hashedPassword,
      username: email,
    });

    const savedUser = await newUser.save();

    // Sign JWT token
    const token = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        type: savedUser.user_type,
        fullname: savedUser.fullname,
        avatar: savedUser.avatar,
      },
      JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Force user to change their password
 * - Verifies current password
 * - Updates with new password
 * - Resets must_change_password flag
 */
const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new password are required" });
    }

    // get current logged-in user from token (req.user should be set by auth middleware)
    const userId = req.currentUser;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // get user with password field
    const user = await UserDb.findById(userId).select(
      "+password +temp_password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check current password OR temp_password
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }
    if (!isMatch && user.temp_password) {
      isMatch = await bcrypt.compare(password, user.temp_password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user
    user.password = hashedPassword;
    user.temp_password = undefined; // clear temporary password
    user.must_change_password = false; // reset flag
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserDb.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a secure random temporary password
    const tempPassword = generateTempPassword(12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user record
    user.temp_password = hashedPassword;
    user.must_change_password = true;
    await user.save();

    // Send the temp password via email
    await createNotificationService({
      category: "forgot_password",
      type: "create",
      data: {
        password: tempPassword,
        user: user,
      },
      recipients: [user.email],
      status: "immediate",
    });

    res.json({ message: "Temporary password sent to email." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  googleLogin,
  signup,
  changePassword,
  forgotPassword,
};
