import "./app.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Admin from "./pages/admin";
import ManageTeachers from "./pages/admin-manage-teachers";
import ManageStudents from "./pages/admin-manage-students";
import ViewReport from "./pages/admin-view-report";
import Teacher from "./pages/teacher";
import Parent from "./pages/parent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-manage-teachers" element={<ManageTeachers />} />
        <Route path="/admin-manage-students" element={<ManageStudents />} />
        <Route path="/admin/view-report" element={<ViewReport />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/parent" element={<Parent />} />
      </Routes>
    </Router>
  );
}

export default App;