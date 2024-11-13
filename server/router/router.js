const express = require("express");
const router = express.Router();
const User = require("../model/Signup");
const jweb = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sql = require("msnodesqlv8");
const multer = require("multer");
const mysql = require("mysql2");

const authMiddleware = require("../auth/authMiddleware");

const secret = "iwfhugafwofjwhig3hwigk3wnig3uwmgkmewoipj39gw8hqoijhi3hgwgkwni";
const connectionString =
  "Driver={MySQL ODBC 8.0 Driver};Server=127.0.0.1;Database=plexifyy;User=root;Password=1234;Option=3;";

// Set up the MySQL connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root", // Your MySQL username
  password: "1234", // Your MySQL password
  database: "plexifyy", // Your database name
  port: 3306, // MySQL default port
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    aadharNumber,
    phoneNumber,
    gender,
    beneficiary,
  } = req.body;

  // Input validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !aadharNumber ||
    !phoneNumber ||
    !gender ||
    !beneficiary
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Validate ENUM fields
  const validGenders = ["Male", "Female", "Other"];
  const validBeneficiary = ["Yes", "No"];
  if (
    !validGenders.includes(gender) ||
    !validBeneficiary.includes(beneficiary)
  ) {
    return res.status(400).json({ msg: "Invalid gender or beneficiary value" });
  }

  try {
    const checkUserQuery = "SELECT * FROM registration WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ msg: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = `
        INSERT INTO registration (first_name, last_name, email, password_hash, aadhar_number, phone_number, gender, beneficiary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertUserQuery,
        [
          firstName,
          lastName,
          email,
          hashedPassword,
          aadharNumber,
          phoneNumber,
          gender,
          beneficiary,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Error inserting user into the database:",
              err.sqlMessage || err.message
            );
            return res
              .status(500)
              .json({
                msg: "Failed to register user",
                error: err.sqlMessage || err.message,
              });
          }

          const token = jweb.sign({ email, user_id: result.insertId }, secret, {
            expiresIn: "1h",
          });
          res.status(201).json({ token, msg: "Signup successful" });
        }
      );
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ msg: "Unexpected error occurred" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide both email and password" });
    }

    // SQL query to check for the user
    const checkUserQuery = `SELECT * FROM registration WHERE email = ?`;

    // Database query execution
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ msg: "Internal Server Error during user query" });
      }

      // Check if the user exists
      if (!results || results.length === 0) {
        console.warn("No user found with the provided email:", email);
        return res
          .status(404)
          .json({ msg: "User not found. Please register first." });
      }

      // Verify the password using bcrypt
      const user = results[0];
      try {
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
          // Generate JWT token
          const token = jweb.sign(
            { email: user.email, user_id: user.user_id },
            secret,
            {
              expiresIn: "1h", // token expires in 1 hour
            }
          );
          return res.status(200).json({ token, msg: "Login successful" });
        } else {
          return res
            .status(401)
            .json({ msg: "Invalid credentials. Please try again." });
        }
      } catch (bcryptError) {
        console.error("Error during password verification:", bcryptError);
        return res.status(500).json({ msg: "Error verifying password" });
      }
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return res.status(500).json({ msg: "Unexpected server error occurred" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserQuery = `SELECT * FROM [registration] WHERE LOWER(email) = LOWER(?)`;

    sql.query(connectionString, checkUserQuery, [email], async (err, user) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ msg: "Server Error" });
      }

      if (!user || user.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = await bcrypt.hash(resetToken, 10);
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      const updateUserQuery = `
        UPDATE [registration] SET reset_token = ?, reset_token_expiry = ?
        WHERE LOWER(email) = LOWER(?)
      `;

      sql.query(
        connectionString,
        updateUserQuery,
        [hashedToken, tokenExpiry, email],
        async (err, result) => {
          if (err) {
            console.error("Error updating user with reset token:", err);
            return res.status(500).json({ msg: "Server Error" });
          }

          const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: "lazerxd002@gmail.com",
              pass: "oggv xfco evnc uhwv",
            },
          });

          const mailOptions = {
            from: "lazerxd002@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `You requested a password reset. Click this link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
          };

          await transporter.sendMail(mailOptions);

          return res.status(200).json({ msg: "Password reset email sent" });
        }
      );
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    console.log("✌️ req.body --->", req.body);
    const { token, newPassword } = req.body;

    const checkUserQuery = `
      SELECT email, reset_token, reset_token_expiry 
      FROM [registration] 
      WHERE reset_token IS NOT NULL
    `;

    sql.query(connectionString, checkUserQuery, async (err, user) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ msg: "Server Error" });
      }

      if (!user || user.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const hashedToken = user[0].reset_token;
      const tokenExpiry = new Date(user[0].reset_token_expiry);

      if (Date.now() > tokenExpiry) {
        return res.status(400).json({ msg: "Token has expired" });
      }

      const isMatch = await bcrypt.compare(token, hashedToken);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatePasswordQuery = `
        UPDATE [registration] 
        SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL 
        WHERE LOWER(email) = LOWER(?)
      `;

      sql.query(
        connectionString,
        updatePasswordQuery,
        [hashedPassword, user[0].email],
        (err, result) => {
          if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ msg: "Server Error" });
          }

          return res.status(200).json({ msg: "Password reset successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// insurance

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/insurance",
  authMiddleware,
  upload.single("document"),
  async (req, res) => {
    const {
      policyName,
      policyNumber,
      provider,
      policyType,
      policyPeriod,
      premiumAmount,
      coverageLimit,
      maturityAmount,
      nomineeName,
      nomineeRelation,
    } = req.body;

    const user_id = req.user_id;

    const parsedPremiumAmount = parseFloat(premiumAmount);
    const parsedCoverageLimit = parseFloat(coverageLimit);
    const parsedMaturityAmount = parseFloat(maturityAmount);

    const finalNomineeName = nomineeName.trim() === "" ? null : nomineeName;
    const finalNomineeRelation =
      nomineeRelation.trim() === "" ? null : nomineeRelation;

    let documentData = null;
    if (req.file) {
      try {
        documentData = fs.readFileSync(req.file.path);
      } catch (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ msg: "Error reading document file" });
      }
    }

    const insertPolicyQuery = `
    INSERT INTO insurance_policy (
      user_id, policy_number, policy_name, policy_type, provider, 
      policy_period, premium_amount, coverage_limit, maturity_amount, 
      nominee_name, nominee_relation, status, document
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)
  `;

    sql.query(
      connectionString,
      insertPolicyQuery,
      [
        user_id,
        policyNumber,
        policyName,
        policyType,
        provider,
        policyPeriod,
        parsedPremiumAmount,
        parsedCoverageLimit,
        parsedMaturityAmount,
        finalNomineeName,
        finalNomineeRelation,
        documentData, // Insert the file as binary data
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting insurance policy:", err);
          return res.status(500).json({ msg: "Server Error" });
        }
        res.status(201).json({ msg: "Insurance policy added successfully" });
      }
    );
  }
);

