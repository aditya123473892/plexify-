import React, { useState } from "react";

function Liabilities() {
  const [selectedType, setSelectedType] = useState("Home Loan");

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="min-h-screen bg-[#3d5e27fd] text-white p-6 rounded-xl">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Your Liabilities</h1>
        <p className="text-white mt-2">
          Easily add, view, and manage your liabilities with helpful features.
        </p>
      </header>

      {/* Liability Types */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">Select Liability Type</h2>
        <select
          className="border border-[#2f7004fd] p-2 rounded-md w-full bg-[#3d5e27fd] outline-0"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option>Home Loan</option>
          <option>Personal Loan</option>
          <option>Vehicle Loan</option>
          <option>Education Loan</option>
          <option>Business Loan</option>
          <option>Other Liabilities</option>
        </select>
      </section>

      {/* Dynamic Form Sections */}
      {selectedType === "Home Loan" && (
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Assign Home Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Bank/Institution Name</label>
              <input type="text" placeholder="Bank/Institution Name" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Amount</label>
              <input type="number" placeholder="Loan Amount" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Account Number</label>
              <input type="text" placeholder="Account Number" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Tenure (Years)</label>
              <input type="number" placeholder="Loan Tenure (Years)" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Interest Rate (%)</label>
              <input type="number" placeholder="Interest Rate (%)" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
          </div>
        </section>
      )}

      {selectedType === "Personal Loan" && (
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Assign Personal Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Bank/Institution Name</label>
              <input type="text" placeholder="Bank/Institution Name" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Amount</label>
              <input type="number" placeholder="Loan Amount" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Purpose</label>
              <input type="text" placeholder="Loan Purpose" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Interest Rate (%)</label>
              <input type="number" placeholder="Interest Rate (%)" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
          </div>
        </section>
      )}

      {selectedType === "Vehicle Loan" && (
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Assign Vehicle Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Bank/Institution Name</label>
              <input type="text" placeholder="Bank/Institution Name" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Amount</label>
              <input type="number" placeholder="Loan Amount" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Vehicle Type/Model</label>
              <input type="text" placeholder="Vehicle Type/Model" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Tenure (Years)</label>
              <input type="number" placeholder="Loan Tenure (Years)" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
          </div>
        </section>
      )}

      {selectedType === "Education Loan" && (
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Assign Education Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Bank/Institution Name</label>
              <input type="text" placeholder="Bank/Institution Name" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Amount</label>
              <input type="number" placeholder="Loan Amount" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Course/Institution</label>
              <input type="text" placeholder="Course/Institution" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Interest Rate (%)</label>
              <input type="number" placeholder="Interest Rate (%)" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
          </div>
        </section>
      )}

      {selectedType === "Business Loan" && (
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Assign Business Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Bank/Financial Institution</label>
              <input type="text" placeholder="Bank/Financial Institution" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Amount</label>
              <input type="number" placeholder="Loan Amount" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Details</label>
              <input type="text" placeholder="Loan Details" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Loan Period (Years)</label>
              <input type="text" placeholder="Loan Period (Years)" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
          </div>
        </section>
      )}

      {selectedType === "Other Liabilities" && (
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Other Liabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Liability Description</label>
              <input type="text" placeholder="Description of Other Liability" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Amount</label>
              <input type="number" placeholder="Amount" className="border border-gray-300 p-2 rounded-md w-full" />
            </div>
          </div>
        </section>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button className="bg-[#4e7a30fd] text-white py-2 px-4 rounded hover:bg-[#345220fd] transition duration-300">
          Submit Liabilities
        </button>
      </div>
    </div>
  );
}

export default Liabilities;
