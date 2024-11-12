import React, { useState } from "react";
import { FaPlus, FaFileUpload } from "react-icons/fa";

function PreciousMetalsInheritanceManagement() {
  const [metals, setMetals] = useState([
    { metalType: "", weight: "", purchasePrice: "", currentValue: "" },
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

  // Add a new metal entry
  const addMetal = () => {
    setMetals([
      ...metals,
      { metalType: "", weight: "", purchasePrice: "", currentValue: "" },
    ]);
  };

  // Add a new beneficiary
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

  // Handle changes for metal fields
  const handleMetalChange = (index, field, value) => {
    const updatedMetals = [...metals];
    updatedMetals[index][field] = value;
    setMetals(updatedMetals);
  };

  // Handle changes for beneficiary fields
  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Precious Metals Inheritance
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Organize and designate beneficiaries for your precious metal assets.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Precious Metals Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Precious Metals
          </h2>
          {metals.map((metal, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={metal.metalType}
                  onChange={(e) =>
                    handleMetalChange(index, "metalType", e.target.value)
                  }
                >
                  <option value="">Select Metal Type</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Palladium">Palladium</option>
                </select>
                <input
                  type="number"
                  placeholder="Weight (grams)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={metal.weight}
                  onChange={(e) =>
                    handleMetalChange(index, "weight", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Purchase Price (₹)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={metal.purchasePrice}
                  onChange={(e) =>
                    handleMetalChange(index, "purchasePrice", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Current Value (₹)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={metal.currentValue}
                  onChange={(e) =>
                    handleMetalChange(index, "currentValue", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={addMetal}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Metal
          </button>
        </section>

        {/* Beneficiary Information */}
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

        {/* Document Upload */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Document Upload
          </h2>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600">
            <FaFileUpload className="inline mr-2" /> Upload Documents
          </button>
        </section>

        {/* Educational Resources */}
        <section className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Educational Resources
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Learn about investing and transferring precious metals.
          </p>
          <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600">
            Explore Resources
          </button>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-green-600 text-white py-3 px-8 rounded-md shadow-md hover:bg-green-700 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreciousMetalsInheritanceManagement;
