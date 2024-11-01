import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import '../assets/css/Bubbles.css';
import { FaLock } from "react-icons/fa";

function NewPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      const bubbleCount = 10;
      for (let i = 0; i < bubbleCount; i++) {
        const size = Math.random() * 250 + 120;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 4 + 2;

        newBubbles.push(
          <div
            key={i}
            className="bubble"
            style={{
              width: size,
              height: size,
              left: `${left}vw`,
              top: `${top}vh`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validateForm = () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError("");
    return true;
  };

  const postData = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3523/reset-password",
          { token, newPassword }
        );
        if (response.status === 200) {
          toast.success("Password reset successfully!");
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else {
          toast.error(response?.data?.msg || "Error resetting password.");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to reset password.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bubble-container">
      {bubbles}
      <div className="min-h-screen flex items-center justify-center p-10 relative z-10">
        <div className="w-full max-w-lg bg-slate-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-black mb-6">Reset Password</h2>

<form onSubmit={postData}>
  <div className="flex items-center border w-full mb-4 shadow-md rounded-lg">
    <FaLock className="ml-3 text-gray-500" />
    <input
      type="password"
      name="newPassword"
      value={newPassword}
      onChange={handlePasswordChange}
      placeholder="New Password"
      aria-label="New Password"
      className="p-3 w-full text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-lg"
      required
    />
  </div>
  
  <div className="flex items-center border w-full mb-4 shadow-md rounded-lg">
    <FaLock className="ml-3 text-gray-500" />
    <input
      type="password"
      name="confirmPassword"
      value={confirmPassword}
      onChange={handleConfirmPasswordChange}
      placeholder="Confirm Password"
      aria-label="Confirm Password"
      className="p-3 w-full text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-lg"
      required
    />
  </div>
  
  {error && <p className="text-red-500 mb-4">{error}</p>}
  <button
    type="submit"
    disabled={loading}
    className={`w-full bg-[#385723] text-white py-3 shadow-md rounded-lg transition ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#293f1a]"
    }`}
  >
    {loading ? "Resetting..." : "Reset Password"}
  </button>
</form>

        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default NewPassword;
