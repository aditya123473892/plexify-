const express = require('express')
const router = express.Router()
const User = require('../model/Signup')
const jweb = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secret = 'iwfhugafwofjwhig3hwigk3wnig3uwmgkmewoipj39gw8hqoijhi3hgwgkwni'
const sql = require('msnodesqlv8');
const authMiddleware = require('../auth/authMiddleware')
const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-BBKLDAG\\SQLEXPRESS01;Database=DB;Trusted_Connection=yes;';
const db = require('../db/connection');





router.post('/signup', async (req, res) => {
  try {
    console.log('✌️req.body --->', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Fill All Fields' });
    }

    const checkEmailQuery = `SELECT * FROM [User] WHERE email = ?`;
    sql.query(connectionString, checkEmailQuery, [email], async (err, existingUser) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ msg: 'Server Error' });
      }

      if (existingUser.length > 0) {
        return res.status(400).json({ msg: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const insertUserQuery = `INSERT INTO [User] (email, password) VALUES (?, ?)`;
      sql.query(connectionString, insertUserQuery, [email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ msg: 'Server Error' });
        }

        const token = jweb.sign({ email }, secret, { expiresIn: '3d' });
        res.status(201).json({ token, msg: 'Account Created Successfully' });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUserQuery = `SELECT * FROM [User] WHERE email = ?`;
    sql.query(connectionString, checkUserQuery, [email], async (err, user) => {
      if (err || user.length === 0) {
        return res.status(400).json({ msg: 'No User Found' });
      }

      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        const token = jweb.sign({ email: email, user_id: user[0].user_id }, secret);
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ msg: 'Incorrect Details' });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Server Error' });
  }
});


module.exports = router


