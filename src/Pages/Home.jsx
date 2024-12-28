// src/components/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../assets/css/swiper.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PaymentsSlider from "../Components/PaymentsSlider";
import Accordion from "../Components/Accordion";
import Chartsline from "./Chartsline";
import VideoChat from "../Components/Videochat";
import { AuthContext } from "../Contexts/Context";
import axios from "axios";
import LiabilitiesSlider from "../Components/Liabilitis";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const formatToINR = (value) => {
  if (!value) return "0";
  if (value >= 10000000) {
    const crores = value / 10000000;
    return `${crores.toFixed(2)} crore`;
  } else if (value >= 100000) {
    const lakhs = value / 100000;
    return `${lakhs.toFixed(2)} lakh`;
  } else {
    const thousands = value / 1000;
    return `${thousands.toFixed(2)} thousand`;
  }
};

const Home = () => {
  const { API, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState(null);

  const navigate = useNavigate();

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

  const maxValue = financialData
    ? Math.max(
        financialData.total_wealth || 0,
        financialData.total_liabilities || 0,
        (financialData.total_wealth || 0) - (financialData.total_liabilities || 0)
      )
    : 0;

  const computedNetWorth = financialData
    ? (financialData.total_wealth || 0) - (financialData.total_liabilities || 0)
    : 0;

  return (
    <>
      <VideoChat />
      <div className="mt-24 md:mt-16">
        <div className="grid md:grid-cols-3 gap-7">
          {/* Total Wealth Section */}
          <div
            onClick={() => navigate("/assetsshow")}
            className="col-span-1 z-20 border-l-8 rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <div className="bground"></div>
            <div className="flex justify-end pb-4"></div>
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressbar
                  value={
                    financialData
                      ? (financialData.total_wealth / maxValue) * 100
                      : 0
                  }
                  text={`${financialData ? ((financialData.total_wealth / maxValue) * 100).toFixed(2) : 0}%`}
                  styles={buildStyles({
                    pathColor: "#538d2dfd",
                    textColor: "#ffffff",
                    trailColor: "#e6e6e6",
                    textSize: "16px",
                    fontFamily: "Roboto Mono, monospace",
                  })}
                />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                  Total Wealth
                  <div style={{ fontFamily: "Roboto Mono, monospace" }}>
                    ₹{financialData ? formatToINR(financialData.total_wealth) : "0"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liabilities Section */}
          <div
            onClick={() => navigate("/liabilitiesshow")}
            className="col-span-1 z-20 border-l-8 rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <div className="bground"></div>
            <div className="flex justify-end pb-4"></div>
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressbar
                  value={
                    financialData
                      ? (financialData.total_liabilities / maxValue) * 100
                      : 0
                  }
                  text={`${financialData ? ((financialData.total_liabilities / maxValue) * 100).toFixed(2) : 0}%`}
                  styles={buildStyles({
                    pathColor: "#ff9800",
                    textColor: "#ffffff",
                    trailColor: "#e6e6e6",
                    textSize: "16px",
                    fontFamily: "Roboto Mono, monospace",
                  })}
                />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                  Current Liabilities
                  <div style={{ fontFamily: "Roboto Mono, monospace" }}>
                    ₹{financialData ? formatToINR(financialData.total_liabilities) : "0"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Worth Section */}
          <div
            onClick={() => navigate("/net-worth")}
            className="col-span-1 z-20 border-l-8 rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <div className="bground"></div>
            <div className="flex justify-end pb-4"></div>
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressbar
                  value={
                    financialData
                      ? (computedNetWorth / maxValue) * 100
                      : 0
                  }
                  text={`${financialData ? ((computedNetWorth / maxValue) * 100).toFixed(2) : 0}%`}
                  styles={buildStyles({
                    pathColor: "#007aff",
                    textColor: "#ffffff",
                    trailColor: "#e6e6e6",
                    textSize: "16px",
                    fontFamily: "Roboto Mono, monospace",
                  })}
                />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                  Net Worth
                  <div style={{ fontFamily: "Roboto Mono, monospace" }}>
                    ₹{formatToINR(computedNetWorth)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Chartsline />
        <PaymentsSlider />
        <LiabilitiesSlider />
        <Accordion />
      </div>
    </>
  );
};

export default Home;
