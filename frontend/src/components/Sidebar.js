import React from "react";
import PropTypes from "prop-types";
import { FaBook, FaUsers, FaFileAlt, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ role, activeSection, setActiveSection, onLogout }) => (
  <div className="sidebar">
    <div className="sidebar-header">
      <h2>Assignment System</h2>
    </div>
    <nav>
      <ul>
        <li>
          <button
            className={activeSection === "assignment" ? "active" : ""}
            onClick={() => setActiveSection("assignment")}
          >
            <FaBook /> Assignment
          </button>
        </li>
        {role === "admin" && (
          <li>
            <button
              className={activeSection === "users" ? "active" : ""}
              onClick={() => setActiveSection("users")}
            >
              <FaUsers /> Manage Users
            </button>
          </li>
        )}
        <li>
          <button
            className={activeSection === "submissions" ? "active" : ""}
            onClick={() => setActiveSection("submissions")}
          >
            <FaFileAlt /> Submissions
          </button>
        </li>
        <li>
          <button onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </nav>
  </div>
);

Sidebar.propTypes = {
  role: PropTypes.oneOf(["admin", "student"]),
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Sidebar;