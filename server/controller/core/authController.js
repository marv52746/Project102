const { UserDb } = require("../../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library"); // ✅ Import this

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // ✅ Initialize the client

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserDb.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

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
        avatar: user.avatar,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
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
        fullname: user.fullname,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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
        fullname: savedUser.fullname,
        avatar: savedUser.avatar,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  login,
  googleLogin,
  signup,
};
