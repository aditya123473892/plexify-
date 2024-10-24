import React from 'react';

function Home() {
  return (
<>
<div className="">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-white">Overview of key metrics and stats</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Beneficiaries */}
        <div className="bg-[#3d5e27fd] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Total Beneficiaries</h3>
          <p className="text-3xl font-bold text-green-600 mt-4">42</p>
        </div>

        {/* Documents Uploaded */}
        <div className="bg-[#3d5e27fd] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Documents Uploaded</h3>
          <p className="text-3xl font-bold text-blue-600 mt-4">128</p>
        </div>

        {/* Pending Entitlements */}
        <div className="bg-[#3d5e27fd] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Pending Entitlements</h3>
          <p className="text-3xl font-bold text-red-600 mt-4">5</p>
        </div>

        {/* Percentage Distributed */}
        <div className="bg-[#3d5e27fd] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">Entitlement Percentage Distributed</h3>
          <p className="text-3xl font-bold text-purple-600 mt-4">78%</p>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Recent Beneficiaries */}
        <div className="bg-[#3d5e27fd] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Recent Beneficiaries</h3>
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between text-white">
              <span>John Doe</span>
              <span className="text-white">Beneficiary</span>
            </li>
            <li className="flex justify-between text-white">
              <span>Jane Smith</span>
              <span className="text-white">Beneficiary</span>
            </li>
            <li className="flex justify-between text-white">
              <span>Michael Lee</span>
              <span className="text-white">Beneficiary</span>
            </li>
            <li className="flex justify-between text-white">
              <span>Sarah Davis</span>
              <span className="text-white">Beneficiary</span>
            </li>
          </ul>
        </div>

        {/* Recent Document Uploads */}
        <div className="bg-[#3d5e27fd] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Recent Document Uploads</h3>
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between text-white">
              <span>Policy Document.pdf</span>
              <span className="text-white">1 day ago</span>
            </li>
            <li className="flex justify-between text-white">
              <span>Identity Proof.pdf</span>
              <span className="text-white">2 days ago</span>
            </li>
            <li className="flex justify-between text-white">
              <span>Nomination Form.pdf</span>
              <span className="text-white">3 days ago</span>
            </li>
            <li className="flex justify-between text-white">
              <span>Address Proof.pdf</span>
              <span className="text-white">4 days ago</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Entitlement Distribution Chart (Placeholder) */}
      <div className="bg-[#3d5e27fd] p-6 rounded-lg shadow-lg mt-10">
        <h3 className="text-xl font-semibold text-white">Entitlement Distribution</h3>
        <p className="text-white mt-2">Graphical representation of entitlement distribution</p>
        {/* Insert chart here (e.g., using a chart library like Chart.js or Recharts) */}
        <div className="mt-6 bg-[#69c42c9f] h-64 rounded-lg"></div>
      </div>
    </div>
</>
  );
}

export default Home;
