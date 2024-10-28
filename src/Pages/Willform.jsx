import React from 'react';

const WillForm = () => {
  return (
    <div className="min-h-screen bg-[#3d5e27fd] text-white p-6 rounded-xl">

      <h1 className="text-3xl font-bold text-center mb-6">Last Will and Testament</h1>

      <div className="bg-[#4e7a30fd] shadow-md rounded-lg p-6 space-y-6">
        {/* Personal Information Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Full Name</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Your Full Name" />
            </div>
            <div>
              <label className="block font-medium">Address</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Your Address" />
            </div>
            <div>
              <label className="block font-medium">Father's Full Name</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Father's Full Name" />
            </div>
            <div>
              <label className="block font-medium">Mother's Full Name</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Mother's Full Name" />
            </div>
          </div>
        </section>

        {/* Assets Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Assets</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium">Insurance Policies</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Details like Account No." />
            </div>
            <div>
              <label className="block font-medium">Fixed Deposit</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Details like Account No." />
            </div>
            {/* Add more fields as necessary */}
          </div>
        </section>

        {/* Liabilities Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Liabilities</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium">Home Loan</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Details like Account No." />
            </div>
            <div>
              <label className="block font-medium">Car Loan</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Details like Account No." />
            </div>
            {/* Add more fields as necessary */}
          </div>
        </section>

        {/* Signature Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Signature and Witnesses</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium">Your Full Name</label>
              <input type="text" className="border rounded-lg w-full p-2" placeholder="Your Full Name" />
            </div>
            <div>
              <label className="block font-medium">Date</label>
              <input type="date" className="border rounded-lg w-full p-2" />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="text-center">
        <button className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]">
          Save Changes
        </button>
      </div>
      </div>
    </div>
  );
};

export default WillForm;
