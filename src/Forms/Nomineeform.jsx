// File: src/components/NomineeForm.jsx

import React, { useState } from "react";

const NomineeForm = () => {
  const [nominees, setNominees] = useState([
    {
      name: "",
      contact: "",
      email: "",
      percentage: "",
      notificationType: "Single",
      notificationMethod: "Email",
      errors: {},
    },
  ]);

  const [policyTerm, setPolicyTerm] = useState("");
  const [sumAssured, setSumAssured] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formError, setFormError] = useState("");

  const validateNominee = (nominee) => {
    const errors = {};
    if (!nominee.name) errors.name = "Name is required";
    if (!nominee.contact) errors.contact = "Contact number is required";
    if (!nominee.email || !/\S+@\S+\.\S+/.test(nominee.email)) {
      errors.email = "A valid email address is required";
    }
    if (
      !nominee.percentage ||
      isNaN(nominee.percentage) ||
      nominee.percentage <= 0 ||
      nominee.percentage > 100
    ) {
      errors.percentage = "Percentage must be a number between 1 and 100";
    }
    return errors;
  };

  const handleNomineeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNominees = [...nominees];
    updatedNominees[index][name] = value;
    setNominees(updatedNominees);
  };

  const addNominee = () => {
    setNominees([
      ...nominees,
      {
        name: "",
        contact: "",
        email: "",
        percentage: "",
        notificationType: "Single",
        notificationMethod: "Email",
        errors: {},
      },
    ]);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 2 * 1024 * 1024; 
    const supportedFormats = ["image/jpeg", "image/png", "application/pdf"];

    const validFiles = files.filter((file) => {
      if (file.size > maxFileSize) {
        alert(`${file.name} is too large. Maximum file size is 2MB.`);
        return false;
      }
      if (!supportedFormats.includes(file.type)) {
        alert(`${file.name} is not a supported format.`);
        return false;
      }
      return true;
    });

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const calculatePremium = () => {
    if (!policyTerm || !sumAssured || !annualIncome || !paymentMode) {
      setFormError("Please fill out all premium calculation fields.");
      return;
    }

    alert("Premium Calculated!");
    setFormError("");
  };

  const handleFormSubmit = () => {
    let totalPercentage = 0;
    const updatedNominees = nominees.map((nominee) => {
      const errors = validateNominee(nominee);
      totalPercentage += parseFloat(nominee.percentage) || 0;
      return { ...nominee, errors };
    });

    if (totalPercentage > 100) {
      alert("Total percentage of entitlement should not exceed 100%.");
      return;
    }

    setNominees(updatedNominees);

    const hasErrors = updatedNominees.some(
      (nominee) => Object.keys(nominee.errors).length > 0
    );
    if (!hasErrors) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className=" mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Nominee Information</h1>
      {nominees.map((nominee, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={nominee.name}
              onChange={(e) => handleNomineeChange(index, e)}
              placeholder="Enter name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {nominee.errors.name && (
              <p className="text-red-500">{nominee.errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={nominee.contact}
              onChange={(e) => handleNomineeChange(index, e)}
              placeholder="Enter contact number"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {nominee.errors.contact && (
              <p className="text-red-500">{nominee.errors.contact}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={nominee.email}
              onChange={(e) => handleNomineeChange(index, e)}
              placeholder="Enter email address"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {nominee.errors.email && (
              <p className="text-red-500">{nominee.errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">
              Percentage of Entitlement
            </label>
            <input
              type="text"
              name="percentage"
              value={nominee.percentage}
              onChange={(e) => handleNomineeChange(index, e)}
              placeholder="Enter percentage"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {nominee.errors.percentage && (
              <p className="text-red-500">{nominee.errors.percentage}</p>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addNominee}
        className="bg-[#446b2b] text-white px-6 py-2 rounded-md mb-8 hover:bg-[#263f16] transition"
      >
        Add Another Nominee
      </button>

      <h2 className="text-2xl font-bold mb-4">Document Upload</h2>
      <div className="mb-6">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
            <ul className="list-disc pl-5">
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Premium Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      </div>
      {formError && <p className="text-red-500">{formError}</p>}
      <button
        onClick={calculatePremium}
        className="bg-[#466d2c] text-white px-6 py-2 rounded-md hover:bg-[#233615] transition"
      >
        Calculate your Premium
      </button>
      <button
        onClick={handleFormSubmit}
        className="bg-[#466d2b] text-white px-6 py-2 rounded-md hover:bg-[#233615] transition mx-5"
      >
        Submit Form
      </button>
    </div>
  );
};

export default NomineeForm;
