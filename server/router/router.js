const express = require("express");
const router = express.Router();
const jweb = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sql = require("msnodesqlv8");
const multer = require("multer");
const fs = require("fs");
const qs = require('qs'); // To handle the nested form data
const path = require("path");
const authMiddleware = require("../auth/authMiddleware");

const secret = "iwfhugafwofjwhig3hwigk3wnig3uwmgkmewoipj39gw8hqoijhi3hgwgkwni";
const connectionString ='Driver={ODBC Driver 17 for SQL Server};Server=PLEXIFY;Database=PLEXIFY;Trusted_Connection=yes;';

 // "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-BBKLDAG\\SQLEXPRESS01;Database=DB;Trusted_Connection=yes;";

//  "Driver={ODBC Driver 18 for SQL Server};Server=MOHIT\\SQLEXPRESS;Database=master;Trusted_Connection=yes;TrustServerCertificate=yes;";


 
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





// GET route to fetch all beneficiaries for a user
router.get("/beneficiaries", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Get the user ID from the authenticated user

  const fetchBeneficiariesQuery = `
      SELECT 
        beneficiary_id,
        user_id,
        name,
        contact,
        email,
        entitlement,
        relationship,
        document,
        notify,
        created_at,
        updated_at
      FROM beneficiaries
      WHERE user_id = ?
      ORDER BY beneficiary_id DESC
    `;

  try {
    const beneficiaries = await queryDatabase(fetchBeneficiariesQuery, [user_id]);
    res.status(200).json({
      beneficiaries,
      msg: "Beneficiaries retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching beneficiaries:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});


const ben_storage = multer.memoryStorage();
const ben_upload = multer({ storage: ben_storage }).single('document');

router.post('/beneficiaries', ben_upload, authMiddleware, async (req, res) => {
  try {
    const { name, contact, email, entitlement, relationship, notify } = req.body;
    const user_id = req.user_id;
    const documentBuffer = req.file ? req.file.buffer : null;

    const query = `
      INSERT INTO beneficiaries 
      (user_id, name, contact, email, entitlement, relationship, notify, document, created_at, updated_at)
      VALUES 
      ('${user_id}', '${name}', '${contact || ''}', '${email || ''}', ${entitlement}, '${relationship}', ${notify || 0}, ${documentBuffer ? `0x${documentBuffer.toString('hex')}` : 'NULL'}, GETDATE(), GETDATE())
    `;

    await queryDatabase(query);

    res.status(200).json({ msg: 'Beneficiary saved successfully' });
  } catch (err) {
    console.error('Error saving beneficiary:', err);
    res.status(500).json({ msg: 'Server Error' });
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

 
console.log(deposits,'depositsdepositsdeposits')
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
  storage: deposits_storage
});

router.post("/deposits", authMiddleware, deposits_upload.single("document"), async (req, res) => {
  try {
    const {
      depositId, depositType, depositName, accountNumber, bankName,
      depositTerm, depositAmount, interestRate, maturityAmount,
    } = req.body;

    const depositAmountParsed = parseFloat(depositAmount);
    const interestRateParsed = parseFloat(interestRate);
    const maturityAmountParsed = parseFloat(maturityAmount);

    if (isNaN(depositAmountParsed) || isNaN(interestRateParsed) || isNaN(maturityAmountParsed)) {
      return res.status(400).json({ msg: "Invalid numeric values" });
    }

    let documentData = null;
    if (req.file) {
      try {
        documentData = fs.readFileSync(req.file.path);
      } catch (err) {
        return res.status(500).json({ msg: "Error reading document file" });
      }
    }

    if (!documentData) {
      return res.status(400).json({ msg: "No document data to upload" });
    }

    const user_id = req.user_id;

    const checkDepositQuery = `
      SELECT * FROM fixed_deposit WHERE user_id = ?
    `;
    const depositExists = await queryDatabase(checkDepositQuery, [user_id]);

    if (depositExists.length > 0) {
      const updateDepositQuery = `
        UPDATE fixed_deposit SET 
          deposit_type = ?, deposit_name = ?, account_number = ?, bank_name = ?, deposit_term = ?, 
          deposit_amount = ?, interest_rate = ?, maturity_amount = ?, document = ?, updated_at = GETDATE()
        WHERE user_id = ? 
      `;
      await queryDatabase(updateDepositQuery, [
        depositType, depositName, accountNumber, bankName, depositTerm,
        depositAmountParsed, interestRateParsed, maturityAmountParsed, documentData, user_id
      ]);
      return res.status(200).json({ msg: "Deposit details updated successfully" });
    } else {
      const insertDepositQuery = `
        INSERT INTO fixed_deposit (
          user_id, deposit_type, deposit_name, account_number, bank_name, deposit_term,
          deposit_amount, interest_rate, maturity_amount, document, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE())
      `;
      await queryDatabase(insertDepositQuery, [
        user_id, depositType, depositName, accountNumber, bankName, depositTerm,
        depositAmountParsed, interestRateParsed, maturityAmountParsed, documentData, "active"
      ]);
      return res.status(201).json({ msg: "Deposit details added successfully" });
    }
  } catch (error) {
    console.error("Error processing deposit details:", error);
    res.status(500).json({ msg: "Error processing deposit details" });
  }
});

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
  const user_id = req.user_id; // Get the user ID from the authenticated 
  console.log(user_id)
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
      console.log("✌️req.file --->", req.file); // Check the uploaded file

      const bonds = JSON.parse(req.body.bonds);
      const beneficiaries = JSON.parse(req.body.beneficiaries);
      const user_id = req.user_id;

      if (!Array.isArray(beneficiaries)) {
        return res.status(400).json({ msg: "Beneficiaries should be an array of user IDs." });
      }

      const beneficiariesString = beneficiaries.map((id) => Number(id)).join(",");

      let documentData = null;
      if (req.file) {
        documentData = fs.readFileSync(req.file.path);
        console.log("Document Data Buffer:", documentData);
      }

      // Iterate over bonds and process each one
      for (let bond of bonds) {
        const {
          issuer,
         
          bondType,
          maturityDate,
          faceValue,
          interestRate,
          marketValue,
          description
        } = bond;
console.log(bondType,'bondType')
        const issuerValidated = String(issuer || "");
        const bondTypeValidated = String(bondType || "");
        const maturityDateValidated = maturityDate ? new Date(maturityDate) : null;
        const faceValueValidated = Number(faceValue || 0);
        const interestRateValidated = Number(interestRate || 0);
        const marketValueValidated = Number(marketValue || 0);

        const checkBondQuery = `
          SELECT id, beneficiarie_user
          FROM [dbo].[bond]
          WHERE user_id = ? AND issuer = ? AND bond_type = ?;
        `;
        const existingBondResult = await queryDatabase(checkBondQuery, [
          user_id,
          issuerValidated,
          bondTypeValidated,
        ]);

        if (existingBondResult.length > 0) {
          // Bond exists - Update record
          console.log(`Updating bond for issuer: ${issuerValidated}`);
          const existingBeneficiaries = existingBondResult[0].beneficiarie_user || "";
          const updatedBeneficiaries = existingBeneficiaries
            ? `${existingBeneficiaries},${beneficiariesString}`
            : beneficiariesString;

          const updateBondQuery = `
            UPDATE [dbo].[bond]
            SET 
              maturity_date = ?, 
              face_value = ?, 
              interest_rate = ?, 
              market_value = ?, 
              beneficiarie_user = ?, 
              document = ?,
              description = ?
            WHERE user_id = ? AND issuer = ? AND bond_type = ?;
          `;
          await queryDatabase(updateBondQuery, [
            maturityDateValidated,
            faceValueValidated,
            interestRateValidated,
            marketValueValidated,
            updatedBeneficiaries,
            documentData,  // Pass the file buffer
            description,
            user_id,
            issuerValidated,
            bondTypeValidated,
          ]);
        } else {
          // Bond does not exist - Insert new record
          console.log(`Inserting new bond for issuer: ${issuerValidated}`);
          const insertBondQuery = `
            INSERT INTO [dbo].[bond] (
              user_id, beneficiarie_user, issuer, bond_type, maturity_date, face_value, interest_rate, market_value, document, description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `;
          await queryDatabase(insertBondQuery, [
            user_id,
            beneficiariesString,
            issuerValidated,
            bondTypeValidated,
            maturityDateValidated,
            faceValueValidated,
            interestRateValidated,
            marketValueValidated,
            documentData,  // Pass the file buffer
            description,
          ]);
        }
      }

      res.status(201).json({ msg: "Bonds added or updated successfully with beneficiaries!" });
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
router.get("/precious-metals", authMiddleware, async (req, res) => {
  const user_id = req.user_id; 

  const fetchMetalsQuery = `
      SELECT 
        id, 
        metal_type, 
        weight, 
        purchase_price, 
        current_value, 
        description, 
        document, 
        beneficiarie_user
      FROM precious_metals 
      WHERE user_id = ? 
      ORDER BY id DESC;
    `;

  try {
    // Execute the query with the user's ID
    const metals = await queryDatabase(fetchMetalsQuery, [user_id]);

    console.log(metals,'metals')
    res.status(200).json({
      metals,
      msg: "Precious metals retrieved successfully",
    });
  } catch (err) {
    // Log and handle any errors
    console.error("Error fetching precious metals:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

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

        // Check if metal entry already exists for the user
        const checkExistingMetalQuery = `
          SELECT id, beneficiarie_user FROM precious_metals 
          WHERE user_id = ? AND metal_type = ?;
        `;

        const existingMetal = await queryDatabase(checkExistingMetalQuery, [userId, metal.metalType]);

        if (existingMetal.length > 0) {
          // If the metal exists, update it
          const existingBeneficiaries = existingMetal[0].beneficiaries_user || "";
          const updatedBeneficiaries = existingBeneficiaries
            ? `${existingBeneficiaries},${beneficiariesString}`
            : beneficiariesString;

          const updateMetalQuery = `
            UPDATE precious_metals
            SET weight = ?, purchase_price = ?, current_value = ?, description = ?, document = ?, beneficiarie_user = ?
            WHERE id = ?;
          `;
          await queryDatabase(updateMetalQuery, [
            weight,
            purchasePrice,
            currentValue,
            description,
            documentData || null,
            updatedBeneficiaries,
            existingMetal[0].id, // Use the existing metal's id for update
          ]);
          console.log(`Metal updated: ${metal.metalType}`);
        } else {
          // If no entry exists, insert a new record
          const insertMetalQuery = `
            INSERT INTO precious_metals (user_id, metal_type, weight, purchase_price, current_value, description, document, beneficiarie_user)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
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

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ msg: "No bank accounts found" });
    }

    res.status(200).json({
      accounts,
      msg: "Bank accounts retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching bank accounts:", err);
    res.status(500).json({ msg: "Server error while fetching bank accounts" });
  }
});

// POST: Add multiple bank accounts
router.post("/bank-accounts", authMiddleware, async (req, res) => {
  const { accounts } = req.body; // Expecting an array of account objects
  const user_id = req.user_id;

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return res
      .status(400)
      .json({ msg: "At least one account must be provided." });
  }

  try {
    const insertAccountQuery = `
      INSERT INTO bank_accounts (
        account_holder, account_number, bank_name, account_type, balance, notes, user_id
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const saveAccountPromises = accounts.map((account) => {
      const {
        account_holder,
        account_number,
        bank_name,
        account_type,
        balance,
        notes,
      } = account;

      if (
        !account_holder ||
        !account_number ||
        !bank_name ||
        !account_type ||
        !balance
      ) {
        throw new Error(
          "Account holder, account number, bank name, account type, and balance are required."
        );
      }

      return queryDatabase(insertAccountQuery, [
        account_holder,
        account_number,
        bank_name,
        account_type,
        parseFloat(balance),
        notes || null,
        user_id,
      ]);
    });

    await Promise.all(saveAccountPromises);

    res.status(201).json({ msg: "Bank accounts added successfully" });
  } catch (err) {
    console.error("Error adding bank accounts:", err);
    res
      .status(500)
      .json({ msg: "Error adding bank accounts", error: err.message });
  }
});

// PUT: Update a single bank account by ID
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
    const updateAccountQuery = `
      UPDATE bank_accounts
      SET 
        account_holder = ?, 
        account_number = ?, 
        bank_name = ?, 
        account_type = ?, 
        balance = ?, 
        notes = ?, 
        updated_at = NOW()
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
    res
      .status(500)
      .json({ msg: "Server error while updating bank account" });
  }
});

// DELETE: Remove a bank account by ID
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
    res
      .status(500)
      .json({ msg: "Server error while deleting bank account" });
  }
});

router.post("/retirement-accounts", authMiddleware, async (req, res) => {
  const { accounts } = req.body; // Expecting an array of accounts
  const userId = req.user_id;

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return res.status(400).json({ msg: "Accounts data is required." });
  }

  try {
    const insertAccountQuery = `
      INSERT INTO retirement_accounts (
        account_holder, account_type, institution_name, current_balance, total_contributions, notes, user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const saveAccountPromises = accounts.map((account) => {
      const {
        accountHolder,
        accountType,
        institutionName,
        currentBalance,
        contributions,
        notes,
      } = account;

      if (
        !accountHolder ||
        !accountType ||
        !institutionName ||
        !currentBalance ||
        !contributions
      ) {
        throw new Error(
          "All required fields (accountHolder, accountType, institutionName, currentBalance, contributions) must be provided."
        );
      }

      return queryDatabase(insertAccountQuery, [
        accountHolder,
        accountType,
        institutionName,
        parseFloat(currentBalance),
        parseFloat(contributions),
        notes || null,
        userId,
      ]);
    });

    await Promise.all(saveAccountPromises);

    res
      .status(201)
      .json({ msg: "Retirement account details saved successfully!" });
  } catch (error) {
    console.error("Error saving retirement account details:", error);
    res
      .status(500)
      .json({ msg: "Error saving retirement account details", error });
  }
});

// GET: Fetch all retirement accounts for the authenticated user
router.get("/retirement-accounts", authMiddleware, async (req, res) => {
  const userId = req.user_id;

  try {
    const fetchAccountsQuery = `
      SELECT 
        id, 
        account_holder, 
        account_type, 
        institution_name, 
        current_balance, 
        total_contributions, 
        notes, 
        created_at, 
        updated_at
      FROM retirement_accounts
      WHERE user_id = ?
      ORDER BY account_holder ASC;
    `;

    const accounts = await queryDatabase(fetchAccountsQuery, [userId]);

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ msg: "No retirement accounts found" });
    }

    res.status(200).json({
      accounts,
      msg: "Retirement accounts retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching retirement accounts:", error);
    res.status(500).json({ msg: "Error fetching retirement accounts", error });
  }
});

// GET: Fetch a single retirement account by ID
router.get("/retirement-accounts/:id", authMiddleware, async (req, res) => {
  const accountId = req.params.id;
  const userId = req.user_id;

  try {
    const fetchAccountQuery = `
      SELECT 
        id, 
        account_holder, 
        account_type, 
        institution_name, 
        current_balance, 
        total_contributions, 
        notes, 
        created_at, 
        updated_at
      FROM retirement_accounts
      WHERE id = ? AND user_id = ?;
    `;

    const [account] = await queryDatabase(fetchAccountQuery, [accountId, userId]);

    if (!account) {
      return res
        .status(404)
        .json({ msg: "Retirement account not found or unauthorized" });
    }

    res.status(200).json({ account });
  } catch (error) {
    console.error("Error fetching retirement account:", error);
    res.status(500).json({ msg: "Error fetching retirement account", error });
  }
});

// PUT: Update a retirement account by ID
router.put("/retirement-accounts/:id", authMiddleware, async (req, res) => {
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

  if (
    !accountHolder ||
    !accountType ||
    !institutionName ||
    !currentBalance ||
    !contributions
  ) {
    return res.status(400).json({
      msg: "All required fields (accountHolder, accountType, institutionName, currentBalance, contributions) must be provided.",
    });
  }

  try {
    const updateAccountQuery = `
      UPDATE retirement_accounts
      SET 
        account_holder = ?, 
        account_type = ?, 
        institution_name = ?, 
        current_balance = ?, 
        total_contributions = ?, 
        notes = ?, 
        updated_at = NOW()
      WHERE id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(updateAccountQuery, [
      accountHolder,
      accountType,
      institutionName,
      parseFloat(currentBalance),
      parseFloat(contributions),
      notes || null,
      accountId,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: "Retirement account not found or unauthorized" });
    }

    res
      .status(200)
      .json({ msg: "Retirement account updated successfully!" });
  } catch (error) {
    console.error("Error updating retirement account:", error);
    res.status(500).json({ msg: "Error updating retirement account", error });
  }
});

// DELETE: Remove a retirement account by ID
router.delete("/retirement-accounts/:id", authMiddleware, async (req, res) => {
  const accountId = req.params.id;
  const userId = req.user_id;

  try {
    const deleteAccountQuery = `
      DELETE FROM retirement_accounts
      WHERE id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(deleteAccountQuery, [accountId, userId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ msg: "Retirement account not found or unauthorized" });
    }

    res
      .status(200)
      .json({ msg: "Retirement account deleted successfully!" });
  } catch (error) {
    console.error("Error deleting retirement account:", error);
    res.status(500).json({ msg: "Error deleting retirement account", error });
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
// GET: Fetch all commodities for a user
router.get("/commodities", authMiddleware, async (req, res) => {
  const user_id = req.user_id;

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
    WHERE user_id = ?
    ORDER BY id DESC;
  `;

  try {
    const commodities = await queryDatabase(fetchCommoditiesQuery, [user_id]);

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

// POST: Add multiple commodities
router.post("/commodities", authMiddleware, async (req, res) => {
  try {
    const { commodities } = req.body; // Expecting an array of commodity objects
    const user_id = req.user_id;

    if (!Array.isArray(commodities) || commodities.length === 0) {
      return res.status(400).json({ msg: "Commodities data is required." });
    }

    const insertCommodityQuery = `
      INSERT INTO commodities (
        commodity_name, commodity_type, unit_of_measure, market_price, 
        stock_quantity, provider, acquisition_date, expiry_date, 
        description, status, user_id
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    // Loop through each commodity object and save to the database
    const saveCommodityPromises = commodities.map((commodity) => {
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
      } = commodity;

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
        throw new Error(
          "All required fields (commodity_name, commodity_type, unit_of_measure, market_price, stock_quantity, provider, acquisition_date, expiry_date, status) must be provided."
        );
      }

      return queryDatabase(insertCommodityQuery, [
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
        user_id,
      ]);
    });

    // Execute all insert queries concurrently
    await Promise.all(saveCommodityPromises);

    res.status(201).json({ msg: "Commodities added successfully!" });
  } catch (err) {
    console.error("Error adding commodities:", err);
    res.status(500).json({ msg: "Error adding commodities", error: err.message });
  }
});

// PUT: Update a single commodity by ID
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
  const user_id = req.user_id;

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
    return res.status(400).json({
      msg: "All required fields (commodity_name, commodity_type, unit_of_measure, market_price, stock_quantity, provider, acquisition_date, expiry_date, status) must be provided.",
    });
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
        status = ?, 
        updated_at = NOW()
      WHERE id = ? AND user_id = ?;
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
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Commodity not found or unauthorized" });
    }

    res.status(200).json({ msg: "Commodity updated successfully" });
  } catch (err) {
    console.error("Error updating commodity:", err);
    res.status(500).json({ msg: "Server error while updating commodity" });
  }
});

