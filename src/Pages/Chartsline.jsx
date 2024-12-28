import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import { Link, useNavigate } from "react-router-dom";

const Chartsline = () => {
  const [financialData, setFinancialData] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API, token } = useContext(AuthContext);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get(`${API}/beneficiaries`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedBeneficiaries = response.data.beneficiaries.map((beneficiary) => ({
          id: beneficiary.beneficiary_id,
          name: beneficiary.name || "N/A",
          relation: beneficiary.relationship || "N/A",
          document: beneficiary.document || null,
          entitlement: parseFloat(beneficiary.entitlement) || 0,
        }));
        setBeneficiaries(fetchedBeneficiaries);
      } catch (err) {
        console.error("Error fetching beneficiaries:", err);
        setError("Error fetching beneficiaries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFinancialSummary = async () => {
      try {
        const response = await axios.get(`${API}/financial-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFinancialData(response.data);
      } catch (err) {
        console.error("Failed to load financial summary:", err);
        setError("Failed to load financial summary. Please try again later.");
      }
    };

    fetchBeneficiaries();
    fetchFinancialSummary();
  }, [API, token]);

  const topInvestments = financialData?.top_investments || [];
  const totalInvestmentValue = topInvestments.reduce((total, investment) => total + investment.value, 0);

  const investmentsWithPercentage = topInvestments.map((investment) => ({
    ...investment,
    percentage: ((investment.value / totalInvestmentValue) * 100).toFixed(2),
  }));

  const getImageSrc = (document) => {
    if (!document) return "https://via.placeholder.com/50";
    if (document.type === "Buffer" && Array.isArray(document.data)) {
      const base64String = btoa(String.fromCharCode(...new Uint8Array(document.data)));
      return `data:image/jpeg;base64,${base64String}`;
    }
    return document;
  };

  const handleBeneficiaryClick = (beneficiaryId) => {
    navigate(`/beneficiary/${beneficiaryId}`); // Navigate to the beneficiary page
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard grid lg:grid-cols-2 md:grid-cols-1 gap-6">
      <style>
        {`
          .dashboard {
            font-family: 'Poppins', sans-serif;
          }
          .dashboard-card {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            background-color: white;
            height: 420px;
            overflow: hidden;
          }
          .beneficiary-item img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 15px;
          }
          .progress-bar {
            height: 10px;
            width: 100%;
            background-color: #eee;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 5px;
          }
          .progress-bar .progress {
            height: 100%;
            background-color: #538d2dfd;
          }
        `}
      </style>

      {/* Beneficiaries Section */}
      <div className="dashboard-card bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Beneficiaries</h3>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : beneficiaries.length > 0 ? (
          beneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className="beneficiary-item flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer"
              onClick={() => handleBeneficiaryClick(beneficiary.id)}
            >
              <div>
                <img
                  src={getImageSrc(beneficiary.document)}
                  alt={`Beneficiary ${beneficiary.name}`}
                  className="object-cover rounded-full"
                />
              </div>
              <div className="w-full">
                <p className="font-bold text-lg text-gray-700">
                  {beneficiary.name}{" "}
                  <span style={{ fontFamily: "Roboto Mono, monospace" }} className="text-sm">
                    {Math.min(beneficiary.entitlement, 100)}%
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-600">Relation:</span> {beneficiary.relation}
                </p>
                <div className="progress-bar bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div
                    className="progress bg-blue-500 h-full"
                    style={{
                      width: `${Math.min(beneficiary.entitlement, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm">No beneficiaries available</div>
        )}
      </div>

      {/* Top 5 Investments Section */}
      <div className="dashboard-card bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Top 5 Investments</h3>
        {investmentsWithPercentage.map((investment, index) => (
           <Link to={investment.link}>
          <div key={index} className="investment-item mb-4">
            <div className="flex justify-between items-center">
              <span>{investment.name}</span>
              <span style={{ fontFamily: "Roboto Mono, monospace" }}>{investment.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${investment.percentage}%` }}
              ></div>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Chartsline;
