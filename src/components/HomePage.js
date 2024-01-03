import React from 'react';
import './Style.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <nav>
        <div className="menu">
          <div className="logo">
            <a href="#">Vacation Planner</a>
          </div>
          <ul></ul>
        </div>
      </nav>
      <div className="bg-container">
        <div className="img"></div>
        <div className="center">
          <div className="title">Employee Leave Management System</div>
          <div className="btns">
            <Link to="/signup"><button>SignUp</button></Link>
            <Link to="/login"><button>Employee Login</button></Link>
            <Link to="/admin"><button>Manager Login</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
