import React, { useState,useEffect } from "react";
import './Styles.css'; 


function LeaveForm() {
    const [employeeName, setEmployeeName] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [error, setError] = useState('');
    const [role,setRole]=useState('');
    const [compOffComment, setCompOffComment] = useState('');

    useEffect(() => {
        const retrievedEmployeeName = localStorage.getItem('employeeName'); // Retrieve from localStorage
        setEmployeeName(retrievedEmployeeName || ''); 
        const retrievedRole = localStorage.getItem('role');  // Retrieve role from localStorage
        setRole(retrievedRole || '');
    }, []);



    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) return; 
        fetch('http://localhost:8000/applyLeave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ employeeName,role,leaveType, fromDate, toDate, compOffComment,})
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
                    Department:
                    <input
                    type="text"
                    value={role}
                    readOnly/>
                </label>
                <label>
                    Leave Type:
                    <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                       setCompOffComment('');
                        <option value="">Select Leave Type</option>
                        <option value="Planned Vacation">Planned Vacation(V)</option>
                        <option value="Half-day Vacation">Half-day Vacation(H)</option>
                        <option value="Compensatory Off">Compensatory Off(C)</option>
                        <option value="Sick Leave">Sick Leave(S)</option>
                        <option value="others">Others</option>
                    </select>
                </label>
                {leaveType === 'Compensatory Off' && (
                    <label>
                        Comp off for which IBM Holiday:
                        <input
                            type="text"
                            value={compOffComment}
                            onChange={(e) => setCompOffComment(e.target.value)}
                        />
                    </label>
                )}
                {leaveType === 'others' && (
                    <label>
                        Training, UR Session or anything relevant:
                        <input
                            type="text"
                            value={compOffComment}
                            onChange={(e) => setCompOffComment(e.target.value)}
                        />
                    </label>
                )}
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
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={error}>Apply</button>
            </form>
        </div>
    );
}

export default LeaveForm;