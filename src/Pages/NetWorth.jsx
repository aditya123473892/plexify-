import React, { useState } from "react";
import { FaMoneyBillWave, FaPlus, FaCheckCircle } from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

const NetWorth = () => {
  const [assets, setAssets] = useState([{ name: "", value: "" }]);
  const [liabilities, setLiabilities] = useState([{ name: "", value: "" }]);

  const handleAssetChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
  };

  const handleLiabilityChange = (index, field, value) => {
    const newLiabilities = [...liabilities];
    newLiabilities[index][field] = value;
    setLiabilities(newLiabilities);
  };

  const addAsset = () => {
    setAssets([...assets, { name: "", value: "" }]);
  };

  const addLiability = () => {
    setLiabilities([...liabilities, { name: "", value: "" }]);
  };

  const totalAssets = assets.reduce(
    (acc, asset) => acc + (parseFloat(asset.value) || 0),
    0
  );
  const totalLiabilities = liabilities.reduce(
    (acc, liability) => acc + (parseFloat(liability.value) || 0),
    0
  );
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Net Worth
        </h1>
        <p className="text-gray-600">
          Keep track of your assets and liabilities to calculate your net worth.
        </p>
      </header>

      {/* Assets Section */}
      <FieldSection title="Assets">
        {assets.map((asset, index) => (
          <div className="flex items-center mb-4" key={index}>
            <InputWithIcon
              icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Asset Name"
              value={asset.name}
              onChange={(e) => handleAssetChange(index, "name", e.target.value)}
            />
            <InputWithIcon
              icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
              type="number"
              placeholder="Value"
              value={asset.value}
              onChange={(e) =>
                handleAssetChange(index, "value", e.target.value)
              }
            />
          </div>
        ))}
        <button
          onClick={addAsset}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Asset
        </button>
      </FieldSection>

      {/* Liabilities Section */}
      <FieldSection title="Liabilities">
        {liabilities.map((liability, index) => (
          <div className="flex items-center mb-4" key={index}>
            <InputWithIcon
              icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Liability Name"
              value={liability.name}
              onChange={(e) =>
                handleLiabilityChange(index, "name", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
              type="number"
              placeholder="Value"
              value={liability.value}
              onChange={(e) =>
                handleLiabilityChange(index, "value", e.target.value)
              }
            />
          </div>
        ))}
        <button
          onClick={addLiability}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Liability
        </button>
      </FieldSection>

      {/* Net Worth Summary */}
      <Section title="Net Worth Summary">
        <p className="text-gray-800 font-bold">
          Total Assets: ${totalAssets.toFixed(2)}
        </p>
        <p className="text-gray-800 font-bold">
          Total Liabilities: ${totalLiabilities.toFixed(2)}
        </p>
        <p className="text-gray-800 font-bold">
          <span className={netWorth >= 0 ? "text-green-600" : "text-red-600"}>
            Net Worth: ${netWorth.toFixed(2)}
          </span>
        </p>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Net Worth Details
      </button>
    </div>
  );
};

export default NetWorth;
