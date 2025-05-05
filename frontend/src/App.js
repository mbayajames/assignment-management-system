import React, { useState } from "react";
import "./styles.css";
import Dashboard from "./Dashboard";
import Login from "./components/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleLogin = (token, role, userId) => {
    setIsAuthenticated(true);
    setRole(role);
    setUserId(userId);
  };

  const handleLogout = () => {
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
