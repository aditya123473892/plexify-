import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// Sample data for the chart
const chartData = [
  { name: 'Beneficiary 1', entitlement: 30 },
  { name: 'Beneficiary 2', entitlement: 45 },
  { name: 'Beneficiary 3', entitlement: 20 },
  { name: 'Beneficiary 4', entitlement: 60 },
  { name: 'Beneficiary 6', entitlement: 5 },
  { name: 'Beneficiary 7', entitlement: 40 },
  { name: 'Beneficiary 8', entitlement: 79 },
  { name: 'Beneficiary 9', entitlement: 66 },
  { name: 'Beneficiary 10', entitlement: 86 },
  { name: 'Beneficiary 11', entitlement: 34 },
  { name: 'Beneficiary 12', entitlement: 98 },
];

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

        {/* Entitlement Distribution Chart */}
        <div className=" p-6 rounded-lg shadow-lg mt-10">
          <h3 className="text-xl font-semibold text-white">Entitlement Distribution</h3>
          <p className="text-white mt-2">Graphical representation of entitlement distribution</p>
          <div className="mt-6">
            <BarChart width={1600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="entitlement" fill="#69c42c9f" />
            </BarChart>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
