const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET current user profile
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user profile
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    if (password && password.trim() !== "") updateData.password = password;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;