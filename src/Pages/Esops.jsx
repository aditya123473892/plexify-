import React from "react";

function Esops() {
  return (
    <div className="min-h-screen bg-[#3d5e27fd] text-white p-6 rounded-xl">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Adding ESOP
        </h1>
        <p className="text-white mt-2">
          Easily add your ESOP details with helpful features.
        </p>
      </header>

      {/* ESOP Details */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          ESOP Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Policy Name */}
          <div>
            <label htmlFor="policyName" className="block text-sm font-medium text-white mb-1">
              Policy Name
            </label>
            <input
              id="policyName"
              type="text"
              placeholder="e.g., ICICI Pru Easy Retirement"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          
          {/* Units Granted */}
          <div>
            <label htmlFor="unitsGranted" className="block text-sm font-medium text-white mb-1">
              Number of Units Granted
            </label>
            <input
              id="unitsGranted"
              type="text"
              placeholder="e.g., 1000"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          
          {/* Vested ESOPs */}
          <div>
            <label htmlFor="vestedEsops" className="block text-sm font-medium text-white mb-1">
              Number of Vested ESOPs
            </label>
            <input
              id="vestedEsops"
              type="text"
              placeholder="e.g., 700"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          
          {/* Unvested ESOPs */}
          <div>
            <label htmlFor="unvestedEsops" className="block text-sm font-medium text-white mb-1">
              Number of Unvested ESOPs
            </label>
            <input
              id="unvestedEsops"
              type="text"
              placeholder="e.g., 300"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="text-right">
        <button className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Esops;
