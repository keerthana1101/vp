import React, { useState, useEffect } from 'react';
import './LeaveHistory.css';

function LeaveHistory() {
    const [leaveHistory, setLeaveHistory] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/leaveRequests')
            .then(response => response.json())
            .then(data => {
                const employeeLeaveHistory = data.filter(request => request.employeeName === localStorage.getItem('employeeName'));
                setLeaveHistory(employeeLeaveHistory);
            })
            .catch(error => {
                console.error('Error fetching leave history:', error);
            });
    }, []);

    return (
        <div className="leave-history">
            <h1>Leave History</h1>
            <table>
                <thead>
                    <tr>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveHistory.map(request => (
                        <tr key={request._id}>
                            <td>{request.leaveType}</td>
                            <td>{request.fromDate}</td>
                            <td>{request.toDate}</td>
                            <td>{request.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LeaveHistory;
