// src/components/Teacher.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/teacher.css";

function Teacher() {
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [editStudentData, setEditStudentData] = useState({});

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name");

  const subjects = ["Maths", "English", "Amharic", "Science", "Art"];

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students?teacherId=${userId}`);
      const data = await res.json();
      const sorted = Array.isArray(data) 
        ? data.sort((a, b) => a.name.localeCompare(b.name)) 
        : [];
      setStudents(sorted);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile/${userId}`);
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      fetchStudents();
      fetchProfile();
    }
  }, [userId, navigate]);

  // ====================== GRADE UPDATE ======================
  const updateGrades = async (studentId, newGrades) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grades: newGrades })
      });

      if (res.ok) {
        fetchStudents();
      } else {
        alert("Failed to update grade");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating grade");
    }
  };

  // ====================== SUGGESTION ======================
  const openSuggestion = (student) => {
    setSelectedStudent(student);
    setFormData({ suggestions: student.suggestions || "" });
    setShowSuggestionModal(true);
  };

  const saveSuggestion = async () => {
    if (!selectedStudent) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${selectedStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestions: formData.suggestions || "" })
      });

      if (res.ok) {
        setShowSuggestionModal(false);
        fetchStudents();
        alert("Suggestion saved successfully!");
      } else {
        alert("Failed to save suggestion");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving suggestion");
    }
  };

  // ====================== ADD STUDENT ======================
  const addStudent = async () => {
    const { name, classLevel, parentName, parentEmail, parentPassword, parentPhone } = formData;
    if (!name || !classLevel || !parentEmail || !parentPassword || !parentPhone) {
      alert("Please fill all required fields (*)");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          classLevel,
          parentName: parentName || "Parent",
          parentEmail,
          parentPassword,
          parentPhone,
          teacherId: userId
        })
      });

      if (res.ok) {
        const newStudent = await res.json();
        setStudents(prev => [...prev, newStudent].sort((a, b) => a.name.localeCompare(b.name)));
        setShowAddModal(false);
        setFormData({});
        alert("Student added successfully!");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add student");
      }
    } catch (err) {
      alert("Error adding student");
    }
  };

  // ====================== EDIT STUDENT ======================
  const openEditStudent = (student) => {
    setEditStudentData({
      _id: student._id,
      name: student.name,
      classLevel: student.classLevel,
      parentPhone: student.parentPhone || ""
    });
    setShowEditStudentModal(true);
  };

  const saveEditStudent = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${editStudentData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStudentData)
      });

      if (res.ok) {
        setShowEditStudentModal(false);
        fetchStudents();
        alert("Student updated successfully!");
      } else {
        alert("Failed to update student");
      }
    } catch (err) {
      alert("Error updating student");
    }
  };

  // ====================== DELETE STUDENT ======================
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/students/${id}`, { method: "DELETE" });
      setStudents(prev => prev.filter(s => s._id !== id));
      alert("Student deleted successfully");
    } catch (err) {
      alert("Error deleting student");
    }
  };

  // ====================== PROFILE ======================
  const openProfile = () => {
    setProfileData({ ...profileData, password: "" });
    setShowProfileModal(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        setShowProfileModal(false);
        fetchProfile();
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="admin-container">
      {/* Top Navigation with Profile & Logout */}
      <nav className="admin-top-nav">
        <div className="admin-header-content">
          <div>
            <h1>Teacher Dashboard</h1>
            <p>Welcome, {userName || "Teacher"}</p>
          </div>
          <div className="admin-top-actions">
            <button className="admin-profile-btn" onClick={openProfile}>
              👤 Profile
            </button>
            <button 
              className="admin-logout-btn" 
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Add New Student
        </button>

        <h2>My Students ({students.length})</h2>

        {students.length === 0 ? (
          <p className="no-data">No students yet. Add your first student.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
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
                      <td key={sub}>
                        <select
                          value={s.grades?.[sub] || ""}
                          onChange={(e) => {
                            const newGrades = { ...(s.grades || {}), [sub]: e.target.value };
                            updateGrades(s._id, newGrades);
                          }}
                        >
                          <option value="">-</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </td>
                    ))}
                    <td>
                      <button 
                        className="suggestion-btn"
                        onClick={() => openSuggestion(s)}
                      >
                        {s.suggestions ? "View/Edit" : "Add"}
                      </button>
                    </td>
                    <td>
                      <button 
                        className="edit-btn" 
                        onClick={() => openEditStudent(s)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => deleteStudent(s._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====================== MODALS ====================== */}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add New Student</h2>
            <input 
              type="text" 
              placeholder="Student Name *" 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <select 
              onChange={e => setFormData({...formData, classLevel: e.target.value})} 
              defaultValue=""
            >
              <option value="" disabled>Select Class *</option>
              <option value="KG1">KG1</option>
              <option value="KG2">KG2</option>
              <option value="KG3">KG3</option>
            </select>
            <input 
              type="text" 
              placeholder="Parent Name" 
              onChange={e => setFormData({...formData, parentName: e.target.value})} 
            />
            <input 
              type="email" 
              placeholder="Parent Email *" 
              onChange={e => setFormData({...formData, parentEmail: e.target.value})} 
            />
            <input 
              type="password" 
              placeholder="Parent Password *" 
              onChange={e => setFormData({...formData, parentPassword: e.target.value})} 
            />
            <input 
              type="tel" 
              placeholder="Parent Phone *" 
              onChange={e => setFormData({...formData, parentPhone: e.target.value})} 
            />
            <div className="modal-footer">
              <button className="confirm-btn" onClick={addStudent}>Add Student</button>
              <button className="cancel-btn" onClick={() => {setShowAddModal(false); setFormData({});}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Student</h2>
            <input
              type="text"
              value={editStudentData.name || ""}
              onChange={e => setEditStudentData({...editStudentData, name: e.target.value})}
              placeholder="Student Name"
            />
            <select
              value={editStudentData.classLevel || ""}
              onChange={e => setEditStudentData({...editStudentData, classLevel: e.target.value})}
            >
              <option value="KG1">KG1</option>
              <option value="KG2">KG2</option>
              <option value="KG3">KG3</option>
            </select>
            <input
              type="tel"
              value={editStudentData.parentPhone || ""}
              onChange={e => setEditStudentData({...editStudentData, parentPhone: e.target.value})}
              placeholder="Parent Phone"
            />
            <div className="modal-footer">
              <button className="confirm-btn" onClick={saveEditStudent}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setShowEditStudentModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestion Modal */}
      {showSuggestionModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Suggestion for {selectedStudent.name}</h2>
            <textarea
              rows="5"
              value={formData.suggestions || ""}
              onChange={e => setFormData({...formData, suggestions: e.target.value})}
              placeholder="Write suggestion or advice..."
            />
            <div className="modal-footer">
              <button className="confirm-btn" onClick={saveSuggestion}>Save</button>
              <button className="cancel-btn" onClick={() => setShowSuggestionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Profile</h2>
            <form onSubmit={saveProfile}>
              <input
                type="text"
                value={profileData.name || ""}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
                placeholder="Name"
              />
              <input
                type="email"
                value={profileData.email || ""}
                onChange={e => setProfileData({...profileData, email: e.target.value})}
                placeholder="Email"
              />
              <input
                type="password"
                placeholder="New Password (optional)"
                onChange={e => setProfileData({...profileData, password: e.target.value})}
              />
              <div className="modal-footer">
                <button type="submit" className="confirm-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teacher;