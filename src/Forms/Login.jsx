import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import RegistrationForm from "../Forms/Registrationform"; 
import logo from "../assets/images/logo.png"; 
import BubbleContainer from "../Components/BubbleContainer";
import { FaEnvelope, FaLock } from "react-icons/fa";
function LoginForm() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false); 

  const handleInp = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(user.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters.");
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
        const response = await axios.post("http://localhost:3523/signin", user);
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          login(response.data.token);
          toast.success("Signin successful!");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          toast.error(response?.data?.msg || "Details Not Match");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  
  const handleForgotPassword = async (e) => {
  }
  const handleRememberMe = async (e) => {
  }

  // if (isLoggedIn) {
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 1000);
  //   return null;
  // }

 
  return (
<div className="min-h-screen flex relative overflow-hidden">
  <BubbleContainer />
  
  {showSignup ? (
  <div className="hidden md:flex w-1/2 items-center justify-center p-10 transition-all duration-1000 ease-in-out bg-[#385723]">
    {/* Registration Logo or Content */}
    <img src={logo} alt="Logo for Signup" />
  </div>
) : (
  <div className="hidden md:flex w-1/2 items-center justify-center p-10 transition-all duration-1000 ease-in-out bg-[#385723]">
    {/* Login Logo or Content */}
    <img src={logo} alt="Logo for Login" />
  </div>
)}

 
  <div
    className={`w-full md:w-1/2 flex items-center justify-center p-2 md:p-10 transition-all duration-1000 ease-in-out  ${
      showSignup ? "" : "bg-slate-50"
    }`}
  >
    <div className="w-full max-w-lg  z-30 md:bg-white rounded-br-[60px] rounded-tl-[60px] rounded-lg">
      <div className="shadow-2xl p-4 rounded-br-[60px] rounded-tl-[60px] pb-12">
        {showSignup ? (
          <>
            {/* Registration Form */}
            <RegistrationForm />
            <p className="ms-6 text-sm text-black">
              Already have an account?{" "}
              <button
                onClick={() => setShowSignup(false)}
                className="text-[#203118] font-bold"
              >
                Login here
              </button>
            </p>
          </>
        ) : (
          <>
            {/* Login Form */}
            <img
              src={logo}
              alt="Logo"
              className="mx-auto mb-[-60px] ms-6 block" // Hides logo below md
            />
            <h2 className="text-2xl font-bold text-black mb-6">Hello! Welcome back</h2>
          

<form onSubmit={postData}>
  <div className="flex items-center border w-full mb-4 shadow-md rounded-lg">
    <FaEnvelope className="text-[#385723] mx-3" />
    <input
      type="email"
      name="email"
      value={user.email}
      onChange={handleInp}
      placeholder="Email"
      aria-label="Email"
      className="p-3 w-full text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-lg"
      required
    />
  </div>
  
  <div className="flex items-center border w-full mb-4 shadow-md rounded-lg">
    <FaLock className="text-[#385723] mx-3" />
    <input
      type="password"
      name="password"
      value={user.password}
      onChange={handleInp}
      placeholder="Password"
      aria-label="Password"
      className="p-3 w-full text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-lg"
      required
    />
  </div>
  
  <div className="flex justify-between items-center mb-6">
    <label className="flex items-center text-sm text-gray-600">
      <input
        type="checkbox"
        name="rememberMe"
        onChange={handleRememberMe}
        className="mr-2"
      />
      Remember Me
    </label>
    <button
      type="button"
      onClick={() => navigate('/forgetpassword')}
      className="text-sm text-[#203118] hover:underline"
    >
      Forgot password?
    </button>
  </div>
  
  {error && <p className="text-red-500 mb-4">{error}</p>}
  
  <button
    type="submit"
    disabled={loading}
    className={`w-full bg-[#385723] text-white py-3 shadow-md rounded-lg transition ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#293f1a]"
    }`}
  >
    {loading ? "Logging in..." : "LOGIN"}
  </button>
</form>

            <p className="mt-4 text-sm text-black">
              Don't have an account?{" "}
              <button
                onClick={() => setShowSignup(true)}
                className="text-[#203118] font-bold"
              >
                Register here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  </div>

  <ToastContainer />
</div>

  
  
  );
}

export default LoginForm;
