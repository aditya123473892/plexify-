import React, { useState } from "react";
import {
  FaChartLine,
  FaCalendarAlt,
  FaSortNumericUp,
  FaDollarSign,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaPercent,
  FaPlus,
  FaFileUpload,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

const StockManagement = () => {
  const [stocks, setStocks] = useState([
    {
      symbol: "",
      purchaseDate: "",
      quantity: "",
      purchasePrice: "",
      currentValue: "",
      totalInvestment: "",
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

  const handleStockChange = (index, field, value) => {
    const newStocks = [...stocks];
    newStocks[index][field] = value;
    setStocks(newStocks);
  };

  const addStock = () => {
    setStocks([
      ...stocks,
      {
        symbol: "",
        purchaseDate: "",
        quantity: "",
        purchasePrice: "",
        currentValue: "",
        totalInvestment: "",
      },
    ]);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index][field] = value;
    setBeneficiaries(newBeneficiaries);
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

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Stock Portfolio
        </h1>
        <p className="text-gray-600">
          Organize and track your stock investments with ease.
        </p>
      </header>

      {/* Stock Details Section */}
      {stocks.map((stock, index) => (
        <FieldSection title={`Stock ${index + 1}`}>
          <InputWithIcon
            icon={<FaChartLine className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Stock Symbol (e.g., AAPL)"
            value={stock.symbol}
            onChange={(e) => handleStockChange(index, "symbol", e.target.value)}
          />
          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Purchase Date"
            value={stock.purchaseDate}
            onChange={(e) =>
              handleStockChange(index, "purchaseDate", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaSortNumericUp className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Quantity"
            value={stock.quantity}
            onChange={(e) =>
              handleStockChange(index, "quantity", e.target.value)
            }
          />
          <InputWithIcon
            icon={
              <span className="text-[#538d2dfd] mx-2 font-extrabold text-xl">
                ₹{" "}
              </span>
            }
            type="number"
            placeholder="Purchase Price per Share"
            value={stock.purchasePrice}
            onChange={(e) =>
              handleStockChange(index, "purchasePrice", e.target.value)
            }
          />
          <InputWithIcon
            icon={
              <span className="text-[#538d2dfd] mx-2 font-extrabold text-xl">
                ₹{" "}
              </span>
            }
            type="number"
            placeholder="Current Value per Share"
            value={stock.currentValue}
            onChange={(e) =>
              handleStockChange(index, "currentValue", e.target.value)
            }
          />
          <InputWithIcon
            icon={
              <span className="text-[#538d2dfd] mx-2 font-extrabold text-xl">
                ₹{" "}
              </span>
            }
            type="number"
            placeholder="Total Investment"
            value={stock.totalInvestment}
            onChange={(e) =>
              handleStockChange(index, "totalInvestment", e.target.value)
            }
          />
        </FieldSection>
      ))}
      <button
        onClick={addStock}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add Stock
      </button>

      {/* Beneficiary Information */}
      {beneficiaries.map((beneficiary, index) => (
        <FieldSection title="Beneficiary Information">
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Beneficiary Name"
            value={beneficiary.name}
            onChange={(e) =>
              handleBeneficiaryChange(index, "name", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Contact Number"
            value={beneficiary.contact}
            onChange={(e) =>
              handleBeneficiaryChange(index, "contact", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email Address"
            value={beneficiary.email}
            onChange={(e) =>
              handleBeneficiaryChange(index, "email", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPercent className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Entitlement Percentage"
            value={beneficiary.entitlement}
            onChange={(e) =>
              handleBeneficiaryChange(index, "entitlement", e.target.value)
            }
          />
        </FieldSection>
      ))}
      <button
        onClick={addBeneficiary}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Beneficiary
      </button>

      {/* Document Upload */}
      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <input
            type="file"
            className="border-0 rounded-md p-3 w-full bg-transparent"
          />
        </div>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          Upload Document
        </button>
      </Section>

      {/* Educational Resources */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">
          Explore our educational resources on stock investment management.
        </p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaBook className="inline mr-2" /> Learn More
        </button>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Stock Details
      </button>
    </div>
  );
};

export default StockManagement;
