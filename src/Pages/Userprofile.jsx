import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import { FaCheckCircle } from "react-icons/fa";
import FieldSection from "../Components/FieldSection";
import InputWithIcon from "../Components/InputWithIcon";
import { toast,ToastContainer } from "react-toastify";

const UserProfile = ({ userId }) => {
  const { API, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    aadharNumber: "",
    phoneNumber: "",
    gender: "",
    beneficiary: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/user_profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data.user_profile[0];
        setForm((prev) => ({
          ...prev,
          ...userData,
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API}/user_profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(response.data.msg || "User data updated successfully!");
    } catch (err) {
      console.error("Error updating user data:", err);
      toast.error("Failed to update user data. Please try again.");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>
      {loading ? (
        <p className="text-blue-500">Loading user data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <FieldSection>
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="First Name"
              value={form.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Last Name"
              value={form.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Phone Number"
              value={form.phoneNumber || ""}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Aadhaar Number"
              value={form.aadharNumber || ""}
              onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              name="gender"
              type="select"
              value={form.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              options={["Select Gender", "Male", "Female"]}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Father's Name"
              value={form.fatherName || ""}
              onChange={(e) => handleInputChange("fatherName", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Mother's Name"
              value={form.motherName || ""}
              onChange={(e) => handleInputChange("motherName", e.target.value)}
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              name="beneficiary"
                  type="select"
              value={form.beneficiary || ""}
              onChange={(e) => handleInputChange("beneficiary", e.target.value)}
              options={["Select Any", "Yes", "No"]}
            />
                     <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Spouse's Name"
              value={form.spouseName || ""}
              onChange={(e) => handleInputChange("spouseName", e.target.value)}
            />
   <div className="col-span-2 w-full">
  <textarea
    name="address"
    value={form.address || ""}
    onChange={(e) => handleInputChange("address", e.target.value)}
    className="mt-1 border-l-2 border-[#538d2dfd] shadow rounded-md w-full p-2"
    rows="6"
    placeholder="Address"
  ></textarea>
</div>

          </FieldSection>

          <button
            type="button"
            onClick={handleUpdate}
            className="w-full bg-[#538d2dfd] text-white font-medium py-2 px-4 rounded-md hover:bg-[#4c7033fd] focus:outline-none focus:ring-2 focus:ring-[#538d2dfd]"
          >
            Update Profile
          </button>
        </>
      )}
    <ToastContainer/>
    </div>
  );
};

export default UserProfile;
