import React, { useState } from "react";
import { FaSignInAlt, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Updated mock users with email
  const mockUsers = [
    {
      id: 1,
      username: "lecturer",
      password: "lecturer123",
      role: "admin",
      email: "lecturer@example.com",
    },
    {
      id: 2,
      username: "student1",
      password: "student123",
      role: "student",
      email: "student1@example.com",
    },
    {
      id: 3,
      username: "student2",
      password: "student123",
      role: "student",
      email: "student2@example.com",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) throw new Error("Invalid username or password");
      onLogin("mock-token", user.role, user.id);
    } catch (err) {
      setError(err.message || "Invalid username or password");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const userExists = mockUsers.some((u) => u.email === email);
      if (!userExists) throw new Error("Email not found");
      setSuccessMessage(
        "Password reset instructions have been sent to your email."
      );
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-container">
      {!showForgotPassword ? (
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
          <p className="forgot-password-link">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
                setError("");
                setSuccessMessage("");
              }}
            >
              Forgot Password?
            </a>
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleForgotPasswordSubmit}
          className="forgot-password-form"
        >
          <h2>
            <FaArrowLeft />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(false);
                setEmail("");
                setError("");
                setSuccessMessage("");
              }}
            >
              Back to Login
            </a>
          </h2>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </div>
          {error && (
            <p className="error">
              <FaExclamationCircle /> {error}
            </p>
          )}
          {successMessage && <p className="success">{successMessage}</p>}
          <button type="submit">Send Reset Instructions</button>
        </form>
      )}
    </div>
  );
};

export default Login;
