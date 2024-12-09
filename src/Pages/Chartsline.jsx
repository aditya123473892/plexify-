import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";

const Chartsline = () => {
  const [financialData, setFinancialData] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get(`${API}/beneficiary_user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Process and map the beneficiary data
        const fetchedBeneficiaries = response.data.beneficiaries.map((beneficiary) => ({
          id: beneficiary.beneficiary_id,
          name: beneficiary.name || "N/A",
          relation: beneficiary.relationship || "N/A",
          document_path: beneficiary.document_path || null,
          entitlement: parseFloat(beneficiary.entitlement) || 0, // Ensure numeric value
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

  const handleViewAll = (section) => {
    console.log(`View all clicked for ${section}`);
    // Add your navigation or modal logic here
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <style>
        {`
          .dashboard {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          .dashboard-card {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            background-color: white;
            height: 400px; /* Fixed height for uniformity */
            overflow: hidden;
          }
          .card-content {
            flex: 1;
            overflow-y: auto;
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
            background-color: #4caf50;
          }
          .view-all-button {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 16px;
            font-size: 14px;
            color: white;
            background-color: #8884d8;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            transition: background-color 0.3s ease;
          }
          .view-all-button:hover {
            background-color: #6b6ab7;
          }
        `}
      </style>

      {/* Beneficiaries Section */}
      <div className="dashboard-card beneficiaries">
        <h3>Beneficiaries</h3>
        <div className="card-content">
          {error ? (
            <div>{error}</div>
          ) : beneficiaries.length > 0 ? (
            beneficiaries.slice(0, 3).map((beneficiary) => (
              <div key={beneficiary.id} className="beneficiary-item">
                <img
                  src={
                    beneficiary.document_path || "https://via.placeholder.com/50"
                  }
                  alt={`Beneficiary ${beneficiary.name}`}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    {beneficiary.name}
                  </p>
                  <p style={{ margin: 0, color: "#555" }}>
                    Relation: {beneficiary.relation}
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${Math.min(beneficiary.entitlement, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No beneficiaries available</div>
          )}
        </div>
        <button
          className="view-all-button"
          onClick={() => handleViewAll("Beneficiaries")}
        >
          View All
        </button>
      </div>

      {/* Top 5 Investments Section */}
      <div className="dashboard-card investments">
        <h3>Top 5 Investments</h3>
        <div className="card-content">
          {investmentsWithPercentage.map((investment, index) => (
            <div key={index} className="investment-item">
              <span style={{ flex: 1 }}>{investment.name}</span>
              <span>{investment.percentage}%</span>
              <div className="progress-bar" style={{ flex: 1, marginLeft: "15px" }}>
                <div
                  className="progress"
                  style={{
                    width: `${investment.percentage}%`,
                    backgroundColor: "#8884d8",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="view-all-button"
          onClick={() => handleViewAll("Top Investments")}
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default Chartsline;
