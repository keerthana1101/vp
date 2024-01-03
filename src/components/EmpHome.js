import React, { useState,useEffect } from "react";
import './Styles.css'; 


function LeaveForm() {
    const [employeeName, setEmployeeName] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const retrievedEmployeeName = localStorage.getItem('employeeName'); // Retrieve from localStorage
        setEmployeeName(retrievedEmployeeName || ''); 
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) return; 
        fetch('http://localhost:8000/applyLeave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ employeeName,leaveType, fromDate, toDate, description })
        })
        
        .then(response => {
            if (!response.ok) {
              return response.json().then(data => {
                throw new Error(data.error);
              });
            }
            return response.json();
          })
          .then(data => {
            alert(data.message);
          })
          .catch(error => {
            console.error('Error applying for leave:', error.message);
            alert(error.message); 
          });        
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
        validateDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
        validateDate(date);
    };

    const validateDate = (date) => {
        const dayOfWeek = new Date(date).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            setError('You cannot apply for leave on Weekend.');
        } else {
            setError('');
        }
    };

    return (
        <div className="leave-form">
            <h1>Apply for Leave</h1>
            
            <form onSubmit={handleSubmit}>
            <label>
                    Employee Name:
                    <input
                        type="text"
                        value={employeeName}
                        readOnly 
                    />
                </label>
                <label>
                    Leave Type:
                    <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                        <option value="">Select Leave Type</option>
                        <option value="sick">Sick Leave</option>
                        <option value="vacation">Vacation Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Others">Others</option>
                    </select>
                </label>
                <label>
                    From Date:
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => handleFromDateChange(e.target.value)}
                    />
                </label>
                <label>
                    To Date:
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => handleToDateChange(e.target.value)}
                    />
                </label>
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={error}>Apply</button>
            </form>
        </div>
    );
}

export default LeaveForm;