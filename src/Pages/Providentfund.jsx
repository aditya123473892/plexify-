// src/pages/ProvidentFundsManagement.js
import React, { useState } from "react";
import { FaPlus, FaFileUpload } from "react-icons/fa";

function ProvidentFundsManagement() {
  const [funds, setFunds] = useState([
    {
      holderName: "",
      accountNumber: "",
      fundType: "",
      contributionAmount: "",
      currentBalance: "",
      interestRate: "",
      maturityDate: "",
      notify: false,
    },
  ]);

  const addFund = () => {
    setFunds([
      ...funds,
      {
        holderName: "",
        accountNumber: "",
        fundType: "",
        contributionAmount: "",
        currentBalance: "",
        interestRate: "",
        maturityDate: "",
        notify: false,
      },
    ]);
  };

  const handleFundChange = (index, field, value) => {
    const updatedFunds = [...funds];
    updatedFunds[index][field] = value;
    setFunds(updatedFunds);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Provident Funds
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Track your provident fund contributions and balances.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Provident Funds
          </h2>
          {funds.map((fund, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.holderName}
                  onChange={(e) =>
                    handleFundChange(index, "holderName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.accountNumber}
                  onChange={(e) =>
                    handleFundChange(index, "accountNumber", e.target.value)
                  }
                />
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.fundType}
                  onChange={(e) =>
                    handleFundChange(index, "fundType", e.target.value)
                  }
                >
                  <option value="">Select Fund Type</option>
                  <option value="EPF">EPF</option>
                  <option value="PPF">PPF</option>
                </select>
                <input
                  type="number"
                  placeholder="Contribution Amount"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.contributionAmount}
                  onChange={(e) =>
                    handleFundChange(
                      index,
                      "contributionAmount",
                      e.target.value
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Current Balance"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.currentBalance}
                  onChange={(e) =>
                    handleFundChange(index, "currentBalance", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Interest Rate (%)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.interestRate}
                  onChange={(e) =>
                    handleFundChange(index, "interestRate", e.target.value)
                  }
                />
                <input
                  type="date"
                  placeholder="Maturity Date"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.maturityDate}
                  onChange={(e) =>
                    handleFundChange(index, "maturityDate", e.target.value)
                  }
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={fund.notify}
                    onChange={(e) =>
                      handleFundChange(index, "notify", e.target.checked)
                    }
                  />
                  Notify on Updates
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addFund}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Provident Fund
          </button>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Document Upload
          </h2>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600">
            <FaFileUpload className="inline mr-2" /> Upload Documents
          </button>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Educational Resources
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Get insights on provident fund management and growth.
          </p>
          <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600">
            Explore Resources
          </button>
        </section>

        <div className="flex justify-end">
          <button className="bg-green-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-green-700 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProvidentFundsManagement;
