// src/OTPVerificationForm.js

import React, { useState } from "react";
// import "animate.css"; // Add animate.css for animations
import logo from "../assets/images/logo.png"; 

const Aadhaarotp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Move to the next input if a valid number is entered
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp.join(""));
  };

  return (
    <div className="relative flex min-h-screen ">
      {/* Form on the left */}
      <div className="flex-1 flex flex-col items-center justify-center a">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-center text-2xl font-semibold mb-4 text-black">
            Verify your Aadhaar OTP
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center space-x-2 mb-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 transform hover:scale-105"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#385723] text-white font-semibold rounded-md shadow-md hover:bg-[#2d461c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800 transition-transform transform hover:scale-105 active:scale-95 duration-150"
            >
              VERIFY
            </button>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">OTP not received?</p>
              <button
                type="button"
                className="text-sm text-[#385723] hover:underline"
                onClick={() => console.log("Resend OTP")}
              >
                RESEND
              </button>
            </div>
          </form>
        </div>

        <button
          className="mt-4 text-sm text-white hover:underline transition-transform transform hover:scale-105"
          onClick={() => console.log("Go back")}
        >
          BACK
        </button>
      </div>

      {/* Cut-out with the logo on the right */}
      <div className="flex-1 relative ">
        <div className="absolute inset-0 flex items-center justify-center bg-[#385723]">
          {/* Cut-out effect */}
          <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[#385723] clip-path-custom"></div>
          {/* Logo inside the cut */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={logo} // Replace with actual logo URL
              alt="Logo"
              className="w-40 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aadhaarotp;
