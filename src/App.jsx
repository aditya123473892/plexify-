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
import InsurancePolicies from "./Pages/Insurancepolicies";
import BankAccounts from "./Pages/Bankaccount";
import RealEstateManagement from "./Pages/RealEstate";
import DematAccountManagement from "./Pages/Demat";
import MutualFundsManagement from "./Pages/Mutualfunds";
import ProvidentFundsManagement from "./Pages/Providentfund";
import Esops from "./Pages/Esops";
import Ip from "./Pages/Ip";
import Liabilites from "./Pages/Liabilites";
import WillForm from "./Pages/Willform";
import Deposit from "./Pages/Deposit";

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
        <Route path="/insurance-policies" element={<InsurancePolicies />} />
        <Route path="/bank" element={<BankAccounts />} />
        <Route path="/property" element={<RealEstateManagement />} />
        <Route path="/demat" element={<DematAccountManagement />} />
        <Route path="/mutual-funds" element={<MutualFundsManagement />} />
        <Route path="/pf" element={<ProvidentFundsManagement />} />
        {/* ajit */}
        <Route path="/esops" element={<Esops />} />
        <Route path="/ip" element={<Ip />} />
        <Route path="/liabilites" element={<Liabilites />} />
        <Route path="/willform" element={<WillForm />} />
        <Route path="/fixed-deposit" element={<Deposit />} />
      </Route>
      <Route
        path="/signin"
        element={isLoggedIn ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route path="/reset-password/:token" element={<NewPassword />} />
      <Route path="/forgetpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
