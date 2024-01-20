import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import profilePic from './profile.png';

const Sidebar = () => {
  const [employeeName, setEmployeeName] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('employeeName');
    navigate('/');
  };
  
  useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    setEmployeeName(storedEmployeeName);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <br />
        <br />
        <img src={profilePic} alt="Profile" className="profile-img" />
        <h4 style={{ marginLeft: '2rem' }}>{employeeName}</h4>
        <Link to="/employeepage">Apply Leave</Link>
        <Link to="/leave">Leave History</Link>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
