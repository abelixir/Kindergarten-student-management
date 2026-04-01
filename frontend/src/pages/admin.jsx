import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/admin.css";

function Admin() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const getUserId = () => localStorage.getItem("userId");

  // Redirect to login if userId not present
  useEffect(() => {
    if (!getUserId()) navigate("/login");
  }, [navigate]);

  const fetchUser = async () => {
    const userId = getUserId();
    if (!userId) return null;

    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const openModal = async () => {
    const data = await fetchUser();
    if (!data) return;

    setFormData({
      name: data.name || "",
      email: data.email || "",
      password: "" // leave blank for optional password change
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();

      // Update localStorage with new info
      localStorage.setItem("name", updatedUser.name);
      localStorage.setItem("email", updatedUser.email);

      alert("Profile updated successfully");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <div className="admin-background" />

      <nav className="admin-top-nav">
        <div className="admin-header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {localStorage.getItem("name") || "Admin"}</p>
          </div>

          <div className="admin-top-actions">
            <button className="admin-profile-btn" onClick={openModal}>👤 Profile</button>
            <button className="admin-logout-btn" onClick={handleLogout}>↩ Logout</button>
          </div>
        </div>
      </nav>

      <div className="admin-main">
        <div className="admin-actions">
          <div className="action-card">
            <h2>Teachers</h2>
            <Link to="/admin-manage-teachers"><button>Manage Teachers</button></Link>
          </div>

          <div className="action-card">
            <h2>Students</h2>
            <Link to="/admin-manage-students"><button>Manage Students</button></Link>
          </div>

          <div className="action-card">
            <h2>Reports</h2>
            <Link to="/admin/view-report"><button>View Reports</button></Link>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder="New Password (optional)" value={formData.password} onChange={handleChange} />

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;