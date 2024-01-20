import React, { useState, useEffect } from "react";
import './LeaveRequests.css';

function LeaveRequests() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editedRequest, setEditedRequest] = useState({
        leaveType: '',
        fromDate: '',
        toDate: '',
    });

    const fetchLeaveRequests = async () => {
        try {
            const response = await fetch('http://localhost:8000/leaveRequests');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched leave requests:', data); 
                const leaveRequestsWithCompOff = data.map(request => ({
                    ...request,
                    leaveType: request.leaveType === 'Compensatory Off' ? `${request.leaveType} - ${request.compOffComment}` : request.leaveType,
                }));
                setLeaveRequests(leaveRequestsWithCompOff);
            } else {
                console.error('Error fetching leave requests:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }
    };
    
    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const approveLeave = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/approveLeave/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Approved' })
            });
    
            if (response.ok) {
                console.log(`Leave request with ID ${id} approved successfully`);
                const updatedLeaveRequests = leaveRequests.map(request =>
                    request._id === id ? { ...request, status: 'Approved' } : request
                );
                setLeaveRequests(updatedLeaveRequests); 
            } else {
                console.error(`Failed to approve leave request with ID ${id}`);
            }
        } catch (error) {
            console.error('Error approving leave request:', error);
        }
    };


    const rejectLeave = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/rejectLeave/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Rejected' })
            });
    
            if (response.ok) {
                console.log(`Leave request with ID ${id} rejected successfully`);
                const updatedLeaveRequests = leaveRequests.map(request =>
                    request._id === id ? { ...request, status: 'Rejected' } : request
                );
                setLeaveRequests(updatedLeaveRequests); 
            } else {
                console.error(`Failed to reject leave request with ID ${id}`);
            }
        } catch (error) {
            console.error('Error rejecting leave request:', error);
        }
    };
    
    

const editLeave = async (id) => {
    try {
        const response = await fetch(`http://localhost:8000/getLeaveRequest/${id}`);
        if (response.ok) {
            const leaveRequest = await response.json();
            setSelectedRequest(leaveRequest); 
            setEditedRequest({
                leaveType: leaveRequest.leaveType,
                fromDate: leaveRequest.fromDate,
                toDate: leaveRequest.toDate,
            });
        } else {
            console.error(`Failed to fetch leave request for editing with ID ${id}`);
        }
    } catch (error) {
        console.error('Error editing leave request:', error);
    }
};


    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedRequest({
            ...editedRequest,
            [name]: value
        });
    };

    const saveEditedLeave = async () => {
        try {
            const response = await fetch(`http://localhost:8000/updateLeave/${selectedRequest._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedRequest)
            });

            if (response.ok) {
                console.log(`Leave request with ID ${selectedRequest._id} updated successfully`);
                fetchLeaveRequests(); 
                setSelectedRequest(null); 
            } else {
                console.error(`Failed to update leave request with ID ${selectedRequest._id}`);
            }
        } catch (error) {
            console.error('Error saving edited leave request:', error);
        }
    };

    return (
        <div className="leave-requests">
            <h1>Leave Requests for Approval</h1>
            <table>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveRequests.map(request => (
                        request.role=='Mapping' && (
                        <tr key={request._id}>
                            <td>{request.employeeName}</td>
                            <td>{request.leaveType}</td>
                            <td>{request.fromDate}</td>
                            <td>{request.toDate}</td>
                            <td>{request.status}</td>
                            <td>
                                <button onClick={() => editLeave(request._id)}>Edit</button>
                                <button onClick={() => approveLeave(request._id)}>Approve</button>
                                 <button onClick={() => rejectLeave(request._id)}>Reject</button>
                            </td>
                        </tr>
                        )
                    ))}
                </tbody>
            </table>
    
            {selectedRequest && (
                <div className="edit-modal">
                    <h2>Edit Leave Request</h2>
                    <form>
                        <label htmlFor="leaveType">Leave Type:</label>
                        <input type="text" id="leaveType" name="leaveType" value={editedRequest.leaveType} onChange={handleEditChange} />
    
                        <label htmlFor="fromDate">From Date:</label>
                        <input type="date" id="fromDate" name="fromDate" value={editedRequest.fromDate} onChange={handleEditChange} />
    
                        <label htmlFor="toDate">To Date:</label>
                        <input type="date" id="toDate" name="toDate" value={editedRequest.toDate} onChange={handleEditChange} />

    
                        <button onClick={saveEditedLeave}>Save</button>
                    </form>
                </div>
            )}
        </div>
    );
    
}

export default LeaveRequests;