import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaCheckCircle, FaSyncAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Contexts/Context";
import "react-toastify/dist/ReactToastify.css";

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Your Will
        </h1>
        <p className="text-gray-600">
          Fill out the form below to draft your last will and testament.
        </p>
      </header>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Personal Information Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
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
              <input
                key={idx}
                type={field === "address" ? "textarea" : "text"}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="border border-gray-300 p-3 rounded-md w-full"
                value={personalInfo[field]}
                onChange={(e) =>
                  handlePersonalInfoChange(field, e.target.value)
                }
              />
            ))}
          </div>
        </section>

        {/* Wealth Details Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            Wealth Details
            <button
              onClick={fetchWealthDetails}
              className="ml-4 text-blue-600 hover:underline flex items-center"
            >
              <FaSyncAlt className="mr-2" /> Refresh
            </button>
          </h2>
          {loading ? (
            <p>Loading wealth details...</p>
          ) : wealthDetails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Type</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Details
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Value</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wealthDetails.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {item.type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.details}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.value}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleDeleteWealth(item.id)}
                          className="text-red-500 hover:underline"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No wealth details available.</p>
          )}
        </section>

        {/* Witness Information Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
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
                className="text-red-500 hover:underline"
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
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="text-white py-3 px-6 rounded-md shadow-md bg-blue-600 hover:bg-blue-700 transition-all"
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
