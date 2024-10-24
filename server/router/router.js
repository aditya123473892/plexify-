const express = require('express');
const router = express.Router();
const User = require('../model/Signup');
const jweb = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const sql = require('msnodesqlv8');

const secret = 'iwfhugafwofjwhig3hwigk3wnig3uwmgkmewoipj39gw8hqoijhi3hgwgkwni';
const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-BBKLDAG\\SQLEXPRESS01;Database=DB;Trusted_Connection=yes;';

router.post('/signup', async (req, res) => {
  try {
    console.log('✌️const --->', req.body);
    const { firstName, lastName, email, password, aadharNumber, phoneNumber, gender, beneficiary } = req.body;

    if (!firstName || !lastName || !email || !password || !aadharNumber || !phoneNumber || !gender || !beneficiary) {
      return res.status(400).json({ msg: 'Fill All Fields' });
    }

    const checkEmailQuery = `SELECT * FROM [registration] WHERE email = ?`;
    sql.query(connectionString, checkEmailQuery, [email], async (err, existingUser) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ msg: 'Server Error' });
      }

      if (existingUser.length > 0) {
        return res.status(400).json({ msg: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const insertUserQuery = `
        INSERT INTO [registration] (firstName, lastName, email, password_hash, aadharNumber, phoneNumber, gender, beneficiary) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      sql.query(connectionString, insertUserQuery, [firstName, lastName, email, hashedPassword, aadharNumber, phoneNumber, gender, beneficiary], (err, result) => {
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

    const checkUserQuery = `SELECT * FROM [registration] WHERE email = ?`;
    
    sql.query(connectionString, checkUserQuery, [email], async (err, user) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ msg: 'Server Error' });
      }

      if (!user || user.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user[0].password_hash);
      if (isMatch) {
        const token = jweb.sign({ email: email, user_id: user[0].id }, secret);
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ msg: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserQuery = `SELECT * FROM [registration] WHERE LOWER(email) = LOWER(?)`;

    sql.query(connectionString, checkUserQuery, [email], async (err, user) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ msg: 'Server Error' });
      }

      if (!user || user.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(resetToken, 10);
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      const updateUserQuery = `
        UPDATE [registration] SET reset_token = ?, reset_token_expiry = ?
        WHERE LOWER(email) = LOWER(?)
      `;

      sql.query(connectionString, updateUserQuery, [hashedToken, tokenExpiry, email], async (err, result) => {
        if (err) {
          console.error('Error updating user with reset token:', err);
          return res.status(500).json({ msg: 'Server Error' });
        }

        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'lazerxd002@gmail.com',
            pass: 'oggv xfco evnc uhwv', 
          },
        });

        const mailOptions = {
          from: 'lazerxd002@gmail.com',
          to: email,
          subject: 'Password Reset',
          text: `You requested a password reset. Click this link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ msg: 'Password reset email sent' });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    console.log('✌️ req.body --->',  req.body);
    const { token, newPassword } = req.body;

    const checkUserQuery = `
      SELECT email, reset_token, reset_token_expiry 
      FROM [registration] 
      WHERE reset_token IS NOT NULL
    `;

    sql.query(connectionString, checkUserQuery, async (err, user) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ msg: 'Server Error' });
      }

      if (!user || user.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const hashedToken = user[0].reset_token;
      const tokenExpiry = new Date(user[0].reset_token_expiry);

      if (Date.now() > tokenExpiry) {
        return res.status(400).json({ msg: 'Token has expired' });
      }

      const isMatch = await bcrypt.compare(token, hashedToken);
      if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid token' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatePasswordQuery = `
        UPDATE [registration] 
        SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL 
        WHERE LOWER(email) = LOWER(?)
      `;

      sql.query(connectionString, updatePasswordQuery, [hashedPassword, user[0].email], (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ msg: 'Server Error' });
        }

        return res.status(200).json({ msg: 'Password reset successfully' });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
});


module.exports = router;
