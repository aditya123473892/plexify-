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

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/signin" />}/> */}
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
        <Route path="/esops" element={<Esops />} />
        <Route path="/ip" element={<Ip />} />
        <Route path="/liabilites" element={<Liabilites />} />
        <Route path="/willform" element={<WillForm />} />
        <Route path="/fixed-deposit" element={<Deposit />} />
        <Route path="/business" element={<BusinessInheritanceManagement />} />
        <Route path="/stocks" element={<StockManagement />} />
        <Route path="/bonds" element={<BondManagement />} />
        <Route path="/cryptocurrencies" element={<CryptoManagement  />} />
        <Route path="/bank-accounts" element={<BankAccountManagement  />} />
        <Route path="/commodities" element={<CommodityManagement  />} />
        <Route path="/retirement-accounts" element={<RetirementAccountManagement  />} />
        <Route path="/other-investments" element={<OtherInvestments   />} />
        <Route path="/net-worth" element={<NetWorth   />} />
        <Route path="/recurring-deposit" element={<RecurringDepositManagement />}/>
        <Route path="/precious-metals" element={<PreciousMetalsInheritanceManagement />}/>
        <Route path="/vehicle" element={<VehicleInheritanceManagement />} />
        <Route path="/digitalassets" element={<DigitalAssetsInheritanceManagement />}/>
        <Route  path="/safetydeposits" element={<SafetyDepositsInheritanceManagement />}/>
        
        
        <Route  path="/legal-documentation" element={<LegalDocumentation />}/>
        <Route  path="/financial-account-closure" element={<FinancialAccountClosure />}/>
        <Route  path="/investment-transmission" element={<InvestmentTransmission />}/>
        <Route  path="/misc-asset-transfer" element={<MiscellaneousAssetTransfer  />}/>
        <Route  path="/real-estate-registration" element={<RealEstateRegistration />}/>
        <Route  path="/insurance-pension-claims" element={<InsurancePensionClaims  />}/>
        <Route  path="/vehicle-utility-transfer" element={<VehicleUtilityTransfer />}/>
        <Route  path="/digital-identity-management" element={<DigitalIdentityManagement />}/>
        <Route  path="/nps" element={<NPSManagement />}/>
        <Route  path="/ppf" element={<PPFManagement  />}/>
        <Route  path="/eps" element={<EPFManagement  />}/>
        
      </Route>
      
      <Route path="/signin" element={<LoginForm />} />
      {/*   <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <LoginForm />}/> */}
      <Route path="/reset-password/:token" element={<NewPassword />} />
      <Route path="/forgetpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
