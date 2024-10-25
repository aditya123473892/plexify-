import React, { useState } from "react";
import { FaPlus, FaFileUpload, FaCalculator } from "react-icons/fa";

function BankAccounts() {
  const [accountTypes, setAccountTypes] = useState([
    {
      type: "",
      accountNo: "",
      branch: "",
      ifsc: "",
      swift: "",
      accountMode: "Single",
    },
  ]);
  const [nominees, setNominees] = useState([
    {
      name: "",
      contact: "",
      email: "",
      entitlement: "",
      relationship: "",
      notify: false,
    },
  ]);

  const addAccountType = () => {
    setAccountTypes([
      ...accountTypes,
      {
        type: "",
        accountNo: "",
        branch: "",
        ifsc: "",
        swift: "",
        accountMode: "Single",
      },
    ]);
  };

  const addNominee = () => {
    setNominees([
      ...nominees,
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

  const handleAccountTypeChange = (index, field, value) => {
    const updatedAccounts = [...accountTypes];
    updatedAccounts[index][field] = value;
    setAccountTypes(updatedAccounts);
  };

  const handleNomineeChange = (index, field, value) => {
    const updatedNominees = [...nominees];
    updatedNominees[index][field] = value;
    setNominees(updatedNominees);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Bank Accounts
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Effortlessly manage your bank accounts with a user-friendly interface.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Account Types */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Account Types
          </h2>
          {accountTypes.map((account, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.type}
                  onChange={(e) =>
                    handleAccountTypeChange(index, "type", e.target.value)
                  }
                >
                  <option value="">Select Account Type</option>
                  <option value="Saving">Saving</option>
                  <option value="Current">Current</option>
                  <option value="FD">Fixed Deposit</option>
                  <option value="Recurring">Recurring Deposit</option>
                </select>
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.bank}
                  onChange={(e) =>
                    handleAccountTypeChange(index, "bank", e.target.value)
                  }
                >
                  <option value="">Select Bank</option>
                  <option value="SBI">SBI</option>
                  <option value="HDFC">HDFC</option>
                  <option value="ICICI">ICICI</option>
                  <option value="Axis">Axis</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Account Number"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.accountNo}
                  onChange={(e) =>
                    handleAccountTypeChange(index, "accountNo", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Branch Name & Address"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.branch}
                  onChange={(e) =>
                    handleAccountTypeChange(index, "branch", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.ifsc}
                  onChange={(e) =>
                    handleAccountTypeChange(index, "ifsc", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="SWIFT Code"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.swift}
                  onChange={(e) =>
                    handleAccountTypeChange(index, "swift", e.target.value)
                  }
                />
              </div>
              <div className="mt-4">
                <label className="font-semibold">Account Type:</label>
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.accountMode}
                  onChange={(e) =>
                    handleAccountTypeChange(
                      index,
                      "accountMode",
                      e.target.value
                    )
                  }
                >
                  <option value="Single">Single</option>
                  <option value="Joint">Joint</option>
                </select>
              </div>
            </div>
          ))}
          <button
            onClick={addAccountType}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Account Type
          </button>
        </section>

        {/* Nominee Information */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Nominee Information
          </h2>
          {nominees.map((nominee, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nominee Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={nominee.name}
                  onChange={(e) =>
                    handleNomineeChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={nominee.contact}
                  onChange={(e) =>
                    handleNomineeChange(index, "contact", e.target.value)
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={nominee.email}
                  onChange={(e) =>
                    handleNomineeChange(index, "email", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Percentage of Entitlement"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={nominee.entitlement}
                  onChange={(e) =>
                    handleNomineeChange(index, "entitlement", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={nominee.relationship}
                  onChange={(e) =>
                    handleNomineeChange(index, "relationship", e.target.value)
                  }
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={nominee.notify}
                    onChange={(e) =>
                      handleNomineeChange(index, "notify", e.target.checked)
                    }
                  />
                  Notify by Email
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addNominee}
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Nominee
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

        {/* Educational Resources & Calculator */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Educational Resources
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Explore to stay informed about FD/RD.
            </p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600">
              Explore Resources
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Calculator
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Estimate FD/RD maturity amounts.
            </p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600">
              <FaCalculator className="inline mr-2" /> Open Calculator
            </button>
          </div>
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

export default BankAccounts;
