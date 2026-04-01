import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/admin-manage-teachers.css";

function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/teachers")
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error(err));
  }, []);

  const openModal = (type, teacher = null) => {
    setMode(type);
    setSelectedTeacher(teacher);
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        password: "",
      });
    } else {
      setFormData({ name: "", email: "", password: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    if (mode === "add") {
      const res = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setTeachers([...teachers, data]);
    }

    if (mode === "edit") {
      await fetch(`http://localhost:5000/api/teachers/${selectedTeacher._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setTeachers(
        teachers.map((t) =>
          t._id === selectedTeacher._id ? { ...t, ...formData } : t
        )
      );
    }

    if (mode === "delete") {
      await fetch(`http://localhost:5000/api/teachers/${selectedTeacher._id}`, {
        method: "DELETE",
      });
      setTeachers(teachers.filter((t) => t._id !== selectedTeacher._id));
    }

    closeModal();
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Manage Teachers</h1>
        <Link to="/admin" className="back-link">← Back to Dashboard</Link>
      </header>

      <div className="top-bar">
        <button className="add-btn" onClick={() => openModal("add")}>
          + Add New Teacher
        </button>
      </div>

      <div className="table-container">
        {teachers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => openModal("edit", teacher)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => openModal("delete", teacher)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No teachers found</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {mode === "add" && "Add New Teacher"}
                {mode === "edit" && "Update Teacher"}
                {mode === "delete" && "Confirm Deletion"}
              </h2>
              <span className="close-btn" onClick={closeModal}>×</span>
            </div>

            <div className="modal-body">
              {mode !== "delete" ? (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password (leave empty to keep current)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </>
              ) : (
                <p className="delete-text">
                  Are you sure you want to delete <strong>{selectedTeacher?.name}</strong>?
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button className="confirm-btn" onClick={handleSubmit}>
                {mode === "delete" ? "Yes, Delete" : "Confirm"}
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTeachers;