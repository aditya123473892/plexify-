import React, { useState, useRef, useEffect } from "react";
import { FaHome, FaInfoCircle, FaUsers, FaBars } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FiMessageCircle, FiUser } from "react-icons/fi"; // FiUser added for profile icon
import styled from "styled-components";
import { Link,useNavigate } from "react-router-dom";
import NomineeForm from "../Forms/Nomineeform";

const NavbarContainer = styled.nav`
  background-color: #446b2b; /* Green color */
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
  const navigate = useNavigate();
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
    navigate('/signin'); 
  };
  return (
    <>
    
      <div
        className="h-screen bg-[#446b2b] transition-all duration-300 flex flex-col items-center p-4 shadow-lg"
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
            className="text-white text-xl focus:outline-none mt-3 ms-2"
          >
            {isOpen ? <MdOutlineClose /> : <FaBars />}
          </button>
        </div>

        <nav className="flex flex-col space-y-6 text-white w-full">
  <Link
    to="/"
    className="flex items-center p-2 hover:bg-[#205223cc] transition duration-200 rounded-md"
  >
    <FaHome className="text-xl" />
    <span className={`ml-4 ${!isOpen && "hidden"}`}>Home</span>
  </Link>
  <Link
    to="/otp"
    className="flex items-center p-2 hover:bg-[#205223cc] transition duration-200 rounded-md"
  >
    <FaInfoCircle className="text-xl" />
    <span className={`ml-4 ${!isOpen && "hidden"}`}>OTP Verification</span>
  </Link>
  <Link
    to="/aadhar"
    className="flex items-center p-2 hover:bg-[#205223cc] transition duration-200 rounded-md"
  >
    <FaUsers className="text-xl" />
    <span className={`ml-4 ${!isOpen && "hidden"}`}>Aadhaar OTP</span>
  </Link>
  <Link
    to="/beneficiary" // Update this to the actual path for the Beneficiary page
    className="flex items-center p-2 hover:bg-[#205223cc] transition duration-200 rounded-md"
  >
    <FaUsers className="text-xl" />
    <span className={`ml-4 ${!isOpen && "hidden"}`}>Beneficiary</span>
  </Link>
  <Link
    to="/nominee" // Update this to the actual path for the Nominee page
    className="flex items-center p-2 hover:bg-[#205223cc] transition duration-200 rounded-md"
  >
    <FaUsers className="text-xl" />
    <span className={`ml-4 ${!isOpen && "hidden"}`}>Nominee</span>
  </Link>
</nav>


        {isOpen && (
          <div
            onMouseDown={startResizing}
            className="w-1 bg-gray-400 cursor-ew-resize absolute right-0 top-0 bottom-0"
          />
        )}
      </div>

    
      <NavbarContainer sidebarWidth={isOpen ? sidebarWidth : 64}>
        <Logo>Plexify</Logo>

        <UserIcon ref={dropdownRef} onClick={toggleDropdown}>
          <FiUser /> Profile
          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem onClick={() => alert("Settings clicked")}>
              Settings
            </DropdownItem>
            <DropdownItem onClick={logout}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UserIcon>
      </NavbarContainer>

     
    </>
  );
}

export default Sidebar;
