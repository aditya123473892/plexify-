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

  router.post("/commodities", authMiddleware, async (req, res) => {
    console.log("✌️ req.body --->", req.body);
    const { commodities } = req.body;

    let connection;
    try {
      connection = await initializeConnection(); // Initialize connection

      const transaction = new sql.Transaction(connection);
      await transaction.begin(); // Start transaction

      for (const commodity of commodities) {
        const {
          CommodityID,
          CommodityType,
          Quantity,
          PurchasePrice,
          CurrentValue = null,
          Notes = "",
        } = commodity;

        // Input validation
        if (
          !CommodityType ||
          Quantity === undefined ||
          PurchasePrice === undefined
        ) {
          throw new Error(
            "CommodityType, Quantity, and PurchasePrice are required."
          );
        }

        let existingCommodityCheckQuery = `
        SELECT COUNT(*) AS count FROM Commodities WHERE CommodityID = @CommodityID
      `;
        const request = new sql.Request(transaction);
        request.input("CommodityID", sql.Int, CommodityID);

        const existingCommodityCheckResult = await request.query(
          existingCommodityCheckQuery
        );

        if (existingCommodityCheckResult.recordset[0].count > 0) {
          // Update existing commodity
          const updateCommodityQuery = `
          UPDATE Commodities
          SET CommodityType = @CommodityType, Quantity = @Quantity, PurchasePrice = @PurchasePrice,
              CurrentValue = @CurrentValue, Notes = @Notes, CreatedAt = GETDATE()
          WHERE CommodityID = @CommodityID
        `;
          request.input("CommodityType", sql.NVarChar, CommodityType);
          request.input("Quantity", sql.Float, Quantity);
          request.input("PurchasePrice", sql.Float, PurchasePrice);
          request.input("CurrentValue", sql.Float, CurrentValue);
          request.input("Notes", sql.NVarChar, Notes);

          await request.query(updateCommodityQuery);
          console.log(`Updated Commodity ID: ${CommodityID}`);
        } else {
          // Insert new commodity
          const insertCommodityQuery = `
          INSERT INTO Commodities (CommodityType, Quantity, PurchasePrice, CurrentValue, Notes, CreatedAt)
          OUTPUT INSERTED.CommodityID
          VALUES (@CommodityType, @Quantity, @PurchasePrice, @CurrentValue, @Notes, GETDATE())
        `;
          request.input("CommodityType", sql.NVarChar, CommodityType);
          request.input("Quantity", sql.Float, Quantity);
          request.input("PurchasePrice", sql.Float, PurchasePrice);
          request.input("CurrentValue", sql.Float, CurrentValue);
          request.input("Notes", sql.NVarChar, Notes);

          const insertCommodityResult = await request.query(
            insertCommodityQuery
          );
          console.log(
            `New Commodity ID: ${insertCommodityResult.recordset[0].CommodityID}`
          );
        }
      }

      await transaction.commit(); // Commit transaction
      res.status(201).json({ msg: "Commodities added/updated successfully!" });
    } catch (error) {
      console.error("Error:", error);
      if (connection) {
        await connection.rollback(); // Rollback transaction on error
      }
      res.status(500).json({ msg: "Server error." });
    } finally {
      if (connection) {
        connection.close(); // Close the connection
      }
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
    const { deposits } = req.body;
    const user_id = req.user_id;

    try {
      for (const deposit of deposits) {
        const checkDepositQuery = `
          SELECT COUNT(*) AS count FROM [dbo].[recurring_deposit] WHERE rd_number = ?
        `;

        const checkDepositResult = await queryDatabase(checkDepositQuery, [
          deposit.rdNumber,
        ]);

        let rd_id;

        if (checkDepositResult[0].count > 0) {
          // Update the existing deposit
          const updateDepositQuery = `
            UPDATE [dbo].[recurring_deposit]
            SET monthly_deposit_amount = ?, interest_rate = ?, start_date = ?, 
                maturity_date = ?, maturity_amount = ?, bank_name = ?, status = ?
            OUTPUT INSERTED.rd_id
            WHERE rd_number = ?
          `;

          const updateResult = await queryDatabase(updateDepositQuery, [
            deposit.depositAmount,
            deposit.interestRate,
            deposit.startDate,
            deposit.maturityDate,
            deposit.maturityAmount,
            deposit.bankName,
            deposit.status || "Active",
            deposit.rdNumber,
          ]);

          rd_id = updateResult[0].rd_id;
        } else {
          // Insert a new deposit and get the inserted ID
          const insertDepositQuery = `
            INSERT INTO [dbo].[recurring_deposit] (
              user_id, rd_number, monthly_deposit_amount, interest_rate, start_date, 
              maturity_date, maturity_amount, bank_name, status
            )
            OUTPUT INSERTED.rd_id
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const insertDepositResult = await queryDatabase(insertDepositQuery, [
            user_id,
            deposit.rdNumber,
            deposit.depositAmount,
            deposit.interestRate,
            deposit.startDate,
            deposit.maturityDate,
            deposit.maturityAmount,
            deposit.bankName,
            deposit.status || "Active",
          ]);

          rd_id = insertDepositResult[0].rd_id;
        }

        console.log("Recurring Deposit ID:", rd_id);

        // Handle the beneficiaries associated with each deposit
        const beneficiaryPromises = deposit.beneficiaries.map((beneficiary) => {
          const insertBeneficiaryQuery = `
            INSERT INTO [dbo].[beneficiaries] (
              rd_id, user_id, name, contact, email, entitlement, relationship, notify
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          return queryDatabase(insertBeneficiaryQuery, [
            rd_id,
            user_id,
            beneficiary.name,
            beneficiary.contact,
            beneficiary.email,
            parseInt(beneficiary.entitlement),
            beneficiary.relationship,
            beneficiary.notify ? 1 : 0,
          ]);
        });

        await Promise.all(beneficiaryPromises); // Insert beneficiaries only once per deposit
      }

      res.status(201).json({
        msg: "Recurring deposits and beneficiaries added/updated successfully!",
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
        const metals = JSON.parse(req.body.metals); // Metals data
        const beneficiaries = JSON.parse(req.body.beneficiaries); // Shared beneficiaries
        const userId = req.user_id;

        let documentData = null;
        if (req.file) {
          documentData = fs.readFileSync(req.file.path);
          console.log("Document Data Buffer:", documentData);
        }

        // Insert each metal record
        const metalIds = await Promise.all(
          metals.map(async (metal) => {
            const weight = parseFloat(metal.weight).toFixed(2);
            const purchasePrice = parseFloat(metal.purchasePrice).toFixed(2);
            const currentValue = parseFloat(metal.currentValue).toFixed(2);
            const description = metal.description || "";

            if (isNaN(weight) || isNaN(purchasePrice) || isNaN(currentValue)) {
              throw new Error("Invalid numeric data for metal entry");
            }

            const insertMetalQuery = `
          INSERT INTO precious_metals (user_id, metal_type, weight, purchase_price, current_value, description, document)
          OUTPUT INSERTED.id
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

            const result = await queryDatabase(insertMetalQuery, [
              userId,
              metal.metalType,
              weight,
              purchasePrice,
              currentValue,
              description,
              documentData || null,
            ]);

            console.log("Metal Insert Result:", result);
            return result[0].id; // Get the inserted metal ID
          })
        );

        // Insert beneficiaries only once and link to the first metal ID or last inserted ID as per requirement
        const pm_id = metalIds[0]; // Use the first metal ID (or use metalIds[metalIds.length - 1] for the last one)

        await Promise.all(
          beneficiaries.map(async (beneficiary) => {
            const entitlement = parseFloat(beneficiary.entitlement);
            if (isNaN(entitlement)) {
              throw new Error("Invalid entitlement data for beneficiary");
            }

            const insertBeneficiaryQuery = `
          INSERT INTO realestate_Beneficiary (pm_id, user_id, name, contact, email, entitlement, relationship, notify)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

            await queryDatabase(insertBeneficiaryQuery, [
              pm_id,
              userId,
              beneficiary.name,
              beneficiary.contact,
              beneficiary.email,
              entitlement,
              beneficiary.relationship,
              beneficiary.notify ? 1 : 0,
            ]);
          })
        );

        res.status(200).json({
          msg: "Precious metals and beneficiaries data saved successfully",
        });
      } catch (error) {
        console.error("Error saving precious metals inheritance data:", error);
        res.status(500).json({ msg: "Failed to save data" });
      }
    }
  );

  router.post("/commodities", authMiddleware, async (req, res) => {
    console.log("✌️ req.body --->", req.body);
    const { commodities } = req.body;

    let connection;
    try {
      connection = await initializeConnection(); // Initialize connection

      const transaction = new sql.Transaction(connection);
      await transaction.begin(); // Start transaction

      for (const commodity of commodities) {
        const {
          CommodityID,
          CommodityType,
          Quantity,
          PurchasePrice,
          CurrentValue = null,
          Notes = "",
        } = commodity;

        // Input validation
        if (
          !CommodityType ||
          Quantity === undefined ||
          PurchasePrice === undefined
        ) {
          throw new Error(
            "CommodityType, Quantity, and PurchasePrice are required."
          );
        }

        let existingCommodityCheckQuery = `
        SELECT COUNT(*) AS count FROM Commodities WHERE CommodityID = @CommodityID
      `;
        const request = new sql.Request(transaction);
        request.input("CommodityID", sql.Int, CommodityID);

        const existingCommodityCheckResult = await request.query(
          existingCommodityCheckQuery
        );

        if (existingCommodityCheckResult.recordset[0].count > 0) {
          // Update existing commodity
          const updateCommodityQuery = `
          UPDATE Commodities
          SET CommodityType = @CommodityType, Quantity = @Quantity, PurchasePrice = @PurchasePrice,
              CurrentValue = @CurrentValue, Notes = @Notes, CreatedAt = GETDATE()
          WHERE CommodityID = @CommodityID
        `;
          request.input("CommodityType", sql.NVarChar, CommodityType);
          request.input("Quantity", sql.Float, Quantity);
          request.input("PurchasePrice", sql.Float, PurchasePrice);
          request.input("CurrentValue", sql.Float, CurrentValue);
          request.input("Notes", sql.NVarChar, Notes);

          await request.query(updateCommodityQuery);
          console.log(`Updated Commodity ID: ${CommodityID}`);
        } else {
          // Insert new commodity
          const insertCommodityQuery = `
          INSERT INTO Commodities (CommodityType, Quantity, PurchasePrice, CurrentValue, Notes, CreatedAt)
          OUTPUT INSERTED.CommodityID
          VALUES (@CommodityType, @Quantity, @PurchasePrice, @CurrentValue, @Notes, GETDATE())
        `;
          request.input("CommodityType", sql.NVarChar, CommodityType);
          request.input("Quantity", sql.Float, Quantity);
          request.input("PurchasePrice", sql.Float, PurchasePrice);
          request.input("CurrentValue", sql.Float, CurrentValue);
          request.input("Notes", sql.NVarChar, Notes);

          const insertCommodityResult = await request.query(
            insertCommodityQuery
          );
          console.log(
            `New Commodity ID: ${insertCommodityResult.recordset[0].CommodityID}`
          );
        }
      }

      await transaction.commit(); // Commit transaction
      res.status(201).json({ msg: "Commodities added/updated successfully!" });
    } catch (error) {
      console.error("Error:", error);
      if (connection) {
        await connection.rollback(); // Rollback transaction on error
      }
      res.status(500).json({ msg: "Server error." });
    } finally {
      if (connection) {
        connection.close(); // Close the connection
      }
    }
  });


  router.post("/stocks", authMiddleware, async (req, res) => {
    console.log('✌️req.body --->', req.body);
  
    const { stocks, beneficiaries } = req.body;
    const user_id = req.user_id;
  
    try {
      // Define the SQL queries inside the route handler
      const insertStockQuery = `
        INSERT INTO [dbo].[stocks] 
          (user_id, ticker_symbol, purchase_date, quantity, purchase_price, current_price)
        OUTPUT INSERTED.id
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      const updateStockQuery = `
        UPDATE [dbo].[stocks]
        SET purchase_date = ?, quantity = ?, purchase_price = ?, current_price = ?
        WHERE ticker_symbol = ?
      `;
  
      const insertBeneficiaryQuery = `
        INSERT INTO [dbo].[bussiness_Beneficiary] 
          (stock_id, user_id, name, contact, email, entitlement, relationship, notify)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      // Process each stock record
      for (const stock of stocks) {
        const purchasePrice = parseFloat(stock.purchasePrice);  // Convert to float
        const quantity = parseInt(stock.quantity);  // Convert to integer
        const currentValue = parseFloat(stock.currentValue);  // Convert to float
        const purchaseDate = new Date(stock.purchaseDate).toISOString();  // Convert to ISO string
  
        // Check if the stock already exists
        const checkStockQuery = `
          SELECT COUNT(*) AS count FROM [dbo].[stocks] WHERE ticker_symbol = ?
        `;
        const checkResult = await queryDatabase(checkStockQuery, [stock.symbol]);
  
        let stock_id;
        if (checkResult[0].count > 0) {
          // Stock exists, update the record
          const updateResult = await queryDatabase(updateStockQuery, [
            purchaseDate,
            quantity,
            purchasePrice,
            currentValue,
            stock.symbol,
          ]);
  
          // Get the updated stock ID
          const getStockIdQuery = `SELECT id FROM [dbo].[stocks] WHERE ticker_symbol = ?`;
          const result = await queryDatabase(getStockIdQuery, [stock.symbol]);
          stock_id = result[0].id;
        } else {
          // Stock does not exist, insert a new record
          const result = await queryDatabase(insertStockQuery, [
            user_id,
            stock.symbol,
            purchaseDate,
            quantity,
            purchasePrice,
            currentValue,
          ]);
          stock_id = result[0]?.id;
        }
  
        console.log(`Processing Stock: ${stock.symbol}, stock_id: ${stock_id}`);
  
        // Insert beneficiaries for this stock (only once for each stock)
        for (const beneficiary of beneficiaries) {
          const entitlement = parseFloat(beneficiary.entitlement);  // Ensure entitlement is a number
  
          // Insert beneficiary only if it doesn't exist already for this stock
          const beneficiaryExistsQuery = `
            SELECT COUNT(*) AS count 
            FROM [dbo].[bussiness_Beneficiary] 
            WHERE stock_id = ? AND user_id = ? AND email = ?
          `;
          const beneficiaryCheck = await queryDatabase(beneficiaryExistsQuery, [
            stock_id,
            user_id,
            beneficiary.email,
          ]);
  
          // If beneficiary doesn't already exist for the stock, insert them
          if (beneficiaryCheck[0].count === 0) {
            await queryDatabase(insertBeneficiaryQuery, [
              stock_id, // Linking stock_id as foreign key
              user_id,
              beneficiary.name,
              beneficiary.contact,
              beneficiary.email,
              entitlement,
              beneficiary.relationship,
              beneficiary.notify ? 1 : 0, // Convert boolean to 1 or 0
            ]);
          } else {
            console.log(`Beneficiary ${beneficiary.email} already exists for stock_id ${stock_id}`);
          }
        }
      }
  
      // If everything went successfully, send a response
      res.status(201).json({ msg: "Stocks and beneficiaries saved successfully!" });
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      res.status(500).json({ msg: "Failed to save data." });
    }
  });
  



  const bondUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/bond"); // File upload directory
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  });
  
  router.post(
    "/bonds",
    authMiddleware,
    bondUpload.single("document"), // Middleware to handle file uploads
    async (req, res) => {
      try {
        console.log("Request Body:", req.body);
  
        const bonds = JSON.parse(req.body.bonds); // Bond data from frontend
        const beneficiaries = JSON.parse(req.body.beneficiaries); // Shared beneficiaries
        const userId = req.user_id; // Extracted from authMiddleware
  
        let documentData = null;
        if (req.file) {
          documentData = fs.readFileSync(req.file.path); // Read document file
          console.log("Document Data Buffer:", documentData);
        }
  
        // Insert each bond record
        const bondIds = await Promise.all(
          bonds.map(async (bond) => {
            // Parse the values to ensure they are numbers
            const bondValue = parseFloat(bond.faceValue);
            const interestRate = parseFloat(bond.interestRate);
            const marketValue = parseFloat(bond.marketValue);
            const description = bond.description || "";
  
            if (isNaN(bondValue) || isNaN(interestRate) || isNaN(marketValue)) {
              throw new Error("Invalid numeric data for bond entry");
            }
  
            const insertBondQuery = `
              INSERT INTO bond (user_id, bond_name, bond_value, maturity_date, description, document)
              OUTPUT INSERTED.bond_id
              VALUES (?, ?, ?, ?, ?, ?);
            `;
  
            const result = await queryDatabase(insertBondQuery, [
              userId,
              bond.issuer,  // Updated to bond.issuer instead of bond.name
              bondValue.toFixed(2),  // Use bondValue as the value to be inserted
              bond.maturityDate,
              description,
              documentData || null,
            ]);
  
            console.log("Bond Insert Result:", result);
            return result[0].bond_id; // Get the inserted bond ID
          })
        );
  
        // Insert beneficiaries and associate them with the first bond ID or any other as required
        const bondId = bondIds[0]; // Use the first bond ID (or bondIds[bondIds.length - 1] for the last one)
  
        await Promise.all(
          beneficiaries.map(async (beneficiary) => {
            const entitlement = parseFloat(beneficiary.entitlement);
            if (isNaN(entitlement)) {
              throw new Error("Invalid entitlement data for beneficiary");
            }
  
            const insertBeneficiaryQuery = `
              INSERT INTO bond_beneficiary (bond_id, user_id, name, contact, email, entitlement, relationship, notify)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
  
            await queryDatabase(insertBeneficiaryQuery, [
              bondId,
              userId,
              beneficiary.name,
              beneficiary.contact,
              beneficiary.email,
              entitlement,
              beneficiary.relationship,
              beneficiary.notify ? 1 : 0,
            ]);
          })
        );
  
        res.status(200).json({
          msg: "Bonds and beneficiaries data saved successfully",
        });
      } catch (error) {
        console.error("Error saving bond data:", error);
        res.status(500).json({ msg: "Failed to save data" });
      }
    }
  );
  

module.exports = router;
