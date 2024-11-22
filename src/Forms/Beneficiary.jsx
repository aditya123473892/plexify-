import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaPercentage,
  FaLink,
  FaDatabase,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";

function Beneficiary() {
  const [formData, setFormData] = useState({
    userId: "", // Matches the backend field `userId`
    name: "",
    contact: "",
    email: "",
    entitlement: "",
    relationship: "",
    notify: false, // Matches the boolean field in SQL
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.userId.trim()) newErrors.userId = "User ID is required.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.entitlement.trim())
      newErrors.entitlement = "Entitlement percentage is required.";
    if (!formData.relationship.trim())
      newErrors.relationship = "Relationship is required.";

    // Format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (formData.entitlement && isNaN(formData.entitlement)) {
      newErrors.entitlement = "Entitlement percentage must be a number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit data to the backend
  const postData = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        const payload = {
          userId: formData.userId.trim(),
          name: formData.name.trim(),
          contact: formData.contact ? formData.contact.trim() : null, // Optional field
          email: formData.email ? formData.email.trim() : null, // Optional field
          entitlement: parseFloat(formData.entitlement),
          relationship: formData.relationship.trim(),
          notify: formData.notify,
        };

        console.log("Submitting payload:", payload);

        const response = await axios.post(
          "http://localhost:3523/add-beneficiary",
          payload
        );

        console.log("Server response:", response.data);

        if (response.status === 201) {
          toast.success("Beneficiary data submitted successfully!");
          setFormData({
            userId: "",
            name: "",
            contact: "",
            email: "",
            entitlement: "",
            relationship: "",
            notify: false,
          });
        } else {
          toast.error(response.data.msg || "Submission failed.");
        }
      } catch (error) {
        if (error.response) {
          // Server returned an error
          console.error("Error response:", error.response.data);
          toast.error(error.response.data.msg || "A server error occurred.");
        } else if (error.request) {
          // Network error
          console.error("Network error:", error.request);
          toast.error("Network error. Please try again.");
        } else {
          // Other error
          console.error("Error:", error.message);
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form
      className="min-h-screen bg-white p-6 rounded-lg shadow-2xl mt-10 md:mt-20 overflow-y-auto"
      onSubmit={postData}
      style={{ maxHeight: "100vh" }}
    >
      <header>
        <h1 className="text-3xl font-bold mb-8">Beneficiary Information</h1>
        <p className="text-gray-600">
          Manage your beneficiaries with a user-friendly interface.
        </p>
      </header>
      <div>
        <FieldSection title="Beneficiary Details">
          <InputWithIcon
            icon={<FaDatabase />}
            placeholder="Enter user ID"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
          />
          {errors.userId && (
            <p className="text-red-500 text-sm">{errors.userId}</p>
          )}

          <InputWithIcon
            icon={<FaUser />}
            placeholder="Enter beneficiary name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <InputWithIcon
            icon={<FaPhoneAlt />}
            placeholder="Enter contact number (optional)"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && (
            <p className="text-red-500 text-sm">{errors.contact}</p>
          )}

          <InputWithIcon
            icon={<FaEnvelope />}
            placeholder="Enter email address (optional)"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <InputWithIcon
            icon={<FaPercentage />}
            placeholder="Enter entitlement percentage"
            name="entitlement"
            value={formData.entitlement}
            onChange={handleChange}
          />
          {errors.entitlement && (
            <p className="text-red-500 text-sm">{errors.entitlement}</p>
          )}

          <InputWithIcon
            icon={<FaLink />}
            placeholder="Enter relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
          />
          {errors.relationship && (
            <p className="text-red-500 text-sm">{errors.relationship}</p>
          )}

          <div className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              name="notify"
              id="notify"
              checked={formData.notify}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="notify" className="text-gray-700">
              Notify Beneficiary
            </label>
          </div>
        </FieldSection>
      </div>
      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#466d2c] text-white px-6 py-2 w-fit rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#233615]"
          } transition text shadow-xl`}
        >
          {loading ? "Submitting..." : "Submit Form"}
        </button>
      </div>
    </form>
  );
}

export default Beneficiary;
