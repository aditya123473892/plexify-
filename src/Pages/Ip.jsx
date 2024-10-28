import React from "react";

function Ip() {
  return (
    <div className="min-h-screen bg-[#3d5e27fd] text-white p-6 rounded-xl">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Adding Intellectual Property</h1>
        <p className="text-white mt-2">Easily add your Intellectual Property details with helpful features.</p>
      </header>

      {/* Intellectual Property Details */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">Intellectual Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ipName" className="block text-sm font-medium text-white mb-1">Property Name</label>
            <input
              id="ipName"
              type="text"
              placeholder="e.g., Company Trademark"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          <div>
            <label htmlFor="ipType" className="block text-sm font-medium text-white mb-1">Property Type</label>
            <input
              id="ipType"
              type="text"
              placeholder="e.g., Trademark"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-white mb-1">Registration Number</label>
            <input
              id="registrationNumber"
              type="text"
              placeholder="e.g., 12345"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
        </div>
      </section>

      {/* Exclusive Product */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">Exclusive Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-white mb-1">Product Name</label>
            <input
              id="productName"
              type="text"
              placeholder="e.g., Software Suite"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-white mb-1">License Number</label>
            <input
              id="licenseNumber"
              type="text"
              placeholder="e.g., LIC-98765"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
        </div>
      </section>

      {/* Invention */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">Invention</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="inventionName" className="block text-sm font-medium text-white mb-1">Invention Name</label>
            <input
              id="inventionName"
              type="text"
              placeholder="e.g., New Engine Design"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          <div>
            <label htmlFor="patentNumber" className="block text-sm font-medium text-white mb-1">Patent Number</label>
            <input
              id="patentNumber"
              type="text"
              placeholder="e.g., PAT-123456"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
        </div>
      </section>

      {/* Software */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">Software</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="softwareName" className="block text-sm font-medium text-white mb-1">Software Name</label>
            <input
              id="softwareName"
              type="text"
              placeholder="e.g., Productivity Suite"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          <div>
            <label htmlFor="softwareVersion" className="block text-sm font-medium text-white mb-1">Version</label>
            <input
              id="softwareVersion"
              type="text"
              placeholder="e.g., 3.1"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
        </div>
      </section>

      {/* Website Content */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">Website Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contentTitle" className="block text-sm font-medium text-white mb-1">Content Title</label>
            <input
              id="contentTitle"
              type="text"
              placeholder="e.g., Blog Article"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-white mb-1">URL</label>
            <input
              id="url"
              type="url"
              placeholder="e.g., https://example.com/article"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
        </div>
      </section>

      {/* Secret Formula */}
      <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">Secret Formula</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="formulaName" className="block text-sm font-medium text-white mb-1">Formula Name</label>
            <input
              id="formulaName"
              type="text"
              placeholder="e.g., Product Compound Formula"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-1">Description</label>
            <textarea
              id="description"
              placeholder="Provide a brief description"
              className="border border-gray-300 p-2 rounded-md w-full text-black"
            />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="text-right">
        <button className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]">Save Changes</button>
      </div>
    </div>
  );
}

export default Ip;
