import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import wealthlogo from "../assets/images/Picture_1.png";
import video_pic from "../assets/images/video_pic.png";
import { FaArrowTrendUp } from "react-icons/fa6";
import "../assets/css/swiper.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { MdArrowOutward, MdOutlineQueryStats } from "react-icons/md";
import { FaMoneyBillWave, FaHandsHelping } from "react-icons/fa";
import { Link } from "react-router-dom";
import FeatureSwiper from "../Components/FeatureSwiper";
import PaymentsSlider from "../Components/PaymentsSlider";
import Accordion from "../Components/Accordion";
import { FaLightbulb, FaEye } from "react-icons/fa";
import Chartsline from "./Chartsline";
import VideoChat from "../Components/Videochat";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const data = {
    labels: ["Profit", "Cost"],
    datasets: [
      {
        label: "Monthly Stats",
        data: [95, 19],
        backgroundColor: ["rgba(10, 108, 18, 0.9)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(10, 108, 18, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  const metrics = [
    {
      title: "Networth",
      value: 932,

      percentage: 75,
      color: "#6a1b9a",
      icon: <FaLightbulb />,
      footerText: "Completed",
    },
    {
      title: "Wealth",
      value: 756,
      percentage: 50,
      color: "#4caf50",
      icon: <FaEye />,
      footerText: "Increased since yesterday",
    },
    {
      title: "Liabilities",
      value: 10038,
      percentage: 35,
      color: "#ff9800",
      icon: <FaEye />,
      footerText: "Increased since yesterday",
    },
  ];

  const MetricCard = ({
    title,
    value,
    total,
    percentage,
    color,
    icon,
    footerText,
  }) => (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 w-60 h-80 text-center m-4">
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 my-2">{value}</p>

      <div className="w-24 h-24 mb-3">
        <CircularProgressbar
          value={percentage}
          text={icon}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: "#e0e0e0",
            textSize: "22px",
          })}
        />
      </div>

      <p className="text-xl font-semibold text-gray-700">{total}</p>
      <p className="text-sm text-gray-500 mt-2">{footerText}</p>
    </div>
  );

  const CircularProgressBar = ({ percentage, title, color }) => {
    return (
      <div className="flex flex-col items-center w-20">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: color || "#ff0000",
            textColor: "#ffffff",
            trailColor: "#e6e6e6",
          })}
          strokeWidth={10}
        />
        {/* <h3 className="text-xl text-black mt-2 font-semibold whitespace-nowrap">&#x20b9; {title}</h3> */}
      </div>
    );
  };

  return (
    <>
      <VideoChat></VideoChat>

      <div className="mt-24 md:mt-16">
        <div className="grid md:grid-cols-3 gap-7">
          <div className="col-span-1 z-20 border-l-8  rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white">
            <div className="bground"></div>
            {/* Header Section */}
            <div className="flex justify-end pb-4 ">
              <div className="flex items-center whitespace-nowrap">
                <img
                  src={wealthlogo}
                  alt="Wealth Logo"
                  className="w-8 h-8 filter brightness-[20.5]"
                />
                <div className="pl-2 pt-1 italic text-white">Wealth Guard</div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressBar
                  percentage={90}
                  title="10,00,000"
                  color="#538d2dfd"
                />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                  Total Wealth
                  <div>
                    <span>₹</span> 39.09 Lakhs
                  </div>
                </div>

                {/* Sub-Balances */}
                {/* <div className="flex justify-between mt-3 ">
                  {[
                    {
                      label: "Saving (3)",
                      amount: "19.09",
                      bgColor: "bg-[#538d2dfd]",
                    },
                    {
                      label: "Deposit (3)",
                      amount: "20.00",
                      bgColor: "bg-[#538d2dfd]",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div
                        className={`w-8 h-2 rounded-3xl my-2 ${item.bgColor} bg-white`}
                      />
                      <div className="text-sm font-bold text-white">
                        {item.label}
                        <div>
                          <span>₹</span> {item.amount} Lakhs
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 border-white text-white">
              {/* {["Statement", "Manage", "Spends"].map((text, index) => ( */}
              {["View All"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {/* {index < 2 && <span className="mx-2">|</span>} */}
                  {index < 0 && <span className="mx-2">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="col-span-1 z-20 border-l-8  rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white">
            <div className="bground"></div>
            {/* Header Section */}
            <div className="flex justify-end pb-4 ">
              <div className="flex items-center whitespace-nowrap">
                <img
                  src={wealthlogo}
                  alt="Wealth Logo"
                  className="w-8 h-8 filter brightness-[20.5]"
                />
                <div className="pl-2 pt-1 italic text-white">Wealth Guard</div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressBar
                  percentage={90}
                  title="10,00,000"
                  color="#538d2dfd"
                />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                  Current Liabilities
                  <div>
                    <span>₹</span> 39.09 Lakhs
                  </div>
                </div>

                {/* Sub-Balances */}
                {/* <div className="flex justify-between mt-3 ">
                  {[
                    {
                      label: "Saving (3)",
                      amount: "19.09",
                      bgColor: "bg-[#538d2dfd]",
                    },
                    {
                      label: "Deposit (3)",
                      amount: "20.00",
                      bgColor: "bg-[#538d2dfd]",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div
                        className={`w-8 h-2 rounded-3xl my-2 ${item.bgColor} bg-white`}
                      />
                      <div className="text-sm font-bold text-white">
                        {item.label}
                        <div>
                          <span>₹</span> {item.amount} Lakhs
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {/* {["Statement", "Manage", "Spends"].map((text, index) => ( */}
              {["View All"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 0 && <span className="mx-2">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="col-span-1 z-20 border-l-8  rounded-3xl p-4 bg-[#538d2dfd] shadow-2xl group transition ease-in-out duration-500 relative overflow-hidden border-white">
            <div className="bground"></div>
            {/* Header Section */}
            <div className="flex justify-end pb-4 ">
              <div className="flex items-center whitespace-nowrap">
                <img
                  src={wealthlogo}
                  alt="Wealth Logo"
                  className="w-8 h-8 filter brightness-[20.5]"
                />
                <div className="pl-2 pt-1 italic text-white">Wealth Guard</div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="flex items-center">
              <div className="text-3xl font-semibold text-white w-36">
                <CircularProgressBar
                  percentage={90}
                  title="10,00,000"
                  color="#538d2dfd"
                />
              </div>
              <div className="pl-4 w-full text-white">
                <div className="text-2xl font-bold">
                  Net Worth
                  <div>
                    <span>₹</span> 39.09 Lakhs
                  </div>
                </div>

                {/* Sub-Balances */}
                {/* <div className="flex justify-between mt-3 ">
                  {[
                    {
                      label: "Saving (3)",
                      amount: "19.09",
                      bgColor: "bg-[#538d2dfd]",
                    },
                    {
                      label: "Deposit (3)",
                      amount: "20.00",
                      bgColor: "bg-[#538d2dfd]",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div
                        className={`w-8 h-2 rounded-3xl my-2 ${item.bgColor} bg-white`}
                      />
                      <div className="text-sm font-bold text-white">
                        {item.label}
                        <div>
                          <span>₹</span> {item.amount} Lakhs
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {/* {["Statement", "Manage", "Spends"].map((text, index) => ( */}
              {["View All"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 0 && <span className="mx-2">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* charts */}

        <Chartsline></Chartsline>

        <PaymentsSlider />
        <Accordion />
      </div>
    </>
  );
};

export default Home;
