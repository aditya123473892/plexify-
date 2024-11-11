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
      <header className="mb-8 text-white rounded-2xl bg-[#548831]">
        <div className="  p-5 mt-4 rounded-xl">
          <div className="flex justify-between text-white">
            <div className="text-center">
              <img
                className="w-2/5 mx-auto filter brightness-[20.5]"
                src={wealthlogo}
                alt="Manage, Grow, Pass On"
              />
              <p className="pt-3 ">Manage, Grow, Pass On</p>
            </div>

            <div className="text-center flex flex-col justify-center">
              <h2 className="text-6xl font-bold text-center py-5 text-[#daa431]">
                Manage Grow Inherit
              </h2>
              <h2 className="text-lg text-center text-white">
                चिंतामुक्त भविष्य, विरासत का सुखद सफर
              </h2>
            </div>

            <div className="text-center mt-2">
              <img
                className="w-2/5 mx-auto rounded-full filter brightness-[20.5]"
                src={video_pic}
                alt="Video Consultation Booking"
              />
              <p className="pt-2">Video Consultation Booking</p>
            </div>
          </div>
        </div>
      </header>

      <div>
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
                <div className="flex justify-between mt-3 ">
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
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {["Statement", "Manage", "Spends"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 2 && <span className="mx-2">|</span>}
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
                <div className="flex justify-between mt-3 ">
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
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {["Statement", "Manage", "Spends"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 2 && <span className="mx-2">|</span>}
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
                <div className="flex justify-between mt-3 ">
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
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around border-t-2 pt-3 mt-3 text-white">
              {["Statement", "Manage", "Spends"].map((text, index) => (
                <React.Fragment key={index}>
                  <div>{text}</div>
                  {index < 2 && <span className="mx-2">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* charts */}
        <div className="mt-10">
          {/* Metrics Overview Heading */}

          {/* Metrics Cards Section */}
          <div className="flex flex-wrap justify-center space-x-4">
            <div className="mt-10">
              {/* Metrics Overview Heading */}
              <div className="text-2xl font-bold text-center text-[#538d2d] mb-6">
                Metrics Overview
              </div>

              {/* Metrics Cards Section */}
              <div className="flex flex-wrap justify-center space-x-4">
                {metrics.map((metric, index) => (
                  <MetricCard
                    key={index}
                    {...metric}
                    className="flex-1 min-h-[500px] rounded-2xl p-6 my-6 text-white shadow-2xl bg-[#f5f5f5] border-l-8 border-[#85bb65]"
                  />
                ))}
              </div>
            </div>

            {/* Main Card Section */}
            <div className="w-full md:w-4/12 p-6 my-6 rounded-2xl text-white shadow-2xl bg-[#538d2dfd] z-40 relative border-l-8 border-[#538d2dfd] flex flex-col items-center space-y-6 min-h-[500px]">
              <div className="absolute inset-0 opacity-40 bg-slate-200 rounded-2xl"></div>

              {/* Header Icon Section */}
              <div className="flex justify-end w-full mb-6 pr-4 z-10">
                {/* <MdOutlineQueryStats className="text-3xl p-3 rounded-full shadow-lg bg-white text-[#538d2dfd]" /> */}
              </div>

              {/* Circle Chart Section */}
              <div className="relative flex justify-center items-center mb-8 h-[300px] z-10">
                {/* Circle 1 */}
                <div className="w-24 h-24 bg-[#85bb65] rounded-full opacity-90 absolute left-5 bottom-10 flex flex-col items-center justify-center text-white text-sm font-semibold shadow-lg">
                  <div>25%</div>
                  <div className="text-xs">Current Liabilities</div>
                </div>

                {/* Circle 2 */}
                <div className="w-44 h-44 bg-[#5cace4] rounded-full opacity-90 absolute -top-10 flex flex-col items-center justify-center text-white text-lg font-semibold shadow-lg">
                  <div>70%</div>
                  <div className="text-sm">Net Worth</div>
                </div>

                {/* Circle 3 */}
                <div className="w-28 h-28 bg-[#f3a541] rounded-full opacity-90 absolute top-24 right-5 flex flex-col items-center justify-center text-white text-base font-semibold shadow-lg">
                  <div>45%</div>
                  <div className="text-xs">In this month</div>
                </div>
              </div>

              {/* Stats and Progress Bars Section */}
              <div className="w-full space-y-4 z-10">
                {/* Stat 1 */}
                <div className="flex flex-col">
                  <div className="flex justify-between text-white text-lg font-semibold mb-1">
                    <span>Current Liabilities</span>
                    <span className="text-green-400 flex items-center">
                      <FaArrowTrendUp className="inline-block mr-1" /> 70%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
                    <div
                      className="bg-[#85bb65] h-4 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col">
                  <div className="flex justify-between text-white text-lg font-semibold mb-1">
                    <span>Net Worth</span>
                    <span className="text-blue-700 flex items-center">
                      <FaArrowTrendUp className="inline-block mr-1" /> 45%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
                    <div
                      className="bg-[#5cace4] h-4 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col">
                  <div className="flex justify-between text-white text-lg font-semibold mb-1">
                    <span>In this month</span>
                    <span className="text-yellow-700 flex items-center">
                      <FaArrowTrendUp className="inline-block mr-1" /> 25%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
                    <div
                      className="bg-[#f3a541] h-4 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Chartsline></Chartsline>

        <PaymentsSlider />
        <Accordion />
      </div>
    </>
  );
};

export default Home;
