// src/components/admin-manage-students.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/admin-manage-students.css";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("KG1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  const subjects = ["Maths", "English", "Amharic", "Science", "Art"];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students?classLevel=${selectedClass}`);
        const data = await res.json();
        const sorted = Array.isArray(data) 
          ? data.sort((a, b) => a.name.localeCompare(b.name)) 
          : [];
        setStudents(sorted);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const openEdit = (student) => {
    setFormData({
      _id: student._id,
      name: student.name,
      classLevel: student.classLevel,
      parentPhone: student.parentPhone || "",
      // Parent info for display only
      parentName: student.parentId?.name || "",
      parentEmail: student.parentId?.email || ""
    });
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const updateData = {
        name: formData.name,
        classLevel: formData.classLevel,
        parentPhone: formData.parentPhone
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        setShowModal(false);
        window.location.reload(); // Simple refresh
      } else {
        alert("Failed to update student");
      }
    } catch (err) {
      alert("Error updating student");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student permanently?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s._id !== id));
        alert("Student deleted successfully.");
      }
    } catch (err) {
      alert("Error deleting student");
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Manage Students – {selectedClass}</h1>
        <Link to="/admin" className="back-link">← Back to Dashboard</Link>
      </header>

      <div className="class-tabs">
        {["KG1", "KG2", "KG3"].map(cls => (
          <button key={cls} className={selectedClass === cls ? "active" : ""} onClick={() => setSelectedClass(cls)}>
            {cls}
          </button>
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p className="no-data">Loading...</p>
      ) : students.length === 0 ? (
        <p className="no-data">No students found in {selectedClass}</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                {subjects.map(sub => <th key={sub}>{sub}</th>)}
                <th>Suggestion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.classLevel}</td>
                  {subjects.map(sub => (
                    <td key={sub}><strong>{s.grades?.[sub] || "-"}</strong></td>
                  ))}
                  <td style={{ maxWidth: "280px", whiteSpace: "pre-wrap" }}>
                    {s.suggestions || "-"}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => openEdit(s)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteStudent(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Simplified Edit Modal - Admin can only edit basic info */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Student Info</h2>

            <input 
              value={formData.name || ""} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Student Name *" 
            />

            <select 
              value={formData.classLevel || ""} 
              onChange={e => setFormData({...formData, classLevel: e.target.value})}
            >
              <option value="KG1">KG1</option>
              <option value="KG2">KG2</option>
              <option value="KG3">KG3</option>
            </select>

            <input 
              value={formData.parentPhone || ""} 
              onChange={e => setFormData({...formData, parentPhone: e.target.value})} 
              placeholder="Parent Phone" 
            />

            {/* Read-only fields */}
            <input value={formData.parentName || ""} disabled placeholder="Parent Name (View Only)" />
            <input value={formData.parentEmail || ""} disabled placeholder="Parent Email (View Only)" />

            <p style={{ marginTop: "15px", fontStyle: "italic", color: "#666" }}>
              Grades and Suggestion can only be edited by the assigned Teacher.
            </p>

            <div className="modal-footer">
              <button className="confirm-btn" onClick={handleEditSubmit}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;