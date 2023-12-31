var express = require('express');
var router = express.Router();
const db = require('../Model/database')

// GET all users
router.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
    res.json(rows);
    // console.log(rows)
  });
});

// POST create a new user
router.post('/users', (req, res) => {
  const { firstname, lastname, dob, address } = req.body;


  if (!firstname || !lastname || !dob || !address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

    // Convert dob to the correct format (YYYY-MM-DD)
    const dobDate = new Date(dob);
    const formattedDob = dobDate.toISOString().split('T')[0];

  // Insert a new user into the "users" table
  db.run(
    'INSERT INTO users (first_name, last_name, dob, address) VALUES (?, ?, ?, ?)',
    [firstname, lastname, formattedDob, address],
    function (err) {
      if (err) {
        console.error('Error executing query:', err.message);
        return res.status(500).json({ error: 'An error occurred while adding a new user.' });
      }

console.log("Success")
      res.status(201).json({ message: 'User added successfully' });
    }
  );
});

// get user details by user ID
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'An error occurred while fetching user details.' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(row);
  });
});


// update user details by user ID
router.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, dob, address } = req.body;

  if (!firstname || !lastname || !dob || !address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  db.run(
    'UPDATE users SET first_name = ?, last_name = ?, dob = ?, address = ? WHERE id = ?',
    [firstname, lastname, dob, address, userId],
    (err) => {
      if (err) {
        console.error('Error executing query:', err.message);
        return res.status(500).json({ error: 'An error occurred while updating user details.' });
      }

      res.json({ message: 'User details updated successfully.' });
    }
  );
});


// delete a user by user ID
router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }

    res.json({ message: 'User deleted successfully.' });
  });
});


module.exports = router;
