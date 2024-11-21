import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaFileAlt, FaPiggyBank, FaChartLine } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { Link } from "react-router-dom";

function FooterSidebar() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <FooterContainer>
      {/* Expandable Half-Screen Drawer */}
      {activeSection === "insurance" && (
        <SlidingDrawer>
          <DrawerContent>
            <ModalHeader>Insurance Policies</ModalHeader>
            <List>
              <ListItem>
                <Link to="/insurance-policies">Insurance Policies</Link>
              </ListItem>
              <ListItem>
                <Link to="/fixed-deposit">Fixed Deposit</Link>
              </ListItem>
              <ListItem>
                <Link to="/recurring-deposit">Recurring Deposit</Link>
              </ListItem>
              <ListItem>
                <Link to="/property">Property/Real Estate</Link>
              </ListItem>
              <ListItem>
                <Link to="/stocks">Stocks</Link>
              </ListItem>
            </List>
            <CloseButton onClick={() => setActiveSection(null)}>
              Close
            </CloseButton>
          </DrawerContent>
        </SlidingDrawer>
      )}

      {activeSection === "liabilities" && (
        <SlidingDrawer>
          <DrawerContent>
            <ModalHeader>Liabilities</ModalHeader>
            <List>
              <ListItem>
                <Link to="/home-loan">Home Loan</Link>
              </ListItem>
              <ListItem>
                <Link to="/car-loan">Car Loan</Link>
              </ListItem>
              <ListItem>
                <Link to="/personal-loan">Personal Loan</Link>
              </ListItem>
              <ListItem>
                <Link to="/credit-card-debt">Credit Card Debt</Link>
              </ListItem>
              <ListItem>
                <Link to="/business-loan">Business Loan</Link>
              </ListItem>
            </List>
            <CloseButton onClick={() => setActiveSection(null)}>
              Close
            </CloseButton>
          </DrawerContent>
        </SlidingDrawer>
      )}

      {activeSection === "post-demise" && (
        <SlidingDrawer>
          <DrawerContent>
            <ModalHeader>Post Demise Services</ModalHeader>
            <List>
              <ListItem>
                <Link to="/legal-documentation">Legal Documentation</Link>
              </ListItem>
              <ListItem>
                <Link to="/financial-account-closure">
                  Financial Account Closure
                </Link>
              </ListItem>
              <ListItem>
                <Link to="/investment-transmission">
                  Investment Transmission
                </Link>
              </ListItem>
              <ListItem>
                <Link to="/real-estate-registration">
                  Real Estate Registration
                </Link>
              </ListItem>
              <ListItem>
                <Link to="/insurance-pension-claims">
                  Insurance & Pension Claims
                </Link>
              </ListItem>
            </List>
            <CloseButton onClick={() => setActiveSection(null)}>
              Close
            </CloseButton>
          </DrawerContent>
        </SlidingDrawer>
      )}

      {/* Footer Navigation */}
      <Footer>
        <FooterButton
          onClick={() => toggleSection("insurance")}
          active={activeSection === "insurance"}
        >
          <FaFileAlt />
          <span>Insurance</span>
        </FooterButton>
        <FooterButton
          onClick={() => toggleSection("liabilities")}
          active={activeSection === "liabilities"}
        >
          <FaPiggyBank />
          <span>Liabilities</span>
        </FooterButton>
        <FooterButton
          onClick={() => toggleSection("post-demise")}
          active={activeSection === "post-demise"}
        >
          <FaChartLine />
          <span>Post Demise</span>
        </FooterButton>
        <FooterButton onClick={() => setActiveSection(null)}>
          <MdDashboardCustomize />
          <span>Dashboard</span>
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
  @media (min-width: 1200px) {
    display: none !important; /* Force hiding */
  }
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

  @media (max-width: 1100px) {
    left: 0;
  }
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
