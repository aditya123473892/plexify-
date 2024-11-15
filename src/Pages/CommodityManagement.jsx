import React, { useState, useContext } from "react";
import axios from "axios";
import {
  FaSeedling,
  FaMoneyBillWave,
  FaInfoCircle,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context"; // Assuming you have an AuthContext providing the token

const CommodityManagement = () => {
  const { token } = useContext(AuthContext); // Get token from AuthContext
  const [commodities, setCommodities] = useState([
    {
      commodityType: "",
      quantity: "",
      purchasePrice: "",
      currentValue: "",
      notes: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:3523/commodities"; // Ensure full URL and correct port

  const handleCommodityChange = (index, field, value) => {
    const newCommodities = [...commodities];
    newCommodities[index][field] = value;
    setCommodities(newCommodities);
  };

  const addCommodity = () => {
    setCommodities([
      ...commodities,
      {
        commodityType: "",
        quantity: "",
        purchasePrice: "",
        currentValue: "",
        notes: "",
      },
    ]);
  };

  const validateCommodities = () => {
    for (const commodity of commodities) {
      if (
        !commodity.commodityType ||
        !commodity.quantity ||
        !commodity.purchasePrice
      ) {
        setMessage(
          "Commodity Type, Quantity, and Purchase Price are required."
        );
        return false;
      }
      if (isNaN(commodity.quantity) || commodity.quantity <= 0) {
        setMessage("Quantity must be a positive number.");
        return false;
      }
      if (isNaN(commodity.purchasePrice) || commodity.purchasePrice <= 0) {
        setMessage("Purchase Price must be a positive number.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCommodities()) return;

    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        API_URL,
        { commodities },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Commodities saved successfully!");
      setCommodities([
        {
          commodityType: "",
          quantity: "",
          purchasePrice: "",
          currentValue: "",
          notes: "",
        },
      ]); // Reset form
    } catch (error) {
      console.error("Error saving commodities:", error);
      setMessage("An error occurred while saving commodities.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Commodities
        </h1>
        <p className="text-gray-600">
          Keep track of your commodity investments and monitor their
          performance.
        </p>
      </header>

      {/* Commodity Section */}
      {commodities.map((commodity, index) => (
        <FieldSection title={`Commodity ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaSeedling className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Commodity Type (e.g., Gold, Silver)"
            value={commodity.commodityType}
            onChange={(e) =>
              handleCommodityChange(index, "commodityType", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Quantity"
            value={commodity.quantity}
            onChange={(e) =>
              handleCommodityChange(index, "quantity", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Purchase Price"
            value={commodity.purchasePrice}
            onChange={(e) =>
              handleCommodityChange(index, "purchasePrice", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Value"
            value={commodity.currentValue}
            onChange={(e) =>
              handleCommodityChange(index, "currentValue", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Additional Notes"
            value={commodity.notes}
            onChange={(e) =>
              handleCommodityChange(index, "notes", e.target.value)
            }
          />
        </FieldSection>
      ))}

      <button
        onClick={addCommodity}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Commodity
      </button>

      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">
          Explore our educational resources on commodity investments.
        </p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaMoneyBillWave className="inline mr-2" /> Learn More
        </button>
      </Section>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className={`bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span>Saving...</span>
        ) : (
          <>
            <FaCheckCircle className="mr-2" /> Save Commodity Details
          </>
        )}
      </button>

      {message && (
        <div className="mt-4 text-center text-gray-700">{message}</div>
      )}
    </div>
  );
};

export default CommodityManagement;
