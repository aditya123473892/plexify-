import React, { useState, useContext,useEffect } from "react";
import axios from "axios";
import {
  FaChartLine,
  FaCalendarAlt,
  FaSortNumericUp,
  FaRupeeSign,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaPercent,
  FaPlus,
  FaFileUpload,
  FaBook,
  FaLink
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

const StockManagement = () => {
  const [addedBeneficiaries, setAddedBeneficiaries] = useState([]);
  const { API, token,beneficiaryUser } = useContext(AuthContext);
  const [stocks, setStocks] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    stocks: [],
    beneficiaries: [],
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/stocks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  console.log(response.data.stocks,'response.data.stocks')
        if (response.data.stocks && response.data.stocks.length > 0) {
          const formattedStocks = response.data.stocks.map((stock) => ({
            symbol: stock.symbol || "",
            purchaseDate: stock.purchase_date.split("T")[0] || "",
            quantity: stock.quantity || "",
            purchasePrice: stock.purchase_price || "",
            currentValue: stock.current_value || "",
            totalInvestment: stock.total_investment || "",
            beneficiaryUser: stock.beneficiarie_user || "",
          }));
          setStocks(formattedStocks);
        } else {
          setStocks([{
            symbol: "",
            purchaseDate: "",
            quantity: "",
            purchasePrice: "",
            currentValue: "",
            totalInvestment: "",
            beneficiaryUser:"",
          }]);
        }
  
        if (response.data.beneficiaries && response.data.beneficiaries.length > 0) {
          setBeneficiaries(response.data.beneficiaries);
        } else {
          setBeneficiaries([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again.");
      }
    };
  
    fetchData();
  }, [API, token]);
  




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

;

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


  const handleSubmit = async () => {
    setLoading(true);
    
    const stockErrors = validateStocks();
    
    if (stockErrors.length > 0) {
      setErrors({ stocks: stockErrors });
      setLoading(false);
      return;
    }
    const beneficiaryIds = beneficiaries.map((beneficiary) => beneficiary.beneficiary_id); 
    const payload = {
      stocks,
      beneficiaries: beneficiaryIds ,
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

  const handleAddBeneficiary = (userIndex) => {
    if (beneficiaryUser.length > 0 && !addedBeneficiaries.includes(userIndex)) {
      const user = beneficiaryUser[userIndex];
      console.log('✌️beneficiaryUser --->', beneficiaryUser);
      const newBeneficiary = {
        beneficiary_id: user.beneficiary_id || "",
        name: user.name || "",
        contact: user.contact || "",
        email: user.email || "",
        entitlement: user.entitlement || "",
        relationship: user.relationship || "",
        notify: false,
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setAddedBeneficiaries([...addedBeneficiaries, userIndex]);
    } else {
      toast.error("This user has already been added or no users are available.");
    }
  };
  const getBeneficiaryById = (id) => {
    return beneficiaryUser.find(
      (user) => String(user.beneficiary_id) === String(id)
    ) || null;
  };

  // Flatten and deduplicate the beneficiary IDs across all deposits
const uniqueBeneficiaryIds = Array.from(
  new Set(stocks.flatMap((deposit) =>  deposit.beneficiaryUser ? deposit.beneficiaryUser.split(",") : []))
);
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
            icon={<FaRupeeSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Purchase Price per Share"
            value={stock.purchasePrice}
            onChange={(e) => handleStockChange(index, "purchasePrice", e.target.value)}
          />
          {errors.stocks[index]?.purchasePrice && (
            <p className="text-red-500 text-sm">{errors.stocks[index].purchasePrice}</p>
          )}
          <InputWithIcon
            icon={<FaRupeeSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Value per Share"
            value={stock.currentValue}
            onChange={(e) => handleStockChange(index, "currentValue", e.target.value)}
          />
          {errors.stocks[index]?.currentValue && (
            <p className="text-red-500 text-sm">{errors.stocks[index].currentValue}</p>
          )}
          <InputWithIcon
            icon={<FaRupeeSign className="text-[#538d2dfd] mx-2" />}
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
      <Section>
  <h3 className="font-semibold text-xl">Beneficiaries</h3>
  <div className="mb-6">
    <select
      onChange={(e) => handleAddBeneficiary(e.target.value)}
      className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
    >
      <option value="" disabled selected>Select a beneficiary</option>
      {beneficiaryUser &&
        beneficiaryUser
          .filter((user, index) => !addedBeneficiaries.includes(index))
          .map((user, index) => (
            <option key={index} value={index}>
              {user.name}
            </option>
          ))}
    </select>
  </div>
  
  <div className="grid mb-4">
    {beneficiaries.map((beneficiary, index) => (
      <FieldSection key={index}>
        <InputWithIcon
          icon={<FaUser />}
          type="text"
          placeholder="Beneficiary Name"
          value={beneficiary.name}
          onChange={(e) =>
            handleBeneficiaryChange(index, "name", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaPhone />}
          type="text"
          placeholder="Contact"
          value={beneficiary.contact}
          onChange={(e) =>
            handleBeneficiaryChange(index, "contact", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaEnvelope />}
          type="email"
          placeholder="Email"
          value={beneficiary.email}
          onChange={(e) =>
            handleBeneficiaryChange(index, "email", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaPercent />}
          type="number"
          placeholder="Entitlement %"
          value={beneficiary.entitlement}
          onChange={(e) =>
            handleBeneficiaryChange(index, "entitlement", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaLink />}
          type="text"
          placeholder="Relationship"
          value={beneficiary.relationship}
          onChange={(e) =>
            handleBeneficiaryChange(index, "relationship", e.target.value)
          }
        />
      </FieldSection>
    ))}
  </div>


<div className=" p-4 rounded-lg mt-4  bg-gray-50">
  
  <div className="flex flex-col space-y-4">
    {uniqueBeneficiaryIds.map((id) => {
      const beneficiary = getBeneficiaryById(id); // Use updated function
      return beneficiary ? (
        <FieldSection
          key={id}
          className="flex flex-col md:flex-row md:space-x-4"
        >
          <InputWithIcon
            icon={<FaUser />}
            type="text"
            placeholder="Beneficiary Name"
            value={beneficiary.name}
            onChange={(e) =>
              handleBeneficiaryChange("name", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPhone />}
            type="text"
            placeholder="Contact"
            value={beneficiary.contact}
            onChange={(e) =>
              handleBeneficiaryChange("contact", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaEnvelope />}
            type="email"
            placeholder="Email"
            value={beneficiary.email}
            onChange={(e) =>
              handleBeneficiaryChange("email", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPercent />}
            type="number"
            placeholder="Entitlement %"
            value={beneficiary.entitlement}
            onChange={(e) =>
              handleBeneficiaryChange("entitlement", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaLink />}
            type="text"
            placeholder="Relationship"
            value={beneficiary.relationship}
            onChange={(e) =>
              handleBeneficiaryChange("relationship", id, e.target.value)
            }
          />
        </FieldSection>
      ) : (
        ''
      );
    })}
  </div>
</div>


</Section>

   

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 block text-white py-2 px-4 rounded-md shadow-md bg-[#538d2dfd] hover:bg-[#3a5e22fd]"
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
