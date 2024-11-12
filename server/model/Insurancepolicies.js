// models/InsurancePolicy.js

const mongoose = require("mongoose");

const InsurancePolicySchema = new mongoose.Schema({
  policy_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  policy_number: {
    type: String,
    required: true,
    unique: true,
  },
  policy_name: {
    type: String,
    required: true,
  },
  policy_type: {
    type: String,
    enum: [
      "Life Insurance",
      "Health Insurance",
      "Car Insurance",
      "Home Insurance",
      "Term Insurance",
      "Identity Information",
      "Others",
    ],
    default: "Life Insurance",
  },
  provider: {
    type: String,
    required: true,
  },
  coverage_amount: {
    type: Number,
    required: true,
  },
  premium_amount: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  nominee_name: {
    type: String,
    required: true,
  },
  nominee_relation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Pending", "Expired"],
    default: "Active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("InsurancePolicy", InsurancePolicySchema);
