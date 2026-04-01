import React from "react";
import { Link } from "react-router-dom";
import "./styles/homepage.css";

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-content">
          <h2>Kindergarten School</h2>
        </div>
      </nav>

      <div className="hero-overlay">
        <h1>Welcome to Kindergarten School</h1>
        <p className="hero-subtitle">Nurturing young minds with care and excellence</p>
        
        <Link to="/login" className="login-button">
          Login
        </Link>
      </div>
    </div>
  );
}

export default HomePage;