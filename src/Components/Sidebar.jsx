import React, { useState, useRef, useEffect } from "react";
import { FaHome, FaInfoCircle, FaUsers, FaBars } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FiMessageCircle, FiUser } from "react-icons/fi"; // FiUser added for profile icon
import styled from "styled-components";

// Styled Components for Sidebar, Navbar, Dropdown
const NavbarContainer = styled.nav`
  background-color: #4caf50; /* Green color */
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: fixed;
  top: 0;
  left: ${({ sidebarWidth }) => (sidebarWidth ? `${sidebarWidth}px` : "64px")};
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

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Sidebar width in pixels
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
      const newWidth = Math.max(e.clientX, 64); // Minimum sidebar width of 64px
      setSidebarWidth(newWidth);
    }
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  // Close the dropdown if clicked outside
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

  return (
    <>
      {/* Sidebar */}
      <div
        className="h-screen bg-[#4CAF50] transition-all duration-300 flex flex-col items-center p-4 shadow-lg"
        style={{
          width: isOpen ? `${sidebarWidth}px` : "64px",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        onMouseMove={resizeSidebar}
        onMouseUp={stopResizing}
      >
        <div className="flex justify-between items-center w-full mb-6">
          <button
            onClick={toggleSidebar}
            className="text-white text-xl focus:outline-none"
          >
            {isOpen ? <MdOutlineClose /> : <FaBars />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-6 text-white w-full">
          <a
            href="#"
            className="flex items-center p-2 hover:bg-[#388E3C] transition duration-200 rounded-md"
          >
            <FaHome className="text-xl" />
            <span className={`ml-4 ${!isOpen && "hidden"}`}>Home</span>
          </a>
          <a
            href="#"
            className="flex items-center p-2 hover:bg-[#388E3C] transition duration-200 rounded-md"
          >
            <FaInfoCircle className="text-xl" />
            <span className={`ml-4 ${!isOpen && "hidden"}`}>About</span>
          </a>
          <a
            href="#"
            className="flex items-center p-2 hover:bg-[#388E3C] transition duration-200 rounded-md"
          >
            <FaUsers className="text-xl" />
            <span className={`ml-4 ${!isOpen && "hidden"}`}>Beneficiary</span>
          </a>
        </nav>

        {isOpen && (
          <div
            onMouseDown={startResizing}
            className="w-1 bg-gray-400 cursor-ew-resize absolute right-0 top-0 bottom-0"
          />
        )}
      </div>

      {/* Navbar */}
      <NavbarContainer sidebarWidth={isOpen ? sidebarWidth : 64}>
        <Logo>Plexify</Logo>

        {/* Profile Dropdown */}
        <UserIcon ref={dropdownRef} onClick={toggleDropdown}>
          <FiUser /> Profile
          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem onClick={() => alert("Settings clicked")}>
              Settings
            </DropdownItem>
            <DropdownItem onClick={() => alert("Logout clicked")}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UserIcon>
      </NavbarContainer>

      {/* Main Content */}
      <div
        className="flex-grow bg-gray-100 p-6"
        style={{ marginLeft: isOpen ? `${sidebarWidth}px` : "64px" }}
      >
        <h1 className="text-3xl font-semibold text-center">
          Main Content Area
        </h1>
        <p>This area will adjust when the sidebar is resized or toggled.</p>
      </div>
    </>
  );
}

export default Sidebar;
