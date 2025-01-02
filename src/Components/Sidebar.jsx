import React, { useState, useEffect, useRef } from "react";
import {
  FaUsers,
  FaPiggyBank,
  FaFileAlt,
  FaCoins,
  FaHandsHelping,
  FaCar,
  FaBuilding,
  FaRupeeSign,
  FaChartLine,
  FaHome,
  FaHotTub,
  FaIntercom,
  FaSlideshare,
  FaUserNurse,
} from "react-icons/fa";
import {
  MdOutlineClose,
  MdDashboardCustomize,
  MdOfflineShare,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { RiMoneyRupeeCircleFill, RiRefund2Fill } from "react-icons/ri";
import "../assets/css/Sidebar.css";
import styled from "styled-components";
import wealthlogo from "../assets/images/Picture_1.png";
import logo from "../assets/images/png logo.png";

import { GiBank } from "react-icons/gi";
import { SiCryptpad, SiFormstack, SiOpensearch } from "react-icons/si";

function Sidebar() {


  const [isWealthOpen, setWealthOpen] = useState(false);
  const [isLiabilitiesOpen, setLiabilitiesOpen] = useState(false);
  const [isPostDemiseOpen, setPostDemiseOpen] = useState(false);
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };



  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const toggleWealth = () => {
    setWealthOpen(!isWealthOpen);
  };

  const toggleLiabilities = () => {
    setLiabilitiesOpen(!isLiabilitiesOpen);
  };

  const togglePostDemise = () => {
    setPostDemiseOpen(!isPostDemiseOpen);
  };

  const toggleSuggestions = () => {
    setSuggestionsOpen(!isSuggestionsOpen);
  };

  return (
    <div>
      <div
        className={`sidebar ${isOpen ? "open" : "closed"} z-50`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{ width: isOpen ? `${sidebarWidth}px` : "64px" }}
      >
        <div className="sidebar-header">
          <button
            onClick={toggleSidebar}
            className="toggle-button ms-1 my-5 "
            aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isOpen ? <MdOutlineClose /> : <FaHome />}
          </button>
        </div>
        <nav className="sidebar-nav z-50">
          <div className="flex justify-center">
            <img
              src={wealthlogo}
              alt="Wealth Logo"
              className={`${isOpen ? "size-20" : ""} `}
            />
          </div>

          <Link to="/" className="sidebar-link my-3">
            <MdDashboardCustomize className={isOpen ? "mr-3" : ""} />{" "}
            {isOpen ? "Dashboard" : ""}
          </Link>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title" onClick={toggleWealth}>
              {isOpen ? "Wealth" : ""}{" "}
              {isWealthOpen ? (
                <RiMoneyRupeeCircleFill />
              ) : (
                <RiMoneyRupeeCircleFill />
              )}
            </h3>
            <div
              className={`sidebar-section-content ${
                isWealthOpen ? "open" : "closed"
              }`}
            >
              <Link to="/insurance-policies" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Insurance Policies" : ""}
              </Link>
              <Link to="/fixed-deposit" className="sidebar-link">
                <FaPiggyBank className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Fixed Deposit" : ""}
              </Link>
              <Link to="/recurring-deposit" className="sidebar-link">
                <FaCoins className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Recurring Deposit" : ""}
              </Link>
              <Link to="/property" className="sidebar-link">
                <FaBuilding className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Property/ Real Estate" : ""}
              </Link>
              <Link to="/stocks" className="sidebar-link">
                <FaChartLine className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Stocks" : ""}
              </Link>
              <Link to="/bonds" className="sidebar-link">
                ₹ <span className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Bonds" : ""}
              </Link>
              <Link to="/mutual-funds" className="sidebar-link">
                <RiRefund2Fill className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Mutual Funds" : ""}
              </Link>
              <Link to="/precious-metals" className="sidebar-link">
                <FaCoins className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Precious Metals" : ""}
              </Link>
              <Link to="/cryptocurrencies" className="sidebar-link">
                <SiCryptpad className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Cryptocurrencies" : ""}
              </Link>
              <Link to="/nps" className="sidebar-link">
                <SiOpensearch className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "NPS" : ""}
              </Link>
              <Link to="/ppf" className="sidebar-link">
                <MdOfflineShare className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "PPF" : ""}
              </Link>
              <Link to="/eps" className="sidebar-link">
                <FaSlideshare className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "EPS" : ""}
              </Link>
              <Link to="/bank-accounts" className="sidebar-link">
                <GiBank className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Bank A/C" : ""}
              </Link>

              <Link to="/commodities" className="sidebar-link">
                <FaIntercom className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Commodities" : ""}
              </Link>
              <Link to="/other-investments" className="sidebar-link">
                <FaHotTub className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Other Investments" : ""}
              </Link>
            </div>
          </div>

          {/* Liabilities Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title" onClick={toggleLiabilities}>
              {isOpen ? "Liabilities" : ""}{" "}
              {isLiabilitiesOpen ? <FaUserNurse /> : <FaUserNurse />}
            </h3>
            <div
              className={`sidebar-section-content ${
                isLiabilitiesOpen ? "open" : "closed"
              }`}
            >
              <Link to="/liabilites" className="sidebar-link">
                <RiRefund2Fill className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Loan" : ""}
              </Link>
              {/* <Link to="/car-loan" className="sidebar-link">
                <FaCar className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Car Loan" : ""}
              </Link>
              <Link to="/personal-loan" className="sidebar-link">
                <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Personal Loan" : ""}
              </Link>
              <Link to="/education-loan" className="sidebar-link">
                <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Education Loan" : ""}
              </Link>
              <Link to="/credit-card-debt" className="sidebar-link">
                <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Credit Card Debt" : ""}
              </Link>
              <Link to="/agri-loan" className="sidebar-link">
                <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Agri Loan" : ""}
              </Link>
              <Link to="/business-loan" className="sidebar-link">
                <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Business Loan" : ""}
              </Link> */}
            </div>
          </div>

          {/* Beneficiary Section */}
          <Link to="/beneficiary" className="sidebar-link">
            <FaUsers className={isOpen ? "mr-3" : ""} />{" "}
            {isOpen ? "Beneficiary" : ""}
          </Link>

          {/* Net Worth Section */}
          <Link to="/net-worth" className="sidebar-link">
            <FaChartLine className={isOpen ? "mr-3" : ""} />{" "}
            {isOpen ? "Net Worth" : ""}
          </Link>

          {/* Will/Vasiyat Section */}
          <Link to="/willform" className="sidebar-link mb-3">
            <SiFormstack className={isOpen ? "mr-3" : ""} />{" "}
            {isOpen ? "Will/Vasiyat" : ""}
          </Link>

          {/* Post Demise Services Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title" onClick={togglePostDemise}>
              {isOpen ? "Post Demise Services" : ""}{" "}
              {isPostDemiseOpen ? <FaChartLine /> : <FaChartLine />}
            </h3>
            <div
              className={`sidebar-section-content ${
                isPostDemiseOpen ? "open" : "closed"
              }`}
            >
              <Link to="/legal-documentation" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Legal Documentation" : ""}
              </Link>
              <Link to="/financial-account-closure" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Financial Account Closure" : ""}
              </Link>
              <Link to="/investment-transmission" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Investment Transmission" : ""}
              </Link>
              <Link to="/misc-asset-transfer" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Miscellaneous Asset Transfer" : ""}
              </Link>
              <Link to="/real-estate-registration" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Real Estate Registration" : ""}
              </Link>
              <Link to="/insurance-pension-claims" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Insurance & Pension Claims" : ""}
              </Link>
              <Link to="/vehicle-utility-transfer" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Vehicle & Utility Transfer" : ""}
              </Link>
              <Link to="/digital-identity-management" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Digital Identity Management" : ""}
              </Link>
            </div>
          </div>

          {/* Suggestions Section */}
          {/* Suggestions Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title" onClick={toggleSuggestions}>
              {isOpen ? "Suggestions" : ""}{" "}
              {isSuggestionsOpen ? <FaChartLine /> : <FaChartLine />}
            </h3>
            <div
              className={`sidebar-section-content ${
                isSuggestionsOpen ? "open" : "closed"
              }`}
            >
              <Link
                to="/insurance-renewal-suggestions"
                className="sidebar-link"
              >
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "Insurance Renewal Suggestions" : ""}
              </Link>
              <Link to="/fd-rd-renewal-suggestions" className="sidebar-link">
                <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "FD/RD Renewal Suggestions" : ""}
              </Link>
              <Link to="/user" className="sidebar-link">
                <FaUsers className={isOpen ? "mr-3" : ""} />{" "}
                {isOpen ? "User Profile" : ""}
              </Link>
            </div>
          </div>
          <Link to="/user" className="sidebar-link">
            <FaUsers className={isOpen ? "mr-3" : ""} />{" "}
            {isOpen ? "Profile" : ""}
          </Link>
        </nav>
      </div>
      <NavbarContainer
        isOpen={isOpen}
        sidebarWidth={sidebarWidth}
        className="flex items-center justify-between bg-[#548831] text-white px-6 py-4 shadow-md"
      >
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Main Logo"
        className=" w-32"
          />
        </div>

        {/* Text Section */}
        <div className="flex items-center justify-center space-x-4">
          {/* Logo Section */}
          <img
            src={wealthlogo}
            alt="Wealth Logo"
            style={{
              width: "64px", // Adjusted logo width
              height: "64px", // Adjusted logo height
              objectFit: "contain", // Maintain aspect ratio
            }}
          />

          {/* Text Section */}
          <div className="text-left plexify-font manage-text">
  <h2 className="text-2xl md:text-4xl font-bold text-[#daa431] plexify-font">
    Manage Grow Inherit
  </h2>
  <p className="text1 text-sm md:text-base">
    चिंतामुक्त भविष्य, विरासत का सुखद सफर
  </p>
</div>
<style jsx>{`
  @media (max-width: 1200px) {
    .manage-text {
      display: none; /* Hide the text section below 1200px */
    }
  }
`}</style>
        </div>
      </NavbarContainer>
    </div>
  );
}
const NavbarContainer = styled.nav`
  background-color: #446b2b;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  z-index:1000;
  position: fixed;
  top: 0;
  left: ${({ isOpen, sidebarWidth }) =>
    isOpen ? `${sidebarWidth - 6}px` : "64px"};
  width: calc(
    100% -
      ${({ isOpen, sidebarWidth }) =>
        isOpen ? `${sidebarWidth - 6}px` : "64px"}
  );
  height: 80px;
  transition: all 0.3s ease;

  @media (max-width: 1200px) {
    left: 0;
    width: 100%;
    height: 70px;

    .text1 {
      display: none;
    }
  }
`;

export default Sidebar;
