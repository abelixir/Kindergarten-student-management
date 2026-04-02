const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Simple password check (replace with bcrypt if you hash passwords)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      userId: user._id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error("Login route error:", err); // <-- important for Render logs
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;