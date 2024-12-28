// File: src/components/OTPVerification.jsx
import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "animate.css"; // Importing animate.css for predefined animations

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Handle OTP input changes
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input box if current box is filled
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = () => {
    alert(`OTP Submitted: ${otp.join("")}`);
  };

  const handleResend = () => {
    alert("OTP Resent!");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-gray-[#3857239f] to-blue-[#3857239f]">
      <div className="bg-[#3d5e27fd] p-8 rounded-md shadow-lg ">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Verify your Mobile OTP
        </h2>
        <div className="flex justify-center mb-4">
          <i className="fas fa-lock text-4xl text-[#385723] "></i>
        </div>

        {/* OTP Input Boxes with Transition Animation */}
        <div className="flex justify-center mb-6 space-x-2">
          <TransitionGroup component={null}>
            {otp.map((data, index) => (
              <CSSTransition key={index} timeout={500} classNames="otp-input">
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 border border-gray-300 rounded text-center mx-1 text-lg transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>

        <div className="text-center mb-4">
          <button
            onClick={handleSubmit}
            className="hover:bg-[#949c8f9f] hover:text-white px-6 py-2 rounded-md bg-white text-[#3857239f] transition transform hover:scale-105 active:scale-95 duration-150 shadow-md"
          >
            Verify
          </button>
        </div>

        <div className="text-center text-white">
          <p>
            OTP not received?{" "}
            <span
              className="text-[#61db109f] cursor-pointer hover:underline hover:text-[#3e80129f] transition"
              onClick={handleResend}
            >
              RESEND
            </span>
          </p>
        </div>
      </div>

      {/* Custom OTP input animation */}
      <style jsx="true">{`
        .otp-input-enter {
          opacity: 0;
        }
        .otp-input-enter-active {
          opacity: 1;
          transition: opacity 500ms ease-in;
        }
        .otp-input-exit {
          opacity: 1;
        }
        .otp-input-exit-active {
          opacity: 0;
          transition: opacity 500ms ease-in;
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;
