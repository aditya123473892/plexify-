import React, { useState } from "react";
<<<<<<< HEAD
import { FaMoneyBillWave, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaPercent, FaLink, FaPlus,FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection'
=======
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
} from "react-icons/fa";

>>>>>>> 39b1eb9170ace7280ba46888fbe7db35233820ca
function RecurringDepositManagement() {
  const [deposits, setDeposits] = useState([
    {
      bankName: "",
      depositAmount: "",
      tenure: "",
      maturityAmount: "",
      startDate: "",
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
        maturityAmount: "",
        startDate: "",
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
<<<<<<< HEAD
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Recurring Deposits</h1>
      <p className="text-gray-600">Effortlessly manage your recurring deposits and keep track of beneficiary details.</p>
    </header>
  
    {/* Deposit Section */}
      {deposits.map((deposit, index) => (
        <div key={index} className="mb-4 border-b pb-4">
          <FieldSection title="Recurring Deposits">
    
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="text"
              placeholder="Bank Name"
              value={deposit.bankName}
              onChange={(e) => handleDepositChange(index, "bankName", e.target.value)}
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="number"
              placeholder="Deposit Amount"
              value={deposit.depositAmount}
              onChange={(e) => handleDepositChange(index, "depositAmount", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCalendarAlt />}
              type="number"
              placeholder="Tenure (months)"
              value={deposit.tenure}
              onChange={(e) => handleDepositChange(index, "tenure", e.target.value)}
            />
            <InputWithIcon
              icon={<FaMoneyBillWave />}
              type="number"
              placeholder="Maturity Amount"
              value={deposit.maturityAmount}
              onChange={(e) => handleDepositChange(index, "maturityAmount", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCalendarAlt />}
              type="date"
              value={deposit.startDate}
              onChange={(e) => handleDepositChange(index, "startDate", e.target.value)}
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
              onChange={(e) => handleBeneficiaryChange(index, "name", e.target.value)}
            />
            <InputWithIcon
              icon={<FaPhone />}
              type="text"
              placeholder="Contact Number"
              value={beneficiary.contact}
              onChange={(e) => handleBeneficiaryChange(index, "contact", e.target.value)}
            />
            <InputWithIcon
              icon={<FaEnvelope />}
              type="email"
              placeholder="Email Address"
              value={beneficiary.email}
              onChange={(e) => handleBeneficiaryChange(index, "email", e.target.value)}
            />
            <InputWithIcon
              icon={<FaPercent />}
              type="text"
              placeholder="Percentage of Entitlement"
              value={beneficiary.entitlement}
              onChange={(e) => handleBeneficiaryChange(index, "entitlement", e.target.value)}
            />
            <InputWithIcon
              icon={<FaLink />}
              type="text"
              placeholder="Relationship"
              value={beneficiary.relationship}
              onChange={(e) => handleBeneficiaryChange(index, "relationship", e.target.value)}
            />
            <label className="inline-flex items-center mt-2 col-span-2">
              <input
                type="checkbox"
                className="mx-2"
                checked={beneficiary.notify}
                onChange={(e) => handleBeneficiaryChange(index, "notify", e.target.checked)}
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
=======
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
      <section className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recurring Deposits
        </h2>
        {deposits.map((deposit, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg">
                <FaMoneyBillWave className="text-[#538d2dfd] mx-2" />
                <input
                  type="text"
                  placeholder="Bank Name"
                  className="border-0 rounded-md p-3 w-full bg-transparent"
                  value={deposit.bankName}
                  onChange={(e) =>
                    handleDepositChange(index, "bankName", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg">
                <FaMoneyBillWave className="text-[#538d2dfd] mx-2" />
                <input
                  type="number"
                  placeholder="Deposit Amount"
                  className="border-0 rounded-md p-3 w-full bg-transparent"
                  value={deposit.depositAmount}
                  onChange={(e) =>
                    handleDepositChange(index, "depositAmount", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg">
                <FaCalendarAlt className="text-[#538d2dfd] mx-2" />
                <input
                  type="number"
                  placeholder="Tenure (months)"
                  className="border-0 rounded-md p-3 w-full bg-transparent"
                  value={deposit.tenure}
                  onChange={(e) =>
                    handleDepositChange(index, "tenure", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg">
                <FaMoneyBillWave className="text-[#538d2dfd] mx-2" />
                <input
                  type="number"
                  placeholder="Maturity Amount"
                  className="border-0 rounded-md p-3 w-full bg-transparent"
                  value={deposit.maturityAmount}
                  onChange={(e) =>
                    handleDepositChange(index, "maturityAmount", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md col-span-2 shadow-lg">
                <FaCalendarAlt className="text-[#538d2dfd] mx-2" />
                <input
                  type="date"
                  className="border-0 rounded-md p-3 w-full bg-transparent"
                  value={deposit.startDate}
                  onChange={(e) =>
                    handleDepositChange(index, "startDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addDeposit}
          className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md mt-4"
        >
          <FaPlus className="inline mx-2" /> Add Deposit
        </button>
      </section>

      {/* Beneficiary Information */}

      {/* Educational Resources */}
      <section className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Educational Resources
        </h2>
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
      </section>
    </div>
>>>>>>> 39b1eb9170ace7280ba46888fbe7db35233820ca
  );
}

export default RecurringDepositManagement;
