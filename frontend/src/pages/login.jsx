import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/login.css";
import loginBg from "../pics/jLd6H.jpg"; // same background

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="login-container">
      <img src={loginBg} alt="Children in kindergarten" className="login-bg" />
      <div className="login-overlay">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-footer">
          Back to <Link to="/" className="back-link">Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;