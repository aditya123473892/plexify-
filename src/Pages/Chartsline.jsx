import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../Contexts/Context";

const Chartsline = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        const response = await axios.get(`${API}/financial-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFinancialData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load financial summary. Please try again later.");
        setLoading(false);
      }
    };

    fetchFinancialSummary();
  }, [API, token]);
console.log('✌️financialData --->', financialData);
  const maxValue = Math.max(
    financialData?.total_wealth || 0,
    financialData?.total_liabilities || 0,
    financialData?.net_worth || 0
  );

  // Data for Line chart (dynamically updating based on financialData)
  const lineData = [
    {
      name: "Total Wealth",
      value: financialData ? financialData.total_wealth : 0,
    },
    {
      name: "Total Liabilities",
      value: financialData ? financialData.total_liabilities : 0,
    },
    {
      name: "Net Worth",
      value: financialData ? financialData.net_worth : 0,
    },
  ];

  // Pie chart data (example)
  const pieData = [
    {
      name: "Liabilities",
      value: financialData ? (financialData.total_liabilities / maxValue) * 100 : 0,
      color: "#ff0000",
    },
    {
      name: "Assets",
      value: financialData ? (financialData.total_wealth / maxValue) * 100 : 0,
      color: "#00aaff",
    },
    {
      name: "Networth",
      value: financialData ? (financialData.net_worth / maxValue) * 100 : 0,
      color: "#ffaa00",
    },
  ];

  // Extract top investments from financialData
  const topInvestments = financialData?.top_investments || [];

  // Calculate the total value of all investments
  const totalInvestmentValue = topInvestments.reduce((total, investment) => total + investment.value, 0);

  // Add percentage to each investment
  const investmentsWithPercentage = topInvestments.map((investment) => ({
    ...investment,
    percentage: ((investment.value / totalInvestmentValue) * 100).toFixed(2),
  }));

  // Calculate percentage change
  const calculatePercentageChange = (oldValue, newValue) => {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      {/* Sales Per Day / Line chart representing wealth, liabilities, net worth */}
      <div className="dashboard-card sales-per-day">
        <h3>Wealth Overview</h3>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={lineData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="sales-info">
          <p>
            {financialData && financialData.total_wealth} <span>Networth</span>
          </p>
          <p>
            {financialData && financialData.today_sales} <span>Today Sales</span>
          </p>
        </div>
        <div className="mini-stats">
          {lineData.map((data, index) => {
            if (index === 0) return null;
            const prevValue = lineData[index - 1].value;
            const percentageChange = calculatePercentageChange(prevValue, data.value);
            return (
              <p key={index}>
                {data.name} <span style={{ color: percentageChange < 0 ? "red" : "green" }}>
                  {percentageChange.toFixed(2)}%
                </span>
              </p>
            );
          })}
        </div>
      </div>

      {/* Total Revenue / Pie chart */}
      <div className="dashboard-card total-revenue">
        <h3>Net Worth</h3>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={50}
              innerRadius={30}
              paddingAngle={5}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-labels">
          {pieData.map((item, index) => (
            <p key={index} style={{ color: item.color }} className=" gap-2">
              {item.name} <span>{item.value.toFixed(2)} %</span>
            </p>
          ))}
        </div>
      </div>

      {/* Top 5 Investments */}
      <div className="dashboard-card investments">
        <h3>Top 5 Investments</h3>
        {investmentsWithPercentage.map((investment, index) => (
          <div key={index} className="investment-item my-2">
            <span className=" px-3">{investment.name}</span>
            <span>{investment.percentage}%</span> {/* Show percentage */}
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${investment.percentage}%`, // Set width based on the calculated percentage
                  backgroundColor: "#8884d8",
                }}
              ></div>
            </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chartsline;
