// src/components/UserProfile.js
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaGenderless,
} from "react-icons/fa";
import wealthlogo from "../assets/images/Picture_1.png";
import Footer from "../Components/Footer";

// Mock data for the user profile
const userData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  aadharNumber: "1234-5678-9123",
  phoneNumber: "+1 (123) 456-7890",
  gender: "Male",
  beneficiary: "Yes",
  netWorth: 75,
  liabilities: 40,
  assets: 60,
};

const MetricCard = ({ title, value, percentage, color }) => (
  <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 w-60 h-80 text-center m-4">
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 my-2">{value}</p>

    <div className="w-24 h-24 mb-3">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: color,
          textColor: color,
          trailColor: "#e0e0e0",
          textSize: "22px",
        })}
      />
    </div>
  </div>
);

const UserProfile = () => {
  return (
    <>
      <header className="mb-8 text-white rounded-2xl bg-[#548831]">
        <div className="p-5 mt-4 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <img
                className="w-2/5 mx-auto filter brightness-[20.5]"
                src={wealthlogo}
                alt="User Profile"
              />
              <p className="pt-3">Your Profile Overview</p>
            </div>

            <div className="text-center flex flex-col justify-center">
              <h2 className="text-5xl font-bold py-5 text-[#daa431]">
                Welcome, {userData.firstName}
              </h2>
              <p className="text-lg text-white">
                Manage, Update, and Track Your Profile
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-10 pb-10 bg-gray-100">
        <div className="grid md:grid-cols-3 gap-7">
          {/* User Information Cards */}
          <div className="col-span-1 bg-white rounded-lg shadow-lg p-6 text-center">
            <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold">
              {userData.firstName} {userData.lastName}
            </h3>
            <p className="text-gray-500">Personal Information</p>

            <div className="mt-4 text-left space-y-3">
              <p>
                <FaEnvelope className="inline mr-2 text-gray-500" /> Email:{" "}
                {userData.email}
              </p>
              <p>
                <FaIdCard className="inline mr-2 text-gray-500" /> Aadhaar:{" "}
                {userData.aadharNumber}
              </p>
              <p>
                <FaPhone className="inline mr-2 text-gray-500" /> Phone:{" "}
                {userData.phoneNumber}
              </p>
              <p>
                <FaGenderless className="inline mr-2 text-gray-500" /> Gender:{" "}
                {userData.gender}
              </p>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="col-span-2 flex flex-wrap justify-center items-center space-x-4">
            <MetricCard
              title="Net Worth"
              value="₹1.2M"
              percentage={userData.netWorth}
              color="#4caf50"
            />
            <MetricCard
              title="Liabilities"
              value="₹450K"
              percentage={userData.liabilities}
              color="#ff9800"
            />
            <MetricCard
              title="Assets"
              value="₹750K"
              percentage={userData.assets}
              color="#03a9f4"
            />
          </div>
        </div>

        {/* Activity Section with Progress Bars */}
      </div>

      <Footer />
    </>
  );
};

export default UserProfile;