const deposits_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/deposits");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const deposits_upload = multer({
  storage: deposits_storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
});

router.post(
  "/deposits",
  authMiddleware,
  deposits_upload.single("document"),
  async (req, res) => {
    try {
      const {
        depositType,
        depositName,
        accountNumber,
        bankName,
        depositTerm,
        depositAmount,
        interestRate,
        maturityAmount,
      } = req.body;

      let documentData = null;
      if (req.file) {
        try {
          documentData = fs.readFileSync(req.file.path);
          console.log("✌️ documentData Buffer:", documentData);
        } catch (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({ msg: "Error reading document file" });
        }
      }

      if (!documentData) {
        return res.status(400).json({ msg: "No document data to upload" });
      }

      const user_id = req.user_id;
      const depositAmountParsed = parseFloat(depositAmount);
      const interestRateParsed = parseFloat(interestRate);
      const maturityAmountParsed = parseFloat(maturityAmount);

      const insertDepositQuery = `
      INSERT INTO fixed_deposit (
        user_id, deposit_type, deposit_name, account_number, bank_name, deposit_term,
        deposit_amount, interest_rate, maturity_amount, document
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      sql.query(
        connectionString,
        insertDepositQuery,
        [
          user_id,
          depositType,
          depositName,
          accountNumber,
          bankName,
          depositTerm,
          depositAmountParsed,
          interestRateParsed,
          maturityAmountParsed,
          documentData,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting deposit data:", err);
            return res.status(500).json({ msg: "Server Error" });
          }
          res.status(201).json({ msg: "Deposit details added successfully" });
        }
      );
    } catch (error) {
      console.error("Error processing deposit details:", error);
      res.status(500).json({ msg: "Error processing deposit details" });
    }
  }
);

module.exports = router;
