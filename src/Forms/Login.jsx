import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import RegistrationForm from "../Forms/Registrationform"; 
import logo from "../assets/images/logo.png"; 
import BubbleContainer from "../Components/BubbleContainer";

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

  if (isLoggedIn) {
    setTimeout(() => {
      navigate("/");
    }, 1000);
    return null;
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
         <BubbleContainer />
    <div
      className={`w-1/2 flex items-center justify-center p-10 transition-all duration-1000 ease-in-out ${
        showSignup ? "w-[60%] bg-white" : "w-1/2 bg-[#385723]"
      }`}
    >
      <img src={logo} alt="Logo" srcset=""  className={` ${showSignup ? "hidden" : " "}`}/>
      {showSignup && (
        <div className="w-full max-w-xl z-30">
          
          <div className="shadow-2xl p-4 rounded-lg">
          {/* <BubbleContainer /> */}
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
          </div>
        </div>
      )}
    </div>
 
    <div
      className={`w-1/2 flex items-center justify-center p-10 transition-all duration-1000 ease-in-out bg ${
        showSignup ? "w-1/2 bg-[#385723]" : "w-[60%] bg-slate-50"
      }`}
    >
     <img src={logo} alt="Logo" srcset=""  className={` ${showSignup ? "" : "hidden"}`}/>
      {!showSignup && (
        <div className="w-full max-w-lg text-center z-30">
          <div className="shadow-2xl p-4 rounded-lg">
          
          <img
            src={logo} 
            alt="Logo"
            className="mx-auto mb-[-60px] ms-6"
          />
  
          <h2 className="text-2xl font-bold text-black mb-6">Hello! Welcome back</h2>
  
          <form onSubmit={postData}>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInp}
              placeholder="Email"
              aria-label="Email"
              className="p-3 border w-full mb-4 shadow-md rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInp}
              placeholder="Password"
              aria-label="Password"
              className="p-3 border w-full mb-2 shadow-md rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
  
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
                onClick={()=>navigate('/forgetpassword')} 
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
        </div>
        </div>
      )}
      
    </div>
  
    <ToastContainer />
  </div>
  
  
  );
}

export default LoginForm;
