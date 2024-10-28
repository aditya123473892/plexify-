import React, { useState } from "react";
import { FaPlus, FaTrash, FaFileUpload } from "react-icons/fa";

function SafetyDepositsInheritanceManagement() {
  const [deposits, setDeposits] = useState([
    {
      location: "",
      boxNumber: "",
      contentsDescription: "",
      accessInstructions: "",
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

  // Add a new safety deposit entry
  const addDeposit = () => {
    setDeposits([
      ...deposits,
      {
        location: "",
        boxNumber: "",
        contentsDescription: "",
        accessInstructions: "",
      },
    ]);
  };

  // Remove a safety deposit entry
  const removeDeposit = (index) => {
    const updatedDeposits = deposits.filter((_, i) => i !== index);
    setDeposits(updatedDeposits);
  };

  // Add a new beneficiary
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

  // Remove a beneficiary entry
  const removeBeneficiary = (index) => {
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    setBeneficiaries(updatedBeneficiaries);
  };

  // Handle changes for safety deposit fields
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
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Safety Deposit Inheritance
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Organize your safety deposit boxes and designate beneficiaries.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Safety Deposit Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Safety Deposit Boxes
          </h2>
          {deposits.map((deposit, index) => (
            <div key={index} className="mb-4 border-b pb-4 relative">
              <button
                onClick={() => removeDeposit(index)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-2"
              >
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Location (e.g., Bank Branch)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={deposit.location}
                  onChange={(e) =>
                    handleDepositChange(index, "location", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Box Number"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={deposit.boxNumber}
                  onChange={(e) =>
                    handleDepositChange(index, "boxNumber", e.target.value)
                  }
                />
                <textarea
                  placeholder="Contents Description"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={deposit.contentsDescription}
                  onChange={(e) =>
                    handleDepositChange(
                      index,
                      "contentsDescription",
                      e.target.value
                    )
                  }
                />
                <textarea
                  placeholder="Access Instructions (e.g., key location)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={deposit.accessInstructions}
                  onChange={(e) =>
                    handleDepositChange(
                      index,
                      "accessInstructions",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={addDeposit}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Safety Deposit Box
          </button>
        </section>

        {/* Beneficiary Information */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Beneficiary Information
          </h2>
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="mb-4 border-b pb-4 relative">
              <button
                onClick={() => removeBeneficiary(index)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-2"
              >
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Beneficiary Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.name}
                  onChange={(e) =>
                    handleBeneficiaryChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.contact}
                  onChange={(e) =>
                    handleBeneficiaryChange(index, "contact", e.target.value)
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.email}
                  onChange={(e) =>
                    handleBeneficiaryChange(index, "email", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Percentage of Entitlement"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.entitlement}
                  onChange={(e) =>
                    handleBeneficiaryChange(
                      index,
                      "entitlement",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.relationship}
                  onChange={(e) =>
                    handleBeneficiaryChange(
                      index,
                      "relationship",
                      e.target.value
                    )
                  }
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={beneficiary.notify}
                    onChange={(e) =>
                      handleBeneficiaryChange(index, "notify", e.target.checked)
                    }
                  />
                  Notify by Email
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addBeneficiary}
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Beneficiary
          </button>
        </section>

        {/* Document Upload */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Document Upload
          </h2>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600">
            <FaFileUpload className="inline mr-2" /> Upload Documents
          </button>
        </section>

        {/* Educational Resources */}
        <section className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Educational Resources
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Learn more about managing safety deposit boxes and inheritance.
          </p>
          <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600">
            Explore Resources
          </button>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-green-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-green-700 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SafetyDepositsInheritanceManagement;
