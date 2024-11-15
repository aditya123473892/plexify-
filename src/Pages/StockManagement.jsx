import React, { useState, useContext } from "react";
import axios from "axios";
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
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

const StockManagement = () => {
  const { API, token } = useContext(AuthContext);
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
      relationship: "",  // Add relationship field
      notify: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    stocks: [],
    beneficiaries: [],
  });

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
        relationship: "",  // Add relationship field
        notify: false,
      },
    ]);
  };

  const validateStocks = () => {
    let stockErrors = [];
    stocks.forEach((stock, index) => {
      const stockError = {};
      if (!stock.symbol) stockError.symbol = "Stock symbol is required";
      if (!stock.purchaseDate) stockError.purchaseDate = "Purchase date is required";
      if (!stock.quantity) stockError.quantity = "Quantity is required";
      if (!stock.purchasePrice) stockError.purchasePrice = "Purchase price is required";
      if (!stock.currentValue) stockError.currentValue = "Current value is required";
      if (!stock.totalInvestment) stockError.totalInvestment = "Total investment is required";
      if (Object.keys(stockError).length > 0) stockErrors[index] = stockError;
    });
    return stockErrors;
  };

  const validateBeneficiaries = () => {
    let beneficiaryErrors = [];
    beneficiaries.forEach((beneficiary, index) => {
      const beneficiaryError = {};
      if (!beneficiary.name) beneficiaryError.name = "Name is required";
      if (!beneficiary.contact) beneficiaryError.contact = "Contact is required";
      if (!beneficiary.email) beneficiaryError.email = "Email is required";
      if (!beneficiary.entitlement) beneficiaryError.entitlement = "Entitlement percentage is required";
      if (!beneficiary.relationship) beneficiaryError.relationship = "Relationship is required"; // Validate relationship field
      if (Object.keys(beneficiaryError).length > 0) beneficiaryErrors[index] = beneficiaryError;
    });
    return beneficiaryErrors;
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    const stockErrors = validateStocks();
    const beneficiaryErrors = validateBeneficiaries();
    
    if (stockErrors.length > 0 || beneficiaryErrors.length > 0) {
      setErrors({ stocks: stockErrors, beneficiaries: beneficiaryErrors });
      setLoading(false);
      return;
    }

    const payload = {
      stocks,
      beneficiaries,
    };

    try {
      const response = await axios.post(`${API}/stocks`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Stock and Beneficiary details saved successfully!");
    } catch (error) {
      toast.error("An error occurred while saving your details.");
    } finally {
      setLoading(false);
    }
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
        <FieldSection key={index} title={`Stock ${index + 1}`}>
          <InputWithIcon
            icon={<FaChartLine className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Stock Symbol (e.g., AAPL)"
            value={stock.symbol}
            onChange={(e) => handleStockChange(index, "symbol", e.target.value)}
          />
          {errors.stocks[index]?.symbol && (
            <p className="text-red-500 text-sm">{errors.stocks[index].symbol}</p>
          )}
          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Purchase Date"
            value={stock.purchaseDate}
            onChange={(e) => handleStockChange(index, "purchaseDate", e.target.value)}
          />
          {errors.stocks[index]?.purchaseDate && (
            <p className="text-red-500 text-sm">{errors.stocks[index].purchaseDate}</p>
          )}
          <InputWithIcon
            icon={<FaSortNumericUp className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Quantity"
            value={stock.quantity}
            onChange={(e) => handleStockChange(index, "quantity", e.target.value)}
          />
          {errors.stocks[index]?.quantity && (
            <p className="text-red-500 text-sm">{errors.stocks[index].quantity}</p>
          )}
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Purchase Price per Share"
            value={stock.purchasePrice}
            onChange={(e) => handleStockChange(index, "purchasePrice", e.target.value)}
          />
          {errors.stocks[index]?.purchasePrice && (
            <p className="text-red-500 text-sm">{errors.stocks[index].purchasePrice}</p>
          )}
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Value per Share"
            value={stock.currentValue}
            onChange={(e) => handleStockChange(index, "currentValue", e.target.value)}
          />
          {errors.stocks[index]?.currentValue && (
            <p className="text-red-500 text-sm">{errors.stocks[index].currentValue}</p>
          )}
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Total Investment"
            value={stock.totalInvestment}
            onChange={(e) => handleStockChange(index, "totalInvestment", e.target.value)}
          />
          {errors.stocks[index]?.totalInvestment && (
            <p className="text-red-500 text-sm">{errors.stocks[index].totalInvestment}</p>
          )}
        </FieldSection>
      ))}
      <button
        onClick={addStock}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add Stock
      </button>

      {/* Beneficiary Details Section */}
      {beneficiaries.map((beneficiary, index) => (
        <FieldSection key={index} title={`Beneficiary ${index + 1}`}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Beneficiary Name"
            value={beneficiary.name}
            onChange={(e) => handleBeneficiaryChange(index, "name", e.target.value)}
          />
          {errors.beneficiaries[index]?.name && (
            <p className="text-red-500 text-sm">{errors.beneficiaries[index].name}</p>
          )}
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Contact"
            value={beneficiary.contact}
            onChange={(e) => handleBeneficiaryChange(index, "contact", e.target.value)}
          />
          {errors.beneficiaries[index]?.contact && (
            <p className="text-red-500 text-sm">{errors.beneficiaries[index].contact}</p>
          )}
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email"
            value={beneficiary.email}
            onChange={(e) => handleBeneficiaryChange(index, "email", e.target.value)}
          />
          {errors.beneficiaries[index]?.email && (
            <p className="text-red-500 text-sm">{errors.beneficiaries[index].email}</p>
          )}
          <InputWithIcon
            icon={<FaPercent className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Entitlement Percentage"
            value={beneficiary.entitlement}
            onChange={(e) => handleBeneficiaryChange(index, "entitlement", e.target.value)}
          />
          {errors.beneficiaries[index]?.entitlement && (
            <p className="text-red-500 text-sm">{errors.beneficiaries[index].entitlement}</p>
          )}
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Relationship"
            value={beneficiary.relationship}  // Add the relationship field here
            onChange={(e) => handleBeneficiaryChange(index, "relationship", e.target.value)}
          />
          {errors.beneficiaries[index]?.relationship && (
            <p className="text-red-500 text-sm">{errors.beneficiaries[index].relationship}</p>
          )}
        </FieldSection>
      ))}
      <button
        onClick={addBeneficiary}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add Beneficiary
      </button>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 text-white py-2 px-4 rounded-md shadow-md bg-[#538d2dfd] hover:bg-[#3a5e22fd]"
      >
        {loading ? (
          <FaBook className="animate-spin inline" />
        ) : (
          <FaFileUpload className="inline mr-2" />
        )}
        Submit
      </button>

      <ToastContainer />
    </div>
  );
};

export default StockManagement;
