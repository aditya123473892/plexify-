import React, { useState, useEffect, useRef } from "react";
import {
  FaUsers,
  FaPiggyBank,
  FaFileAlt,
  FaCoins,
  FaHandsHelping,
  FaCar,
  FaBuilding,
  FaDollarSign,
  FaChartLine,
  FaHome,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { MdOutlineClose, MdExpandMore } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import "../assets/css/Sidebar.css";
import styled from "styled-components";
function Sidebar() {
  const NavbarContainer = styled.nav`
    background-color: #446b2b; /* Green color */
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    position: fixed;
    top: 0;
    left: ${({ sidebarWidth }) =>
      sidebarWidth ? `${sidebarWidth}px` : "64px"};
    width: calc(
      100% -
        ${({ sidebarWidth }) => (sidebarWidth ? `${sidebarWidth}px` : "64px")}
    );
    transition: left 0.3s ease;
    z-index: 1000;
  `;

  const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
  `;

  const UserIcon = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;

    &:hover {
      color: #61dafb;
    }
  `;

  const DropdownMenu = styled.ul`
    list-style: none;
    position: absolute;
    top: 50px;
    right: 0;
    background-color: white;
    padding: 1rem;
    width: 150px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    z-index: 1001;
    border-radius: 6px;
  `;

  const DropdownItem = styled.li`
    padding: 0.5rem;
    cursor: pointer;
    text-align: left;
    color: #333;

    &:hover {
      background-color: #f0f0f0;
    }
  `;

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const startResizing = () => {
    setIsResizing(true);
  };

  const resizeSidebar = (e) => {
    if (isResizing) {
      const newWidth = Math.max(e.clientX, 64);
      setSidebarWidth(newWidth);
    }
  };

  const stopResizing = () => {
    setIsResizing(false);
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
    <div className={`sidebar ${isOpen ? "open" : "closed"} z-50`}>
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="toggle-button ms-1 mb-5">
          {isOpen ? <MdOutlineClose /> : <FaHome />}
        </button>
      </div>

      <nav className="sidebar-nav z-50">
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
              <FaDollarSign className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Bonds" : ""}
            </Link>
            <Link to="/mutual-funds" className="sidebar-link">
              <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Mutual Funds" : ""}
            </Link>
            <Link to="/precious-metals" className="sidebar-link">
              <FaCoins className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Precious Metals" : ""}
            </Link>
            <Link to="/cryptocurrencies" className="sidebar-link">
              <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Cryptocurrencies" : ""}
            </Link>
            <Link to="/nps" className="sidebar-link">
              <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "NPS" : ""}
            </Link>
            <Link to="/ppf" className="sidebar-link">
              <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "PPF" : ""}
            </Link>
            <Link to="/eps" className="sidebar-link">
              <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "EPS" : ""}
            </Link>
            <Link to="/bank-accounts" className="sidebar-link">
              <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Bank A/C" : ""}
            </Link>
            <Link to="/retirement-accounts" className="sidebar-link">
              <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Retirement Accounts" : ""}
            </Link>
            <Link to="/commodities" className="sidebar-link">
              <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Commodities" : ""}
            </Link>
            <Link to="/other-investments" className="sidebar-link">
              <FaHandsHelping className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Other Investments" : ""}
            </Link>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title" onClick={toggleLiabilities}>
            {isOpen ? "Liabilities" : ""}{" "}
            {isLiabilitiesOpen ? <FaHandsHelping /> : <FaHandsHelping />}
          </h3>
          <div
            className={`sidebar-section-content ${
              isLiabilitiesOpen ? "open" : "closed"
            }`}
          >
            <Link to="/liabilites" className="sidebar-link">
              <FaCar className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Home Loan" : ""}
            </Link>
            <Link to="/car-loan" className="sidebar-link">
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
            </Link>
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
          <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
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
            <Link to="/insurance-renewal-suggestions" className="sidebar-link">
              <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "Insurance Renewal Suggestions" : ""}
            </Link>
            <Link to="/fd-rd-renewal-suggestions" className="sidebar-link">
              <FaFileAlt className={isOpen ? "mr-3" : ""} />{" "}
              {isOpen ? "FD/RD Renewal Suggestions" : ""}
            </Link>
          </div>
        </div>
      </nav>

      <NavbarContainer sidebarWidth={isOpen ? sidebarWidth : 64}>
        <Logo>Plexify</Logo>

        <UserIcon ref={dropdownRef} onClick={toggleDropdown}>
          <FiUser /> Profile
          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem onClick={() => alert("Settings clicked")}>
              Settings
            </DropdownItem>
            <DropdownItem onClick={logout}>Logout</DropdownItem>
          </DropdownMenu>
        </UserIcon>
      </NavbarContainer>
    </div>
  );
}

export default Sidebar;
