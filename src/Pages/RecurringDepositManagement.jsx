import React, { useState } from "react";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaPercent,
  FaLink,
  FaPlus,
  FaCheckCircle,
  FaHashtag,
} from "react-icons/fa";

function RecurringDepositManagement() {
  const [deposits, setDeposits] = useState([
    {
      bankName: "",
      depositAmount: "",
      tenure: "",
      interestRate: "",
      startDate: "",
      maturityDate: "",
      maturityAmount: "",
      rdNumber: "",
      status: "",
    },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([
    {
      name: "",
      contact: "",
      email: "",
      entitlement: "",
      relationship: "",
      notify: false,
    },
  ]);

  const addDeposit = () => {
    setDeposits([
      ...deposits,
      {
        bankName: "",
        depositAmount: "",
        tenure: "",
        interestRate: "",
        startDate: "",
        maturityDate: "",
        maturityAmount: "",
        rdNumber: "",
        status: "",
      },
    ]);
  };

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        name: "",
        contact: "",
        email: "",
        entitlement: "",
        relationship: "",
        notify: false,
      },
    ]);
  };

  const handleDepositChange = (index, field, value) => {
    const updatedDeposits = [...deposits];
    updatedDeposits[index][field] = value;
    setDeposits(updatedDeposits);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Recurring Deposits
        </h1>
        <p className="text-gray-600">
          Effortlessly manage your recurring deposits and keep track of
          beneficiary details.
        </p>
      </header>

      {/* Deposit Section */}
      {deposits.map((deposit, index) => (
        <div key={index} className="mb-4 border-b pb-4">
          <FieldSection title="Recurring Deposits">
            <InputWithIcon
              icon={<FaHashtag />}
              type="text"
              placeholder="RD Number"
              value={deposit.rdNumber}
              onChange={(e) =>
                handleDepositChange(index, "rdNumber", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="text"
              placeholder="Bank Name"
              value={deposit.bankName}
              onChange={(e) =>
                handleDepositChange(index, "bankName", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="number"
              placeholder="Monthly Deposit Amount"
              value={deposit.depositAmount}
              onChange={(e) =>
                handleDepositChange(index, "depositAmount", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaPercent />}
              type="number"
              placeholder="Interest Rate (%)"
              value={deposit.interestRate}
              onChange={(e) =>
                handleDepositChange(index, "interestRate", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaCalendarAlt />}
              type="date"
              placeholder="Start Date"
              value={deposit.startDate}
              onChange={(e) =>
                handleDepositChange(index, "startDate", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaCalendarAlt />}
              type="date"
              placeholder="Maturity Date"
              value={deposit.maturityDate}
              onChange={(e) =>
                handleDepositChange(index, "maturityDate", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="number"
              placeholder="Maturity Amount"
              value={deposit.maturityAmount}
              onChange={(e) =>
                handleDepositChange(index, "maturityAmount", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Status"
              value={deposit.status}
              onChange={(e) =>
                handleDepositChange(index, "status", e.target.value)
              }
            />
          </FieldSection>
        </div>
      ))}
      <button
        onClick={addDeposit}
        className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md mt-4"
      >
        <FaPlus className="inline mx-2" /> Add Deposit
      </button>

      {/* Beneficiary Information */}
      {beneficiaries.map((beneficiary, index) => (
        <div key={index} className="mb-4 border-b pb-4">
          <FieldSection title="Beneficiary Information">
            <InputWithIcon
              icon={<FaUser />}
              type="text"
              placeholder="Beneficiary Name"
              value={beneficiary.name}
              onChange={(e) =>
                handleBeneficiaryChange(index, "name", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaPhone />}
              type="text"
              placeholder="Contact Number"
              value={beneficiary.contact}
              onChange={(e) =>
                handleBeneficiaryChange(index, "contact", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaEnvelope />}
              type="email"
              placeholder="Email Address"
              value={beneficiary.email}
              onChange={(e) =>
                handleBeneficiaryChange(index, "email", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaPercent />}
              type="text"
              placeholder="Percentage of Entitlement"
              value={beneficiary.entitlement}
              onChange={(e) =>
                handleBeneficiaryChange(index, "entitlement", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaLink />}
              type="text"
              placeholder="Relationship"
              value={beneficiary.relationship}
              onChange={(e) =>
                handleBeneficiaryChange(index, "relationship", e.target.value)
              }
            />
            <label className="inline-flex items-center mt-2 col-span-2">
              <input
                type="checkbox"
                className="mx-2"
                checked={beneficiary.notify}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "notify", e.target.checked)
                }
              />
              Notify by Email
            </label>
          </FieldSection>
        </div>
      ))}
      <button
        onClick={addBeneficiary}
        className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md mt-4"
      >
        <FaPlus className="inline mx-2" /> Add Beneficiary
      </button>

      {/* Educational Resources */}
      <FieldSection title="Educational Resources">
        <ul className="list-disc pl-6 text-gray-600">
          <li>Understand the benefits of recurring deposits.</li>
          <li>Learn about maturity amounts and interest rates.</li>
          <li>Explore tax implications of recurring deposits.</li>
        </ul>
        <button
          type="submit"
          className="bg-[#3a5e22fd] text-white ms-auto mt-4 py-2 px-4 rounded hover:bg-[#2f4b1dfd] flex items-center"
        >
          <FaCheckCircle className="mr-2" />
          Submit
        </button>
      </FieldSection>
    </div>
  );
}

export default RecurringDepositManagement;
