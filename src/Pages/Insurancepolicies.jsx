import React from "react";

function InsurancePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Your Insurance Policies
        </h1>
        <p className="text-gray-600 mt-2">
          Easily add, view, and manage your insurance policies with helpful
          features.
        </p>
      </header>

      {/* Add Policy Button */}
      <div className="mb-6">
        <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600">
          Add New Policy
        </button>
      </div>

      {/* Policy Types */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Select Policy Type
        </h2>
        <select className="border border-gray-300 p-2 rounded-md w-full">
          <option>Life Insurance</option>
          <option>Health Insurance</option>
          <option>Car Insurance</option>
          <option>Home Insurance</option>
        </select>
      </section>

      {/* Policy Details */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Policy Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Policy Name"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Policy Number"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Provider (e.g. LIC)"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Policy Period"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Premium Amount"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Coverage Limit"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Maturity Amount"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
      </section>

      {/* Additional Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Renewal Reminders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">
            Renewal Reminders
          </h3>
          <p className="text-gray-600 mt-2">
            Set reminders for upcoming policy renewals.
          </p>
          <button className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-blue-600">
            Add Reminder
          </button>
        </div>

        {/* Nominee Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">
            Nominee Information
          </h3>
          <p className="text-gray-600 mt-2">
            Enter details for policy beneficiaries.
          </p>
          <button className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-blue-600">
            Add Nominee
          </button>
        </div>
      </section>

      {/* Upload Documents */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Document Upload
        </h2>
        <p className="text-gray-600 mb-4">
          Upload scanned copies of policy documents for safekeeping.
        </p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600">
          Upload Documents
        </button>
      </section>

      {/* Educational Resources and Calculator */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">
            Educational Resources
          </h3>
          <p className="text-gray-600 mt-2">
            Learn more about insurance policies and coverage.
          </p>
          <button className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-blue-600">
            Explore Resources
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">
            Insurance Calculator
          </h3>
          <p className="text-gray-600 mt-2">
            Calculate premium, maturity, and other insurance metrics.
          </p>
          <button className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-blue-600">
            Open Calculator
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="text-right">
        <button className="bg-green-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-green-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default InsurancePage;
