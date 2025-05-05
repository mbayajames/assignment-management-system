import React, { useState } from "react";
import { FaSignInAlt, FaExclamationCircle } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Mock users
  const mockUsers = [
    { id: 1, username: "lecturer", password: "lecturer123", role: "admin" },
    { id: 2, username: "student1", password: "student123", role: "student" },
    { id: 3, username: "student2", password: "student123", role: "student" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate async login
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) {
        throw new Error("Invalid username or password");
      }
      onLogin("mock-token", user.role, user.id);
    } catch (err) {
      setError(err.message || "Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>
          <FaSignInAlt /> Login
        </h2>
        {error && (
          <p className="error">
            <FaExclamationCircle /> {error}
          </p>
        )}
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />
        </div>
        <button type="submit">
          <FaSignInAlt /> Login
        </button>
      </form>
    </div>
  );
};

export default Login;
