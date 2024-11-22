import React, { useState, useContext } from "react";
import { FaMoneyBillWave, FaPlus, FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const NetWorth = () => {
  const [assets, setAssets] = useState([{ name: "", value: "", type: "" }]);
  const [liabilities, setLiabilities] = useState([
    { name: "", value: "", type: "" },
  ]);
  const [savings, setSavings] = useState("");
  const [property, setProperty] = useState("");
  const [otherIncome, setOtherIncome] = useState("");

  const { API, token } = useContext(AuthContext);

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
    setAssets([...assets, { name: "", value: "", type: "" }]);
  };

  const addLiability = () => {
    setLiabilities([...liabilities, { name: "", value: "", type: "" }]);
  };

  const calculateNetWorth = () => {
    const totalAssets = assets.reduce(
      (acc, asset) => acc + (parseFloat(asset.value) || 0),
      0
    );
    const totalLiabilities = liabilities.reduce(
      (acc, liability) => acc + (parseFloat(liability.value) || 0),
      0
    );
    return totalAssets - totalLiabilities + parseFloat(savings || 0) + parseFloat(property || 0) + parseFloat(otherIncome || 0);
  };

  const netWorth = calculateNetWorth();

  const handleSubmit = async () => {
    const data = {
      assets,
      liabilities,
      savings: parseFloat(savings) || 0,
      property: parseFloat(property) || 0,
      otherIncome: parseFloat(otherIncome) || 0,
      netWorth,
    };

    try {
      const response = await axios.post(`${API}/networth`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Net worth details saved successfully!");
      }
    } catch (error) {
      console.error("Error submitting net worth data:", error);
      toast.error("Failed to save net worth details. Please try again.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Net Worth
        </h1>
        <p className="text-gray-600">
          Track your financial details to calculate and save your net worth.
        </p>
      </header>

 
      {/* Assets Section */}
      {assets.map((asset, index) => (
        <FieldSection title="Assets" key={index}>
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
            onChange={(e) => handleAssetChange(index, "value", e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Type (e.g., Real Estate, Investment)"
            value={asset.type}
            onChange={(e) => handleAssetChange(index, "type", e.target.value)}
          />
        </FieldSection>
      ))}
      <button
        onClick={addAsset}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Asset
      </button>

      {/* Liabilities Section */}
      {liabilities.map((liability, index) => (
        <FieldSection title="Liabilities" key={index}>
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
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Type (e.g., Loan, Credit Card)"
            value={liability.type}
            onChange={(e) => handleLiabilityChange(index, "type", e.target.value)}
          />
        </FieldSection>
      ))}
      <button
        onClick={addLiability}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Liability
      </button>

      {/* Net Worth Summary */}
      <Section title="Net Worth Summary">
        <p className="text-gray-800 font-bold">Net Worth: ${netWorth.toFixed(2)}</p>
      </Section>

      <button
        onClick={handleSubmit}
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Net Worth Details
      </button>
    </div>
  );
};

export default NetWorth;
