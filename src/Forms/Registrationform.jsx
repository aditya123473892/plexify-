import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone } from "react-icons/fa";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadharNumber: "",
    phoneNumber: "",
    gender: "",
    beneficiary: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.aadharNumber)
      newErrors.aadharNumber = "Aadhaar number is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.beneficiary)
      newErrors.beneficiary = "Beneficiary status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postData = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3523/signup",
        formData
      );
      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        toast.success("Signup successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(response.data.msg || "Unexpected response from server.");
        console.error("Error:", response.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data?.msg || "Signup failed due to server error."
        );
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        toast.error(
          "No response from server. Please check your network connection."
        );
        console.error("Network Error:", error.request);
      } else {
        toast.error("Error during request setup. Please try again.");
        console.error("Request Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 w-full max-w-4xl h-[90vh] overflow-y-auto bg-white shadow-md rounded-lg">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto md:mb-[-60px] ms-6 block"
        />
        <h2 className="text-xl font-semibold text-center mb-4">
          Registration Form
        </h2>

        <form onSubmit={postData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                First Name
              </label>
              <div className="flex items-center border rounded-md shadow-md">
                <div className="p-3 flex items-center justify-center rounded-l-md">
                  <FaUser className="text-[#385723]" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Last Name
              </label>
              <div className="flex items-center border rounded-md shadow-md">
                <div className="p-3 flex items-center justify-center rounded-l-md">
                  <FaUser className="text-[#385723]" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <div className="flex items-center border rounded-md shadow-md">
              <div className="p-3 flex items-center justify-center rounded-l-md">
                <FaEnvelope className="text-[#385723]" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Password
              </label>
              <div className="flex items-center border rounded-md shadow-md">
                <div className="p-3 flex items-center justify-center rounded-l-md">
                  <FaLock className="text-[#385723]" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Confirm Password
              </label>
              <div className="flex items-center border rounded-md shadow-md">
                <div className="p-3 flex items-center justify-center rounded-l-md">
                  <FaLock className="text-[#385723]" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Aadhaar Number */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">
              Aadhaar Number
            </label>
            <div className="flex items-center border rounded-md shadow-md">
              <div className="p-3 flex items-center justify-center rounded-l-md">
                <FaIdCard className="text-[#385723]" />
              </div>
              <input
                type="text"
                name="aadharNumber"
                placeholder="012345678912"
                className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
              />
            </div>
            {errors.aadharNumber && (
              <p className="text-red-500 text-sm">{errors.aadharNumber}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <div className="flex items-center border rounded-md shadow-md">
              <div className="p-3 flex items-center justify-center rounded-l-md">
                <FaPhone className="text-[#385723]" />
              </div>
              <input
                type="text"
                name="phoneNumber"
                placeholder="9876543210"
                className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Gender */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">Gender</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  required
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  required
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Beneficiary */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">
              Beneficiary
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="beneficiary"
                  value="Yes"
                  onChange={handleChange}
                  required
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="beneficiary"
                  value="No"
                  onChange={handleChange}
                  required
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {errors.beneficiary && (
              <p className="text-red-500 text-sm">{errors.beneficiary}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2 shadow-md text-white bg-[#263d17] rounded-md hover:bg-[#263b18] transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
