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
import BusinessInheritanceManagement from "./Pages/Businessinheritance";
import PreciousMetalsInheritanceManagement from "./Pages/Preciousmetal";
import VehicleInheritanceManagement from "./Pages/Vehicleinheritance";
import DigitalAssetsInheritanceManagement from "./Pages/Digitalassets";
import SafetyDepositsInheritanceManagement from "./Pages/Safetydeposits";
import RecurringDepositManagement from "./Pages/RecurringDepositManagement";
import StockManagement from "./Pages/StockManagement";
import BondManagement from "./Pages/BondManagement";
import CryptoManagement from "./Pages/CryptoManagement";
import BankAccountManagement from "./Pages/BankAccountManagement";
import RetirementAccountManagement from "./Pages/RetirementAccountManagement";
import CommodityManagement from "./Pages/CommodityManagement";
import OtherInvestments from "./Pages/OtherInvestments";
import NetWorth from "./Pages/NetWorth";
import LegalDocumentation from "./Pages/LegalDocumentation";
import FinancialAccountClosure from "./Pages/FinancialAccountClosure";
import InvestmentTransmission from "./Pages/InvestmentTransmission";
import MiscellaneousAssetTransfer from "./Pages/MiscellaneousAssetTransfer";
import RealEstateRegistration from "./Pages/RealEstateRegistration";
import InsurancePensionClaims from "./Pages/InsurancePensionClaims";
import VehicleUtilityTransfer from "./Pages/VehicleUtilityTransfer";
import DigitalIdentityManagement from "./Pages/DigitalIdentityManagement";
import NPSManagement from "./Pages/NPSManagement";
import PPFManagement from "./Pages/PPFManagement";
import EPFManagement from "./Pages/EPFManagement";
import LendingManagement from "./Pages/LendingMamagement";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/signin" />} />
    <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/signin" />} />
    <Route path="/otp" element={isLoggedIn ? <OTPVerification /> : <Navigate to="/signin" />} />
    <Route path="/aadhar" element={isLoggedIn ? <Aadhaarotp /> : <Navigate to="/signin" />} />
    <Route path="/beneficiary" element={isLoggedIn ? <Beneficiary /> : <Navigate to="/signin" />} />
    <Route path="/nominee" element={isLoggedIn ? <Nomineeform /> : <Navigate to="/signin" />} />
    <Route path="/insurance-policies" element={isLoggedIn ? <InsurancePolicies /> : <Navigate to="/signin" />} />
    <Route path="/bank" element={isLoggedIn ? <BankAccounts /> : <Navigate to="/signin" />} />
    <Route path="/property" element={isLoggedIn ? <RealEstateManagement /> : <Navigate to="/signin" />} />
    <Route path="/demat" element={isLoggedIn ? <DematAccountManagement /> : <Navigate to="/signin" />} />
    <Route path="/mutual-funds" element={isLoggedIn ? <MutualFundsManagement /> : <Navigate to="/signin" />} />
    <Route path="/pf" element={isLoggedIn ? <ProvidentFundsManagement /> : <Navigate to="/signin" />} />
    <Route path="/esops" element={isLoggedIn ? <Esops /> : <Navigate to="/signin" />} />
    <Route path="/ip" element={isLoggedIn ? <Ip /> : <Navigate to="/signin" />} />
    <Route path="/liabilites" element={isLoggedIn ? <Liabilites /> : <Navigate to="/signin" />} />
    <Route path="/willform" element={isLoggedIn ? <WillForm /> : <Navigate to="/signin" />} />
    <Route path="/fixed-deposit" element={isLoggedIn ? <Deposit /> : <Navigate to="/signin" />} />
    <Route path="/business" element={isLoggedIn ? <BusinessInheritanceManagement /> : <Navigate to="/signin" />} />
    <Route path="/stocks" element={isLoggedIn ? <StockManagement /> : <Navigate to="/signin" />} />
    <Route path="/bonds" element={isLoggedIn ? <BondManagement /> : <Navigate to="/signin" />} />
    <Route path="/cryptocurrencies" element={isLoggedIn ? <CryptoManagement /> : <Navigate to="/signin" />} />
    <Route path="/bank-accounts" element={isLoggedIn ? <BankAccountManagement /> : <Navigate to="/signin" />} />
    <Route path="/commodities" element={isLoggedIn ? <CommodityManagement /> : <Navigate to="/signin" />} />
    <Route path="/retirement-accounts" element={isLoggedIn ? <RetirementAccountManagement /> : <Navigate to="/signin" />} />
    <Route path="/other-investments" element={isLoggedIn ? <OtherInvestments /> : <Navigate to="/signin" />} />
    <Route path="/net-worth" element={isLoggedIn ? <NetWorth /> : <Navigate to="/signin" />} />
    <Route path="/recurring-deposit" element={isLoggedIn ? <RecurringDepositManagement /> : <Navigate to="/signin" />} />
    <Route path="/precious-metals" element={isLoggedIn ? <PreciousMetalsInheritanceManagement /> : <Navigate to="/signin" />} />
    <Route path="/vehicle" element={isLoggedIn ? <VehicleInheritanceManagement /> : <Navigate to="/signin" />} />
    <Route path="/digitalassets" element={isLoggedIn ? <DigitalAssetsInheritanceManagement /> : <Navigate to="/signin" />} />
    <Route path="/safetydeposits" element={isLoggedIn ? <SafetyDepositsInheritanceManagement /> : <Navigate to="/signin" />} />
    <Route path="/legal-documentation" element={isLoggedIn ? <LegalDocumentation /> : <Navigate to="/signin" />} />
    <Route path="/financial-account-closure" element={isLoggedIn ? <FinancialAccountClosure /> : <Navigate to="/signin" />} />
    <Route path="/investment-transmission" element={isLoggedIn ? <InvestmentTransmission /> : <Navigate to="/signin" />} />
    <Route path="/misc-asset-transfer" element={isLoggedIn ? <MiscellaneousAssetTransfer /> : <Navigate to="/signin" />} />
    <Route path="/real-estate-registration" element={isLoggedIn ? <RealEstateRegistration /> : <Navigate to="/signin" />} />
    <Route path="/insurance-pension-claims" element={isLoggedIn ? <InsurancePensionClaims /> : <Navigate to="/signin" />} />
    <Route path="/vehicle-utility-transfer" element={isLoggedIn ? <VehicleUtilityTransfer /> : <Navigate to="/signin" />} />
    <Route path="/digital-identity-management" element={isLoggedIn ? <DigitalIdentityManagement /> : <Navigate to="/signin" />} />
    <Route path="/nps" element={isLoggedIn ? <NPSManagement /> : <Navigate to="/signin" />} />
    <Route path="/ppf" element={isLoggedIn ? <PPFManagement /> : <Navigate to="/signin" />} />
    <Route path="/eps" element={isLoggedIn ? <EPFManagement /> : <Navigate to="/signin" />} />
    <Route path="/lendingmanagement" element={isLoggedIn ? <LendingManagement /> : <Navigate to="/signin" />} />
  </Route>

  <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <LoginForm />} />
  <Route path="/reset-password/:token" element={<NewPassword />} />
  <Route path="/forgetpassword" element={<ForgotPassword />} />
</Routes>

  );
}

export default App;
