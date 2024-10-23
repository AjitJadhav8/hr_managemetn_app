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

    const query = `
        SELECT 
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
        INNER JOIN 
            interview_rounds ir ON c.c_id = ir.c_id
        WHERE 
            c.u_id = ?
        ORDER BY 
            c.c_id, ir.round_number
    `;

    db.query(query, [u_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        console.log('Query results:', results); // Log results to see what's being returned
        res.json(results);
    });
});

  

// Add a new candidate and first interview round
// app.post('/api/candidates', (req, res) => {
//   const { name, position, round_number, interviewer, interview_date, status, remarks } = req.body;
//   const upperCaseName = name.toUpperCase();

//   // Insert into candidates table
//   const insertCandidateQuery = 'INSERT INTO candidates (c_name, position) VALUES (?, ?)';
  
//   db.query(insertCandidateQuery, [upperCaseName, position], (err, result) => {
//     if (err) {
//       res.status(500).json({ error: err });
//     } else {
//       const candidateId = result.insertId;

//       // Insert into interview_rounds table
//       const insertRoundQuery = `
//         INSERT INTO interview_rounds (c_id, round_number, interviewer, interview_date, status, remarks) 
//         VALUES (?, ?, ?, ?, ?, ?)
//       `;
      
//       db.query(insertRoundQuery, [candidateId, round_number, interviewer, interview_date, status, remarks], (err) => {
//         if (err) {
//           res.status(500).json({ error: err });
//         } else {
//           res.json({ message: 'Candidate and first round added', candidateId });
//         }
//       });
//     }
//   });
// });

// Add or update a candidate and interview round
// Add a new candidate and interview round, or update the interview round for an existing candidate
// Add a new candidate with interview round
app.post('/api/candidates', (req, res) => {
  const { name, position, round_number, interviewer, interview_date, status, remarks, u_id } = req.body;

  // Validate required fields
  if (!name || !position || !round_number || !interviewer || !interview_date || !status || !u_id) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const upperCaseName = name.toUpperCase();

  // Insert new candidate
  const addCandidateQuery = `
      INSERT INTO candidates (c_name, position, u_id) VALUES (?, ?, ?)
  `;

  db.query(addCandidateQuery, [upperCaseName, position, u_id], (err, result) => {
      if (err) {
          console.error('Error inserting candidate:', err);
          return res.status(500).json({ error: err.message || 'Database error' });
      }

      const newCandidateId = result.insertId; // Get the new candidate ID

      // Add entry in the interview_rounds table
      const addInterviewRoundQuery = `
          INSERT INTO interview_rounds (c_id, round_number, interviewer, interview_date, status, remarks) VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(addInterviewRoundQuery, [newCandidateId, round_number, interviewer, interview_date, status, remarks], (err) => {
          if (err) {
              console.error('Error inserting interview round:', err);
              return res.status(500).json({ error: err.message || 'Database error' });
          }
          res.status(201).json({ message: 'Candidate and interview round added successfully', c_id: newCandidateId });
      });
  });
});




app.post('/api/candidates/:id/interview-rounds', (req, res) => {
  const { id } = req.params; // Candidate ID from the URL
  const { round_number, interviewer, interview_date, status, remarks } = req.body;

  // Add new entry in the ir table for the existing candidate
  const addInterviewRoundQuery = `
    INSERT INTO interview_rounds (c_id, round_number, interviewer, interview_date, status, remarks) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(addInterviewRoundQuery, [id, round_number, interviewer, interview_date, status, remarks], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: 'Interview round added successfully' });
  });
});




// Delete a candidate
app.delete('/api/candidates/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM candidates WHERE c_id = ?';
  
  db.query(query, [id], (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: 'Candidate deleted' });
    }
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
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
