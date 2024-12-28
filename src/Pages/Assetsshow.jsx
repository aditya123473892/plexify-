import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";

const AssetsPage = () => {
  const { API, token } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
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
        axios.get(`${API}/insurance`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/deposits`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/cryptocurrencies`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/recurring_deposits`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/properties`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/stocks`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/mutual-funds`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/bonds`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const assets = [
        ...insuranceResponse.data.policies.map((policy) => ({
          name: policy.policy_name,
          value: policy.coverage_limit,
          type: "Insurance Policy",
        })),
        ...depositsResponse.data.deposits.map((deposit) => ({
          name: deposit.deposit_name,
          value: deposit.deposit_amount,
          type: "Fixed Deposit",
        })),
        ...cryptoResponse.data.cryptos.map((crypto) => ({
          name: crypto.name,
          value: crypto.current_value,
          type: "Cryptocurrency",
        })),
        ...recurringDepositsResponse.data.deposits.map((rd) => ({
          name: rd.bank_name,
          value: rd.maturity_amount,
          type: "Recurring Deposit",
        })),
        ...propertiesResponse.data.properties.map((property) => ({
          name: property.property_name,
          value: property.current_value,
          type: "Property",
        })),
        ...stocksResponse.data.stocks.map((stock) => ({
          name: stock.symbol,
          value: stock.current_value,
          type: "Stock",
        })),
        ...mutualFundsResponse.data.mutualFunds.map((fund) => ({
          name: fund.fund_name,
          value: fund.current_value,
          type: "Mutual Fund",
        })),
        ...bondsResponse.data.bonds.map((bond) => ({
          name: bond.issuer,
          value: bond.market_value,
          type: "Bond",
        })),
      ];

      setAssets(assets);
      toast.success("Assets fetched successfully.");
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to fetch assets.");
    }
  };

  const calculateTotalAssets = () =>
    assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0);

  useEffect(() => {
    setLoading(true);
    fetchAssets().finally(() => setLoading(false));
  }, [API, token]);

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Assets Overview</h1>
        <p className="text-gray-600">Track all your assets in one place.</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Section title="Assets">
            <table className="table-auto w-full text-left border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index}>
                    <td className="p-2">{asset.name}</td>
                    <td className="p-2">{`₹${asset.value}`}</td>
                    <td className="p-2">{asset.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Summary">
            <p className="text-gray-800 font-bold">
              Total Assets: ₹{calculateTotalAssets().toFixed(2)}
            </p>
          </Section>
        </>
      )}
    </div>
  );
};

export default AssetsPage;
