
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/login", {
                email_id: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                localStorage.setItem('employeeName',response.data.employeeName)
                localStorage.setItem('isLogin',true)
                setLoginSuccess(true);
                
            } else {
                alert("User not signed up");
            }
        } catch (error) {
            alert("Wrong details or network error");
            console.error("Error occurred:", error);
        }
    }

    useEffect(() => {
        if (loginSuccess) {
            navigate("/emp",{
                replace:true
            }); 
        }
    }, [loginSuccess, navigate]);

    return (
        <div className="login">
            <form onSubmit={submit} className="login-form">
                <h1>Employee Login</h1>
                <div className="input-container">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="input-container">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <div className="input-container">
                    <input type="submit" value="Login" />
                </div>
            </form>
        </div>
    );
}

export default Login;