// DELETE: Remove a commodity by ID
router.delete("/commodities/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;

  try {
    const deleteCommodityQuery = `
      DELETE FROM commodities
      WHERE id = ? AND user_id = ?;
    `;

    const result = await queryDatabase(deleteCommodityQuery, [id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Commodity not found or unauthorized" });
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

  try {
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

// POST: Add multiple investments
router.post("/other-investments", authMiddleware, async (req, res) => {
  try {
    const { investments } = req.body; // Expecting an array of investment objects
    const user_id = req.user_id;

    if (!Array.isArray(investments) || investments.length === 0) {
      return res.status(400).json({ msg: "Investments data is required." });
    }

    const insertInvestmentQuery = `
      INSERT INTO other_investments (
        investment_type, amount_invested, current_value, notes, user_id
      )
      VALUES (?, ?, ?, ?, ?);
    `;

    // Loop through each investment object and save to the database
    const saveInvestmentPromises = investments.map((investment) => {
      const {
        investment_type,
        amount_invested,
        current_value,
        notes,
      } = investment;

      if (!investment_type || !amount_invested || !current_value) {
        throw new Error("Investment type, amount invested, and current value are required.");
      }

      const params = [
        investment_type,
        parseFloat(amount_invested),
        parseFloat(current_value),
        notes || null,
        user_id,
      ];

      return queryDatabase(insertInvestmentQuery, params);
    });

    // Execute all insert queries concurrently
    await Promise.all(saveInvestmentPromises);

    res.status(200).json({ msg: "Investments added successfully!" });
  } catch (err) {
    console.error("Error adding investments:", err);
    res.status(500).json({ msg: "Error adding investments", error: err.message });
  }
});

// PUT: Update a single investment by ID
router.put("/other-investments/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { investment_type, amount_invested, current_value, notes } = req.body;
  const user_id = req.user_id;

  if (!investment_type || !amount_invested || !current_value) {
    return res.status(400).json({
      msg: "Investment type, amount invested, and current value are required.",
    });
  }

  try {
    const updateInvestmentQuery = `
      UPDATE other_investments
      SET 
        investment_type = ?, 
        amount_invested = ?, 
        current_value = ?, 
        notes = ?, 
        updated_at = NOW()
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
      return res.status(404).json({ msg: "Investment not found or unauthorized" });
    }

    res.status(200).json({ msg: "Investment updated successfully" });
  } catch (err) {
    console.error("Error updating investment:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// DELETE: Remove an investment by ID
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
      return res.status(404).json({ msg: "Investment not found or unauthorized" });
    }

    res.status(200).json({ msg: "Investment deleted successfully" });
  } catch (err) {
    console.error("Error deleting investment:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});



router.get("/networth", authMiddleware, async (req, res) => {
  const userId = req.user_id;

  const fetchNetWorthQuery = `
    SELECT 
      id,
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
      created_at, 
      updated_at 
    FROM net_worth 
    WHERE user_id = ? 
    ORDER BY created_at DESC;
  `;

  try {
    const netWorthData = await queryDatabase(fetchNetWorthQuery, [userId]);

  

    res.status(200).json({netWorthData,
      msg: "Precious metals data saved successfully"
    });
  } catch (error) {
    console.error("Error fetching net worth data:", error);
    res.status(500).json({ msg: "Server error while fetching net worth data" });
  }
});


router.post("/networth", authMiddleware, async (req, res) => {
  try {
    console.log("✌️req.body --->", req.body);
    const { assets, liabilities, savings, property, otherIncome, netWorth } = req.body;
    const userId = req.user_id; // User ID from the authentication middleware

    // Check if the user already has net worth data
    const checkUserExistsQuery = `SELECT COUNT(*) AS userCount FROM net_worth WHERE user_id = ?`;
    const [userExistsResult] = await queryDatabase(checkUserExistsQuery, [userId]);

    if (userExistsResult.userCount > 0) {
      // If the user exists, update the data
      const updateNetWorthQuery = `
        UPDATE net_worth
        SET asset_name = ?, asset_value = ?, asset_type = ?, 
            liability_name = ?, liability_value = ?, liability_type = ?, 
            savings = ?, property_value = ?, other_income = ?, net_worth = ?
        WHERE user_id = ?
      `;

      const saveNetWorthPromises = [];

      // Handle case when assets and liabilities are in pairs
      const minLength = Math.min(assets.length, liabilities.length);
      for (let i = 0; i < minLength; i++) {
        const params = [
          assets[i].name,
          parseFloat(assets[i].value),
          assets[i].type,
          liabilities[i].name,
          parseFloat(liabilities[i].value),
          liabilities[i].type,
          parseFloat(savings || 0),
          parseFloat(property || 0),
          parseFloat(otherIncome || 0),
          parseFloat(netWorth || 0),
          userId
        ];
        saveNetWorthPromises.push(queryDatabase(updateNetWorthQuery, params));
      }

      // Handle case when there are more assets than liabilities
      if (assets.length > liabilities.length) {
        for (let i = minLength; i < assets.length; i++) {
          const params = [
            assets[i].name,
            parseFloat(assets[i].value),
            assets[i].type,
            null, // No liability data
            null,
            null,
            parseFloat(savings || 0),
            parseFloat(property || 0),
            parseFloat(otherIncome || 0),
            parseFloat(netWorth || 0),
            userId
          ];
          saveNetWorthPromises.push(queryDatabase(updateNetWorthQuery, params));
        }
      }

      // Handle case when there are more liabilities than assets
      if (liabilities.length > assets.length) {
        for (let i = minLength; i < liabilities.length; i++) {
          const params = [
            null, // No asset data
            null,
            null,
            liabilities[i].name,
            parseFloat(liabilities[i].value),
            liabilities[i].type,
            parseFloat(savings || 0),
            parseFloat(property || 0),
            parseFloat(otherIncome || 0),
            parseFloat(netWorth || 0),
            userId
          ];
          saveNetWorthPromises.push(queryDatabase(updateNetWorthQuery, params));
        }
      }

      await Promise.all(saveNetWorthPromises);
      res.status(200).json({ msg: "Net worth details updated successfully!" });

    } else {
      // If the user does not exist, insert new data
      const insertNetWorthQuery = `
        INSERT INTO net_worth (
          asset_name, asset_value, asset_type, 
          liability_name, liability_value, liability_type, 
          savings, property_value, other_income, net_worth, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const saveNetWorthPromises = [];

      // Handle case when assets and liabilities are in pairs
      const minLength = Math.min(assets.length, liabilities.length);
      for (let i = 0; i < minLength; i++) {
        const params = [
          assets[i].name,
          parseFloat(assets[i].value),
          assets[i].type,
          liabilities[i].name,
          parseFloat(liabilities[i].value),
          liabilities[i].type,
          parseFloat(savings || 0),
          parseFloat(property || 0),
          parseFloat(otherIncome || 0),
          parseFloat(netWorth || 0),
          userId
        ];
        saveNetWorthPromises.push(queryDatabase(insertNetWorthQuery, params));
      }

      // Handle case when there are more assets than liabilities
      if (assets.length > liabilities.length) {
        for (let i = minLength; i < assets.length; i++) {
          const params = [
            assets[i].name,
            parseFloat(assets[i].value),
            assets[i].type,
            null, // No liability data
            null,
            null,
            parseFloat(savings || 0),
            parseFloat(property || 0),
            parseFloat(otherIncome || 0),
            parseFloat(netWorth || 0),
            userId
          ];
          saveNetWorthPromises.push(queryDatabase(insertNetWorthQuery, params));
        }
      }

      // Handle case when there are more liabilities than assets
      if (liabilities.length > assets.length) {
        for (let i = minLength; i < liabilities.length; i++) {
          const params = [
            null, // No asset data
            null,
            null,
            liabilities[i].name,
            parseFloat(liabilities[i].value),
            liabilities[i].type,
            parseFloat(savings || 0),
            parseFloat(property || 0),
            parseFloat(otherIncome || 0),
            parseFloat(netWorth || 0),
            userId
          ];
          saveNetWorthPromises.push(queryDatabase(insertNetWorthQuery, params));
        }
      }

      await Promise.all(saveNetWorthPromises);
      res.status(200).json({ msg: "Net worth details saved successfully!" });
    }
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


const fetchTotalLiabilitiesQuery = `
  SELECT 
    COALESCE(SUM(hl.loan_amount), 0) AS Total_Liabilities
  FROM home_loans hl
  WHERE hl.user_id = ?

  UNION ALL

  SELECT 
    COALESCE(SUM(bl.loan_amount), 0) AS Total_Liabilities
  FROM business_loans bl
  WHERE bl.user_id = ?

  UNION ALL

  SELECT 
    COALESCE(SUM(el.loan_amount), 0) AS Total_Liabilities
  FROM education_loans el
  WHERE el.user_id = ?

  UNION ALL

  SELECT 
    COALESCE(SUM(vl.loan_amount), 0) AS Total_Liabilities
  FROM vehicle_loans vl
  WHERE vl.user_id = ?

  UNION ALL

  SELECT 
    COALESCE(SUM(pl.loan_amount), 0) AS Total_Liabilities
  FROM personal_loans pl
  WHERE pl.user_id = ?
`;
  try {
    const totalWealthResult = await queryDatabase(fetchTotalWealthQuery, [
      user_id,
    ]);
    const totalWealth =
      totalWealthResult.length > 0 ? totalWealthResult[0].total_wealth : 0;

      const currentLiabilitiesResult = await queryDatabase(fetchTotalLiabilitiesQuery, [
        user_id,
        user_id,
        user_id,
        user_id,
        user_id,
      ]);
      const totalLiabilities = currentLiabilitiesResult.reduce((total, row) => {
        total += row.Total_Liabilities;
        return total;
      }, 0);



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
    link: getLink(investment.investment_name), // Dynamically create the link
  }));

  // Function to generate link based on investment name
  function getLink(investmentName) {
    switch (investmentName) {
      case 'Property':
        return '/property';
      case 'Fixed Deposit':
        return '/fixed-deposit';
      case 'Mutual Fund':
        return '/mutual-funds';
      case 'Stock':
        return '/stocks';
      case 'Precious Metal':
        return '/precious-metals';
      default:
        return '/'; 
    }
  }

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
// Add a home loan
router.post("/home-loans", authMiddleware, async (req, res) => {
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, account_number } = req.body;
  const user_id = req.user_id;

  const addHomeLoanQuery = `
    INSERT INTO home_loans (
      user_id, institution_name, loan_amount, loan_tenure_years, 
      interest_rate, account_number, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
  `;

  try {
    await queryDatabase(addHomeLoanQuery, [
      user_id,
      institution_name,
      loan_amount,
      loan_tenure_years,
      interest_rate,
      account_number,
    ]);

    res.status(201).json({ msg: "Home loan added successfully" });
  } catch (err) {
    console.error("Error adding home loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/home-loans", authMiddleware, async (req, res) => {
  const user_id = req.user_id;

  const fetchHomeLoansQuery = `
    SELECT 
      id, institution_name, loan_amount, loan_tenure_years, 
      interest_rate, account_number, created_at, updated_at
    FROM home_loans
    WHERE user_id = ?
    ORDER BY id DESC;
  `;

  try {
    const homeLoans = await queryDatabase(fetchHomeLoansQuery, [user_id]);
    res.status(200).json({
      homeLoans,
      msg: "Home loans retrieved successfully",
    });
  } catch (err) {
    console.error("Error fetching home loans:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Add a new home loan

// Update an existing home loan
router.put("/home-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, account_number } = req.body;
  const user_id = req.user_id;

  const updateHomeLoanQuery = `
    UPDATE home_loans
    SET 
      institution_name = ?, loan_amount = ?, loan_tenure_years = ?, 
      interest_rate = ?, account_nsumber = ?, updated_at = GETDATE()
    WHERE id = ? AND user_id = ?;
  `;

  try {
    const result = await queryDatabase(updateHomeLoanQuery, [
      institution_name, loan_amount, loan_tenure_years, interest_rate, account_number, id, user_id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Home loan not found or unauthorized" });
    }

    res.status(200).json({ msg: "Home loan updated successfully!" });
  } catch (error) {
    console.error("Error updating home loan:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete a home loan
router.delete("/home-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;

  const deleteHomeLoanQuery = `
    DELETE FROM home_loans
    WHERE id = ? AND user_id = ?;
  `;

  try {
    const result = await queryDatabase(deleteHomeLoanQuery, [id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Home loan not found or unauthorized" });
    }

    res.status(200).json({ msg: "Home loan deleted successfully!" });
  } catch (error) {
    console.error("Error deleting home loan:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});
// Fetch all personal loans
router.get("/personal-loans", authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const query = `
    SELECT id, institution_name, loan_amount, loan_tenure_years, 
           interest_rate, loan_purpose, created_at, updated_at
    FROM personal_loans
    WHERE user_id = ?
    ORDER BY id DESC;
  `;
  try {
    const loans = await queryDatabase(query, [user_id]);
    res.status(200).json({ loans, msg: "Personal loans retrieved successfully" });
  } catch (err) {
    console.error("Error fetching personal loans:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Add a personal loan
router.post("/personal-loans", authMiddleware, async (req, res) => {
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, loan_purpose } = req.body;
  const user_id = req.user_id;
  const query = `
    INSERT INTO personal_loans (
      user_id, institution_name, loan_amount, loan_tenure_years, 
      interest_rate, loan_purpose, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
  `;
  try {
    await queryDatabase(query, [user_id, institution_name, loan_amount, loan_tenure_years, interest_rate, loan_purpose]);
    res.status(201).json({ msg: "Personal loan added successfully" });
  } catch (err) {
    console.error("Error adding personal loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Update a personal loan
router.put("/personal-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, loan_purpose } = req.body;
  const user_id = req.user_id;
  const query = `
    UPDATE personal_loans
    SET institution_name = ?, loan_amount = ?, loan_tenure_years = ?, 
        interest_rate = ?, loan_purpose = ?, updated_at = GETDATE()
    WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [institution_name, loan_amount, loan_tenure_years, interest_rate, loan_purpose, id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Personal loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Personal loan updated successfully" });
  } catch (err) {
    console.error("Error updating personal loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete a personal loan
router.delete("/personal-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;
  const query = `
    DELETE FROM personal_loans WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Personal loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Personal loan deleted successfully" });
  } catch (err) {
    console.error("Error deleting personal loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});
// Fetch all vehicle loans
router.get("/vehicle-loans", authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const query = `
    SELECT id, institution_name, loan_amount, vehicle_type, loan_tenure_years, 
           interest_rate, created_at, updated_at
    FROM vehicle_loans
    WHERE user_id = ?
    ORDER BY id DESC;
  `;
  try {
    const loans = await queryDatabase(query, [user_id]);
    res.status(200).json({ loans, msg: "Vehicle loans retrieved successfully" });
  } catch (err) {
    console.error("Error fetching vehicle loans:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Add a vehicle loan
router.post("/vehicle-loans", authMiddleware, async (req, res) => {
  const { institution_name, loan_amount, vehicle_type, loan_tenure_years, interest_rate } = req.body;
  const user_id = req.user_id;
  const query = `
    INSERT INTO vehicle_loans (
      user_id, institution_name, loan_amount, vehicle_type, 
      loan_tenure_years, interest_rate, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
  `;
  try {
    await queryDatabase(query, [user_id, institution_name, loan_amount, vehicle_type, loan_tenure_years, interest_rate]);
    res.status(201).json({ msg: "Vehicle loan added successfully" });
  } catch (err) {
    console.error("Error adding vehicle loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Update a vehicle loan
router.put("/vehicle-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { institution_name, loan_amount, vehicle_type, loan_tenure_years, interest_rate } = req.body;
  const user_id = req.user_id;
  const query = `
    UPDATE vehicle_loans
    SET institution_name = ?, loan_amount = ?, vehicle_type = ?, 
        loan_tenure_years = ?, interest_rate = ?, updated_at = GETDATE()
    WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [institution_name, loan_amount, vehicle_type, loan_tenure_years, interest_rate, id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Vehicle loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Vehicle loan updated successfully" });
  } catch (err) {
    console.error("Error updating vehicle loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete a vehicle loan
router.delete("/vehicle-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;
  const query = `
    DELETE FROM vehicle_loans WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Vehicle loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Vehicle loan deleted successfully" });
  } catch (err) {
    console.error("Error deleting vehicle loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});
// Fetch all education loans
router.get("/education-loans", authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const query = `
    SELECT id, institution_name, loan_amount, loan_tenure_years, 
           interest_rate, course_institution, created_at, updated_at
    FROM education_loans
    WHERE user_id = ?
    ORDER BY id DESC;
  `;
  try {
    const loans = await queryDatabase(query, [user_id]);
    res.status(200).json({ loans, msg: "Education loans retrieved successfully" });
  } catch (err) {
    console.error("Error fetching education loans:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Add an education loan
router.post("/education-loans", authMiddleware, async (req, res) => {
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, course_institution } = req.body;
  const user_id = req.user_id;
  const query = `
    INSERT INTO education_loans (
      user_id, institution_name, loan_amount, loan_tenure_years, 
      interest_rate, course_institution, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
  `;
  try {
    await queryDatabase(query, [user_id, institution_name, loan_amount, loan_tenure_years, interest_rate, course_institution]);
    res.status(201).json({ msg: "Education loan added successfully" });
  } catch (err) {
    console.error("Error adding education loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Update an education loan
router.put("/education-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, course_institution } = req.body;
  const user_id = req.user_id;
  const query = `
    UPDATE education_loans
    SET institution_name = ?, loan_amount = ?, loan_tenure_years = ?, 
        interest_rate = ?, course_institution = ?, updated_at = GETDATE()
    WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [institution_name, loan_amount, loan_tenure_years, interest_rate, course_institution, id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Education loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Education loan updated successfully" });
  } catch (err) {
    console.error("Error updating education loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete an education loan
router.delete("/education-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;
  const query = `
    DELETE FROM education_loans WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Education loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Education loan deleted successfully" });
  } catch (err) {
    console.error("Error deleting education loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});
// Fetch all business loans
router.get("/business-loans", authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const query = `
    SELECT id, institution_name, loan_amount, loan_tenure_years, 
           interest_rate, business_purpose, created_at, updated_at
    FROM business_loans
    WHERE user_id = ?
    ORDER BY id DESC;
  `;
  try {
    const loans = await queryDatabase(query, [user_id]);
    res.status(200).json({ loans, msg: "Business loans retrieved successfully" });
  } catch (err) {
    console.error("Error fetching business loans:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Add a business loan
router.post("/business-loans", authMiddleware, async (req, res) => {
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, business_purpose } = req.body;
  const user_id = req.user_id;
  const query = `
    INSERT INTO business_loans (
      user_id, institution_name, loan_amount, loan_tenure_years, 
      interest_rate, business_purpose, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, GETDATE(), GETDATE());
  `;
  try {
    await queryDatabase(query, [user_id, institution_name, loan_amount, loan_tenure_years, interest_rate, business_purpose]);
    res.status(201).json({ msg: "Business loan added successfully" });
  } catch (err) {
    console.error("Error adding business loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Update a business loan
router.put("/business-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { institution_name, loan_amount, loan_tenure_years, interest_rate, business_purpose } = req.body;
  const user_id = req.user_id;
  const query = `
    UPDATE business_loans
    SET institution_name = ?, loan_amount = ?, loan_tenure_years = ?, 
        interest_rate = ?, business_purpose = ?, updated_at = GETDATE()
    WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [institution_name, loan_amount, loan_tenure_years, interest_rate, business_purpose, id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Business loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Business loan updated successfully" });
  } catch (err) {
    console.error("Error updating business loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete a business loan
router.delete("/business-loans/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user_id;
  const query = `
    DELETE FROM business_loans WHERE id = ? AND user_id = ?;
  `;
  try {
    const result = await queryDatabase(query, [id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Business loan not found or unauthorized" });
    }
    res.status(200).json({ msg: "Business loan deleted successfully" });
  } catch (err) {
    console.error("Error deleting business loan:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/user_profile", authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const query = `
    SELECT *
    FROM registration
    WHERE user_id = ?
    
  `;
  try {
    const user_profile = await queryDatabase(query, [user_id]);
    res.status(200).json({ user_profile, msg: "Personal profile retrieved successfully" });
  } catch (err) {
    console.error("Error fetching personal profile:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/user_profile", authMiddleware, async (req, res) => {
  const user_id = req.user_id; // Extract user ID from the authenticated middleware
  const {
    firstName,
    lastName,
    email,
    aadharNumber,
    phoneNumber,
    gender,
    beneficiary,
    fatherName,
    motherName,
    spouseName,
    address,
  } = req.body; // Destructure data from the request body

  const query = `
    UPDATE registration
    SET
      firstName = ?,
      lastName = ?,
      email = ?,
      aadharNumber = ?,
      phoneNumber = ?,
      gender = ?,
      beneficiary = ?,
      fatherName = ?,
      motherName = ?,
      spouseName = ?,
      address = ?,
      updated_at = GETDATE() 
    WHERE user_id = ?;
  `;

  try {
    // Execute the update query with the values from the request body
    const result = await queryDatabase(query, [
      firstName,
      lastName,
      email,
      aadharNumber,
      phoneNumber,
      gender,
      beneficiary,
      fatherName || null, // Handle optional fields
      motherName || null,
      spouseName || null,
      address || null,
      user_id,
    ]);

  
      res
        .status(200)
        .json({ msg: "User profile updated successfully", result });

  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/beneficiary/:beneficiary_id", authMiddleware, async (req, res) => {
  const user_id = req.user_id;
  const { beneficiary_id } = req.params;


  const fetchBeneficiaryQuery = `
    SELECT 
      beneficiary_id, name, relationship, contact, entitlement, document, created_at, updated_at
    FROM beneficiaries
    WHERE user_id = ? AND beneficiary_id = ?; 
  `;


  const fetchBeneficiaryDetailsQuery = `
    SELECT 
      rd.id AS rd_id, rd.rd_number, rd.beneficiarie_user AS rd_beneficiarie_user, 
      rd.monthly_deposit_amount, rd.interest_rate AS rd_interest_rate, rd.start_date, rd.maturity_date, 
      rd.maturity_amount AS rd_maturity_amount, rd.bank_name AS rd_bank_name,
      prop.id AS property_id, prop.property_name, prop.property_type, prop.location, 
      prop.area_in_sqft, prop.purchase_date, prop.purchase_price, prop.current_value AS property_value,
      prop.rental_income, prop.tenant_name, prop.tenant_contact,
      pm.id AS pm_id, pm.metal_type, pm.description AS pm_description, pm.weight, 
      pm.purchase_price AS pm_purchase_price, pm.current_value AS pm_current_value,
      st.id AS stock_id, st.symbol, st.purchase_date AS stock_purchase_date, 
      st.purchase_price AS stock_purchase_price, st.quantity, st.total_investment, st.current_value AS stock_current_value,
      b.id AS bond_id, b.issuer, b.bond_type, b.maturity_date, b.face_value, b.interest_rate AS bond_interest_rate,
      b.market_value, b.description AS bond_description
    FROM 
      [dbo].[recurring_deposit] rd
    LEFT JOIN 
      [dbo].[properties] prop ON prop.user_id = rd.user_id
    LEFT JOIN 
      [dbo].[precious_metals] pm ON pm.user_id = rd.user_id
    LEFT JOIN 
      [dbo].[stocks] st ON st.user_id = rd.user_id
    LEFT JOIN 
      bond b ON b.user_id = rd.user_id
    WHERE 
      rd.user_id = ? AND 
      (
        rd.beneficiarie_user LIKE ? OR 
        prop.beneficiarie_user LIKE ? OR 
        pm.beneficiarie_user LIKE ? OR 
        st.beneficiarie_user LIKE ? OR 
        b.beneficiarie_user LIKE ?
      );
  `;

  try {
    // Fetching beneficiary basic details
    const beneficiary = await queryDatabase(fetchBeneficiaryQuery, [user_id, beneficiary_id]);

    if (beneficiary.length === 0) {
      return res.status(404).json({ msg: "No beneficiary found." });
    }

    const beneficiaryDetails = await queryDatabase(fetchBeneficiaryDetailsQuery, [
      user_id, 
      `%${beneficiary_id}%`, 
      `%${beneficiary_id}%`, 
      `%${beneficiary_id}%`, 
      `%${beneficiary_id}%`, 
      `%${beneficiary_id}%`
    ]);

    // Organizing beneficiary details into separate categories
    const recurringDeposits = [];
    const properties = [];
    const preciousMetals = [];
    const stocks = [];
    const bonds = [];

    const seenRdIds = new Set();
    const seenPropertyIds = new Set();
    const seenPmIds = new Set();
    const seenStockIds = new Set();
    const seenBondIds = new Set();
    
    beneficiaryDetails.forEach((item) => {
      // Handling Recurring Deposits
      if (item.rd_id && !seenRdIds.has(item.rd_id)) {
        seenRdIds.add(item.rd_id);
        recurringDeposits.push({
          rd_id: item.rd_id,
          rd_number: item.rd_number,
          rd_beneficiarie_user: item.rd_beneficiarie_user,
          monthly_deposit_amount: item.monthly_deposit_amount,
          rd_interest_rate: item.rd_interest_rate,
          start_date: item.start_date,
          maturity_date: item.maturity_date,
          rd_maturity_amount: item.rd_maturity_amount,
          rd_bank_name: item.rd_bank_name
        });
      }
    
      // Handling Properties
      if (item.property_id && !seenPropertyIds.has(item.property_id)) {
        seenPropertyIds.add(item.property_id);
        properties.push({
          property_id: item.property_id,
          property_name: item.property_name,
          property_type: item.property_type,
          location: item.location,
          area_in_sqft: item.area_in_sqft,
          purchase_date: item.purchase_date,
          purchase_price: item.purchase_price,
          property_value: item.property_value,
          rental_income: item.rental_income,
          tenant_name: item.tenant_name,
          tenant_contact: item.tenant_contact
        });
      }
    
      // Handling Precious Metals
      if (item.pm_id && !seenPmIds.has(item.pm_id)) {
        seenPmIds.add(item.pm_id);
        preciousMetals.push({
          pm_id: item.pm_id,
          metal_type: item.metal_type,
          pm_description: item.pm_description,
          weight: item.weight,
          pm_purchase_price: item.pm_purchase_price,
          pm_current_value: item.pm_current_value
        });
      }
    
      // Handling Stocks
      if (item.stock_id && !seenStockIds.has(item.stock_id)) {
        seenStockIds.add(item.stock_id);
        stocks.push({
          stock_id: item.stock_id,
          symbol: item.symbol,
          stock_purchase_date: item.stock_purchase_date,
          stock_purchase_price: item.stock_purchase_price,
          quantity: item.quantity,
          total_investment: item.total_investment,
          stock_current_value: item.stock_current_value
        });
      }
    
      // Handling Bonds
      if (item.bond_id && !seenBondIds.has(item.bond_id)) {
        seenBondIds.add(item.bond_id);
        bonds.push({
          bond_id: item.bond_id,
          issuer: item.issuer,
          bond_type: item.bond_type,
          maturity_date: item.maturity_date,
          face_value: item.face_value,
          bond_interest_rate: item.bond_interest_rate,
          market_value: item.market_value,
          bond_description: item.bond_description
        });
      }
    });
    
    // Logging categorized data
    console.log("Categorized1", recurringDeposits);
   
    res.status(200).json({
      beneficiary: beneficiary,
      recurringDeposits,
      properties,
      preciousMetals,
      stocks,
      bonds,
      msg: "Beneficiary details retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching beneficiary details:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});


router.post('/update-beneficiary', authMiddleware, async (req, res) => {
  console.log(req.body,'req.body');
  
  const user_id = req.user_id;
  const { beneficiary_id, updatedData } = req.body;

  if (!beneficiary_id || !updatedData) {
    return res.status(400).json({ msg: 'Beneficiary ID and updated data are required' });
  }

  const { name, relationship, contact, entitlement } = updatedData;

  const updateBeneficiaryQuery = `
    UPDATE beneficiaries
    SET
      name = ?,
      relationship = ?,
      contact = ?,
      entitlement = ?,
      updated_at =GETDATE()
    WHERE
      user_id = ? AND beneficiary_id = ?
  `;

  try {
    const result = await queryDatabase(updateBeneficiaryQuery, [
      name,
      relationship,
      contact,
      entitlement,
      user_id,
      beneficiary_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Beneficiary not found or no changes made' });
    }

    res.status(200).json({
      msg: 'Beneficiary details updated successfully',
      updatedBeneficiary: updatedData,
    });
  } catch (err) {
    console.error('Error updating beneficiary:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});



module.exports = router;
