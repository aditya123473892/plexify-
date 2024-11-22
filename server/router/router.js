const express = require("express");
const router = express.Router();
const User = require("../model/Signup");
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
// const connectionString =
//   "Driver={ODBC Driver 18 for SQL Server};Server=MOHIT\\SQLEXPRESS;Database=master;Trusted_Connection=yes;TrustServerCertificate=yes;";
  const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-BBKLDAG\\SQLEXPRESS01;Database=DB;Trusted_Connection=yes;';


  router.post("/signup", async (req, res) => {
    try {
      console.log("✌️const --->", req.body);
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

      const checkEmailQuery = `SELECT * FROM [registration] WHERE email = ?`;
      sql.query(
        connectionString,
        checkEmailQuery,
        [email],
        async (err, existingUser) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ msg: "Server Error" });
          }

          if (existingUser.length > 0) {
            return res.status(400).json({ msg: "Email already registered" });
          }

          const hashedPassword = await bcrypt.hash(password, 12);

          // Generate a 10-digit random user_id
          const generateUserId = () =>
            Math.floor(1000000000 + Math.random() * 9000000000);
          const user_id = generateUserId();

          const insertUserQuery = `
          INSERT INTO [registration] (user_id, firstName, lastName, email, password_hash, aadharNumber, phoneNumber, gender, beneficiary) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
          sql.query(
            connectionString,
            insertUserQuery,
            [
              user_id,
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
                console.error("Error inserting user:", err);
                return res.status(500).json({ msg: "Server Error" });
              }

              const token = jweb.sign({ email }, secret, { expiresIn: "3d" });
              res
                .status(201)
                .json({ token, msg: "Account Created Successfully" });
            }
          );
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server Error" });
    }
  });


  router.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;

      const checkUserQuery = `SELECT * FROM [registration] WHERE email = ?`;

      sql.query(
        connectionString,
        checkUserQuery,
        [email],
        async (err, user) => {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ msg: "Server Error" });
          }

          if (!user || user.length === 0) {
            return res.status(404).json({ msg: "User not found" });
          }

          const isMatch = await bcrypt.compare(password, user[0].password_hash);
          if (isMatch) {
            console.log("✌️user[0].user_id --->", user[0].user_id);
            const token = jweb.sign(
              { email: email, user_id: user[0].user_id },
              secret
            );
            return res.status(200).json({ token });
          } else {
            return res.status(401).json({ msg: "Invalid credentials" });
          }
        }
      );
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ msg: "Server Error" });
    }
  });

  router.post("/add-beneficiary", async (req, res) => {
    try {
      const {
        userId,
        name,
        contact,
        email,
        entitlement,
        notify,
        relationship,
      } = req.body;

      // Validate input
      if (!userId || !name || !entitlement || !relationship) {
        return res
          .status(400)
          .json({ msg: "Please fill all required fields." });
      }

      // Check if user_id exists
      const checkUserQuery = `SELECT user_id FROM dbo.registration WHERE user_id = ?`;
      sql.query(connectionString, checkUserQuery, [userId], (err, result) => {
        if (err) {
          console.error("Error checking user_id:", err);
          return res.status(500).json({ msg: "Server error." });
        }
        if (result.length === 0) {
          return res
            .status(400)
            .json({ msg: "Invalid user_id. Please register the user first." });
        }

        // Insert the beneficiary
        const insertBeneficiaryQuery = `
          INSERT INTO dbo.beneficiaries 
          (user_id, name, contact, email, entitlement, relationship, notify) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        sql.query(
          connectionString,
          insertBeneficiaryQuery,
          [
            userId,
            name,
            contact || null,
            email || null,
            entitlement,
            relationship,
            notify || 0,
          ],
          (err, result) => {
            if (err) {
              console.error("Error inserting beneficiary:", err);
              return res.status(500).json({ msg: "Server error." });
            }

            res.status(201).json({
              msg: "Beneficiary added successfully",
              beneficiaryId: result.insertId,
            });
          }
        );
      });
    } catch (error) {
      console.error("Error adding beneficiary:", error);
      res.status(500).json({ msg: "Server error." });
    }
  });
  router.get("/beneficiaries", async (req, res) => {
    try {
      const { userId, beneficiaryId } = req.query; // Accept query parameters for filtering

      // Base query
      let fetchQuery = `SELECT * FROM dbo.beneficiaries`;
      const queryParams = [];

      // Add conditions dynamically
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

      // Execute the query
      sql.query(connectionString, fetchQuery, queryParams, (err, results) => {
        if (err) {
          console.error("Error fetching beneficiaries:", err);
          return res.status(500).json({ msg: "Server error." });
        }

        if (results.length === 0) {
          return res.status(404).json({ msg: "No beneficiaries found." });
        }

        res.status(200).json({
          msg: "Beneficiaries retrieved successfully",
          beneficiaries: results,
        });
      });
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      res.status(500).json({ msg: "Server error." });
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
  


  router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      const checkUserQuery = `SELECT * FROM [registration] WHERE LOWER(email) = LOWER(?)`;

      sql.query(
        connectionString,
        checkUserQuery,
        [email],
        async (err, user) => {
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
        }
      );
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


  router.get("/insurance", authMiddleware, async (req, res) => {
    const user_id = req.user_id;
  
    const getInsurancePolicyQuery = `
      SELECT policy_name, policy_number, provider, policy_type, policy_period, 
             premium_amount, coverage_limit, maturity_amount, nominee_name, 
             nominee_relation, status, document 
      FROM insurance_policy 
      WHERE user_id = ?
    `;
  
    try {
      // Using the helper function to query the database
      const result = await queryDatabase(getInsurancePolicyQuery, [user_id]);
  
      if (result.length === 0) {
        return res.status(404).json({ msg: "No insurance policies found for this user." });
      }
  
      // Return the result as a JSON response
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching insurance policy:", error);
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
      console.log('✌️req.body fffff--->', req.body);
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

  // Function to query the database
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

  router.post("/recurring_deposits", authMiddleware, async (req, res) => {
    console.log("✌️ req.body --->", req.body);
    const { deposits,beneficiaries } = req.body; // Array of deposits
    const user_id = req.user_id; // Authenticated user ID
    const beneficiariesString = beneficiaries.join(',');
    try {
      for (const deposit of deposits) {
        // Insert each deposit into the database
        const insertDepositQuery = `
          INSERT INTO [dbo].[recurring_deposit] (
            user_id, 
            beneficiarie_user, 
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE())
        `;
        const insertDepositResult = await queryDatabase(insertDepositQuery, [
          user_id,
          beneficiariesString || null, // Nullable field
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
  
      res.status(201).json({
        msg: "Recurring deposits added successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: "Server error." });
    }
  });
  
  
  router.post("/real_estate", authMiddleware, async (req, res) => {
    console.log("✌️ req.body --->", req.body);
    const { properties } = req.body;
    const user_id = req.user_id;

    try {
      for (const property of properties) {
        const checkPropertyQuery = `
          SELECT COUNT(*) AS count FROM [dbo].[property] WHERE property_name = ? AND user_id = ?
        `;

        const checkPropertyResult = await queryDatabase(checkPropertyQuery, [
          property.propertyName,
          user_id,
        ]);

        if (checkPropertyResult[0].count > 0) {
          // If the property already exists, update it
          const updatePropertyQuery = `
            UPDATE [dbo].[property]
            SET property_type = ?, location = ?, area_in_sqft = ?, purchase_date = ?, 
                purchase_price = ?, current_value = ?, ownership_status = ?, rental_income = ?, 
                tenant_name = ?, tenant_contact = ?, status = ?, updated_at = GETDATE()
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
            property.propertyName,
            user_id,
          ]);
        } else {
          // If property does not exist, insert a new one
          const insertPropertyQuery = `
            INSERT INTO [dbo].[property] (
              user_id, property_name, property_type, location, area_in_sqft, 
              purchase_date, purchase_price, current_value, ownership_status, 
              rental_income, tenant_name, tenant_contact, status, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE())
          `;

          await queryDatabase(insertPropertyQuery, [
            user_id,
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


    router.post("/stocks", authMiddleware, async (req, res) => {
      const { stocks, beneficiaries } = req.body;
      const user_id = req.user_id;
    
      const beneficiariesString = beneficiaries.join(',');
      const insertStockQuery = `
      INSERT INTO [dbo].[stocks] (
        symbol, purchase_date, purchase_price, quantity, current_value, total_investment, user_id, beneficiarie_user
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
      try {
        for (let stock of stocks) {
          const { symbol, purchaseDate, purchasePrice, quantity, currentValue, totalInvestment } = stock;
    
          await queryDatabase(insertStockQuery, [
            symbol, purchaseDate, purchasePrice, quantity, currentValue, totalInvestment, user_id, beneficiariesString
          ]);
        }
    
        res.status(201).json({ msg: "Stocks added successfully with beneficiaries!" });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: "Server error." });
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
      storage: bond_storage
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
            beneficiariesString
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


  router.post('/cryptocurrencies',authMiddleware, async (req, res) => {
    try {
      console.log('✌️req.body --->', req.body);
      const { cryptos, beneficiaryUser } = req.body;
      const userId = req.user_id;
      const insertCryptoQuery = `
        INSERT INTO cryptocurrencies (name, amount_held, current_value, acquisition_date, wallet, user_id)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
  
      // Loop through each crypto object and save to the database
      const saveCryptoPromises = cryptos.map((crypto) => {
        const { name, amountHeld, currentValue, acquisitionDate, wallet } = crypto;
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
  
      res.status(200).json({ msg: 'Cryptocurrency details saved successfully!' });
    } catch (error) {
      console.error('Error saving cryptocurrency details:', error);
      res.status(500).json({ msg: 'Error saving cryptocurrency details', error });
    }
  });


  router.post('/bank-accounts', authMiddleware, async (req, res) => {
    try {
      console.log('✌️req.body --->', req.body);
      const { accounts, beneficiaryUser } = req.body;
      const userId = req.user_id;
  
      const insertAccountQuery = `
        INSERT INTO bank_accounts (account_holder, account_number, bank_name, account_type, balance, notes, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;
  
      // Loop through each account object and save to the database
      const saveAccountPromises = accounts.map((account) => {
        const { accountHolder, accountNumber, bankName, accountType, balance, notes } = account;
        const params = [
          accountHolder,
          accountNumber,
          bankName,
          accountType,
          balance,
          notes,
          userId,
        ];
        return queryDatabase(insertAccountQuery, params);
      });
  
      // Execute all insert queries concurrently
      await Promise.all(saveAccountPromises);
  
      res.status(200).json({ msg: 'Bank account details saved successfully!' });
    } catch (error) {
      console.error('Error saving bank account details:', error);
      res.status(500).json({ msg: 'Error saving bank account details', error });
    }
  });
  

  router.post('/retirement-accounts', authMiddleware, async (req, res) => {
    try {
      console.log('✌️ req.body --->', req.body);
      const { accounts } = req.body;  // Destructure accounts from request body
      const userId = req.user_id;  // Assuming the user ID is passed via authMiddleware
  
      const insertAccountQuery = `
        INSERT INTO retirement_accounts (
          account_holder, account_type, institution_name, current_balance, total_contributions, notes, user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;
      
      // Loop through each account object and save to the database
      const saveAccountPromises = accounts.map((account) => {
        const { accountHolder, accountType, institutionName, currentBalance, contributions, notes } = account;
        
        // Prepare parameters for the insert query
        const params = [
          accountHolder,                         // account_holder
          accountType,                            // account_type
          institutionName,                        // institution_name
          parseFloat(currentBalance),             // current_balance (convert string to number)
          parseFloat(contributions),              // total_contributions (convert string to number)
          notes,                                  // notes
          userId                                  // user_id
        ];
  
        return queryDatabase(insertAccountQuery, params);  // Execute the query
      });
  
      // Execute all insert queries concurrently
      await Promise.all(saveAccountPromises);
  
      res.status(200).json({ msg: 'Retirement account details saved successfully!' });
    } catch (error) {
      console.error('Error saving retirement account details:', error);
      res.status(500).json({ msg: 'Error saving retirement account details', error });
    }
  });
  
  

  router.post('/commodities', authMiddleware, async (req, res) => {
    try {
      console.log('✌️req.body --->', req.body);
      const { commodities } = req.body;  // Extracting commodity array from the request body
      const userId = req.user_id;  // User ID from the authentication middleware
      
      const insertCommodityQuery = `
        INSERT INTO commodities (
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
          user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      
      const saveCommodityPromises = commodities.map((commodity) => {
        const {
          commodityName,
          commodityType,
          unitOfMeasure,
          marketPrice,
          stockQuantity,
          provider,
          acquisitionDate,
          expiryDate,
          description,
          status
        } = commodity;
        
        const params = [
          commodityName,
          commodityType,
          unitOfMeasure,
          marketPrice,
          stockQuantity,
          provider,
          acquisitionDate,
          expiryDate,
          description,
          status,
          userId
        ];
        
        return queryDatabase(insertCommodityQuery, params);
      });
      
      await Promise.all(saveCommodityPromises);
      
      res.status(200).json({ msg: 'Commodity details saved successfully!' });
    } catch (error) {
      console.error('Error saving commodity details:', error);
      res.status(500).json({ msg: 'Error saving commodity details', error });
    }
  });
  
  router.post('/other-investments', authMiddleware, async (req, res) => {
    try {
      console.log('✌️req.body --->', req.body);
      const { investments } = req.body;  // Extracting investments array from the request body
      const userId = req.user_id;  // User ID from the authentication middleware
      
      // SQL query to insert the other investment details into the database
      const insertInvestmentQuery = `
        INSERT INTO other_investments (
          investment_type,
          amount_invested,
          current_value,
          notes,
          user_id
        ) VALUES (?, ?, ?, ?, ?);
      `;
      
      // Creating an array of promises to save each investment
      const saveInvestmentPromises = investments.map((investment) => {
        const {
          investmentType,
          amountInvested,
          currentValue,
          notes
        } = investment;
        
        const params = [
          investmentType,
          amountInvested,
          currentValue,
          notes,
          userId
        ];
        
        return queryDatabase(insertInvestmentQuery, params);
      });
      
      // Wait for all investment details to be saved
      await Promise.all(saveInvestmentPromises);
      
      res.status(200).json({ msg: 'Investment details saved successfully!' });
    } catch (error) {
      console.error('Error saving investment details:', error);
      res.status(500).json({ msg: 'Error saving investment details', error });
    }
  });

  router.get('/networth', authMiddleware, async (req, res) => {
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
            type: row.asset_type
          });
        }
  
        if (row.liability_name && row.liability_value) {
          liabilities.push({
            name: row.liability_name,
            value: row.liability_value,
            type: row.liability_type
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
        netWorth
      });
    } catch (error) {
      console.error('Error fetching net worth details:', error);
      res.status(500).json({ msg: 'Error fetching net worth details', error: error.message });
    }
  });
  

  

  router.post('/networth', authMiddleware, async (req, res) => {
    try {
      console.log('✌️req.body --->', req.body);
      const { assets, liabilities, savings, property, otherIncome, netWorth } = req.body;
      const userId = req.user_id;  // User ID from the authentication middleware
      
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
          asset.name,              // Asset name
          parseFloat(asset.value), // Asset value (convert to float)
          asset.type,              // Asset type
          null,                    // No liability for this row
          null,                    // No liability for this row
          null,                    // No liability type
          parseFloat(savings),    // Savings (convert to float)
          parseFloat(property),   // Property value (convert to float)
          parseFloat(otherIncome),// Other income (convert to float)
          parseFloat(netWorth),   // Net worth (convert to float)
          userId                  // User ID from the auth middleware
        ];
        saveNetWorthPromises.push(queryDatabase(insertNetWorthQuery, params));
      });
  
      // Insert liabilities
      liabilities.forEach((liability) => {
        const params = [
          null,                    // No asset for this row
          null,                    // No asset for this row
          null,                    // No asset name
          liability.name,          // Liability name
          parseFloat(liability.value), // Liability value (convert to float)
          liability.type,          // Liability type
          parseFloat(savings),     // Savings (convert to float)
          parseFloat(property),    // Property value (convert to float)
          parseFloat(otherIncome), // Other income (convert to float)
          parseFloat(netWorth),    // Net worth (convert to float)
          userId                   // User ID from the auth middleware
        ];
        saveNetWorthPromises.push(queryDatabase(insertNetWorthQuery, params));
      });
    
      // Wait for all net worth data to be saved
      await Promise.all(saveNetWorthPromises);
    
      res.status(200).json({ msg: 'Net worth details saved successfully!' });
    } catch (error) {
      console.error('Error saving net worth details:', error);
      res.status(500).json({ msg: 'Error saving net worth details', error });
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



  router.post('/nps_data', npsUpload.single("document"), authMiddleware, async (req, res) => {
    try {
      console.log('✌️ req.body --->', req.body);
      const { data } = req.body;  // Get the data field from the body
      
      if (!data) {
        return res.status(400).json({ msg: "No NPS data provided" });
      }
  
      // Parse the JSON string to access npsDetails
      const parsedData = JSON.parse(data);
      const { npsDetails } = parsedData;  // Extract npsDetails from the parsed data
  
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
        const { name, phone, email, npsNumber, contribution, nominee, documentPath, status } = nps;
  
        const params = [
          userId,        // User ID (foreign key)
          name,          // Account holder name
          phone,         // Contact number
          email || null, // Email address (optional)
          npsNumber,     // NPS account number
          parseFloat(contribution), // Contribution amount (convert to float)
          nominee,       // Nominee name
          documentData || null, // Document path (optional)
          status || 'Active',   // Status (default: Active)
        ];
  
        return queryDatabase(insertNpsQuery, params);
      });
  
      // Wait for all NPS details to be saved
      await Promise.all(saveNpsPromises);
  
      res.status(200).json({ msg: 'NPS details saved successfully!' });
    } catch (error) {
      console.error('Error saving NPS details:', error);
      res.status(500).json({ msg: 'Error saving NPS details', error: error.message || error });
    }
  });
  



  const ppfstorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/ppf');  
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });
  
  const ppfUpload = multer({ storage: ppfstorage });
  
  // API to upload PPF data with file
  router.post('/ppf_data', ppfUpload.single("document"), authMiddleware, async (req, res) => {
    try {
      console.log('✌️ req.body --->', req.body); // Log incoming request body
  
      const { data } = req.body;  // Get the data field from the request body
  
      if (!data) {
        return res.status(400).json({ msg: "No PPF data provided" });
      }
  
      const parsedData = JSON.parse(data);
      const { ppfDetails } = parsedData;  // Extract ppfDetails from parsed data
  
      if (!ppfDetails || !Array.isArray(ppfDetails)) {
        return res.status(400).json({ msg: "Invalid PPF data structure" });
      }
  
      const userId = req.user_id;
  
      let documentData = null;
  
      if (req.file) {
        try {
          documentData = fs.readFileSync(req.file.path);  // Read the document file
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
        const { name, phone, email, ppfAccountNumber, contribution, nominee, documentPath, status } = ppf;
  
        // Parameters for the SQL query
        const params = [
          userId,         // User ID (foreign key)
          name,           // Account holder name
          phone,          // Contact number
          email || null,  // Email address (optional)
          ppfAccountNumber, // PPF account number
          parseFloat(contribution), // Contribution amount (convert to float)
          nominee,        // Nominee name
          documentData || null,  // Document path (optional)
          status || 'Active',    // Status (default: Active)
        ];
  
        return queryDatabase(insertPpfQuery, params);
      });
  
      // Wait for all PPF details to be saved
      await Promise.all(savePpfPromises);
  
      res.status(200).json({ msg: 'PPF details saved successfully!' });
    } catch (error) {
      console.error('Error saving PPF details:', error);
      res.status(500).json({ msg: 'Error saving PPF details', error: error.message || error });
    }
  });


  const epfstorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/epf');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const epfupload = multer({ storage: epfstorage });
  
  // API to handle EPF data submission
  router.post('/epf_data', epfupload.single('document'), authMiddleware, async (req, res) => {
    try {
      console.log('✌️req.body --->', req.body);
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
        const { name, phone, email, epfAccountNumber, contribution, nominee } = epf;
        const params = [name,userId, phone, email, epfAccountNumber, contribution, nominee, document];
        return queryDatabase(insertQuery, params);
      });
  
      await Promise.all(insertPromises);
  
      res.status(200).json({ message: 'EPF details saved successfully!' });
    } catch (error) {
      console.error('Error saving EPF data:', error);
      res.status(500).json({ message: 'Error saving EPF data' });
    }
  });
  


module.exports = router;
