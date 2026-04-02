import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) setError(data.message || "Login failed");
      else {
        // Store user info in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);

        // Redirect based on role
        if (data.role === "admin") navigate("/admin");
        else if (data.role === "teacher") navigate("/teacher");
        else if (data.role === "parent") navigate("/parent");
        else navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, try again later");
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <h1>Login to Your Account</h1>
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="login-button">Sign In</button>
        </form>

        <p className="login-footer">
          Back to <Link to="/" className="back-link">Home Page</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;