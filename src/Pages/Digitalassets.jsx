import React, { useState } from "react";
import { FaPlus, FaTrash, FaFileUpload } from "react-icons/fa";

function DigitalAssetsInheritanceManagement() {
  const [assets, setAssets] = useState([
    { assetType: "", accountName: "", accessDetails: "", estimatedValue: "" },
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

  // Add a new digital asset
  const addAsset = () => {
    setAssets([
      ...assets,
      { assetType: "", accountName: "", accessDetails: "", estimatedValue: "" },
    ]);
  };

  // Remove a digital asset
  const removeAsset = (index) => {
    const updatedAssets = assets.filter((_, i) => i !== index);
    setAssets(updatedAssets);
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

  // Remove a beneficiary
  const removeBeneficiary = (index) => {
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    setBeneficiaries(updatedBeneficiaries);
  };

  // Handle changes for digital asset fields
  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...assets];
    updatedAssets[index][field] = value;
    setAssets(updatedAssets);
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
          Manage Your Digital Assets Inheritance
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Organize your digital assets and designate beneficiaries.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Digital Assets Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Digital Assets
          </h2>
          {assets.map((asset, index) => (
            <div key={index} className="mb-4 border-b pb-4 relative">
              <button
                onClick={() => removeAsset(index)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-2"
              >
                <FaTrash />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={asset.assetType}
                  onChange={(e) =>
                    handleAssetChange(index, "assetType", e.target.value)
                  }
                >
                  <option value="">Select Asset Type</option>
                  <option value="Cryptocurrency">Cryptocurrency</option>
                  <option value="Social Media Account">
                    Social Media Account
                  </option>
                  <option value="Domain Name">Domain Name</option>
                  <option value="Online Account">Online Account</option>
                </select>
                <input
                  type="text"
                  placeholder="Account Name / Platform"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={asset.accountName}
                  onChange={(e) =>
                    handleAssetChange(index, "accountName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Access Details (e.g., wallet address)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={asset.accessDetails}
                  onChange={(e) =>
                    handleAssetChange(index, "accessDetails", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Estimated Value ($)"
                  className="border border-gray-300 p-3 rounded-md w-full"
                  value={asset.estimatedValue}
                  onChange={(e) =>
                    handleAssetChange(index, "estimatedValue", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={addAsset}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Digital Asset
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
            Learn more about managing digital assets and inheritance.
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

export default DigitalAssetsInheritanceManagement;

/*
  const metrics = [
    {
      title: "Networth",
      value: 932,
      total: 5443,
      percentage: 75,
      color: "#6a1b9a",
      icon: <FaLightbulb />,
      footerText: "Completed",
    },
    {
      title: "Wealth",
      value: 756,
      percentage: 50,
      color: "#4caf50",
      icon: <FaEye />,
      footerText: "Increased since yesterday",
    },
    {
      title: "Liabilities",
      value: 10038,
      percentage: 35,
      color: "#ff9800",
      icon: <FaEye />,
      footerText: "Increased since yesterday",
    },
  ];

  const MetricCard = ({
    title,
    value,
    total,
    percentage,
    color,
    icon,
    footerText,
  }) => (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-5 w-64 text-center m-4">
      <h3 className="text-xl font-semibold text-gray-600">{title}</h3>
      <p className="text-2xl font-bold my-2">{value}</p>

      <div className="w-20 h-20 mb-2">
        <CircularProgressbar
          value={percentage}
          text={icon}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: "#e0e0e0",
            textSize: "24px",
          })}
        />
      </div>

      <p className="text-lg font-semibold text-gray-600">{total}</p>
      <p className="text-sm text-gray-500 mt-2">{footerText}</p>
    </div>


      <div className="flex justify-center space-x-6 mt-10">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
  ); */
