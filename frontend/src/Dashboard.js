import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Assignment from './components/Assignment';
import Submissions from './components/Submissions';
import ManageUsers from './components/ManageUsers';
import Header from './components/Header';


const Dashboard = ({ role, userId, onLogout }) => {
  const [activeSection, setActiveSection] = useState('assignment');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        role={role}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="main-content">
        {activeSection === 'assignment' && <Assignment role={role} userId={userId} />}
        {activeSection === 'submissions' && <Submissions role={role} userId={userId} />}
        {activeSection === 'users' && role === 'admin' && <ManageUsers />}
      </div>
    </div>
  );
};

export default Dashboard;