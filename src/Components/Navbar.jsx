import React, { useState } from "react";
import styled from "styled-components";
import { FaHome } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const NavbarContainer = styled.nav`
  background-color: #4caf50; /* Green color */
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    background-color: #333;
    position: absolute;
    top: 70px;
    right: 0;
    width: 100%;
    padding: 1rem;
    display: ${({ open }) => (open ? "block" : "none")};
  }
`;

const NavItem = styled.li`
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
  top: 100%;
  left: 0;
  background-color: #444;
  padding: 0.5rem;
  display: ${({ open }) => (open ? "block" : "none")};
  transition: all 0.3s ease;

  li {
    padding: 0.5rem 1rem;
    cursor: pointer;
    &:hover {
      background-color: #555;
      color: #61dafb;
    }
  }
`;

const HamburgerMenu = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #61dafb;
  }

  @media (max-width: 768px) {
    position: absolute;
    right: 10px;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <NavbarContainer>
      <Logo>Plexify</Logo>
      <HamburgerMenu onClick={toggleMenu}>{isOpen ? "✖" : "☰"}</HamburgerMenu>
      <NavLinks open={isOpen}>
        <NavItem>
          <FaHome /> Home
        </NavItem>
        <NavItem>
          <FaHome /> About
        </NavItem>
        <NavItem onClick={toggleDropdown}>
          <FiUser /> Profile
          <DropdownMenu open={isDropdownOpen}>
            <li>Settings</li>
            <li>Logout</li>
          </DropdownMenu>
        </NavItem>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
