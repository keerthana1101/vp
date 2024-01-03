import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import HomePage from "./components/HomePage";
import EmpHome from "./components/EmpHome";
import ManagerLogin from './components/ManagerLogin';
import Employee from './components/Employee';
import LeaveHistory from "./components/LeaveHistory";
import Manager from './components/Manager';
import ManagerProfile from "./components/ManagerProfile";
import RejectedLeaveRequests from "./components/RejectedLeaveRequests";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/employeepage" element={<EmpHome/>}/>
          <Route path="/managerpage" element={<Home/>}/>
          <Route path="/admin" element={<ManagerLogin/>}/>
          <Route path="/emp" element={<Employee/>}/>
          <Route path="/leave" element={<LeaveHistory/>}/>
          <Route path="/manager" element={<Manager/>}/>
          <Route path="/m" element={<ManagerProfile/>}/>
          <Route path="/reject" element={<RejectedLeaveRequests/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;