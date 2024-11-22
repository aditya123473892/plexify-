import React, { useState, useContext } from "react";
import axios from "axios";
import {
  FaSeedling,
  FaMoneyBillWave,
  FaInfoCircle,
  FaPlus,
  FaCheckCircle,
  FaCalendarAlt,
  FaBuilding,
  FaWeightHanging,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { AuthContext } from "../Contexts/Context"; // Assumes AuthContext provides a token
import { toast, ToastContainer } from "react-toastify"; // For toast notifications

const CommodityManagement = () => {
  const { API, token } = useContext(AuthContext); // Make sure API is coming from context
  const [commodities, setCommodities] = useState([
    {
      commodityName: "",
      commodityType: "",
      unitOfMeasure: "",
      marketPrice: "",
      stockQuantity: "",
      provider: "",
      acquisitionDate: "",
      expiryDate: "",
      description: "",
      status: "Available",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCommodityChange = (index, field, value) => {
    const newCommodities = [...commodities];
    newCommodities[index][field] = value;
    setCommodities(newCommodities);
  };

  const addCommodity = () => {
    setCommodities([
      ...commodities,
      {
        commodityName: "",
        commodityType: "",
        unitOfMeasure: "",
        marketPrice: "",
        stockQuantity: "",
        provider: "",
        acquisitionDate: "",
        expiryDate: "",
        description: "",
        status: "Available",
      },
    ]);
  };

  const validateCommodities = () => {
    for (const commodity of commodities) {
      if (
        !commodity.commodityName ||
        !commodity.commodityType ||
        !commodity.unitOfMeasure ||
        !commodity.marketPrice ||
        !commodity.stockQuantity ||
        !commodity.acquisitionDate
      ) {
        setMessage(
          "Commodity Name, Type, Unit of Measure, Market Price, Stock Quantity, and Acquisition Date are required."
        );
        return false;
      }
      if (isNaN(commodity.marketPrice) || commodity.marketPrice <= 0) {
        setMessage("Market Price must be a positive number.");
        return false;
      }
      if (isNaN(commodity.stockQuantity) || commodity.stockQuantity < 0) {
        setMessage("Stock Quantity must be a non-negative number.");
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
      // Use the correct API endpoint from context
      const response = await axios.post(
        `${API}/commodities`, // Ensure you're using the API URL from context
        { commodities },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Display success and reset form if commodities are saved successfully
      if (response.status === 200) {
        setMessage("Commodities saved successfully!");
        setCommodities([
          {
            commodityName: "",
            commodityType: "",
            unitOfMeasure: "",
            marketPrice: "",
            stockQuantity: "",
            provider: "",
            acquisitionDate: "",
            expiryDate: "",
            description: "",
            status: "Available",
          },
        ]); // Reset form
        toast.success("Commodities saved successfully!"); // Success toast
      }
    } catch (error) {
      console.error("Error saving commodities:", error);
      setMessage("An error occurred while saving commodities.");
      toast.error("An error occurred while saving commodities."); // Error toast
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
            placeholder="Commodity Name (e.g., Gold, Silver)"
            value={commodity.commodityName}
            onChange={(e) =>
              handleCommodityChange(index, "commodityName", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaSeedling className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Commodity Type"
            value={commodity.commodityType}
            onChange={(e) =>
              handleCommodityChange(index, "commodityType", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaWeightHanging className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Unit of Measure (e.g., kg, barrel)"
            value={commodity.unitOfMeasure}
            onChange={(e) =>
              handleCommodityChange(index, "unitOfMeasure", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Market Price"
            value={commodity.marketPrice}
            onChange={(e) =>
              handleCommodityChange(index, "marketPrice", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Stock Quantity"
            value={commodity.stockQuantity}
            onChange={(e) =>
              handleCommodityChange(index, "stockQuantity", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaBuilding className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Provider"
            value={commodity.provider}
            onChange={(e) =>
              handleCommodityChange(index, "provider", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Acquisition Date"
            value={commodity.acquisitionDate}
            onChange={(e) =>
              handleCommodityChange(index, "acquisitionDate", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Expiry Date"
            value={commodity.expiryDate}
            onChange={(e) =>
              handleCommodityChange(index, "expiryDate", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Description"
            value={commodity.description}
            onChange={(e) =>
              handleCommodityChange(index, "description", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaCheckCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Status (e.g., Available, Out of Stock)"
            value={commodity.status}
            onChange={(e) =>
              handleCommodityChange(index, "status", e.target.value)
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

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default CommodityManagement;
