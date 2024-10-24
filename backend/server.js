const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'demo_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Get all candidates with interview rounds
app.get('/api/candidates', (req, res) => {
    const { u_id } = req.query;
    if (!u_id) {
        return res.status(400).json({ error: 'HR user ID is required' });
    }

//     SELECT 
//     c.c_id AS Candidate_ID,
//     c.c_name AS Candidate_Name,
//     c.position AS Position,
//     ir.round_number AS Round_Number,
//     ir.interviewer AS Interviewer,
//     ir.interview_date AS Interview_Date,
//     ir.status AS Status,
//     ir.remarks AS Remarks
// FROM 
//     candidates c
// INNER JOIN 
//     interview_rounds ir ON c.c_id = ir.c_id
// WHERE 
//     c.u_id = ?
// ORDER BY 
//     c.c_id, ir.round_number
    const query = `SELECT 
    c.c_id AS Candidate_ID,
    c.c_name AS Candidate_Name,
    c.position AS Position,
    ir.round_number AS Round_Number,
    ir.interviewer AS Interviewer,
    ir.interview_date AS Interview_Date,
    ir.status AS Status,
    ir.remarks AS Remarks
FROM 
    candidates c
LEFT JOIN 
    interview_rounds ir ON c.c_id = ir.c_id
WHERE 
    c.u_id = ?
ORDER BY 
    c.c_id, ir.round_number;`;

    db.query(query, [u_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        console.log('Query results:', results); // Log results to see what's being returned
        res.json(results);
    });
});

  

// Add a new candidate (without interview rounds)
app.post('/api/candidates', (req, res) => {
  const { name, position, u_id } = req.body;

  if (!name || !position || !u_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const upperCaseName = name.toUpperCase();

  const addCandidateQuery = `
    INSERT INTO candidates (c_name, position, u_id) VALUES (?, ?, ?)
  `;

  db.query(addCandidateQuery, [upperCaseName, position, u_id], (err, result) => {
    if (err) {
      console.error('Error inserting candidate:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }

    res.status(201).json({ message: 'Candidate added successfully', c_id: result.insertId });
  });
});



// Add a new interview round for an existing candidate
app.post('/api/candidates/:id/interview-rounds', (req, res) => {
  const { id } = req.params; // Candidate ID from the URL
  const { round_number, interviewer, interview_date, status, remarks } = req.body;

  if (!round_number || !interviewer || !interview_date || !status) {
    return res.status(400).json({ error: 'All fields are required for the interview round' });
  }

  const addInterviewRoundQuery = `
    INSERT INTO interview_rounds (c_id, round_number, interviewer, interview_date, status, remarks) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(addInterviewRoundQuery, [id, round_number, interviewer, interview_date, status, remarks], (err) => {
    if (err) {
      console.error('Error inserting interview round:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    res.status(201).json({ message: 'Interview round added successfully' });
  });
});



// Delete a candidate
// Delete an interview round for a candidate
app.delete('/api/candidates/:id/interview-rounds/:round_number', (req, res) => {
  const { id, round_number } = req.params;

  const query = 'DELETE FROM interview_rounds WHERE c_id = ? AND round_number = ?';

  db.query(query, [id, round_number], (err, result) => {
    if (err) {
      console.error('Error deleting interview round:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Interview round not found' });
    }

    res.json({ message: 'Interview round deleted successfully' });
  });
});




// Check user credentials (Login)
app.post('/api/login', (req, res) => {
    const { name, password } = req.body;
    
    // Query to check if user exists with given name and password
    const query = 'SELECT * FROM users WHERE name = ? AND password = ?';
    
    db.query(query, [name, password], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else if (results.length > 0) {
        res.json({ message: 'Login successful', user: results[0] });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  });
  
// Update a candidate's name and position
app.put('/api/candidates/:id', (req, res) => {
  const { id } = req.params;
  const { name, position } = req.body;

  if (!name || !position) {
    return res.status(400).json({ error: 'Name and position are required' });
  }

  const upperCaseName = name.toUpperCase(); // Ensure the name is stored in uppercase

  const updateCandidateQuery = `
    UPDATE candidates 
    SET c_name = ?, position = ?
    WHERE c_id = ?
  `;

  db.query(updateCandidateQuery, [upperCaseName, position, id], (err, result) => {
    if (err) {
      console.error('Error updating candidate:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({ message: 'Candidate updated successfully' });
  });
});


// ceo
// Get all candidates from all HRs
// Get all candidates from all HRs
// app.get('/api/all-candidates', (req, res) => {
//   const query = `
//   SELECT 
//       c.c_id AS Candidate_ID,
//       c.c_name AS Candidate_Name,
//       c.position AS Position,
//       c.u_id AS HR_ID,
//       u.name AS HR_Name,  -- Fetch HR name from the users table
//       ir.round_number AS Round_Number,
//       ir.interviewer AS Interviewer,
//       ir.interview_date AS Interview_Date,
//       ir.status AS Status,
//       ir.remarks AS Remarks
//   FROM 
//       candidates c
//   LEFT JOIN 
//       interview_rounds ir ON c.c_id = ir.c_id
//   LEFT JOIN 
//       users u ON c.u_id = u.u_id  -- Join with users table to get HR names
//   ORDER BY 
//       c.c_id, ir.round_number;`;

//   db.query(query, (err, results) => {
//       if (err) {
//           console.error('Database query error:', err);
//           return res.status(500).json({ error: 'Database query error' });
//       }
//       console.log('Query results:', results);
//       res.json(results);
//   });
// });

// Get all distinct candidates from all HRs (no interview details in the list)
app.get('/api/all-candidates', (req, res) => {
  const query = `
  SELECT DISTINCT 
      c.c_id AS Candidate_ID,
      c.c_name AS Candidate_Name,
      c.position AS Position,
      u.name AS HR_Name  -- Fetch HR name from the users table
  FROM 
      candidates c
  LEFT JOIN 
      users u ON c.u_id = u.u_id
  ORDER BY 
      c.c_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    console.log('Distinct candidates results:', results);
    res.json(results);
  });
});

// Get candidate details by ID (including all interview rounds)
app.get('/api/candidates/:id/details', (req, res) => {
  const { id } = req.params;

  const query = `
  SELECT 
    c.c_id AS Candidate_ID,
    c.c_name AS Candidate_Name,
    c.position AS Position,
    u.name AS HR_Name,
    ir.round_number AS Round_Number,
    ir.interviewer AS Interviewer,
    ir.interview_date AS Interview_Date,
    ir.status AS Status,
    ir.remarks AS Remarks
  FROM 
    candidates c
  LEFT JOIN 
    interview_rounds ir ON c.c_id = ir.c_id
  LEFT JOIN 
    users u ON c.u_id = u.u_id
  WHERE 
    c.c_id = ?
  ORDER BY 
    ir.round_number;
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // Prepare the candidate's details along with all interview rounds
    const candidate = {
      Candidate_ID: results[0].Candidate_ID,
      Candidate_Name: results[0].Candidate_Name,
      Position: results[0].Position,
      HR_Name: results[0].HR_Name,
      interviewRounds: results.map(r => ({
        Round_Number: r.Round_Number,
        Interviewer: r.Interviewer,
        Interview_Date: r.Interview_Date,
        Status: r.Status,
        Remarks: r.Remarks
      }))
    };

    res.json(candidate);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
