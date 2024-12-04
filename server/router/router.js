const express = require("express");
const router = express.Router();
const jweb = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sql = require("msnodesqlv8");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../auth/authMiddleware");
const secret = "iwfhugafwofjwhig3hwigk3wnig3uwmgkmewoipj39gw8hqoijhi3hgwgkwni";
const connectionString =
  //'Driver={ODBC Driver 17 for SQL Server};Server=PLEXIFY;Database=PLEXIFY;Trusted_Connection=yes;';

  // "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-BBKLDAG\\SQLEXPRESS01;Database=DB;Trusted_Connection=yes;";

  "Driver={ODBC Driver 18 for SQL Server};Server=MOHIT\\SQLEXPRESS;Database=master;Trusted_Connection=yes;TrustServerCertificate=yes;";

const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

router.post("/signup", async (req, res) => {
  try {
    console.log("✌️ Request body --->", req.body);
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

    // Validate input fields
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
      return res.status(400).json({ msg: "Fill All Fields" });
    }

    // Check if email already exists
    const checkEmailQuery = `SELECT * FROM [registration] WHERE email = ?`;
    const existingUser = await queryDatabase(checkEmailQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a 10-digit random user_id
    const generateUserId = () =>
      Math.floor(1000000000 + Math.random() * 9000000000);
    const user_id = generateUserId();

    // Insert the new user into the database
    const insertUserQuery = `
      INSERT INTO [registration] (user_id, firstName, lastName, email, password_hash, aadharNumber, phoneNumber, gender, beneficiary) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await queryDatabase(insertUserQuery, [
      user_id,
      firstName,
      lastName,
      email,
      hashedPassword,
      aadharNumber,
      phoneNumber,
      gender,
      beneficiary,
    ]);

    // Generate a JWT token
    const token = jweb.sign({ email }, secret, { expiresIn: "3d" });

    res.status(201).json({ token, msg: "Account Created Successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const checkUserQuery = `SELECT * FROM [registration] WHERE email = ?`;
    const user = await queryDatabase(checkUserQuery, [email]);

    if (!user || user.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (isMatch) {
      const token = jweb.sign(
        { email: email, user_id: user[0].user_id },
        secret
      );
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/beneficiary_user", authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const query = `
      SELECT * 
      FROM [dbo].[beneficiaries]
      WHERE user_id = ?
    `;
  const data = await queryDatabase(query, [user_id]);
  res.status(200).json(data);
});
router.post("/add-beneficiary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user_id;
    const { name, contact, email, entitlement, notify, relationship } =
      req.body;

    if (!userId || !name || !entitlement || !relationship) {
      return res.status(400).json({ msg: "Please fill all required fields." });
    }

    const checkUserQuery = `SELECT user_id FROM dbo.registration WHERE user_id = ?`;
    const userExists = await queryDatabase(checkUserQuery, [userId]);

    if (userExists.length === 0) {
      return res
        .status(400)
        .json({ msg: "Invalid user_id. Please register the user first." });
    }

    const insertBeneficiaryQuery = `
      INSERT INTO dbo.beneficiaries 
      (user_id, name, contact, email, entitlement, relationship, notify) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await queryDatabase(insertBeneficiaryQuery, [
      userId,
      name,
      contact || null,
      email || null,
      entitlement,
      relationship,
      notify || 0,
    ]);

    res.status(201).json({
      msg: "Beneficiary added successfully",
      beneficiaryId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding beneficiary:", error);
    res.status(500).json({ msg: "Server error." });
  }
});

router.get("/beneficiaries", async (req, res) => {
  try {
    const { userId, beneficiaryId } = req.query;

    let fetchQuery = `SELECT * FROM dbo.beneficiaries`;
    const queryParams = [];

    if (userId) {
      fetchQuery += ` WHERE user_id = ?`;
      queryParams.push(userId);
    }
    if (beneficiaryId) {
      fetchQuery += userId
        ? ` AND beneficiary_id = ?`
        : ` WHERE beneficiary_id = ?`;
      queryParams.push(beneficiaryId);
    }

    const results = await queryDatabase(fetchQuery, queryParams);

    if (results.length === 0) {
      return res.status(404).json({ msg: "No beneficiaries found." });
    }

    res.status(200).json({
      msg: "Beneficiaries retrieved successfully",
      beneficiaries: results,
    });
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    res.status(500).json({ msg: "Server error." });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserQuery = `SELECT * FROM [registration] WHERE LOWER(email) = LOWER(?)`;
    const user = await queryDatabase(checkUserQuery, [email]);

    if (!user || user.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const tokenExpiry = new Date(Date.now() + 3600000);

    const updateUserQuery = `
      UPDATE [registration] SET reset_token = ?, reset_token_expiry = ?
      WHERE LOWER(email) = LOWER(?)
    `;
    await queryDatabase(updateUserQuery, [hashedToken, tokenExpiry, email]);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "lazerxd002@gmail.com",
        pass: "oggv xfco evnc uhwv", // Consider using environment variables for sensitive data
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
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const checkUserQuery = `
      SELECT email, reset_token, reset_token_expiry 
      FROM [registration] 
      WHERE reset_token IS NOT NULL
    `;
    const users = await queryDatabase(checkUserQuery);

    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = users[0];
    const hashedToken = user.reset_token;
    const tokenExpiry = new Date(user.reset_token_expiry);

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
    await queryDatabase(updatePasswordQuery, [hashedPassword, user.email]);

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// insurance

router.get("/insurance", authMiddleware, async (req, res) => {
  const user_id = req.user_id;

  const fetchPoliciesQuery = `
      SELECT 
        policy_id,
        policy_number,
        policy_name,
        policy_type,
        provider,
        policy_period,
        premium_amount,
        coverage_limit,
        maturity_amount,
        nominee_name,
        nominee_relation,
        status,document
      FROM insurance_policy
      WHERE user_id = ?
      ORDER BY policy_id DESC
    `;
  try {
    const policies = await queryDatabase(fetchPoliciesQuery, [user_id]);
    console.log("✌️policies --->", policies);

    res.status(200).json({
      policies,
      msg: "Insurance policies retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching insurance policies:-", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

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
    try {
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

      const finalNomineeName = nomineeName?.trim() || null;
      const finalNomineeRelation = nomineeRelation?.trim() || null;

      let documentData = null;
      if (req.file) {
        try {
          documentData = fs.readFileSync(req.file.path);
        } catch (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({ msg: "Error reading document file" });
        }
      }

      // Check if a policy with the same policy number and user_id already exists
      const checkPolicyQuery = `
        SELECT * FROM insurance_policy WHERE policy_number = ? AND user_id = ?
      `;
      const existingPolicy = await queryDatabase(checkPolicyQuery, [
        policyNumber,
        user_id,
      ]);

      if (existingPolicy.length > 0) {
        // Update existing policy
        const updatePolicyQuery = `
          UPDATE insurance_policy 
          SET 
            policy_name = ?, 
            policy_type = ?, 
            provider = ?, 
            policy_period = ?, 
            premium_amount = ?, 
            coverage_limit = ?, 
            maturity_amount = ?, 
            nominee_name = ?, 
            nominee_relation = ?, 
            document = ?
          WHERE policy_number = ? AND user_id = ?
        `;

        await queryDatabase(updatePolicyQuery, [
          policyName,
          policyType,
          provider,
          policyPeriod,
          parsedPremiumAmount,
          parsedCoverageLimit,
          parsedMaturityAmount,
          finalNomineeName,
          finalNomineeRelation,
          documentData || existingPolicy[0].document, // Retain the previous document if no new file is uploaded
          policyNumber,
          user_id,
        ]);

        return res.status(200).json({
          msg: "Insurance policy updated successfully",
        });
      } else {
        // Insert new policy
        const insertPolicyQuery = `
          INSERT INTO insurance_policy (
            user_id, policy_number, policy_name, policy_type, provider, 
            policy_period, premium_amount, coverage_limit, maturity_amount, 
            nominee_name, nominee_relation, status, document
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)
        `;

        await queryDatabase(insertPolicyQuery, [
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
          documentData,
        ]);

        return res.status(201).json({
          msg: "Insurance policy added successfully",
        });
      }
    } catch (error) {
      console.error("Error processing insurance request:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

router.get("/deposits", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  // SQL query to fetch deposit records for the user
  const fetchDepositsQuery = `
      SELECT 
        deposit_id,
        deposit_type,
        deposit_name,
        account_number,
        bank_name,
        deposit_term,
        deposit_amount,
        interest_rate,
        maturity_amount,
        status,
        document,
        created_at,
        updated_at
      FROM fixed_deposit
      WHERE user_id = ?
      ORDER BY deposit_id DESC
    `;

  try {
    const deposits = await queryDatabase(fetchDepositsQuery, [user_id]);

    // Return the deposits to the client
    res.status(200).json({
      deposits,
      msg: "Deposits retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching deposits:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});
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
        depositId,
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

      const checkDepositQuery = `
        SELECT * FROM fixed_deposit WHERE user_id = ? AND deposit_id = ?
      `;
      const depositExists = await queryDatabase(checkDepositQuery, [
        user_id,
        depositId,
      ]);

      if (depositExists.length > 0) {
        const updateDepositQuery = `
          UPDATE fixed_deposit SET 
            deposit_type = ?, deposit_name = ?, account_number = ?, bank_name = ?, deposit_term = ?, 
            deposit_amount = ?, interest_rate = ?, maturity_amount = ?, document = ?
          WHERE user_id = ? AND deposit_id = ?
        `;
        await queryDatabase(updateDepositQuery, [
          depositType,
          depositName,
          accountNumber,
          bankName,
          depositTerm,
          depositAmountParsed,
          interestRateParsed,
          maturityAmountParsed,
          documentData,
          user_id,
          depositId,
        ]);
        return res
          .status(200)
          .json({ msg: "Deposit details updated successfully" });
      } else {
        const insertDepositQuery = `
          INSERT INTO fixed_deposit (
            user_id, deposit_type, deposit_name, account_number, bank_name, deposit_term,
            deposit_amount, interest_rate, maturity_amount, document
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await queryDatabase(insertDepositQuery, [
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
        ]);
        return res
          .status(201)
          .json({ msg: "Deposit details added successfully" });
      }
    } catch (error) {
      console.error("Error processing deposit details:", error);
      res.status(500).json({ msg: "Error processing deposit details" });
    }
  }
);

router.get("/recurring_deposits", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  // SQL query to fetch recurring deposit records for the user
  const fetchDepositsQuery = `
      SELECT 
        id,
        user_id,
        beneficiarie_user,
        rd_number,
        monthly_deposit_amount,
        interest_rate,
        start_date,
        maturity_date,
        maturity_amount,
        bank_name,
        status,
        created_at,
        updated_at
      FROM recurring_deposit
      WHERE user_id = ?  
      ORDER BY id DESC;
    `;

  try {
    // Using the queryDatabase function to execute the query
    const deposits = await queryDatabase(fetchDepositsQuery, [user_id]);

    res.status(200).json({
      deposits,
      msg: "Recurring deposits retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching recurring deposits:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/recurring_deposits", authMiddleware, async (req, res) => {
  console.log("✌️ req.bodyssss --->", req.body);
  const { deposits, beneficiaries } = req.body; // Array of deposits
  const user_id = req.user_id; // Authenticated user ID
  const beneficiariesString = beneficiaries.join(","); // New beneficiaries list

  try {
    for (const deposit of deposits) {
      // Check if a deposit with the given user_id exists
      const checkDepositQuery = `
          SELECT id, beneficiarie_user 
          FROM [dbo].[recurring_deposit] 
          WHERE user_id = ? AND rd_number = ?
        `;

      const existingDepositResult = await queryDatabase(checkDepositQuery, [
        user_id,
        deposit.rdNumber,
      ]);

      if (existingDepositResult.length > 0) {
        const existingBeneficiaries =
          existingDepositResult[0].beneficiarie_user;
        const updatedBeneficiaries = existingBeneficiaries
          ? `${existingBeneficiaries},${beneficiariesString}`
          : beneficiariesString;

        const updateDepositQuery = `
            UPDATE [dbo].[recurring_deposit] 
            SET 
              beneficiarie_user = ?, 
              monthly_deposit_amount = ?, 
              interest_rate = ?, 
              start_date = ?, 
              maturity_date = ?, 
              maturity_amount = ?, 
              bank_name = ?, 
              status = ?, 
              updated_at = GETDATE()
            WHERE id = ?
          `;

        await queryDatabase(updateDepositQuery, [
          updatedBeneficiaries || null,
          deposit.depositAmount,
          deposit.interestRate,
          deposit.startDate,
          deposit.maturityDate,
          deposit.maturityAmount,
          deposit.bankName,
          deposit.status || "Active", // Default status if not provided
          existingDepositResult[0].id, // Use the existing deposit ID
        ]);

        console.log(
          "Updated Recurring Deposit ID:",
          existingDepositResult[0].id
        );
      } else {
        // If no existing deposit, insert a new one
        const insertDepositQuery = `
            INSERT INTO [dbo].[recurring_deposit] (
              user_id, 
              beneficiarie_user, 
              rd_number,
              monthly_deposit_amount, 
              interest_rate, 
              start_date, 
              maturity_date, 
              maturity_amount, 
              bank_name, 
              status, 
              created_at, 
              updated_at
            )
            OUTPUT INSERTED.id
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE())
          `;

        const insertDepositResult = await queryDatabase(insertDepositQuery, [
          user_id,
          beneficiariesString || null, // Nullable field for beneficiaries
          deposit.rdNumber,
          deposit.depositAmount,
          deposit.interestRate,
          deposit.startDate,
          deposit.maturityDate,
          deposit.maturityAmount,
          deposit.bankName,
          deposit.status || "Active", // Default status if not provided
        ]);

        const rd_id = insertDepositResult[0].id;
        console.log("Inserted Recurring Deposit ID:", rd_id);
      }
    }

    res.status(201).json({
      msg: "Recurring deposits added/updated successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Server error." });
  }
});

router.get("/properties", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  // SQL query to fetch properties for the authenticated user
  const fetchPropertiesQuery = `
      SELECT 
        id,
        property_name,
        property_type,
        location,
        area_in_sqft,
        purchase_date,
        purchase_price,
        current_value,
        ownership_status,
        rental_income,
        tenant_name,
        tenant_contact,
        status,
        beneficiarie_user,
        created_at,
        updated_at
      FROM properties
      WHERE user_id = ?
      ORDER BY id DESC;
    `;

  try {
    // Using the queryDatabase function to execute the query
    const properties = await queryDatabase(fetchPropertiesQuery, [user_id]);

    res.status(200).json({
      properties,
      msg: "Properties retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/real_estate", authMiddleware, async (req, res) => {
  console.log("✌️ req.body --->", req.body);
  const { properties, beneficiaries } = req.body;
  const user_id = req.user_id;
  const beneficiariesString = beneficiaries.join(",");

  try {
    for (const property of properties) {
      // Check if the specific property exists for the user
      const checkDepositQuery = `
        SELECT id, beneficiarie_user 
        FROM [dbo].[properties] 
        WHERE user_id = ? AND property_name = ? 
      `;

      const existingDepositResult = await queryDatabase(checkDepositQuery, [
        user_id,
        property.propertyName, // Add property_name to the query
      ]);

      console.log(existingDepositResult, "existingDepositResult");

      if (existingDepositResult && existingDepositResult.length > 0) {
        // If the property exists, update it
        const existingBeneficiaries =
          existingDepositResult[0].beneficiarie_user;
        const updatedBeneficiaries = existingBeneficiaries
          ? `${existingBeneficiaries},${beneficiariesString}`
          : beneficiariesString;

        const updatePropertyQuery = `
          UPDATE [dbo].[properties]
          SET property_type = ?, location = ?, area_in_sqft = ?, purchase_date = ?, 
              purchase_price = ?, current_value = ?, ownership_status = ?, rental_income = ?, 
              tenant_name = ?, tenant_contact = ?, status = ?, updated_at = GETDATE(), beneficiarie_user = ?
          WHERE property_name = ? AND user_id = ?
        `;

        await queryDatabase(updatePropertyQuery, [
          property.propertyType,
          property.location,
          parseInt(property.areaInSqft),
          property.purchaseDate,
          parseFloat(property.purchasePrice),
          parseFloat(property.currentValue),
          property.ownershipStatus,
          parseFloat(property.rentalIncome),
          property.tenantName,
          property.tenantContact,
          property.status || "Active",
          updatedBeneficiaries,
          property.propertyName, // Ensure property_name is included in the WHERE clause
          user_id,
        ]);
      } else {
        // If the property doesn't exist, insert it
        const insertPropertyQuery = `
          INSERT INTO [dbo].[properties] (
            user_id, beneficiarie_user, property_name, property_type, location, area_in_sqft, 
            purchase_date, purchase_price, current_value, ownership_status, 
            rental_income, tenant_name, tenant_contact, status, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE())
        `;

        await queryDatabase(insertPropertyQuery, [
          user_id,
          beneficiariesString || null,
          property.propertyName,
          property.propertyType,
          property.location,
          parseInt(property.areaInSqft),
          property.purchaseDate,
          parseFloat(property.purchasePrice),
          parseFloat(property.currentValue),
          property.ownershipStatus,
          parseFloat(property.rentalIncome),
          property.tenantName,
          property.tenantContact,
          property.status || "Active",
        ]);
      }
    }

    res.status(201).json({ msg: "Properties added/updated successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Server error." });
  }
});

router.get("/stocks", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  // SQL query to fetch stocks for the authenticated user
  const fetchStocksQuery = `
      SELECT 
        id,
        symbol,
        purchase_date,
        purchase_price,
        quantity,
        current_value,
        total_investment,
        beneficiarie_user,
        created_at,
        updated_at
      FROM stocks
      WHERE user_id = ?
      ORDER BY id DESC;
    `;

  try {
    const stocks = await queryDatabase(fetchStocksQuery, [user_id]);

    if (stocks.length === 0) {
      return res.status(404).json({ msg: "No stocks found" });
    }

    res.status(200).json({
      stocks,
      msg: "Stocks retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching stocks:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/stocks", authMiddleware, async (req, res) => {
  console.log(req.body);
  const { stocks, beneficiaries } = req.body;
  const user_id = req.user_id;

  const beneficiariesString = beneficiaries.join(",");

  try {
    for (let stock of stocks) {
      const {
        symbol,
        purchaseDate,
        purchasePrice,
        quantity,
        currentValue,
        totalInvestment,
      } = stock;

      // Check if stock already exists
      const checkStockQuery = `
          SELECT id, beneficiarie_user 
          FROM [dbo].[stocks] 
          WHERE user_id = ? AND symbol = ?;
        `;
      const existingStockResult = await queryDatabase(checkStockQuery, [
        user_id,
        symbol,
      ]);

      if (existingStockResult.length > 0) {
        // Update existing stock
        console.log(`Updating stock for symbol: ${symbol}`);
        const existingBeneficiaries = existingStockResult[0].beneficiarie_user;
        const updatedBeneficiaries = existingBeneficiaries
          ? `${existingBeneficiaries},${beneficiariesString}`
          : beneficiariesString;

        const updateStockQuery = `
            UPDATE [dbo].[stocks]
            SET 
              purchase_date = ?, 
              purchase_price = ?, 
              quantity = ?, 
              current_value = ?, 
              total_investment = ?, 
              beneficiarie_user = ?
            WHERE user_id = ? AND symbol = ?;
          `;
        await queryDatabase(updateStockQuery, [
          purchaseDate,
          purchasePrice,
          quantity,
          currentValue,
          totalInvestment,
          updatedBeneficiaries,
          user_id,
          symbol,
        ]);
        console.log(`Stock updated for symbol: ${symbol}`);
      } else {
        // Insert new stock
        console.log(`Inserting new stock for symbol: ${symbol}`);
        const insertStockQuery = `
            INSERT INTO [dbo].[stocks] (
              symbol, purchase_date, purchase_price, quantity, current_value, total_investment, user_id, beneficiarie_user
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
          `;
        await queryDatabase(insertStockQuery, [
          symbol,
          purchaseDate,
          purchasePrice,
          quantity,
          currentValue,
          totalInvestment,
          user_id,
          beneficiariesString,
        ]);
        console.log(`New stock inserted for symbol: ${symbol}`);
      }
    }

    res.status(201).json({
      msg: "Stocks added or updated successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Server error." });
  }
});

router.get("/bonds", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user
  const fetchBondsQuery = `
      SELECT 
        id,
        user_id,
        issuer,
        bond_type,
        maturity_date,
        face_value,
        interest_rate,
        market_value,
        description,
        document,
        created_at,
        updated_at,
        beneficiarie_user
      FROM bond
      WHERE user_id = ?
      ORDER BY id DESC;
    `;

  try {
    const bonds = await queryDatabase(fetchBondsQuery, [user_id]);

    if (bonds.length === 0) {
      return res.status(404).json({ msg: "No bonds found" });
    }

    res.status(200).json({
      bonds,
      msg: "Bonds retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching bonds:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

const bond_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/bond");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const bond_upload = multer({
  storage: bond_storage,
});

router.post(
  "/bonds",
  authMiddleware,
  bond_upload.single("document"),
  async (req, res) => {
    try {
      console.log("✌️req.body --->", req.body);

      const bonds = JSON.parse(req.body.bonds);
      const beneficiaries = JSON.parse(req.body.beneficiaries);

      const user_id = req.user_id;

      if (!Array.isArray(beneficiaries)) {
        return res
          .status(400)
          .json({ msg: "Beneficiaries should be an array of user IDs." });
      }

      const beneficiariesString = beneficiaries
        .map((id) => Number(id))
        .join(",");

      const insertBondQuery = `
            INSERT INTO [dbo].[bond] (
              user_id, beneficiarie_user, issuer, bond_type, maturity_date, face_value, interest_rate, market_value, document
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
          `;

      let documentData = null;
      if (req.file) {
        documentData = fs.readFileSync(req.file.path);
        console.log("Document Data Buffer:", documentData);
      }

      for (let bond of bonds) {
        const {
          issuer,
          type: bondType,
          maturityDate,
          faceValue,
          interestRate,
          marketValue,
        } = bond;

        const issuerValidated = String(issuer || "");
        const bondTypeValidated = String(bondType || "");
        const maturityDateValidated = maturityDate
          ? new Date(maturityDate)
          : null;
        const faceValueValidated = Number(faceValue || 0);
        const interestRateValidated = Number(interestRate || 0);
        const marketValueValidated = Number(marketValue || 0);

        console.log("Values being inserted:");
        console.log({
          user_id,
          beneficiariesString,
          issuerValidated,
          bondTypeValidated,
          maturityDateValidated,
          faceValueValidated,
          interestRateValidated,
          marketValueValidated,
          documentType: documentData ? typeof documentData : null,
        });

        await queryDatabase(insertBondQuery, [
          user_id,
          beneficiariesString,
          issuerValidated,
          bondTypeValidated,
          maturityDateValidated,
          faceValueValidated,
          interestRateValidated,
          marketValueValidated,
          documentData, // This should be a Buffer or null
        ]);
      }

      res
        .status(201)
        .json({ msg: "Bonds added successfully with beneficiaries!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "Server error." });
    }
  }
);

router.get("/mutual-funds", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  const fetchMutualFundsQuery = `
        SELECT 
          id,
          user_id,
          fund_name,
          fund_manager,
          investment_amount,
          current_value,
          fund_type,
          risk_level,
          notify,
          document,
          created_at,
          updated_at
        FROM mutual_funds
        WHERE user_id = ?
        ORDER BY id DESC;
      `;

  try {
    // Execute the query with the user_id to get the user's mutual funds
    const mutualFunds = await queryDatabase(fetchMutualFundsQuery, [user_id]);

    if (mutualFunds.length === 0) {
      return res.status(404).json({ msg: "No mutual funds found" });
    }

    // Return the mutual funds data
    res.status(200).json({
      mutualFunds,
      msg: "Mutual funds retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching mutual funds:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/mutualFundsDocuments");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const mfupload = multer({
  storage: documentStorage,
});

router.post(
  "/mutual-funds",
  authMiddleware,
  mfupload.single("document"),
  async (req, res) => {
    try {
      const funds = JSON.parse(req.body.funds); // Parse funds JSON from request body
      const userId = req.user_id; // Assuming user_id is passed in the request body
      const filePath = req.file ? req.file.path : null;

      funds.forEach((fund) => {
        const insertQuery = `
          INSERT INTO mutual_funds (user_id, fund_name, fund_manager, investment_amount, current_value, fund_type, risk_level, notify, document)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        sql.query(
          connectionString,
          insertQuery,
          [
            userId,
            fund.fundName,
            fund.fundManager,
            fund.investmentAmount,
            fund.currentValue,
            fund.fundType,
            fund.riskLevel,
            fund.notify,
            filePath ? fs.readFileSync(filePath) : null, // Convert file to binary data
          ],
          (err, result) => {
            if (err) {
              console.error("Error inserting mutual fund:", err);
              return res
                .status(500)
                .json({ msg: "Error inserting mutual fund" });
            }
          }
        );
      });

      res.status(200).json({ msg: "Mutual fund data saved successfully" });
    } catch (error) {
      console.error("Error saving mutual fund data:", error);
      res.status(500).json({ msg: "Failed to save mutual fund data" });
    }
  }
);

const pmStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/preciousMetalsDocuments");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const pmUpload = multer({
  storage: pmStorage,
});

router.post(
  "/precious-metal",
  authMiddleware,
  pmUpload.single("document"),
  async (req, res) => {
    try {
      console.log("✌️req.body --->", req.body);
      const beneficiaries = JSON.parse(req.body.beneficiaries);
      const metals = JSON.parse(req.body.metals); // Metals data
      const userId = req.user_id;

      let documentData = null;
      if (req.file) {
        documentData = fs.readFileSync(req.file.path);
        console.log("Document Data Buffer:", documentData);
      }

      if (!Array.isArray(beneficiaries)) {
        return res
          .status(400)
          .json({ msg: "Beneficiaries should be an array of user IDs." });
      }

      const beneficiariesString = beneficiaries
        .map((id) => Number(id))
        .join(",");
      for (let metal of metals) {
        const weight = parseFloat(metal.weight).toFixed(2);
        const purchasePrice = parseFloat(metal.purchasePrice).toFixed(2);
        const currentValue = parseFloat(metal.currentValue).toFixed(2);
        const description = metal.description || "";

        if (isNaN(weight) || isNaN(purchasePrice) || isNaN(currentValue)) {
          throw new Error("Invalid numeric data for metal entry");
        }

        const insertMetalQuery = `
            INSERT INTO precious_metals (user_id, metal_type, weight, purchase_price, current_value, description, document,beneficiarie_user)
            VALUES (?, ?, ?, ?, ?, ?, ?,?);
          `;

        await queryDatabase(insertMetalQuery, [
          userId,
          metal.metalType,
          weight,
          purchasePrice,
          currentValue,
          description,
          documentData || null,
          beneficiariesString,
        ]);

        console.log(`Metal inserted: ${metal.metalType}`);
      }

      res.status(200).json({
        msg: "Precious metals data saved successfully",
      });
    } catch (error) {
      console.error("Error saving precious metals data:", error);
      res.status(500).json({ msg: "Failed to save data" });
    }
  }
);

router.get("/cryptocurrencies", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  const fetchCryptoQuery = `
      SELECT 
        id, 
        name, 
        amount_held, 
        current_value, 
        acquisition_date, 
        wallet, 
        created_at, 
        updated_at 
      FROM cryptocurrencies 
      WHERE user_id = ? 
      ORDER BY id DESC;
    `;

  try {
    const cryptos = await queryDatabase(fetchCryptoQuery, [user_id]);

    if (cryptos.length === 0) {
      return res.status(404).json({ msg: "No cryptocurrencies found" });
    }

    res.status(200).json({
      cryptos,
      msg: "Cryptocurrencies retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching cryptocurrencies:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/cryptocurrencies", authMiddleware, async (req, res) => {
  try {
    console.log("✌️req.body --->", req.body);
    const { cryptos, beneficiaryUser } = req.body;
    const userId = req.user_id;
    const insertCryptoQuery = `
        INSERT INTO cryptocurrencies (name, amount_held, current_value, acquisition_date, wallet, user_id)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

    // Loop through each crypto object and save to the database
    const saveCryptoPromises = cryptos.map((crypto) => {
      const { name, amountHeld, currentValue, acquisitionDate, wallet } =
        crypto;
      const params = [
        name,
        amountHeld,
        currentValue,
        acquisitionDate,
        wallet,
        userId,
      ];
      return queryDatabase(insertCryptoQuery, params);
    });

    // Execute all insert queries concurrently
    await Promise.all(saveCryptoPromises);

    res.status(200).json({ msg: "Cryptocurrency details saved successfully!" });
  } catch (error) {
    console.error("Error saving cryptocurrency details:", error);
    res.status(500).json({ msg: "Error saving cryptocurrency details", error });
  }
});

router.get("/bank-accounts", authMiddleware, async (req, res) => {
  const user_id = req.user_id;

  try {
    const fetchAccountsQuery = `
      SELECT 
        id, 
        account_holder, 
        account_number, 
        bank_name, 
        account_type, 
        balance, 
        notes, 
        created_at, 
        updated_at
      FROM bank_accounts
      WHERE user_id = ?
      ORDER BY id DESC;
    `;

    const accounts = await queryDatabase(fetchAccountsQuery, [user_id]);

    if (accounts.length === 0) {
      return res.status(404).json({ msg: "No bank accounts found" });
    }

    res.status(200).json({
      accounts,
      msg: "Bank accounts retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching bank accounts:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// POST a new bank account
router.post("/bank-accounts", authMiddleware, async (req, res) => {
  const {
    account_holder,
    account_number,
    bank_name,
    account_type,
    balance,
    notes,
  } = req.body;
  const user_id = req.user_id;

  if (
    !account_holder ||
    !account_number ||
    !bank_name ||
    !account_type ||
    !balance
  ) {
    return res.status(400).json({
      msg: "Account holder, account number, bank name, account type, and balance are required.",
    });
  }

  try {
    const insertAccountQuery = `
      INSERT INTO bank_accounts (
        account_holder, account_number, bank_name, account_type, balance, notes, user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    await queryDatabase(insertAccountQuery, [
      account_holder,
      account_number,
      bank_name,
      account_type,
      parseFloat(balance),
      notes || null,
      user_id,
    ]);

    res.status(201).json({ msg: "Bank account added successfully" });
  } catch (err) {
    console.error("Error adding bank account:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// PUT (Update) a bank account
router.put("/bank-accounts/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    account_holder,
    account_number,
    bank_name,
    account_type,
    balance,
    notes,
  } = req.body;
  const user_id = req.user_id;

  try {
    const updateAccountQuery = `
      UPDATE bank_accounts
      SET 
        account_holder = ?, 
        account_number = ?, 
        bank_name = ?, 
        account_type = ?, 
        balance = ?, 
        notes = ?, 
        updated_at = GETDATE()
      WHERE id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(updateAccountQuery, [
      account_holder,
      account_number,
      bank_name,
      account_type,
      parseFloat(balance),
      notes || null,
      id,
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: "Bank account not found or unauthorized" });
    }

    res.status(200).json({ msg: "Bank account updated successfully" });
  } catch (err) {
    console.error("Error updating bank account:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// DELETE a bank account
router.delete("/bank-accounts/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;

  try {
    const deleteAccountQuery = `
      DELETE FROM bank_accounts
      WHERE id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(deleteAccountQuery, [id, user_id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: "Bank account not found or unauthorized" });
    }

    res.status(200).json({ msg: "Bank account deleted successfully" });
  } catch (err) {
    console.error("Error deleting bank account:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});
router.post("/retirement-accounts", authMiddleware, async (req, res) => {
  try {
    console.log("✌️ req.body --->", req.body);
    const { accounts } = req.body; // Destructure accounts from request body
    const userId = req.user_id; // Assuming the user ID is passed via authMiddleware

    const insertAccountQuery = `
        INSERT INTO retirement_accounts (
          account_holder, account_type, institution_name, current_balance, total_contributions, notes, user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;

    // Loop through each account object and save to the database
    const saveAccountPromises = accounts.map((account) => {
      const {
        accountHolder,
        accountType,
        institutionName,
        currentBalance,
        contributions,
        notes,
      } = account;

      // Prepare parameters for the insert query
      const params = [
        accountHolder, // account_holder
        accountType, // account_type
        institutionName, // institution_name
        parseFloat(currentBalance), // current_balance (convert string to number)
        parseFloat(contributions), // total_contributions (convert string to number)
        notes, // notes
        userId, // user_id
      ];

      return queryDatabase(insertAccountQuery, params); // Execute the query
    });

    // Execute all insert queries concurrently
    await Promise.all(saveAccountPromises);

    res
      .status(200)
      .json({ msg: "Retirement account details saved successfully!" });
  } catch (error) {
    console.error("Error saving retirement account details:", error);
    res
      .status(500)
      .json({ msg: "Error saving retirement account details", error });
  }
});
router.get("/retirement-accounts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user_id;

    const fetchAccountsQuery = `
      SELECT * 
      FROM retirement_accounts
      WHERE user_id = ?
      ORDER BY account_holder ASC;
    `;

    const accounts = await queryDatabase(fetchAccountsQuery, [userId]);

    res.status(200).json({ accounts });
  } catch (error) {
    console.error("Error fetching retirement accounts:", error);
    res.status(500).json({ msg: "Error fetching retirement accounts", error });
  }
});

// GET Route: Fetch a single retirement account by ID
router.get("/retirement-accounts/:id", authMiddleware, async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.user_id;

    const fetchAccountQuery = `
      SELECT * 
      FROM retirement_accounts 
      WHERE id = ? AND user_id = ?;
    `;

    const [account] = await queryDatabase(fetchAccountQuery, [
      accountId,
      userId,
    ]);

    if (account) {
      res.status(200).json({ account });
    } else {
      res
        .status(404)
        .json({ msg: "Retirement account not found or unauthorized" });
    }
  } catch (error) {
    console.error("Error fetching retirement account:", error);
    res.status(500).json({ msg: "Error fetching retirement account", error });
  }
});

// PUT Route: Update a retirement account by ID
router.put("/retirement-accounts/:id", authMiddleware, async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.user_id;
    const {
      accountHolder,
      accountType,
      institutionName,
      currentBalance,
      contributions,
      notes,
    } = req.body;

    const updateAccountQuery = `
      UPDATE retirement_accounts
      SET 
        account_holder = ?, 
        account_type = ?, 
        institution_name = ?, 
        current_balance = ?, 
        total_contributions = ?, 
        notes = ?
      WHERE id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(updateAccountQuery, [
      accountHolder,
      accountType,
      institutionName,
      parseFloat(currentBalance),
      parseFloat(contributions),
      notes,
      accountId,
      userId,
    ]);

    if (result.affectedRows > 0) {
      res.status(200).json({ msg: "Retirement account updated successfully!" });
    } else {
      res
        .status(404)
        .json({ msg: "Retirement account not found or unauthorized" });
    }
  } catch (error) {
    console.error("Error updating retirement account:", error);
    res.status(500).json({ msg: "Error updating retirement account", error });
  }
});

// DELETE Route: Delete a retirement account by ID
router.delete("/retirement-accounts/:id", authMiddleware, async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.user_id;

    const deleteAccountQuery = `
      DELETE FROM retirement_accounts 
      WHERE id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(deleteAccountQuery, [accountId, userId]);

    if (result.affectedRows > 0) {
      res.status(200).json({ msg: "Retirement account deleted successfully!" });
    } else {
      res
        .status(404)
        .json({ msg: "Retirement account not found or unauthorized" });
    }
  } catch (error) {
    console.error("Error deleting retirement account:", error);
    res.status(500).json({ msg: "Error deleting retirement account", error });
  }
});
// POST route: Add commodities
router.get("/commodities", authMiddleware, async (req, res) => {
  try {
    const fetchCommoditiesQuery = `
      SELECT 
        id, 
        commodity_name, 
        commodity_type, 
        unit_of_measure, 
        market_price, 
        stock_quantity, 
        provider, 
        acquisition_date, 
        expiry_date, 
        description, 
        status 
      FROM commodities
      ORDER BY id DESC;
    `;
    const commodities = await queryDatabase(fetchCommoditiesQuery);

    if (!commodities || commodities.length === 0) {
      return res.status(404).json({ msg: "No commodities found" });
    }

    res.status(200).json({
      commodities,
      msg: "Commodities retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching commodities:", err);
    res.status(500).json({ msg: "Server error while fetching commodities" });
  }
});

// POST a new commodity
router.post(
  "/commodities",
  authMiddleware,
  upload.single("document"),
  async (req, res) => {
    const {
      commodity_name,
      commodity_type,
      unit_of_measure,
      market_price,
      stock_quantity,
      provider,
      acquisition_date,
      expiry_date,
      description,
      status,
    } = req.body;

    // Input validation
    if (
      !commodity_name ||
      !commodity_type ||
      !unit_of_measure ||
      !market_price ||
      !stock_quantity ||
      !provider ||
      !acquisition_date ||
      !expiry_date ||
      !status
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    try {
      const insertCommodityQuery = `
        INSERT INTO commodities (
          commodity_name, commodity_type, unit_of_measure, market_price, 
          stock_quantity, provider, acquisition_date, expiry_date, 
          description, status
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await queryDatabase(insertCommodityQuery, [
        commodity_name,
        commodity_type,
        unit_of_measure,
        parseFloat(market_price),
        parseInt(stock_quantity, 10),
        provider,
        acquisition_date,
        expiry_date,
        description || null, // Allow null for description
        status,
      ]);

      res.status(201).json({ msg: "Commodity added successfully" });
    } catch (err) {
      console.error("Error adding commodity:", err);
      res.status(500).json({ msg: "Server error while adding commodity" });
    }
  }
);

// PUT (Update) a commodity
router.put("/commodities/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    commodity_name,
    commodity_type,
    unit_of_measure,
    market_price,
    stock_quantity,
    provider,
    acquisition_date,
    expiry_date,
    description,
    status,
  } = req.body;

  if (
    !commodity_name ||
    !commodity_type ||
    !unit_of_measure ||
    !market_price ||
    !stock_quantity ||
    !provider ||
    !acquisition_date ||
    !expiry_date ||
    !status
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const updateCommodityQuery = `
      UPDATE commodities
      SET 
        commodity_name = ?, 
        commodity_type = ?, 
        unit_of_measure = ?, 
        market_price = ?, 
        stock_quantity = ?, 
        provider = ?, 
        acquisition_date = ?, 
        expiry_date = ?, 
        description = ?, 
        status = ?
      WHERE id = ?;
    `;

    const result = await queryDatabase(updateCommodityQuery, [
      commodity_name,
      commodity_type,
      unit_of_measure,
      parseFloat(market_price),
      parseInt(stock_quantity, 10),
      provider,
      acquisition_date,
      expiry_date,
      description || null,
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Commodity not found" });
    }

    res.status(200).json({ msg: "Commodity updated successfully" });
  } catch (err) {
    console.error("Error updating commodity:", err);
    res.status(500).json({ msg: "Server error while updating commodity" });
  }
});

// DELETE a commodity
router.delete("/commodities/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deleteCommodityQuery = `DELETE FROM commodities WHERE id = ?;`;
    const result = await queryDatabase(deleteCommodityQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Commodity not found" });
    }

    res.status(200).json({ msg: "Commodity deleted successfully" });
  } catch (err) {
    console.error("Error deleting commodity:", err);
    res.status(500).json({ msg: "Server error while deleting commodity" });
  }
});
// GET: Fetch a Single Investment by ID
router.get("/other-investments", authMiddleware, async (req, res) => {
  const user_id = req.user_id;

  try {
    const fetchInvestmentsQuery = `
      SELECT 
        investment_id, 
        investment_type, 
        amount_invested, 
        current_value, 
        notes, 
        created_at, 
        updated_at 
      FROM other_investments
      WHERE user_id = ?
      ORDER BY investment_id DESC;
    `;

    const investments = await queryDatabase(fetchInvestmentsQuery, [user_id]);

    if (investments.length === 0) {
      return res.status(404).json({ msg: "No investments found" });
    }

    res.status(200).json({
      investments,
      msg: "Investments retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching investments:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// POST a new investment
router.post("/other-investments", authMiddleware, async (req, res) => {
  const { investment_type, amount_invested, current_value, notes } = req.body;
  const user_id = req.user_id;

  if (!investment_type || !amount_invested || !current_value) {
    return res.status(400).json({
      msg: "Investment type, amount invested, and current value are required.",
    });
  }

  try {
    const insertInvestmentQuery = `
      INSERT INTO other_investments (
        investment_type, amount_invested, current_value, notes, user_id
      )
      VALUES (?, ?, ?, ?, ?);
    `;

    await queryDatabase(insertInvestmentQuery, [
      investment_type,
      parseFloat(amount_invested),
      parseFloat(current_value),
      notes || null,
      user_id,
    ]);

    res.status(201).json({ msg: "Investment added successfully" });
  } catch (err) {
    console.error("Error adding investment:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// PUT (Update) an investment
router.put("/other-investments/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { investment_type, amount_invested, current_value, notes } = req.body;
  const user_id = req.user_id;

  try {
    const updateInvestmentQuery = `
      UPDATE other_investments
      SET 
        investment_type = ?, 
        amount_invested = ?, 
        current_value = ?, 
        notes = ?, 
        updated_at = GETDATE()
      WHERE investment_id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(updateInvestmentQuery, [
      investment_type,
      parseFloat(amount_invested),
      parseFloat(current_value),
      notes || null,
      id,
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: "Investment not found or unauthorized" });
    }

    res.status(200).json({ msg: "Investment updated successfully" });
  } catch (err) {
    console.error("Error updating investment:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// DELETE an investment
router.delete("/other-investments/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;

  try {
    const deleteInvestmentQuery = `
      DELETE FROM other_investments
      WHERE investment_id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(deleteInvestmentQuery, [id, user_id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: "Investment not found or unauthorized" });
    }

    res.status(200).json({ msg: "Investment deleted successfully" });
  } catch (err) {
    console.error("Error deleting investment:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/networth", authMiddleware, async (req, res) => {
  try {
    const userId = req.user_id;

    const fetchNetWorthQuery = `
          SELECT 
            asset_name,
            asset_value,
            asset_type,
            liability_name,
            liability_value,
            liability_type,
            savings,
            property_value,
            other_income,
            net_worth
          FROM net_worth
          WHERE user_id = ?;
        `;

    const results = await queryDatabase(fetchNetWorthQuery, [userId]);

    const assets = [];
    const liabilities = [];
    let savings, property, otherIncome, netWorth;

    results.forEach((row) => {
      if (row.asset_name && row.asset_value) {
        assets.push({
          name: row.asset_name,
          value: row.asset_value,
          type: row.asset_type,
        });
      }

      if (row.liability_name && row.liability_value) {
        liabilities.push({
          name: row.liability_name,
          value: row.liability_value,
          type: row.liability_type,
        });
      }

      // Only set values if they haven't been set yet (allows for nulls to persist)
      if (savings === undefined) savings = row.savings;
      if (property === undefined) property = row.property_value;
      if (otherIncome === undefined) otherIncome = row.other_income;
      if (netWorth === undefined) netWorth = row.net_worth;
    });

    res.status(200).json({
      assets,
      liabilities,
      savings,
      property,
      otherIncome,
      netWorth,
    });
  } catch (error) {
    console.error("Error fetching net worth details:", error);
    res
      .status(500)
      .json({ msg: "Error fetching net worth details", error: error.message });
  }
});

router.get("/networth", authMiddleware, async (req, res) => {
  try {
    const userId = req.user_id;

    const fetchNetWorthQuery = `
        SELECT 
          asset_name,
          asset_value,
          asset_type,
          liability_name,
          liability_value,
          liability_type,
          savings,
          property_value,
          other_income,
          net_worth
        FROM net_worth
        WHERE user_id = ?;
      `;

    const results = await queryDatabase(fetchNetWorthQuery, [userId]);

    const assets = [];
    const liabilities = [];
    let savings, property, otherIncome, netWorth;

    results.forEach((row) => {
      if (row.asset_name && row.asset_value) {
        assets.push({
          name: row.asset_name,
          value: row.asset_value,
          type: row.asset_type,
        });
      }

      if (row.liability_name && row.liability_value) {
        liabilities.push({
          name: row.liability_name,
          value: row.liability_value,
          type: row.liability_type,
        });
      }

      // Only set values if they haven't been set yet (allows for nulls to persist)
      if (savings === undefined) savings = row.savings;
      if (property === undefined) property = row.property_value;
      if (otherIncome === undefined) otherIncome = row.other_income;
      if (netWorth === undefined) netWorth = row.net_worth;
    });

    res.status(200).json({
      assets,
      liabilities,
      savings,
      property,
      otherIncome,
      netWorth,
    });
  } catch (error) {
    console.error("Error fetching net worth details:", error);
    res
      .status(500)
      .json({ msg: "Error fetching net worth details", error: error.message });
  }
});

router.post("/networth", authMiddleware, async (req, res) => {
  try {
    console.log("✌️req.body --->", req.body);
    const { assets, liabilities, savings, property, otherIncome, netWorth } =
      req.body;
    const userId = req.user_id; // User ID from the authentication middleware

    // Define the insert query for net worth details
    const insertNetWorthQuery = `
        INSERT INTO net_worth (
          asset_name,
          asset_value,
          asset_type,
          liability_name,
          liability_value,
          liability_type,
          savings,
          property_value,
          other_income,
          net_worth,
          user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

    // Array to hold all promises
    const saveNetWorthPromises = [];

    // Insert assets
    assets.forEach((asset) => {
      const params = [
        asset.name, // Asset name
        parseFloat(asset.value), // Asset value (convert to float)
        asset.type, // Asset type
        null, // No liability for this row
        null, // No liability for this row
        null, // No liability type
        parseFloat(savings), // Savings (convert to float)
        parseFloat(property), // Property value (convert to float)
        parseFloat(otherIncome), // Other income (convert to float)
        parseFloat(netWorth), // Net worth (convert to float)
        userId, // User ID from the auth middleware
      ];
      saveNetWorthPromises.push(queryDatabase(insertNetWorthQuery, params));
    });

    // Insert liabilities
    liabilities.forEach((liability) => {
      const params = [
        null, // No asset for this row
        null, // No asset for this row
        null, // No asset name
        liability.name, // Liability name
        parseFloat(liability.value), // Liability value (convert to float)
        liability.type, // Liability type
        parseFloat(savings), // Savings (convert to float)
        parseFloat(property), // Property value (convert to float)
        parseFloat(otherIncome), // Other income (convert to float)
        parseFloat(netWorth), // Net worth (convert to float)
        userId, // User ID from the auth middleware
      ];
      saveNetWorthPromises.push(queryDatabase(insertNetWorthQuery, params));
    });

    // Wait for all net worth data to be saved
    await Promise.all(saveNetWorthPromises);

    res.status(200).json({ msg: "Net worth details saved successfully!" });
  } catch (error) {
    console.error("Error saving net worth details:", error);
    res.status(500).json({ msg: "Error saving net worth details", error });
  }
});

const npsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/nps");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const npsUpload = multer({
  storage: npsStorage,
});

router.get("/nps", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  const fetchNpsQuery = `
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        nps_number, 
        contribution, 
        nominee, 
        document, 
        status, 
        created_at, 
        updated_at 
      FROM nps_details 
      WHERE user_id = ? 
      ORDER BY id DESC;
    `;

  try {
    const npsDetails = await queryDatabase(fetchNpsQuery, [user_id]);

    if (npsDetails.length === 0) {
      return res.status(404).json({ msg: "No NPS details found" });
    }

    res.status(200).json({
      npsDetails,
      msg: "NPS details retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching NPS details:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post(
  "/nps_data",
  npsUpload.single("document"),
  authMiddleware,
  async (req, res) => {
    try {
      console.log("✌️ req.body --->", req.body);
      const { data } = req.body; // Get the data field from the body

      if (!data) {
        return res.status(400).json({ msg: "No NPS data provided" });
      }

      // Parse the JSON string to access npsDetails
      const parsedData = JSON.parse(data);
      const { npsDetails } = parsedData; // Extract npsDetails from the parsed data

      if (!npsDetails || !Array.isArray(npsDetails)) {
        return res.status(400).json({ msg: "Invalid NPS data structure" });
      }

      const userId = req.user_id; // User ID from the authentication middleware
      let documentData = null;
      if (req.file) {
        try {
          documentData = fs.readFileSync(req.file.path);
        } catch (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({ msg: "Error reading document file" });
        }
      }

      if (!documentData) {
        return res.status(400).json({ msg: "No document data to upload" });
      }

      const insertNpsQuery = `
        INSERT INTO nps_details (
          user_id,
          name,
          phone,
          email,
          nps_number,
          contribution,
          nominee,
          document,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      // Creating an array of promises to save each NPS detail
      const saveNpsPromises = npsDetails.map((nps) => {
        const {
          name,
          phone,
          email,
          npsNumber,
          contribution,
          nominee,
          documentPath,
          status,
        } = nps;

        const params = [
          userId, // User ID (foreign key)
          name, // Account holder name
          phone, // Contact number
          email || null, // Email address (optional)
          npsNumber, // NPS account number
          parseFloat(contribution), // Contribution amount (convert to float)
          nominee, // Nominee name
          documentData || null, // Document path (optional)
          status || "Active", // Status (default: Active)
        ];

        return queryDatabase(insertNpsQuery, params);
      });

      // Wait for all NPS details to be saved
      await Promise.all(saveNpsPromises);

      res.status(200).json({ msg: "NPS details saved successfully!" });
    } catch (error) {
      console.error("Error saving NPS details:", error);
      res.status(500).json({
        msg: "Error saving NPS details",
        error: error.message || error,
      });
    }
  }
);

router.get("/ppf_data", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  const fetchPpfQuery = `
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        ppf_account_number, 
        contribution, 
        nominee, 
        document, 
        status, 
        created_at, 
        updated_at 
      FROM ppf_details 
      WHERE user_id = ? 
      ORDER BY id DESC;
    `;

  try {
    const ppfDetails = await queryDatabase(fetchPpfQuery, [user_id]);

    if (ppfDetails.length === 0) {
      return res.status(404).json({ msg: "No PPF details found" });
    }

    res.status(200).json({
      ppfDetails,
      msg: "PPF details retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching PPF details:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

const ppfstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ppf");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const ppfUpload = multer({ storage: ppfstorage });

// API to upload PPF data with file
router.post(
  "/ppf_data",
  ppfUpload.single("document"),
  authMiddleware,
  async (req, res) => {
    try {
      console.log("✌️ req.body --->", req.body); // Log incoming request body

      const { data } = req.body; // Get the data field from the request body

      if (!data) {
        return res.status(400).json({ msg: "No PPF data provided" });
      }

      const parsedData = JSON.parse(data);
      const { ppfDetails } = parsedData; // Extract ppfDetails from parsed data

      if (!ppfDetails || !Array.isArray(ppfDetails)) {
        return res.status(400).json({ msg: "Invalid PPF data structure" });
      }

      const userId = req.user_id;

      let documentData = null;

      if (req.file) {
        try {
          documentData = fs.readFileSync(req.file.path); // Read the document file
        } catch (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({ msg: "Error reading document file" });
        }
      }

      // If there's no document, return an error
      if (!documentData) {
        return res.status(400).json({ msg: "No document data to upload" });
      }

      // SQL query to insert data into ppf_details table
      const insertPpfQuery = `
        INSERT INTO ppf_details (
          user_id,
          name,
          phone,
          email,
          ppf_account_number,
          contribution,
          nominee,
          document,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      // Create an array of promises to insert each PPF detail
      const savePpfPromises = ppfDetails.map((ppf) => {
        const {
          name,
          phone,
          email,
          ppfAccountNumber,
          contribution,
          nominee,
          documentPath,
          status,
        } = ppf;

        // Parameters for the SQL query
        const params = [
          userId, // User ID (foreign key)
          name, // Account holder name
          phone, // Contact number
          email || null, // Email address (optional)
          ppfAccountNumber, // PPF account number
          parseFloat(contribution), // Contribution amount (convert to float)
          nominee, // Nominee name
          documentData || null, // Document path (optional)
          status || "Active", // Status (default: Active)
        ];

        return queryDatabase(insertPpfQuery, params);
      });

      // Wait for all PPF details to be saved
      await Promise.all(savePpfPromises);

      res.status(200).json({ msg: "PPF details saved successfully!" });
    } catch (error) {
      console.error("Error saving PPF details:", error);
      res.status(500).json({
        msg: "Error saving PPF details",
        error: error.message || error,
      });
    }
  }
);

router.get("/epf_data", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  const fetchEpfQuery = `
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        epf_account_number, 
        contribution, 
        nominee, 
        document, 
        created_at, 
        updated_at 
      FROM epf_details 
      WHERE user_id = ? 
      ORDER BY id DESC;
    `;

  try {
    const epfDetails = await queryDatabase(fetchEpfQuery, [user_id]);

    if (epfDetails.length === 0) {
      return res.status(404).json({ msg: "No EPF details found" });
    }

    res.status(200).json({
      epfDetails,
      msg: "EPF details retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching EPF details:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

const epfstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/epf");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const epfupload = multer({ storage: epfstorage });

// API to handle EPF data submission
router.post(
  "/epf_data",
  epfupload.single("document"),
  authMiddleware,
  async (req, res) => {
    try {
      console.log("✌️req.body --->", req.body);
      const { data } = req.body; // EPF details
      const parsedData = JSON.parse(data);
      const { epfDetails } = parsedData;
      const userId = req.user_id;
      const document = req.file ? fs.readFileSync(req.file.path) : null;

      // Example query for inserting EPF data into a database
      const insertQuery = `
        INSERT INTO epf_details (name,user_id, phone, email, epf_account_number, contribution, nominee, document)
        VALUES (?, ?, ?, ?, ?, ?, ?,?)
      `;

      // Save each EPF detail entry
      const insertPromises = epfDetails.map((epf) => {
        const { name, phone, email, epfAccountNumber, contribution, nominee } =
          epf;
        const params = [
          name,
          userId,
          phone,
          email,
          epfAccountNumber,
          contribution,
          nominee,
          document,
        ];
        return queryDatabase(insertQuery, params);
      });

      await Promise.all(insertPromises);

      res.status(200).json({ message: "EPF details saved successfully!" });
    } catch (error) {
      console.error("Error saving EPF data:", error);
      res.status(500).json({ message: "Error saving EPF data" });
    }
  }
);

router.get("/financial-summary", authMiddleware, async (req, res) => {
  const user_id = req.user_id;

  const fetchTotalWealthQuery = `
    SELECT 
      user_id,
      SUM(current_value) AS total_wealth
    FROM (
      SELECT user_id, current_value FROM properties
      UNION ALL
      SELECT user_id, deposit_amount AS current_value FROM fixed_deposit
      UNION ALL
      SELECT user_id, current_value FROM mutual_funds
      UNION ALL
      SELECT user_id, current_value FROM stocks
      UNION ALL
      SELECT user_id, current_value FROM precious_metals
    ) AS total_assets
    WHERE user_id = ?
    GROUP BY user_id
  `;

  const fetchCurrentLiabilitiesQuery = `
    SELECT 
      user_id,
      SUM(liability_value) AS total_liabilities
    FROM net_worth
    WHERE liability_value > 0 AND user_id = ?
    GROUP BY user_id

    UNION ALL

    SELECT 
      user_id,
      SUM(market_value) AS total_liabilities
    FROM bond
    WHERE user_id = ?
    GROUP BY user_id
  `;

  const fetchNetWorthQuery = `
    SELECT 
      nw.user_id,
      SUM(asset_value) AS Total_Assets,
      SUM(liability_value) AS Total_Liabilities,
      (SUM(asset_value) - SUM(liability_value)) AS Net_Worth
    FROM net_worth nw
    WHERE nw.user_id = ?
    GROUP BY nw.user_id
  `;

  const fetchTopInvestmentQuery = `
SELECT 
  user_id, 
  investment_name, 
  current_value
FROM (
  -- Top 1 Property investment
  SELECT TOP 1 user_id, 'Property' AS investment_name, current_value
  FROM properties 
  WHERE user_id = ?
  ORDER BY current_value DESC

  UNION ALL

  -- Top 1 Fixed Deposit investment
  SELECT TOP 1 user_id, 'Fixed Deposit' AS investment_name, deposit_amount AS current_value
  FROM fixed_deposit
  WHERE user_id = ?
  ORDER BY deposit_amount DESC

  UNION ALL

  -- Top 1 Mutual Fund investment
  SELECT TOP 1 user_id, 'Mutual Fund' AS investment_name, current_value
  FROM mutual_funds
  WHERE user_id = ?
  ORDER BY current_value DESC

  UNION ALL

  -- Top 1 Stock investment
  SELECT TOP 1 user_id, 'Stock' AS investment_name, current_value
  FROM stocks
  WHERE user_id = ?
  ORDER BY current_value DESC

  UNION ALL

  -- Top 1 Precious Metal investment
  SELECT TOP 1 user_id, 'Precious Metal' AS investment_name, current_value
  FROM precious_metals
  WHERE user_id = ?
  ORDER BY current_value DESC
) AS investments
WHERE user_id = ?
ORDER BY current_value DESC
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;
`;

  try {
    const totalWealthResult = await queryDatabase(fetchTotalWealthQuery, [
      user_id,
    ]);
    const totalWealth =
      totalWealthResult.length > 0 ? totalWealthResult[0].total_wealth : 0;

    const currentLiabilitiesResult = await queryDatabase(
      fetchCurrentLiabilitiesQuery,
      [user_id, user_id]
    );
    const totalLiabilities =
      currentLiabilitiesResult.length > 0
        ? currentLiabilitiesResult[0].total_liabilities
        : 0;

    const netWorthResult = await queryDatabase(fetchNetWorthQuery, [user_id]);
    const netWorth =
      netWorthResult.length > 0 ? netWorthResult[0].Net_Worth : 0;

    const topInvestmentsResult = await queryDatabase(fetchTopInvestmentQuery, [
      user_id,
      user_id,
      user_id,
      user_id,
      user_id,
      user_id,
    ]);

    const topInvestments = topInvestmentsResult.map((investment) => ({
      name: investment.investment_name,
      value: investment.current_value,
    }));

    console.log("✌️top_investments --->", topInvestments);
    res.status(200).json({
      total_wealth: totalWealth,
      total_liabilities: totalLiabilities,
      net_worth: netWorth,
      top_investments: topInvestments,
      msg: "Financial summary retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching financial summary:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
