
import "./app.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Teachers from "./pages/teachers";
import Admin from "./pages/admin";
import Parent from "./pages/parent";
import ManageTeachers from "./pages/admin-manage-teachers";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<Teachers />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/admin-manage-teachers" element={<ManageTeachers />} /> 
      </Routes>
    </Router>
  );
}

export default App;