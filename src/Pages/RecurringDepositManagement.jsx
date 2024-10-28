import React, { useState } from "react";
import { FaPlus, FaFileUpload } from "react-icons/fa";

function RecurringDepositManagement() {
  const [deposits, setDeposits] = useState([
    { bankName: "", depositAmount: "", tenure: "", maturityAmount: "", startDate: "" },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([
    { name: "", contact: "", email: "", entitlement: "", relationship: "", notify: false },
  ]);

  // Add a new deposit
  const addDeposit = () => {
    setDeposits([
      ...deposits,
      { bankName: "", depositAmount: "", tenure: "", maturityAmount: "", startDate: "" },
    ]);
  };

  // Add a new beneficiary
  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      { name: "", contact: "", email: "", entitlement: "", relationship: "", notify: false },
    ]);
  };

  // Handle changes for deposit fields
  const handleDepositChange = (index, field, value) => {
    const updatedDeposits = [...deposits];
    updatedDeposits[index][field] = value;
    setDeposits(updatedDeposits);
  };

  // Handle changes for beneficiary fields
  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  return (
    <div className="min-h-screen bg-[#3d5e27fd] text-white p-6 rounded-xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Recurring Deposits</h1>
        <p className="text-gray-600">
          Effortlessly manage your recurring deposits and keep track of beneficiary details.
        </p>
      </header>

      {/* Deposit Section */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recurring Deposits</h2>
        {deposits.map((deposit, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Bank Name"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={deposit.bankName}
                onChange={(e) => handleDepositChange(index, "bankName", e.target.value)}
              />
              <input
                type="number"
                placeholder="Deposit Amount"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={deposit.depositAmount}
                onChange={(e) => handleDepositChange(index, "depositAmount", e.target.value)}
              />
              <input
                type="number"
                placeholder="Tenure (months)"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={deposit.tenure}
                onChange={(e) => handleDepositChange(index, "tenure", e.target.value)}
              />
              <input
                type="number"
                placeholder="Maturity Amount"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={deposit.maturityAmount}
                onChange={(e) => handleDepositChange(index, "maturityAmount", e.target.value)}
              />
              <input
                type="date"
                placeholder="Start Date"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={deposit.startDate}
                onChange={(e) => handleDepositChange(index, "startDate", e.target.value)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addDeposit}
          className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md  mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Deposit
        </button>
      </section>

      {/* Beneficiary Information */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Beneficiary Information</h2>
        {beneficiaries.map((beneficiary, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Beneficiary Name"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={beneficiary.name}
                onChange={(e) => handleBeneficiaryChange(index, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Contact Number"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={beneficiary.contact}
                onChange={(e) => handleBeneficiaryChange(index, "contact", e.target.value)}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={beneficiary.email}
                onChange={(e) => handleBeneficiaryChange(index, "email", e.target.value)}
              />
              <input
                type="text"
                placeholder="Percentage of Entitlement"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={beneficiary.entitlement}
                onChange={(e) => handleBeneficiaryChange(index, "entitlement", e.target.value)}
              />
              <input
                type="text"
                placeholder="Relationship"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={beneficiary.relationship}
                onChange={(e) => handleBeneficiaryChange(index, "relationship", e.target.value)}
              />
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={beneficiary.notify}
                  onChange={(e) => handleBeneficiaryChange(index, "notify", e.target.checked)}
                />
                Notify by Email
              </label>
            </div>
          </div>
        ))}
        <button
          onClick={addBeneficiary}
          className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md  mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Beneficiary
        </button>
      </section>

      {/* Educational Resources */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md flex flex-col items-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Educational Resources</h3>
        <p className="text-gray-600 text-center mb-4">
          Stay informed on recurring deposit management and growth strategies.
        </p>
        <button className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md ">
          Explore Resources
        </button>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-3 px-8 rounded-md shadow-md  transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default RecurringDepositManagement;
