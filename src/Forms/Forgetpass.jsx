import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInp = (e) => {
    setEmail(e.target.value);
  };

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
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
          "http://localhost:3523/forgot-password",
          { email }
        );
        if (response.status === 200) {
          toast.success("Password reset email sent!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(response?.data?.msg || "Error sending reset email.");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to send reset email.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#385723] p-10">
      <div className="w-full max-w-lg bg-slate-50 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-black mb-6">Forgot Password</h2>
        <form onSubmit={postData}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInp}
            placeholder="Email"
            aria-label="Email"
            className="p-3 border w-full mb-4 shadow-md rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#385723] text-white py-3 shadow-md rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#293f1a]"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-4 text-sm text-black">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#203118] font-bold"
          >
            Login here
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
