import React, { useState } from "react";
import { FaPlus, FaTrash, FaFileUpload } from "react-icons/fa";

function VehicleInheritanceManagement() {
  const [vehicles, setVehicles] = useState([
    { make: "", model: "", year: "", vin: "", value: "", mileage: "" },
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

  // Add a new vehicle entry
  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      { make: "", model: "", year: "", vin: "", value: "", mileage: "" },
    ]);
  };

  // Remove a vehicle entry
  const removeVehicle = (index) => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);
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

  // Remove a beneficiary entry
  const removeBeneficiary = (index) => {
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    setBeneficiaries(updatedBeneficiaries);
  };

  // Handle changes for vehicle fields
  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][field] = value;
    setVehicles(updatedVehicles);
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
          Manage Your Vehicle Inheritance
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Organize your vehicle assets and designate beneficiaries.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Vehicle Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Vehicles
          </h2>
          {vehicles.map((vehicle, index) => (
            <div key={index} className="mb-4 border-b pb-4 relative">
              <button
                onClick={() => removeVehicle(index)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-2"
              >
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Make (e.g., Toyota)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={vehicle.make}
                  onChange={(e) =>
                    handleVehicleChange(index, "make", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Model (e.g., Camry)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={vehicle.model}
                  onChange={(e) =>
                    handleVehicleChange(index, "model", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={vehicle.year}
                  onChange={(e) =>
                    handleVehicleChange(index, "year", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="VIN (Vehicle Identification Number)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={vehicle.vin}
                  onChange={(e) =>
                    handleVehicleChange(index, "vin", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Estimated Value ($)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={vehicle.value}
                  onChange={(e) =>
                    handleVehicleChange(index, "value", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Mileage (km)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={vehicle.mileage}
                  onChange={(e) =>
                    handleVehicleChange(index, "mileage", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={addVehicle}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Vehicle
          </button>
        </section>

        {/* Beneficiary Information */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Beneficiary Information
          </h2>
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="mb-4 border-b pb-4 relative">
              <button
                onClick={() => removeBeneficiary(index)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-2"
              >
                <FaTrash />
              </button>
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
            Learn about vehicle inheritance and asset transfer.
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

export default VehicleInheritanceManagement;
