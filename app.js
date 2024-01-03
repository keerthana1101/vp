const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const nano = require('nano')('http://admin:password@localhost:5984');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const usersDbName = 'users';
const leaveDbName = 'leaves';
const adminDbName = 'admins';
const usersDb = nano.db.use(usersDbName);
const leavesDb = nano.db.use(leaveDbName);
const adminDb = nano.db.use(adminDbName);


app.use(bodyParser.json());
app.use(cors());


nano.db.create(adminDbName)
  .then(() => {
    console.log(`Database '${adminDbName}' created successfully`);
  })
  .catch((err) => {
    if (err && err.statusCode === 412) {
      console.log(`Database '${adminDbName}' already exists`);
    } else {
      console.error(`Error creating '${adminDbName}' database:`, err);
    }
  });


nano.db.create(leaveDbName)
  .then(() => {
    console.log(`Database '${leaveDbName}' created successfully`);
  })
  .catch((err) => {
    if (err && err.statusCode === 412) {
      console.log(`Database '${leaveDbName}' already exists`);
    } else {
      console.error(`Error creating '${leaveDbName}' database:`, err);
    }
  });

  const adminData = {
    email: 'manager@gmail.com',
    passwordHash: '$2b$10$knO9piTLpUxlUqoxJz21A.Tx/baYpjwXsXRfeqRtyY4CtM8VQYyEi',
  };
   
  app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


