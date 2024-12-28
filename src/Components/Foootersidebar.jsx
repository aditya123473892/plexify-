import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaFileAlt, FaPiggyBank, FaChartLine, FaLightbulb } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { Link } from "react-router-dom";

function FooterSidebar() {
  const [activeSection, setActiveSection] = useState(null);

  const sections = {
    wealth: [
      { label: "Insurance Policies", link: "/insurance-policies" },
      { label: "Fixed Deposit", link: "/fixed-deposit" },
      { label: "Recurring Deposit", link: "/recurring-deposit" },
      { label: "Property/Real Estate", link: "/property" },
      { label: "Stocks", link: "/stocks" },
    ],
    liabilities: [
      { label: "Home Loan", link: "/home-loan" },
      { label: "Car Loan", link: "/car-loan" },
      { label: "Personal Loan", link: "/personal-loan" },
      { label: "Credit Card Debt", link: "/credit-card-debt" },
      { label: "Business Loan", link: "/business-loan" },
    ],
    "post-demise": [
      { label: "Legal Documentation", link: "/legal-documentation" },
      { label: "Financial Account Closure", link: "/financial-account-closure" },
      { label: "Investment Transmission", link: "/investment-transmission" },
      { label: "Real Estate Registration", link: "/real-estate-registration" },
      { label: "Insurance & Pension Claims", link: "/insurance-pension-claims" },
    ],
    suggestions: [
      { label: "New Services", link: "/new-services" },
      { label: "User Feedback", link: "/user-feedback" },
      { label: "Improvement Ideas", link: "/improvement-ideas" },
      { label: "Community Support", link: "/community-support" },
    ],
  };

  const renderListItems = (section) =>
    sections[section]?.map((item, index) => (
      <ListItem key={index}>
        <Link to={item.link}>{item.label}</Link>
      </ListItem>
    ));

  return (
    <FooterContainer>
      {activeSection && (
        <SlidingDrawer>
          <DrawerContent>
            <ModalHeader>{activeSection.replace(/-/g, " ").toUpperCase()}</ModalHeader>
            <List>{renderListItems(activeSection)}</List>
            <CloseButton onClick={() => setActiveSection(null)}>Close</CloseButton>
          </DrawerContent>
        </SlidingDrawer>
      )}

      <Footer>
        <FooterButton
          onClick={() => setActiveSection("wealth")}
          active={activeSection === "wealth"}
        >
          <FaFileAlt />
          <span>Wealth</span>
        </FooterButton>
        <FooterButton
          onClick={() => setActiveSection("liabilities")}
          active={activeSection === "liabilities"}
        >
          <FaPiggyBank />
          <span>Liabilities</span>
        </FooterButton>
        <FooterButton
          onClick={() => setActiveSection("post-demise")}
          active={activeSection === "post-demise"}
        >
          <FaChartLine />
          <span>Post Demise</span>
        </FooterButton>
        <FooterButton
          onClick={() => setActiveSection("suggestions")}
          active={activeSection === "suggestions"}
        >
          <FaLightbulb />
          <span>Suggestions</span>
        </FooterButton>
      </Footer>
    </FooterContainer>
  );
}

export default FooterSidebar;

// Styled Components
const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1280px) {
    display: none; /* Hide the sidebar on screens larger than 1280px */
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const FooterButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  text-decoration: none;
  border: none;
  background: none;
  color: ${(props) => (props.active ? "#446b2b" : "#888888")};
  cursor: pointer;

  span {
    font-size: 12px;
    color: ${(props) => (props.active ? "#446b2b" : "#666666")};
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(50%);
  }
`;

const SlidingDrawer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: #ffffff;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease-out;
`;

const DrawerContent = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ModalHeader = styled.h3`
  margin-bottom: 15px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin: 10px 0;

  a {
    text-decoration: none;
    color: #333333;

    &:hover {
      color: #446b2b;
    }
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  align-self: center;
  background-color: #446b2b;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #365622;
  }
`;
