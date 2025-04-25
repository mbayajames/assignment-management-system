import React, { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Assignment from "./components/Assignment";
import ManageUsers from "./components/ManageUsers";
import Submissions from "./components/Submissions";

const Dashboard = () => {
  // Initialize state from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [userId, setUserId] = useState(
    localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null
  );
  const [activeSection, setActiveSection] = useState('assignment');

  const handleLogin = (token, role, userId) => {
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    
    // Update state
    setToken(token);
    setRole(role);
    setUserId(userId);
  };

  const handleLogout = () => {
    // Clear localStorage and state
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard">
      <Sidebar 
        role={role}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      
      <div className="main-content">
        {activeSection === 'assignment' && (
          <Assignment role={role} userId={userId} />
        )}
        
        {activeSection === 'users' && role === 'admin' && (
          <ManageUsers />
        )}
        
        {activeSection === 'submissions' && (
          <Submissions role={role} userId={userId} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;