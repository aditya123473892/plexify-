import React, { useContext } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Contexts/Context";
import Home from "./Pages/Home";
import LoginForm from "./Forms/Login";
import RegistrationForm from "./Forms/Registrationform";
import "react-toastify/dist/ReactToastify.css";
import OTPVerification from "./Forms/otp-verification";
import Aadhaarotp from "./Forms/Aadhaarotp";
// import Navbar from "./Components/Navbar";
// import Sidebar from "./Components/Sidebar";
// import NomineeForm from "./Forms/Nomineeform";
function App() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Home /> : <Navigate to="/signin" />}
      />
      <Route
        path="/signin"
        element={isLoggedIn ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route path="/signup" element={<RegistrationForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/otp" element={<OTPVerification />} />
      <Route path="/aadhar" element={<Aadhaarotp />} />
    </Routes>
  );
}

export default App;