// Employee Registration
app.post('/signup', async (req, res) => {
  try {
    const { email, password, employeeName } = req.body; 
    console.log("received request");
    console.log(email);
    console.log(password);
    console.log(employeeName); 
    const existingUser = await usersDb.get(email).catch(() => null);
    if (existingUser) {
      console.log("user already exists");
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { password: hashedPassword, email, employeeName }; // Include employeeName in the user object
    const result = await usersDb.insert(user);
    console.log("registration success :: ", result.id);
    res.json({ message: 'Registration successful', userId: result.id });
  } catch (error) {
    console.error("an error occurred");
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Employee Login
app.post('/login', async (req, res) => {
  const { email_id, password } = req.body;
  const users = await usersDb.find({
    selector: {
      email: email_id 
    }
  });
  const user = users.docs[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', isManager: !!user.isManager,employeeName: user.employeeName });
});



app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === adminData.email) {
    const passwordMatch = await bcrypt.compare(password, adminData.passwordHash);

    if (passwordMatch) {
      res.status(200).json({ message: 'Admin logged in successfully' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});


app.put('/admin/updatePassword', async (req, res) => {
  try {
    const { newPassword } = req.body; 
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    adminData.passwordHash = hashedPassword;
    res.status(200).json({ message: 'Admin password updated successfully', hashedPassword });
  } catch (error) {
    console.error('Error updating admin password:', error);
    res.status(500).json({ error: 'Failed to update admin password' });
  }
});




app.post('/applyLeave', async (req, res) => {
  const { leaveType, fromDate, toDate, description, employeeName } = req.body;

  try {
    const leavesWithinRange = await leavesDb.find({
      selector: {
        status: 'Approved',
        $or: [
          { fromDate: { $lte: fromDate }, toDate: { $gte: fromDate } },
          { fromDate: { $lte: toDate }, toDate: { $gte: toDate } },
        ],
      },
    });
    if (leavesWithinRange.docs.length >= 3) {
      return res.status(400).json({ error : 'The limit of approved leaves for this period is exceeded' });
    }
    const leaveData = { leaveType, fromDate, toDate, description, employeeName,status: 'Pending'};
    const result = await leavesDb.insert(leaveData);
    console.log('Leave application saved successfully:', result);
    res.status(200).json({ message: 'Leave application submitted successfully' });
  } catch (error) {
    console.error('Error saving leave application:', error);
    res.status(500).json({ error: 'Failed to submit leave application' });
  }
});


app.get('/leaveRequests', async (req, res) => {
  try {
    const allLeaves = await leavesDb.list({ include_docs: true }); 
    const leaveRequests = allLeaves.rows.map(row => {
      const { leaveType, fromDate, toDate, description, status, _id, employeeName } = row.doc;
      return { leaveType, fromDate, toDate, description, status, _id,employeeName};
    });
    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});



app.put('/approveLeave/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const leaveRequest = await leavesDb.get(id);
    leaveRequest.status = 'Approved';
    const result = await leavesDb.insert(leaveRequest);
    console.log(`Leave request with ID ${id} has been approved`);
    res.status(200).json({ message: `Leave request with ID ${id} has been approved` });
  } catch (error) {
    console.error(`Error approving leave request with ID ${id}:`, error);
    res.status(500).json({ error: `Failed to approve leave request with ID ${id}` });
  }
});

//  Leave Rejection 
app.put('/rejectLeave/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const leaveRequest = await leavesDb.get(id);
    leaveRequest.status = 'Rejected';
    const result = await leavesDb.insert(leaveRequest);
    console.log(`Leave request with ID ${id} has been rejected`);
    res.status(200).json({ message: `Leave request with ID ${id} has been rejected` });
  } catch (error) {
    console.error(`Error rejecting leave request with ID ${id}:`, error);
    res.status(500).json({ error: `Failed to reject leave request with ID ${id}` });
  }
});



app.get('/getLeaveRequest/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const leaveRequest = await leavesDb.get(id);
    res.json(leaveRequest);
  } catch (error) {
    console.error(`Error fetching leave request with ID ${id} for editing:`, error);
    res.status(500).json({ error: `Failed to fetch leave request with ID ${id}` });
  }
});

app.put('/updateLeave/:id', async (req, res) => {
  const id = req.params.id;
  const { fromDate, toDate, status } = req.body;

  try {
    const leaveRequest = await leavesDb.get(id);

    if (fromDate) leaveRequest.fromDate = fromDate;
    if (toDate) leaveRequest.toDate = toDate;
    if (status) {
      if (status === 'Approved' || status === 'Rejected' || status === 'Pending') {
        leaveRequest.status = status;
      } else {
        return res.status(400).json({ error: 'Invalid status' });
      }
    }

    const result = await leavesDb.insert(leaveRequest);
    console.log(`Leave request with ID ${id} has been updated`);

    res.status(200).json({ message: `Leave request with ID ${id} has been updated` });
  } catch (error) {
    console.error(`Error updating leave request with ID ${id}:`, error);
    res.status(500).json({ error: `Failed to update leave request with ID ${id}` });
  }
});


app.get('/approvedLeaveRequests', async (req, res) => {
  try {
    const allLeaves = await leavesDb.list({ include_docs: true }); 

    const approvedLeaveRequests = allLeaves.rows
      .filter(row => row.doc.status === 'Approved')
      .map(row => {
        const { leaveType, fromDate, toDate, description, status, _id, employeeName } = row.doc;
        return { leaveType, fromDate, toDate, description, status, _id, employeeName };
      });
    res.json(approvedLeaveRequests);
  } catch (error) {
    console.error('Error fetching approved leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch approved leave requests' });
  }
});


app.get('/rejectedLeaveRequests', async (req, res) => {
  try {
    const allLeaves = await leavesDb.list({ include_docs: true }); 
    const rejectedLeaveRequests = allLeaves.rows
      .filter(row => row.doc.status === 'Rejected')
      .map(row => {
        const { leaveType, fromDate, toDate, description, status, _id, employeeName } = row.doc;
        return { leaveType, fromDate, toDate, description, status, _id, employeeName };
      });

    res.json(rejectedLeaveRequests);
  } catch (error) {
    console.error('Error fetching rejected leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch rejected leave requests' });
  }
});


app.post('/EmpHome', (req, res) => {
    const { leaveType, fromDate, toDate, description } = req.body;
    console.log('Received leave application:');
    console.log('Leave Type:', leaveType);
    console.log('From Date:', fromDate);
    console.log('To Date:', toDate);
    console.log('Description:', description);
    res.status(200).send('Leave application submitted successfully');
});


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is running on port ${port}");
});