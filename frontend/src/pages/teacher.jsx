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

  const fetchStudents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/students?teacherId=${userId}`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userId) navigate("/login");
    else {
      fetchStudents();
      fetchProfile();
    }
  }, [userId, navigate]);

  // Add Student
  const addStudent = async () => {
    const { name, classLevel, parentName, parentEmail, parentPassword, parentPhone } = formData;
    if (!name || !classLevel || !parentEmail || !parentPassword || !parentPhone) {
      alert("Please fill all required fields (*)");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, classLevel, parentName: parentName || "Parent",
          parentEmail, parentPassword, parentPhone, teacherId: userId
        })
      });

      if (res.ok) {
        const newStudent = await res.json();
        setStudents(prev => [...prev, newStudent]);
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

  // Edit Student
  const openEditStudent = (student) => {
    setEditStudentData({
      _id: student._id,
      name: student.name,
      classLevel: student.classLevel,
      parentPhone: student.parentPhone
    });
    setShowEditStudentModal(true);
  };

  const saveEditStudent = async () => {
    try {
      await fetch(`http://localhost:5000/api/students/${editStudentData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStudentData)
      });
      fetchStudents();
      setShowEditStudentModal(false);
      alert("Student updated successfully");
    } catch (err) {
      alert("Error updating student");
    }
  };

  // Delete Student
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, { method: "DELETE" });
      setStudents(prev => prev.filter(s => s._id !== id));
      alert("Student deleted");
    } catch (err) {
      alert("Error deleting student");
    }
  };

  // Update Grades
  const updateGrades = async (studentId, newGrades) => {
    try {
      await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grades: newGrades })
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Suggestion
  const openSuggestion = (student) => {
    setSelectedStudent(student);
    setFormData({ suggestions: student.suggestions || "" });
    setShowSuggestionModal(true);
  };

  const saveSuggestion = async () => {
    try {
      await fetch(`http://localhost:5000/api/students/${selectedStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestions: formData.suggestions || "" })
      });
      setShowSuggestionModal(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Profile
  const openProfile = () => {
    setProfileData({ ...profileData, password: "" });
    setShowProfileModal(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        setShowProfileModal(false);
        fetchProfile();
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-top-nav">
        <div className="admin-header-content">
          <div>
            <h1>Teacher Dashboard</h1>
            <p>Welcome, {userName}</p>
          </div>
          <div className="admin-top-actions">
            <button className="admin-profile-btn" onClick={openProfile}>👤 Profile</button>
            <button className="admin-logout-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>
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
                  <th>Maths</th><th>English</th><th>Amharic</th><th>Art</th><th>Science</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.classLevel}</td>
                    {["Maths","English","Amharic","Art","Science"].map(sub => (
                      <td key={sub}>
                        <select 
                          value={s.grades?.[sub] || ""} 
                          onChange={e => {
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
                      <button className="edit-btn" onClick={() => openEditStudent(s)}>Edit</button>
                      <button className="suggestion-btn" onClick={() => openSuggestion(s)}>Suggestion</button>
                      <button className="delete-btn" onClick={() => deleteStudent(s._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add New Student</h2>
            <input type="text" placeholder="Student Name *" onChange={e => setFormData({...formData, name: e.target.value})} />
            <select onChange={e => setFormData({...formData, classLevel: e.target.value})} defaultValue="">
              <option value="" disabled>Select Class *</option>
              <option value="KG1">KG1</option>
              <option value="KG2">KG2</option>
              <option value="KG3">KG3</option>
            </select>
            <input type="text" placeholder="Parent Name" onChange={e => setFormData({...formData, parentName: e.target.value})} />
            <input type="email" placeholder="Parent Email *" onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
            <input type="password" placeholder="Parent Password *" onChange={e => setFormData({...formData, parentPassword: e.target.value})} />
            <input type="tel" placeholder="Parent Phone *" onChange={e => setFormData({...formData, parentPhone: e.target.value})} />

            <div className="modal-footer">
              <button className="confirm-btn" onClick={addStudent}>Add Student</button>
              <button className="cancel-btn" onClick={() => {setShowAddModal(false); setFormData({});}}>Cancel</button>
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
                <button type="button" className="cancel-btn" onClick={() => setShowProfileModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teacher;