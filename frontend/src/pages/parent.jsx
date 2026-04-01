import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/parent.css";

function Parent() {
  const [children, setChildren] = useState([]);
  const [profile, setProfile] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchData = async () => {
    try {
      const studentRes = await fetch(`http://localhost:5000/api/students?parentId=${userId}`);
      const studentData = await studentRes.json();
      setChildren(studentData);

      const profileRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
      const profileData = await profileRes.json();
      setProfile(profileData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (!userId) navigate("/login");
    else fetchData();
  }, [userId, navigate]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        setShowProfileModal(false);
        fetchData();
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-top-nav">
        <div className="admin-header-content">
          <h1>Parent Dashboard</h1>
          <div className="admin-top-actions">
            <button className="admin-profile-btn" onClick={() => setShowProfileModal(true)}>
              👤 Profile
            </button>
            <button className="admin-logout-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <h2>My Child(ren)</h2>

        {children.length === 0 ? (
          <p className="no-data">No children registered yet. Contact your child's teacher.</p>
        ) : (
          children.map(child => (
            <div key={child._id} className="child-card">
              <h3 className="child-name">
                {child.name} — <span className="class-level">{child.classLevel}</span>
              </h3>
              <p><strong>Teacher:</strong> {child.teacherId?.name || "Not assigned"}</p>

              <h4>Grades</h4>
              <table className="grade-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {["Maths", "English", "Amharic", "Art", "Science"].map(sub => (
                    <tr key={sub}>
                      <td>{sub}</td>
                      <td><strong>{child.grades?.[sub] || "-"}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4>Teacher's Suggestion / Advice</h4>
              <p className="suggestion">
                {child.suggestions ? child.suggestions : "No suggestions yet from the teacher."}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Your Profile</h2>
            <form onSubmit={updateProfile}>
              <input 
                type="text" 
                value={profile.name || ""} 
                onChange={e => setProfile({...profile, name: e.target.value})} 
                placeholder="Your Name" 
              />
              <input 
                type="email" 
                value={profile.email || ""} 
                onChange={e => setProfile({...profile, email: e.target.value})} 
                placeholder="Your Email" 
              />
              <input 
                type="password" 
                placeholder="New Password (leave empty to keep current)" 
                onChange={e => setProfile({...profile, password: e.target.value})} 
              />
              <div className="modal-footer">
                <button type="submit" className="confirm-btn">Save Changes</button>
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

export default Parent;