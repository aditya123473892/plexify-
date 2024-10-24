import React from 'react'

function Beneficiary() {
  return (
<>
  <div className="mx-auto p-6  rounded-2xl bg-[#3d5e27fd] min-h-96">
    <h1 className="text-3xl font-bold mb-8 text-white">Beneficiary Information</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label className="block text-white">Beneficiary Name</label>
        <input
          type="text"
          name="beneficiaryName"
          placeholder="Enter beneficiary name"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>
      <div>
        <label className="block text-white">Aadhaar Number</label>
        <input
          type="text"
          name="aadhaarNumber"
          placeholder="Enter Aadhaar number"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>

      <div>
        <label className="block text-white">Contact Number</label>
        <input
          type="text"
          name="beneficiaryContact"
          placeholder="Enter contact number"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>
      <div>
        <label className="block text-white">Email Address</label>
        <input
          type="email"
          name="beneficiaryEmail"
          placeholder="Enter email address"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-white">Address</label>
        <input
          type="text"
          name="beneficiaryAddress"
          placeholder="Enter full address"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>

      <div>
        <label className="block text-white">Relationship to Policyholder</label>
        <input
          type="text"
          name="relationship"
          placeholder="Enter relationship"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>
      <div>
        <label className="block text-white">Date of Birth</label>
        <input
          type="date"
          name="beneficiaryDob"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>

      <div>
        <label className="block text-white">ID/Passport Number</label>
        <input
          type="text"
          name="beneficiaryId"
          placeholder="Enter ID or passport number"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>
      <div>
        <label className="block text-white">Percentage of Entitlement</label>
        <input
          type="text"
          name="entitlementPercentage"
          placeholder="Enter percentage"
          className="w-full p-3 border border-gray-300 rounded-md shadow-lg"
        />
      </div>
    </div>

    <h2 className="text-2xl font-bold mb-4 text-white">Document Upload</h2>
    <div className="mb-6">
      <input
        type="file"
        multiple
        className="block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>

    <h2 className="text-2xl font-bold mb-4 text-white">Premium Calculator</h2>
    <button className="bg-[#466d2c] text-white px-6 py-2 rounded-md hover:bg-[#233615] transition text shadow-xl">
      Calculate your Premium
    </button>
    <button className="bg-[#466d2b] text-white px-6 py-2 rounded-md hover:bg-[#233615] transition mx-5 shadow-xl">
      Submit Form
    </button>
  </div>
</>

  
  )
}

export default Beneficiary
