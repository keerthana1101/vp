import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css'; 

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/admin/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        setLoginSuccess(true);
      } else {
        alert("Wrong details");
      }
    } catch (error) {
      alert("Wrong details or network error");
      console.error("Error occurred:", error);
    }
  }

  useEffect(() => {
    if (loginSuccess) {
      navigate("/manager"); 
    }
  }, [loginSuccess, navigate]);

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Manager Login</h1>
        <div className="input-container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="input-container">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
