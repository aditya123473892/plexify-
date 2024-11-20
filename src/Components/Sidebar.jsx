import React, { useState, useEffect, useRef } from "react";
import {
  FaUsers,
  FaPiggyBank,
  FaFileAlt,
  FaCoins,
  FaHandsHelping,
  FaCar,
  FaBuilding,
  FaChartLine,
  FaHome,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { MdOutlineClose, MdDashboardCustomize } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import wealthlogo from "../assets/images/Picture_1.png";
import "../assets/css/Sidebar.css";

function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(""); // Active section for mobile
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({}); // Track expanded sections
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Detect screen size for responsive layout
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout function
  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  // Open/close drawer for mobile view
  const toggleDrawer = (section) => {
    setActiveSection(section);
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => setIsDrawerOpen(false);

  // Toggle the expansion of sections in PC view
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Styled Components

  const SidebarContainer = styled.div`
    display: ${isMobile ? "none" : "block"};
    width: 256px;
    background-color: #446b2b;
    color: white;
    height: 100vh;
    position: fixed;
    z-index: 1000;
    overflow-y: auto;
    transition: background-color 0.4s ease, transform 0.5s ease;

    .logo-container {
      padding: 1rem;
      text-align: center;
    }

    .logo {
      width: 150px;
      transition: transform 0.3s ease;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: white;
      transition: background-color 0.4s ease, color 0.4s ease;

      &:hover {
        background-color: #61dafb;
        color: #446b2b;
      }

      .icon {
        margin-right: 0.5rem;
        transition: transform 0.3s ease;
      }
    }

    .section-header {
      cursor: pointer;
      padding: 0.75rem 1rem;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      transition: background-color 0.4s ease;

      &:hover {
        background-color: #61dafb;
        color: #446b2b;
      }
    }

    .section-links {
      display: flex;
      flex-direction: column;
    }
  `;

  const FooterBar = styled.div`
    display: ${isMobile ? "flex" : "none"};
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #446b2b;
    color: white;
    justify-content: space-around;
    padding: 0.5rem 0;
    z-index: 1000;
    transition: background-color 0.4s ease;

    .icon-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      color: white;
      transition: color 0.3s ease;

      &:hover {
        color: #61dafb;
      }

      span {
        font-size: 0.8rem;
        margin-top: 0.2rem;
        transition: transform 0.3s ease;
      }
    }
  `;

  const MobileDrawer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 70%;
    background-color: white;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(${isDrawerOpen ? "0" : "100%"});
    transition: transform 0.5s ease-in-out;
    z-index: 999;
    overflow-y: auto;
    padding: 1rem;

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        color: #446b2b;
        transition: color 0.3s ease;
      }

      .close-btn {
        font-size: 1.5rem;
        cursor: pointer;
        color: #446b2b;
        transition: color 0.3s ease;

        &:hover {
          color: #61dafb;
        }
      }
    }

    .drawer-content {
      display: flex;
      flex-direction: column;

      .drawer-link {
        display: flex;
        align-items: center;
        margin: 0.5rem 0;
        text-decoration: none;
        color: #333;
        transition: color 0.3s ease, transform 0.3s ease;

        &:hover {
          color: #446b2b;
          transform: translateX(5px);
        }

        .icon {
          margin-right: 0.5rem;
          transition: transform 0.3s ease;
        }
      }
    }
  `;

  const sections = {
    Wealth: [
      {
        to: "/insurance-policies",
        label: "Insurance Policies",
        icon: <FaFileAlt />,
      },
      { to: "/fixed-deposit", label: "Fixed Deposit", icon: <FaPiggyBank /> },
      {
        to: "/recurring-deposit",
        label: "Recurring Deposit",
        icon: <FaCoins />,
      },
      { to: "/property", label: "Property/ Real Estate", icon: <FaBuilding /> },
      { to: "/stocks", label: "Stocks", icon: <FaChartLine /> },
      { to: "/bonds", label: "Bonds", icon: <FaCoins /> },
      { to: "/mutual-funds", label: "Mutual Funds", icon: <FaFileAlt /> },
      { to: "/precious-metals", label: "Precious Metals", icon: <FaCoins /> },
      {
        to: "/cryptocurrencies",
        label: "Cryptocurrencies",
        icon: <FaFileAlt />,
      },
      { to: "/nps", label: "NPS", icon: <FaHandsHelping /> },
      { to: "/ppf", label: "PPF", icon: <FaHandsHelping /> },
      { to: "/eps", label: "EPS", icon: <FaHandsHelping /> },
      { to: "/bank-accounts", label: "Bank A/C", icon: <FaHandsHelping /> },
      {
        to: "/retirement-accounts",
        label: "Retirement Accounts",
        icon: <FaHandsHelping />,
      },
      { to: "/commodities", label: "Commodities", icon: <FaHandsHelping /> },
      {
        to: "/other-investments",
        label: "Other Investments",
        icon: <FaHandsHelping />,
      },
    ],
    Liabilities: [
      { to: "/home-loan", label: "Home Loan", icon: <FaCar /> },
      { to: "/car-loan", label: "Car Loan", icon: <FaCar /> },
      {
        to: "/personal-loan",
        label: "Personal Loan",
        icon: <FaHandsHelping />,
      },
      {
        to: "/education-loan",
        label: "Education Loan",
        icon: <FaHandsHelping />,
      },
      {
        to: "/credit-card-debt",
        label: "Credit Card Debt",
        icon: <FaHandsHelping />,
      },
      { to: "/agri-loan", label: "Agri Loan", icon: <FaHandsHelping /> },
      {
        to: "/business-loan",
        label: "Business Loan",
        icon: <FaHandsHelping />,
      },
    ],
    PostDemise: [
      {
        to: "/legal-documentation",
        label: "Legal Documentation",
        icon: <FaFileAlt />,
      },
      {
        to: "/financial-account-closure",
        label: "Financial Account Closure",
        icon: <FaFileAlt />,
      },
      {
        to: "/investment-transmission",
        label: "Investment Transmission",
        icon: <FaFileAlt />,
      },
      {
        to: "/misc-asset-transfer",
        label: "Miscellaneous Asset Transfer",
        icon: <FaFileAlt />,
      },
      {
        to: "/real-estate-registration",
        label: "Real Estate Registration",
        icon: <FaFileAlt />,
      },
      {
        to: "/insurance-pension-claims",
        label: "Insurance & Pension Claims",
        icon: <FaFileAlt />,
      },
      {
        to: "/vehicle-utility-transfer",
        label: "Vehicle & Utility Transfer",
        icon: <FaFileAlt />,
      },
      {
        to: "/digital-identity-management",
        label: "Digital Identity Management",
        icon: <FaFileAlt />,
      },
    ],
    Family: [
      { to: "/family-details", label: "Family Details", icon: <FaUsers /> },
      {
        to: "/nominee-appointments",
        label: "Nominee Appointments",
        icon: <FaUsers />,
      },
      { to: "/family-trust", label: "Family Trust", icon: <FaUsers /> },
    ],
    Other: [
      { to: "/password-manager", label: "Password Manager", icon: <FiUser /> },
      { to: "/medical-records", label: "Medical Records", icon: <FaFileAlt /> },
    ],
  };

  return (
    <div>
      <SidebarContainer>
        <div className="logo-container">
          <img className="logo" src={wealthlogo} alt="logo" />
        </div>
        {Object.keys(sections).map((section) => (
          <div key={section}>
            <div
              className="section-header"
              onClick={() => toggleSection(section)}
            >
              <span>{section}</span>
            </div>
            {expandedSections[section] && (
              <div className="section-links">
                {sections[section].map((link) => (
                  <Link to={link.to} key={link.label} className="sidebar-link">
                    <span className="icon">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </SidebarContainer>

      <FooterBar>
        {Object.keys(sections).map((section) => (
          <div
            key={section}
            className="icon-wrapper"
            onClick={() => toggleDrawer(section)}
          >
            {section === "Wealth" && <RiMoneyRupeeCircleFill />}
            {section === "Liabilities" && <FaCoins />}
            {section === "PostDemise" && <FaFileAlt />}
            {section === "Family" && <FaUsers />}
            {section === "Other" && <FiUser />}
            <span>{section}</span>
          </div>
        ))}
      </FooterBar>

      <MobileDrawer isDrawerOpen={isDrawerOpen}>
        <div className="drawer-header">
          <h3>{activeSection}</h3>
          <MdOutlineClose className="close-btn" onClick={closeDrawer} />
        </div>
        <div className="drawer-content">
          {sections[activeSection]?.map((link) => (
            <Link to={link.to} key={link.label} className="drawer-link">
              <span className="icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </MobileDrawer>
    </div>
  );
}

export default Sidebar;
