import React, { useState } from "react";
import { FaPlus, FaFileUpload } from "react-icons/fa";

function RealEstateManagement() {
  const [properties, setProperties] = useState([
    { type: "", location: "", size: "", purchaseValue: "", currentValue: "" },
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

  // Add a new property
  const addProperty = () => {
    setProperties([
      ...properties,
      { type: "", location: "", size: "", purchaseValue: "", currentValue: "" },
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

  // Handle changes for property fields
  const handlePropertyChange = (index, field, value) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = value;
    setProperties(updatedProperties);
  };

  // Handle changes for beneficiary fields
  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  return (
    <div className="min-h-screen bg-[#3d5e27fd] text-white p-6 rounded-xl">
      <header className="mb-8 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Real Estate
        </h1>
        <p className="text-gray-600 ">
          Effortlessly manage your real estate properties with a user-friendly
          interface.
        </p>
      </header>

        {/* Property Section */}
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Properties
          </h2>
          {properties.map((property, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={property.type}
                  onChange={(e) =>
                    handlePropertyChange(index, "type", e.target.value)
                  }
                >
                  <option value="">Select Property Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Vacant Land">Vacant Land</option>
                  <option value="Agricultural">Agricultural</option>
                </select>
                <input
                  type="text"
                  placeholder="Location and Address"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={property.location}
                  onChange={(e) =>
                    handlePropertyChange(index, "location", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Society Name"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={property.society}
                  onChange={(e) =>
                    handlePropertyChange(index, "society", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Size (sq ft)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={property.size}
                  onChange={(e) =>
                    handlePropertyChange(index, "size", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Purchase Value"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={property.purchaseValue}
                  onChange={(e) =>
                    handlePropertyChange(index, "purchaseValue", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Current Value"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={property.currentValue}
                  onChange={(e) =>
                    handlePropertyChange(index, "currentValue", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={addProperty}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Property
          </button>
        </section>

        {/* Beneficiary Information */}
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
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
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Document Upload
          </h2>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600">
            <FaFileUpload className="inline mr-2" /> Upload Documents
          </button>
        </section>

        {/* Educational Resources */}
        <section className="mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Educational Resources
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Stay informed on property acquisition and transfer.
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
  );
}

export default RealEstateManagement;
