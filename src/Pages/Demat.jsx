import React, { useState } from "react";
import { FaPlus, FaFileUpload } from "react-icons/fa";

function DematAccountManagement() {
  const [accounts, setAccounts] = useState([
    {
      holderName: "",
      accountNumber: "",
      depositoryName: "",
      brokerName: "",
      contact: "",
      portfolioValue: "",
      notify: false,
    },
  ]);

  // Add a new Demat account
  const addAccount = () => {
    setAccounts([
      ...accounts,
      {
        holderName: "",
        accountNumber: "",
        depositoryName: "",
        brokerName: "",
        contact: "",
        portfolioValue: "",
        notify: false,
      },
    ]);
  };

  // Handle changes for Demat account fields
  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index][field] = value;
    setAccounts(updatedAccounts);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Demat Accounts
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Efficiently manage your Demat accounts and monitor portfolio value.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Demat Account Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Demat Accounts
          </h2>
          {accounts.map((account, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.holderName}
                  onChange={(e) =>
                    handleAccountChange(index, "holderName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.accountNumber}
                  onChange={(e) =>
                    handleAccountChange(index, "accountNumber", e.target.value)
                  }
                />
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.depositoryName}
                  onChange={(e) =>
                    handleAccountChange(index, "depositoryName", e.target.value)
                  }
                >
                  <option value="">Select Depository</option>
                  <option value="CDSL">CDSL</option>
                  <option value="NSDL">NSDL</option>
                </select>
                <input
                  type="text"
                  placeholder="Broker Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.brokerName}
                  onChange={(e) =>
                    handleAccountChange(index, "brokerName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Contact Information"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.contact}
                  onChange={(e) =>
                    handleAccountChange(index, "contact", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Portfolio Value"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={account.portfolioValue}
                  onChange={(e) =>
                    handleAccountChange(index, "portfolioValue", e.target.value)
                  }
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={account.notify}
                    onChange={(e) =>
                      handleAccountChange(index, "notify", e.target.checked)
                    }
                  />
                  Notify on Updates
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addAccount}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Demat Account
          </button>
        </section>

        {/* Document Upload Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Document Upload
          </h2>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600">
            <FaFileUpload className="inline mr-2" /> Upload Documents
          </button>
        </section>

        {/* Educational Resources Section */}
        <section className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Educational Resources
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Learn more about Demat account management and portfolio growth.
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

export default DematAccountManagement;
