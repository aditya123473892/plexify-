import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaCheckCircle, FaSyncAlt, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Contexts/Context";
import "react-toastify/dist/ReactToastify.css";
import Section from "../Components/Section";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";

const WillForm = () => {
  const { API, token } = useContext(AuthContext);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    address: "",
    spouseName: "",
  });

  const [witnesses, setWitnesses] = useState([{ name: "", address: "" }]);
  const [wealthDetails, setWealthDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState(null);

  // Fetch wealth data from all endpoints
  const fetchWealthDetails = async () => {
    setLoading(true);

    try {
      const [
        insuranceResponse,
        depositsResponse,
        cryptoResponse,
        recurringDepositsResponse,
        propertiesResponse,
        stocksResponse,
        mutualFundsResponse,
        bondsResponse,
      ] = await Promise.all([
        axios.get(`${API}/insurance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/deposits`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/cryptocurrencies`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/recurring_deposits`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/properties`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/stocks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/mutual-funds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/bonds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const insurance = insuranceResponse.data.policies.map((policy) => ({
        id: `policy-${policy.policy_id}`,
        type: "Insurance Policy",
        details: `${policy.policy_name} (${policy.policy_type}), Provider: ${policy.provider}`,
        value: `Coverage: $${policy.coverage_limit}, Premium: $${policy.premium_amount}`,
      }));

      const deposits = depositsResponse.data.deposits.map((deposit) => ({
        id: `deposit-${deposit.deposit_id}`,
        type: "Fixed Deposit",
        details: `${deposit.deposit_name}, Bank: ${deposit.bank_name}`,
        value: `Amount: $${deposit.deposit_amount}, Term: ${deposit.deposit_term}`,
      }));

      const cryptos = cryptoResponse.data.cryptos.map((crypto) => ({
        id: `crypto-${crypto.id}`,
        type: "Cryptocurrency",
        details: `${crypto.name}, Wallet: ${crypto.wallet}`,
        value: `Amount: ${crypto.amount_held}, Current Value: $${crypto.current_value}`,
      }));

      const recurringDeposits = recurringDepositsResponse.data.deposits.map(
        (deposit) => ({
          id: `rd-${deposit.id}`,
          type: "Recurring Deposit",
          details: `${deposit.bank_name}, RD Number: ${deposit.rd_number}`,
          value: `Monthly Deposit: $${deposit.monthly_deposit_amount}, Maturity: $${deposit.maturity_amount}`,
        })
      );

      const properties = propertiesResponse.data.properties.map((property) => ({
        id: `property-${property.id}`,
        type: "Property",
        details: `${property.property_name}, Location: ${property.location}, Type: ${property.property_type}`,
        value: `Area: ${property.area_in_sqft} sqft, Current Value: $${property.current_value}`,
      }));

      const stocks = stocksResponse.data.stocks.map((stock) => ({
        id: `stock-${stock.id}`,
        type: "Stock",
        details: `Symbol: ${stock.symbol}, Quantity: ${stock.quantity}`,
        value: `Purchase Price: $${stock.purchase_price}, Current Value: $${stock.current_value}`,
      }));

      const mutualFunds = mutualFundsResponse.data.mutualFunds.map((fund) => ({
        id: `mutual-fund-${fund.id}`,
        type: "Mutual Fund",
        details: `${fund.fund_name}, Managed by: ${fund.fund_manager}, Type: ${fund.fund_type}`,
        value: `Investment: $${fund.investment_amount}, Current Value: $${fund.current_value}, Risk: ${fund.risk_level}`,
      }));

      const bonds = bondsResponse.data.bonds.map((bond) => ({
        id: `bond-${bond.id}`,
        type: "Bond",
        details: `${bond.issuer}, Type: ${bond.bond_type}, Description: ${bond.description}`,
        value: `Face Value: $${bond.face_value}, Market Value: $${bond.market_value}, Interest: ${bond.interest_rate}%`,
      }));

      setWealthDetails([
        ...insurance,
        ...deposits,
        ...cryptos,
        ...recurringDeposits,
        ...properties,
        ...stocks,
        ...mutualFunds,
        ...bonds,
      ]);
      toast.success("Wealth details loaded successfully.");
    } catch (error) {
      console.error("Error fetching wealth details:", error);
      toast.error("Failed to load all wealth details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWealthDetails();
  }, []);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const addWitness = () => {
    setWitnesses([...witnesses, { name: "", address: "" }]);
  };

  const removeWitness = (index) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const handleWitnessChange = (index, field, value) => {
    const updated = [...witnesses];
    updated[index][field] = value;
    setWitnesses(updated);
  };

  const handleDeleteWealth = (id) => {
    setWealthDetails((prev) => prev.filter((item) => item.id !== id));
    toast.success("Wealth item removed successfully.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", { personalInfo, wealthDetails, witnesses });
    toast.success("Will form submitted successfully!");
  };


  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];  // Get the first selected file
    if (file) {
      setSignature(file);  // Set the uploaded file to the signature state
    }
  };


  
  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Your Will
        </h1>
        <p className="text-gray-600">
          Fill out the form below to draft your last will and testament.
        </p>
      </header>

      <div className="">
        <Section className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
    Personal Information
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      "fullName",
      "fatherName",
      "motherName",
      "spouseName",
      "address",
    ].map((field, idx) => (
      <InputWithIcon
        key={idx}
        icon={<FaUser className="text-[#538d2dfd] mx-2" />}
        type={field === "address" ? "textarea" : "text"}
        placeholder={field.replace(/([A-Z])/g, " $1")}
        value={personalInfo[field]}
        onChange={(e) => handlePersonalInfoChange(field, e.target.value)}
      />
    ))}
  </div>
</Section>


        {/* Wealth Details Section */}

        <Section className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
    Wealth Details
    <button
      onClick={fetchWealthDetails}
      className="ml-4 text-[#538d2dfd] hover:underline flex items-center"
    >
      <FaSyncAlt className="mr-2" /> Refresh
    </button>
  </h2>
  {loading ? (
    <div className="flex justify-center">
      <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full"></div>
    </div>
  ) : wealthDetails.length > 0 ? (
    Object.entries(
      wealthDetails.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
      }, {})
    ).map(([type, items]) => (
      <FieldSection key={type} title={`${type} (${items.length})`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h4 className="text-lg font-semibold text-gray-800">{item.details}</h4>
              <p className="text-sm text-gray-600 mb-4">Value: {item.value}</p>
              <button
                onClick={() => handleDeleteWealth(item.id)}
                className="text-[#538d2dfd] hover:underline"
                aria-label={`Delete ${type}`}
                title={`Delete ${type}`}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </FieldSection>
    ))
  ) : (
    <p className="text-gray-600">No wealth details available.</p>
  )}
</Section>


        {/* Witness Information Section */}
        <Section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Witnesses
          </h2>
          {witnesses.map((witness, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <input
                type="text"
                placeholder="Witness Name"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={witness.name}
                onChange={(e) =>
                  handleWitnessChange(index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Witness Address"
                className="border border-gray-300 p-3 rounded-md w-full"
                value={witness.address}
                onChange={(e) =>
                  handleWitnessChange(index, "address", e.target.value)
                }
              />
              <button
                onClick={() => removeWitness(index)}
                className="text-[#538d2dfd] hover:underline inline-block"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            onClick={addWitness}
            className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
          >
            <FaPlus className="inline mr-2" /> Add Witness
          </button>
        </Section>
        <Section className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Digital Signature</h2>
  
  <div className="mb-4">
    <input
      type="file"
      accept="image/*" 
      onChange={(e) => handleSignatureUpload(e)}
      className="border border-gray-300 p-3 rounded-md w-full"
    />
  </div>

  {signature && (
    <div className="mt-2">
      <p className="text-gray-800">Uploaded Signature:</p>
      <img
        src={URL.createObjectURL(signature)}
        alt="Signature Preview"
        className="w-32 h-32 object-contain mt-2"
      />
    </div>
  )}
</Section>
        <div className="">
          <button
            onClick={handleSubmit}
            className="text-white py-3 px-6 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] transition-all"
          >
            <FaCheckCircle className="inline mr-2" /> Submit Will
          </button>
        </div>
      </div>

      <ToastContainer />


    </div>
  );
};

export default WillForm;
