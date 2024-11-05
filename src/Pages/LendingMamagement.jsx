import React, { useState } from "react";
import {
  FaUser,
  FaDollarSign,
  FaPercent,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaLink,
  FaFileUpload,
  FaPlus,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

const LendingManagement = () => {
  const [loans, setLoans] = useState([
    {
      borrowerName: "",
      contact: "",
      email: "",
      amountLent: "",
      interestRate: "",
      dueDate: "",
      relationship: "",
      notify: false,
    },
  ]);

  const handleLoanChange = (index, field, value) => {
    const newLoans = [...loans];
    newLoans[index][field] = value;
    setLoans(newLoans);
  };

  const addLoan = () => {
    setLoans([
      ...loans,
      {
        borrowerName: "",
        contact: "",
        email: "",
        amountLent: "",
        interestRate: "",
        dueDate: "",
        relationship: "",
        notify: false,
      },
    ]);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Lending Records
        </h1>
        <p className="text-gray-600">
          Keep track of money lent to friends, family, and others with ease.
        </p>
      </header>

      {/* Lending Records Section */}
      {loans.map((loan, index) => (
        <FieldSection key={index} title={`${index + 1} Lending Record`}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Borrower Name"
            value={loan.borrowerName}
            onChange={(e) =>
              handleLoanChange(index, "borrowerName", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Contact Number"
            value={loan.contact}
            onChange={(e) => handleLoanChange(index, "contact", e.target.value)}
          />
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email Address"
            value={loan.email}
            onChange={(e) => handleLoanChange(index, "email", e.target.value)}
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Amount Lent"
            value={loan.amountLent}
            onChange={(e) =>
              handleLoanChange(index, "amountLent", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPercent className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Interest Rate (%)"
            value={loan.interestRate}
            onChange={(e) =>
              handleLoanChange(index, "interestRate", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Due Date"
            value={loan.dueDate}
            onChange={(e) => handleLoanChange(index, "dueDate", e.target.value)}
          />
          <InputWithIcon
            icon={<FaLink className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Relationship"
            value={loan.relationship}
            onChange={(e) =>
              handleLoanChange(index, "relationship", e.target.value)
            }
          />
          <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg">
            <input
              type="checkbox"
              className="mx-2"
              checked={loan.notify}
              onChange={(e) =>
                handleLoanChange(index, "notify", e.target.checked)
              }
            />
            <label className="text-gray-800">Notify Borrower</label>
          </div>
        </FieldSection>
      ))}

      <button
        onClick={addLoan}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add Loan Record
      </button>

      {/* Document Upload Section */}
      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <input
            type="file"
            className="border-0 rounded-md p-3 w-full bg-transparent"
            placeholder="Upload Loan Agreement"
            aria-label="Upload Loan Agreement"
          />
        </div>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          Upload Document
        </button>
      </Section>

      {/* Educational Resources Section */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">
          Learn more about best practices in lending and financial management.
        </p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaBook className="inline mr-2" /> Learn More
        </button>
      </Section>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Lending Details
      </button>
    </div>
  );
};

export default LendingManagement;
