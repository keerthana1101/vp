import React, { useState, useEffect } from "react";
import './ManagerProfile.css';
function ManagerProfile() {
    const [approvedLeaveRequests, setApprovedLeaveRequests] = useState([]);

    const fetchApprovedLeaveRequests = async () => {
        try {
            const response = await fetch('http://localhost:8000/approvedLeaveRequests');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched approved leave requests:', data);
                setApprovedLeaveRequests(data);
            } else {
                console.error('Error fetching approved leave requests:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching approved leave requests:', error);
        }
    };

    useEffect(() => {
        fetchApprovedLeaveRequests();
    }, []);

    return (
        <div className="manager-profile">
            <h1>Approved Leave Requests</h1>
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
                    {approvedLeaveRequests.map(request => (
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

export default ManagerProfile;
