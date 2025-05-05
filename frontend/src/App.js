import React, { useState, useEffect } from "react";
import "./styles.css";
import Dashboard from "./Dashboard";
import Login from "./components/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedRole && storedUserId) {
      setIsAuthenticated(true);
      setRole(storedRole);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogin = (token, role, userId) => {
    setIsAuthenticated(true);
    setRole(role);
    setUserId(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard role={role} userId={userId} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
