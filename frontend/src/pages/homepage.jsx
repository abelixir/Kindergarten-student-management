import React from "react";
import { Link } from "react-router-dom";
import childrenImg from "../pics/jLd6H.jpg";
import "./styles/homepage.css";

function HomePage() {
  return (
    <div className="homepage-container">
      <img
        src={childrenImg}
        alt="Children in kindergarten"
        className="hero-image"
      />
      <div className="hero-overlay">
        <h1>Welcome to Kindergarten School</h1>
        <Link to="/login" className="login-button">
          Login
        </Link>
      </div>
    </div>
  );
}

export default HomePage;