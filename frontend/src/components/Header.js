import React from 'react';
import { FaBars, FaBookOpen } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => (
  <div className="header">
    <h2><FaBookOpen /> Assignment System</h2>
    <button className="hamburger" onClick={toggleSidebar}>
      <FaBars />
    </button>
  </div>
);

export default Header;