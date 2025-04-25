import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";

const mockApi = {
  login: (username, password) => {
    if (username === "lecturer" && password === "admin123") {
      return Promise.resolve({ token: "mock-jwt-token", role: "admin" });
    } else if (username === "student1" && password === "student123") {
      return Promise.resolve({
        token: "mock-jwt-token",
        role: "student",
        userId: 2,
      });
    } else if (username === "student2" && password === "student123") {
      return Promise.resolve({
        token: "mock-jwt-token",
        role: "student",
        userId: 3,
      });
    }
    return Promise.reject(new Error("Invalid credentials"));
  },
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await mockApi.login(username, password);
      onLogin(response.token, response.role, response.userId || null);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        
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