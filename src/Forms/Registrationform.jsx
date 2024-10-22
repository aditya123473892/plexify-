import React, { useState } from "react";

function RegistrationForm() {
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

  // Utility function to validate fields
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const aadharRegex = /^\d{12}$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.firstName.trim())
      tempErrors.firstName = "First Name is required";
    if (!formData.lastName.trim())
      tempErrors.lastName = "Last Name is required";
    if (!emailRegex.test(formData.email)) tempErrors.email = "Invalid Email";
    if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    if (!aadharRegex.test(formData.aadharNumber))
      tempErrors.aadharNumber = "Aadhaar must be 12 digits";
    if (!phoneRegex.test(formData.phoneNumber))
      tempErrors.phoneNumber = "Phone number must be 10 digits";
    if (!formData.gender) tempErrors.gender = "Please select gender";
    if (!formData.beneficiary)
      tempErrors.beneficiary = "Please select beneficiary status";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted", formData);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl border border-gray-300">
        <h2 className="text-xl font-semibold text-center mb-4">
          Registration Form
        </h2>
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="w-full p-2 border rounded-md"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="w-full p-2 border rounded-md"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              className="w-full p-2 border rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password and Confirm Password */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded-md"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className="w-full p-2 border rounded-md"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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
            <input
              type="text"
              name="aadharNumber"
              placeholder="012345678912"
              className="w-full p-2 border rounded-md"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
            />
            {errors.aadharNumber && (
              <p className="text-red-500 text-sm">{errors.aadharNumber}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="9876543210"
              className="w-full p-2 border rounded-md"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
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

          {/* Register Button */}
          <button
            type="submit"
            className="w-full mt-6 py-2 bg-[#385723] text-white rounded-md hover:bg-green-700 transition"
          >
            Register
          </button>

          {/* Redirect to Login */}
          <p className="text-center mt-3 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
