require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = Router();

// User Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({ username, email, password });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.matchPasswordAndGenerateToken(email, password);
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(401).json({ message: error.message });
  }
});

// User Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
});

module.exports = router;
