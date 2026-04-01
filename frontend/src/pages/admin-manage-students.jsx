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

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/students?classLevel=${selectedClass}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load students");

        // SORT ALPHABETICALLY BY NAME
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
      parentPhone: student.parentPhone || "",
      // Full parent info (already populated by backend)
      parentName: student.parentId?.name || "",
      parentEmail: student.parentId?.email || "",
      grade: student.grade || "",
      teacherSuggestion: student.teacherSuggestion || ""
    });
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Update failed");
      setShowModal(false);
      window.location.reload(); // refresh list
    } catch (err) {
      alert("Failed to update student");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student and their parent account permanently?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s._id !== id));
        alert("Student deleted successfully.");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to delete");
      }
    } catch (err) {
      alert("Error connecting to server");
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
        <p className="no-data">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="no-data">No students found in {selectedClass}</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Parent Name</th>
                <th>Parent Email</th>
                <th>Parent Phone</th>
                <th>Grade</th>
                <th>Suggestion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.parentId?.name || "-"}</td>
                  <td>{s.parentId?.email || "-"}</td>
                  <td>{s.parentPhone || "-"}</td>
                  <td>{s.grade || "-"}</td>
                  <td>{s.teacherSuggestion || "-"}</td>
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

      {/* EDIT MODAL - FULL INFO */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Student</h2>
            <input value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Student Name" />
            <input value={formData.parentName || ""} disabled placeholder="Parent Name (cannot change)" />
            <input value={formData.parentEmail || ""} disabled placeholder="Parent Email" />
            <input value={formData.parentPhone || ""} onChange={e => setFormData({...formData, parentPhone: e.target.value})} placeholder="Parent Phone" />
           
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