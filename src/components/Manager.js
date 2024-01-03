import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import YourImage from './employee.jpg';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/logout');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="sidebar">
      <div className="sidebar-links">
        <br></br>
        <br></br>
        <br></br>
        <Link to="/managerpage">Leave Requests</Link>
        <Link to="/m">Approved List</Link>
        <Link to="/reject">Rejected List</Link>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
      </div>
      <div style={{ marginLeft: '400px' }}>
        <img
          src={YourImage} 
          style={{ width: '90%',maxWidth:"100%",minWidth:"50%", height: 'auto' }} 
        />
      </div>
    </div>
    
  );
};

export default Sidebar;
