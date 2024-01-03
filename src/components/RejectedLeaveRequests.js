import React, { useState, useEffect } from "react";
import './RejectedLeaveRequests.css';

function RejectedLeaveRequests() {
    const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState([]);
    const fetchRejectedLeaveRequests = async () => {
        try {
            const response = await fetch('http://localhost:8000/rejectedLeaveRequests');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched rejected leave requests:', data);
                setRejectedLeaveRequests(data);
            } else {
                console.error('Error fetching rejected leave requests:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching rejected leave requests:', error);
        }
    };

    useEffect(() => {
        fetchRejectedLeaveRequests();
    }, []);

    return (
        <div className="rejected-leave-requests">
            <h1>Rejected Leave Requests</h1>
            <table>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rejectedLeaveRequests.map(request => (
                        <tr key={request._id}>
                            <td>{request.employeeName}</td>
                            <td>{request.leaveType}</td>
                            <td>{request.fromDate}</td>
                            <td>{request.toDate}</td>
                            <td>{request.description}</td>
                            <td>{request.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RejectedLeaveRequests;
