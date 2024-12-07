import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaPercentage,
  FaLink,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { AuthContext } from "../Contexts/Context";

function Beneficiary() {
  const { API, token } = useContext(AuthContext);
  const [formData, setFormData] = useState([]); // Change formData to an array of beneficiaries
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch beneficiary data and pre-fill form (if needed)
  useEffect(() => {
    const fetchBeneficiaryData = async () => {
      try {
        const response = await axios.get(`${API}/beneficiary_user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Assuming you fetch multiple beneficiaries
        setFormData(response.data); // Set response data directly
      } catch (error) {
        console.error("Error fetching beneficiary data:", error);
        toast.error("Error fetching beneficiary data. Please try again.");
      }
    };

    fetchBeneficiaryData();
  }, [API, token]);

  // Handle input changes for specific beneficiary
  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedBeneficiaries = [...formData];
    updatedBeneficiaries[index] = {
      ...updatedBeneficiaries[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(updatedBeneficiaries);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    formData.forEach((beneficiary, index) => {
      if (!beneficiary.name.trim()) newErrors[`name-${index}`] = "Name is required.";
      if (!beneficiary.entitlement.trim())
        newErrors[`entitlement-${index}`] = "Entitlement percentage is required.";
      if (!beneficiary.relationship.trim())
        newErrors[`relationship-${index}`] = "Relationship is required.";

      if (beneficiary.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(beneficiary.email)) {
        newErrors[`email-${index}`] = "Invalid email address.";
      }
      if (beneficiary.entitlement && isNaN(beneficiary.entitlement)) {
        newErrors[`entitlement-${index}`] = "Entitlement percentage must be a number.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit data to the backend
  const postData = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        const payload = formData.map((beneficiary) => ({
          name: beneficiary.name.trim(),
          contact: beneficiary.contact ? beneficiary.contact.trim() : null,
          email: beneficiary.email ? beneficiary.email.trim() : null,
          entitlement: parseFloat(beneficiary.entitlement),
          relationship: beneficiary.relationship.trim(),
          notify: beneficiary.notify,
        }));

        console.log("Submitting payload:", payload);

        const response = await axios.post(
          `${API}/add-beneficiary`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Server response:", response.data);

        if (response.status === 201) {
          toast.success("Beneficiary data submitted successfully!");
          setFormData([]); // Reset form data after successful submission
        } else {
          toast.error(response.data.msg || "Submission failed.");
        }
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
          toast.error(error.response.data.msg || "A server error occurred.");
        } else if (error.request) {
          console.error("Network error:", error.request);
          toast.error("Network error. Please try again.");
        } else {
          console.error("Error:", error.message);
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to add a new empty beneficiary
  const addNewBeneficiary = () => {
    setFormData([
      ...formData,
      {
        name: "",
        contact: "",
        email: "",
        entitlement: "",
        relationship: "",
        notify: false,
      },
    ]);
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

      {/* Loop through each beneficiary and display the form */}
      {formData.map((beneficiary, index) => (
        <div key={index} className="p-6 mb-4 border border-gray-300 rounded-lg shadow-md">
          <FieldSection title="Beneficiary Details">
            <InputWithIcon
              icon={<FaUser />}
              placeholder="Enter beneficiary name"
              name="name"
              value={beneficiary.name}
              onChange={(e) => handleChange(e, index)}
            />
            {errors[`name-${index}`] && <p className="text-red-500 text-sm">{errors[`name-${index}`]}</p>}

            <InputWithIcon
              icon={<FaPhoneAlt />}
              placeholder="Enter contact number (optional)"
              name="contact"
              value={beneficiary.contact}
              onChange={(e) => handleChange(e, index)}
            />
            {errors[`contact-${index}`] && <p className="text-red-500 text-sm">{errors[`contact-${index}`]}</p>}

            <InputWithIcon
              icon={<FaEnvelope />}
              placeholder="Enter email address (optional)"
              type="email"
              name="email"
              value={beneficiary.email}
              onChange={(e) => handleChange(e, index)}
            />
            {errors[`email-${index}`] && <p className="text-red-500 text-sm">{errors[`email-${index}`]}</p>}

            <InputWithIcon
              icon={<FaPercentage />}
              placeholder="Enter entitlement percentage"
              name="entitlement"
              value={beneficiary.entitlement}
              onChange={(e) => handleChange(e, index)}
            />
            {errors[`entitlement-${index}`] && <p className="text-red-500 text-sm">{errors[`entitlement-${index}`]}</p>}

            <InputWithIcon
              icon={<FaLink />}
              placeholder="Enter relationship"
              name="relationship"
              value={beneficiary.relationship}
              onChange={(e) => handleChange(e, index)}
            />
            {errors[`relationship-${index}`] && <p className="text-red-500 text-sm">{errors[`relationship-${index}`]}</p>}

            <div className="flex items-center space-x-3 mt-4">
              <input
                type="checkbox"
                name="notify"
                id={`notify-${index}`}
                checked={beneficiary.notify}
                onChange={(e) => handleChange(e, index)}
                className="w-4 h-4"
              />
              <label htmlFor={`notify-${index}`} className="text-gray-700">
                Notify Beneficiary
              </label>
            </div>
          </FieldSection>
        </div>
      ))}


<div className="mt-4">
        <button
          type="button"
          onClick={addNewBeneficiary}
          className="bg-[#466d2c] text-white px-6 py-2 rounded-md hover:bg-[#233615] transition"
        >
          Add New Beneficiary
        </button>
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

      {/* Button to add a new beneficiary */}


      <ToastContainer />
    </form>
  );
}

export default Beneficiary;
