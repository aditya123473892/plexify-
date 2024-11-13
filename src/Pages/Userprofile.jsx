// src/components/UserProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with actual endpoint to fetch user data
        const response = await axios.get("http://localhost:3523/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  if (!userData) {
    return <p className="text-center mt-4">No user data found.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 w-full max-w-4xl bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-4">User Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              First Name
            </label>
            <div className="flex items-center border rounded-md shadow-md p-3">
              <FaUser className="text-[#385723] mr-3" />
              <p>{userData.firstName}</p>
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Last Name
            </label>
            <div className="flex items-center border rounded-md shadow-md p-3">
              <FaUser className="text-[#385723] mr-3" />
              <p>{userData.lastName}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <div className="flex items-center border rounded-md shadow-md p-3">
              <FaEnvelope className="text-[#385723] mr-3" />
              <p>{userData.email}</p>
            </div>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Aadhaar Number
            </label>
            <div className="flex items-center border rounded-md shadow-md p-3">
              <FaIdCard className="text-[#385723] mr-3" />
              <p>{userData.aadharNumber}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <div className="flex items-center border rounded-md shadow-md p-3">
              <FaPhone className="text-[#385723] mr-3" />
              <p>{userData.phoneNumber}</p>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold mb-1">Gender</label>
            <div className="flex items-center border rounded-md shadow-md p-3">
              <p>{userData.gender}</p>
            </div>
          </div>

          {/* Beneficiary Status */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Beneficiary
            </label>
            <div className="flex items-center border rounded-md shadow-md p-3">
              <p>{userData.beneficiary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
