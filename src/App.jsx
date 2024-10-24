import React, { useContext } from "react";
import "./App.css";
import "./assets/css/Main.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Contexts/Context";
import Home from "./Pages/Home";
import LoginForm from "./Forms/Login";
import "react-toastify/dist/ReactToastify.css";
import OTPVerification from "./Forms/otp-verification";
import ForgotPassword from "./Forms/Forgetpass";
import Aadhaarotp from "./Forms/Aadhaarotp";
import NewPassword from "./Forms/NewPassword";
import Nomineeform from "./Forms/Nomineeform";
import Layout from "./layouts/Layout"; 
import Beneficiary from "./Forms/Beneficiary";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/signin" />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/aadhar" element={<Aadhaarotp />} />
        <Route path="/beneficiary" element={<Beneficiary />} />
        <Route path="/nominee" element={<Nomineeform />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
      </Route>
      <Route
        path="/signin"
        element={isLoggedIn ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route path="/forgetpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
