import React, { useState, useContext, useEffect } from "react";
import { FaMoneyBillWave, FaPlus, FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const NetWorth = () => {
  const [netWorthData, setNetWorthData] = useState({
    id: null,
    assets: [],
    liabilities: [],
    savings: "",
    property: "",
    otherIncome: "",
    netWorth: 0,
  });

  const { API, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchNetWorthData = async () => {
      try {
        const response = await axios.get(`${API}/networth`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        console.log(response.data, "Fetched response data"); // Debug the structure
  
        if (response.data && response.data.netWorthData.length > 0) {
          const assets = response.data.netWorthData
            .filter((entry) => entry.asset_name)
            .map((entry) => ({
              name: entry.asset_name || "",
              value: entry.asset_value || 0,
              type: entry.asset_type || "",
            }));
  
          const liabilities = response.data.netWorthData
            .filter((entry) => entry.liability_name)
            .map((entry) => ({
              name: entry.liability_name || "",
              value: entry.liability_value || 0,
              type: entry.liability_type || "",
            }));
  
          const firstEntry = response.data.netWorthData[0];
  
          setNetWorthData({
            id: firstEntry.id,
            assets,
            liabilities,
            savings: firstEntry.savings || "",
            property: firstEntry.property_value || "",
            otherIncome: firstEntry.other_income || "",
            netWorth: firstEntry.net_worth || 0,
          });
        } else {
          console.log("No data received, using default values.");
          setNetWorthData({
            id: null,
            assets: [{ name: "", value: "", type: "" }],
            liabilities: [{ name: "", value: "", type: "" }],
            savings: "",
            property: "",
            otherIncome: "",
            netWorth: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching net worth data:", error);
        toast.error("Error fetching net worth data. Please try again.");
      }
    };
  
    fetchNetWorthData();
  }, [API, token]);
  
  
  const handleFieldChange = (field, value) => {
    setNetWorthData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (type, index, field, value) => {
    const updatedList = [...netWorthData[type]];
    updatedList[index][field] = value;
    setNetWorthData((prev) => ({ ...prev, [type]: updatedList }));
  };

  const addNewItem = (type) => {
    setNetWorthData((prev) => ({
      ...prev,
      [type]: [...prev[type], { name: "", value: "", type: "" }],
    }));
  };

  const calculateNetWorth = () => {
    const totalAssets = netWorthData.assets.reduce(
      (acc, asset) => acc + (parseFloat(asset.value) || 0),
      0
    );
    const totalLiabilities = netWorthData.liabilities.reduce(
      (acc, liability) => acc + (parseFloat(liability.value) || 0),
      0
    );
    return (
      totalAssets -
      totalLiabilities +
      parseFloat(netWorthData.savings || 0) +
      parseFloat(netWorthData.property || 0) +
      parseFloat(netWorthData.otherIncome || 0)
    );
  };

  const handleSubmit = async () => {
    const data = {
      ...netWorthData,
      netWorth: calculateNetWorth(),
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

  const netWorth = calculateNetWorth();

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
      {netWorthData.assets.map((asset, index) => (
        <FieldSection title="Assets" key={index}>
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Asset Name"
            value={asset.name}
            onChange={(e) =>
              handleNestedFieldChange("assets", index, "name", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Value"
            value={asset.value}
            onChange={(e) =>
              handleNestedFieldChange("assets", index, "value", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Type (e.g., Real Estate, Investment)"
            value={asset.type}
            onChange={(e) =>
              handleNestedFieldChange("assets", index, "type", e.target.value)
            }
          />
        </FieldSection>
      ))}
      <button
        onClick={() => addNewItem("assets")}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Asset
      </button>

      {/* Liabilities Section */}
      {netWorthData.liabilities.map((liability, index) => (
        <FieldSection title="Liabilities" key={index}>
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Liability Name"
            value={liability.name}
            onChange={(e) =>
              handleNestedFieldChange("liabilities", index, "name", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Value"
            value={liability.value}
            onChange={(e) =>
              handleNestedFieldChange("liabilities", index, "value", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Type (e.g., Loan, Credit Card)"
            value={liability.type}
            onChange={(e) =>
              handleNestedFieldChange("liabilities", index, "type", e.target.value)
            }
          />
        </FieldSection>
      ))}
      <button
        onClick={() => addNewItem("liabilities")}
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
