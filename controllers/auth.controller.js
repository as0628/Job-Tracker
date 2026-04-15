const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;        // ✅ from URL
    const { password } = req.body;       // ✅ from body

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // 🔐 hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        reset_token: hashedToken,
        reset_token_expiry: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.reset_token = null;
    user.reset_token_expiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};






exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ message: "If email exists, reset link sent" });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    user.reset_token = hashedToken;
    user.reset_token_expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;

    await sendEmail(
      user.email,
      "🔐 Reset Your Password",
      `
Hello ${user.name || "User"},

You requested a password reset.

Click the link below (valid for 15 minutes):
${resetLink}

If you did not request this, ignore this email.

Job Tracker
      `
    );

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
