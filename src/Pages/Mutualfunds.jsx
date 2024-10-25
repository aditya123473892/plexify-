// src/pages/MutualFundsManagement.js
import React, { useState } from "react";
import { FaPlus, FaFileUpload } from "react-icons/fa";

function MutualFundsManagement() {
  const [funds, setFunds] = useState([
    {
      fundName: "",
      fundManager: "",
      investmentAmount: "",
      currentValue: "",
      fundType: "",
      riskLevel: "",
      notify: false,
    },
  ]);

  const addFund = () => {
    setFunds([
      ...funds,
      {
        fundName: "",
        fundManager: "",
        investmentAmount: "",
        currentValue: "",
        fundType: "",
        riskLevel: "",
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
          Manage Your Mutual Funds
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Keep track of your mutual fund investments easily.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Mutual Funds
          </h2>
          {funds.map((fund, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Fund Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.fundName}
                  onChange={(e) =>
                    handleFundChange(index, "fundName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Fund Manager"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.fundManager}
                  onChange={(e) =>
                    handleFundChange(index, "fundManager", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Investment Amount"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.investmentAmount}
                  onChange={(e) =>
                    handleFundChange(index, "investmentAmount", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Current Value"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.currentValue}
                  onChange={(e) =>
                    handleFundChange(index, "currentValue", e.target.value)
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
                  <option value="Equity">Equity</option>
                  <option value="Debt">Debt</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={fund.riskLevel}
                  onChange={(e) =>
                    handleFundChange(index, "riskLevel", e.target.value)
                  }
                >
                  <option value="">Select Risk Level</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
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
            <FaPlus className="inline mr-2" /> Add Mutual Fund
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
            Learn more about mutual fund management.
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

export default MutualFundsManagement;
