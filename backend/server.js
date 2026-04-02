const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// CORS setup - allow your deployed frontend
app.use(cors({
  origin: 'https://kindergarten-frontend-gy4c.onrender.com', // your frontend URL
  credentials: true
}));

// Routes
const loginRoute = require("./routes/login");
const teacherRoute = require("./routes/teachers");
const userRoute = require("./routes/user");
const studentRoute = require("./routes/students");

app.use("/api/login", loginRoute);
app.use("/api/teachers", teacherRoute);
app.use("/api/user", userRoute);
app.use("/api/students", studentRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => res.send("Backend is working!"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));