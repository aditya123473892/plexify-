import React, { useState } from "react";
import { FaPlus, FaFileUpload } from "react-icons/fa";

function BusinessInheritanceManagement() {
  const [businesses, setBusinesses] = useState([
    {
      name: "",
      location: "",
      industry: "",
      value: "",
      ownershipPercentage: "",
      type: "",
    },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([
    {
      name: "",
      contact: "",
      email: "",
      entitlement: "",
      relationship: "",
      notify: false,
    },
  ]);

  const addBusiness = () => {
    setBusinesses([
      ...businesses,
      {
        name: "",
        location: "",
        industry: "",
        value: "",
        ownershipPercentage: "",
        type: "",
      },
    ]);
  };

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        name: "",
        contact: "",
        email: "",
        entitlement: "",
        relationship: "",
        notify: false,
      },
    ]);
  };

  const handleBusinessChange = (index, field, value) => {
    const updatedBusinesses = [...businesses];
    updatedBusinesses[index][field] = value;
    setBusinesses(updatedBusinesses);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Business Inheritance
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Easily manage your business assets and designate beneficiaries.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Businesses
          </h2>
          {businesses.map((business, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={business.type}
                  onChange={(e) =>
                    handleBusinessChange(index, "type", e.target.value)
                  }
                >
                  <option value="">Select Business Type</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="LLP">LLP</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="Others">Others</option>
                </select>
                <input
                  type="text"
                  placeholder="Location"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={business.location}
                  onChange={(e) =>
                    handleBusinessChange(index, "location", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Industry"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={business.industry}
                  onChange={(e) =>
                    handleBusinessChange(index, "industry", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Current Business Value"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={business.value}
                  onChange={(e) =>
                    handleBusinessChange(index, "value", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Ownership Percentage"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={business.ownershipPercentage}
                  onChange={(e) =>
                    handleBusinessChange(
                      index,
                      "ownershipPercentage",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={addBusiness}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Business
          </button>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Beneficiary Information
          </h2>
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Beneficiary Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.name}
                  onChange={(e) =>
                    handleBeneficiaryChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.contact}
                  onChange={(e) =>
                    handleBeneficiaryChange(index, "contact", e.target.value)
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.email}
                  onChange={(e) =>
                    handleBeneficiaryChange(index, "email", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Percentage of Entitlement"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.entitlement}
                  onChange={(e) =>
                    handleBeneficiaryChange(
                      index,
                      "entitlement",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={beneficiary.relationship}
                  onChange={(e) =>
                    handleBeneficiaryChange(
                      index,
                      "relationship",
                      e.target.value
                    )
                  }
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={beneficiary.notify}
                    onChange={(e) =>
                      handleBeneficiaryChange(index, "notify", e.target.checked)
                    }
                  />
                  Notify by Email
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addBeneficiary}
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Beneficiary
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
            Learn more about business inheritance and succession planning.
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

export default BusinessInheritanceManagement;
