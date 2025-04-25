import React from 'react';
import PropTypes from 'prop-types';
import { FaBookOpen, FaUserGraduate, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ role, activeSection, setActiveSection, onLogout, isOpen, toggleSidebar }) => (
  <div className={`sidebar ${isOpen ? 'open' : ''}`}>
    <div className="sidebar-header">
      <h2><FaBookOpen style={{ marginRight: '10px' }} /> Assignment System</h2>
    </div>
    <nav>
      <ul>
        <li>
          <button
            className={activeSection === 'assignment' ? 'active' : ''}
            onClick={() => {
              setActiveSection('assignment');
              toggleSidebar();
            }}
          >
            <FaBookOpen /> Assignments
          </button>
        </li>
        {role === 'admin' && (
          <li>
            <button
              className={activeSection === 'users' ? 'active' : ''}
              onClick={() => {
                setActiveSection('users');
                toggleSidebar();
              }}
            >
              <FaUserGraduate /> Manage Users
            </button>
          </li>
        )}
        <li>
          <button
            className={activeSection === 'submissions' ? 'active' : ''}
            onClick={() => {
              setActiveSection('submissions');
              toggleSidebar();
            }}
          >
            <FaFileAlt /> Submissions
          </button>
        </li>
        <li>
          <button onClick={() => {
            onLogout();
            toggleSidebar();
          }}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </nav>
  </div>
);

Sidebar.propTypes = {
  role: PropTypes.oneOf(['admin', 'student']),
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;