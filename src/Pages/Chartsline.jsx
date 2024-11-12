// src/components/Dashboard.js
import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Chartsline = () => {
  const lineData = [
    { name: "Mon", sales: 100 },
    { name: "Tue", sales: 300 },
    { name: "Wed", sales: 200 },
    { name: "Thu", sales: 400 },
    { name: "Fri", sales: 350 },
    { name: "Sat", sales: 250 },
    { name: "Sun", sales: 300 },
  ];

  const pieData = [
    { name: "Liabilities", value: 18.85, color: "#ff0000" },
    { name: "Assets", value: 45.36, color: "#00aaff" },
    { name: "Networth", value: 50.69, color: "#ffaa00" },
  ];

  const trafficSources = [
    { source: "Direct", value: 80 },
    { source: "Social", value: 50 },
    { source: "Referral", value: 20 },
    { source: "Bounce", value: 60 },
    { source: "Internet", value: 40 },
  ];

  return (
    <div className="dashboard">
      {/* Sales Per Day */}
      <div className="dashboard-card sales-per-day">
        <h3>Wealth</h3>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={lineData}>
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="sales-info">
          <p>
            $4230 <span>Networth</span>
          </p>
          <p>
            321 <span>Today Sales</span>
          </p>
        </div>
        <div className="mini-stats">
          <p>
            REALTY <span style={{ color: "red" }}>-0.99</span>
          </p>
          <p>
            INFRA <span style={{ color: "green" }}>-7.66</span>
          </p>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="dashboard-card total-revenue">
        <h3>Total Revenue</h3>
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
            <p key={index} style={{ color: item.color }}>
              {item.name} <span>{item.value}%</span>
            </p>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="dashboard-card traffic-sources">
        <h3>Investements</h3>
        {trafficSources.map((source, index) => (
          <div key={index} className="traffic-source">
            <span>{source.source}</span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${source.value}%`,
                  backgroundColor: "#8884d8",
                }}
              ></div>
            </div>
            <span>{source.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chartsline;
