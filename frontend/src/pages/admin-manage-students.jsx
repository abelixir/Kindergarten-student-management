import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/admin-manage-students.css";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("KG1");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/students?classLevel=${selectedClass}`)
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);
  }, [selectedClass]);

  const openEdit = (student) => {
    setFormData({
      ...student,
      parentName: student.parentId?.name || "",
      parentEmail: student.parentId?.email || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    await fetch(`http://localhost:5000/api/students/${formData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        classLevel: formData.classLevel,
        parentPhone: formData.parentPhone,
        // parent updates are handled in backend if needed
      })
    });
    setShowModal(false);
    // refresh
    window.location.reload();
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
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Parent Name</th>
              <th>Parent Email</th>
              <th>Parent Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.parentId?.name}</td>
                <td>{s.parentId?.email}</td>
                <td>{s.parentPhone}</td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(s)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Student</h2>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
            <div className="modal-footer">
              <button className="confirm-btn" onClick={handleSubmit}>Save</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;