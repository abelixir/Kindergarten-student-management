const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
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
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;