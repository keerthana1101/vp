import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Signup.css';

function Signup() {
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    async function submit(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/signup", {
                email,
                password,
                employeeName, 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response);

            if (response.status === 200) {
                setRegistrationSuccess(true);
                setEmail('');
                setPassword('');
                setEmployeeName('');

                localStorage.setItem('employeeName', employeeName);
            } else {
                alert("Error occurred during registration");
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }

    return (
        <div className="signup">
            <form onSubmit={submit} className="signup-form">
                <h1>Signup</h1>
                <div className="input-container">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="input-container">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <div className="input-container">
                    <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Employee Name" />
                </div>
                <div className="input-container">
                    <input type="submit" value="Signup" />
                </div>
            </form>
            {registrationSuccess && (
                <div className="success-message"> 
                <p>Registration successful!</p>
            </div>
            )}
            <br />
            <br />
        </div>
    );
}

export default Signup;
