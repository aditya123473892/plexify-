import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaUser, FaPhoneAlt, FaEnvelope, FaPercentage, FaLink, FaEye } from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { AuthContext } from "../Contexts/Context";

function Beneficiary() {
  const { API, token } = useContext(AuthContext);
  const [formData, setFormData] = useState([]); // Beneficiaries array
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch beneficiary data from the API
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get(`${API}/beneficiary_user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const beneficiaries = response.data.beneficiaries.map((beneficiary) => ({
          ...beneficiary,
          photo: null, // Placeholder for file upload
        }));
        setFormData(beneficiaries.length > 0 ? beneficiaries : [
          {
            name: "",
            contact: "",
            email: "",
            entitlement: "",
            relationship: "",
            notify: false,
            photo: null,
            document_path: null,
          },
        ]);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        toast.error("Failed to fetch beneficiaries. Please try again.");
      }
    };
    fetchBeneficiaries();
  }, [API, token]);

  // Handle input changes
  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(updatedFormData);
  };

  // Handle file changes
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedFormData = [...formData];
      updatedFormData[index].photo = file;
      setFormData(updatedFormData);
    }
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
      if (
        beneficiary.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(beneficiary.email)
      ) {
        newErrors[`email-${index}`] = "Invalid email address.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      formData.forEach((beneficiary, index) => {
        Object.keys(beneficiary).forEach((key) => {
          if (key === "photo" && beneficiary.photo) {
            payload.append(`beneficiaries[${index}][photo]`, beneficiary.photo);
          } else {
            payload.append(`beneficiaries[${index}][${key}]`, beneficiary[key]);
          }
        });
      });

      const response = await axios.post(`${API}/add-beneficiary`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Beneficiaries saved successfully!");
        setFormData([]); // Reset the form after submission
      } else {
        toast.error(response.data.msg || "Submission failed.");
      }
    } catch (error) {
      console.error("Error saving beneficiaries:", error);
      toast.error("Failed to save beneficiaries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new empty beneficiary
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
        photo: null,
        document_path: null,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-white p-6 rounded-lg shadow-2xl mt-10 md:mt-20 overflow-y-auto">
      <header>
        <h1 className="text-3xl font-bold mb-8">Manage Beneficiaries</h1>
        <p className="text-gray-600">
          Add, manage, and upload documents for your beneficiaries.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        {formData.map((beneficiary, index) => (
          <div key={index} className="mb-6 border border-gray-300 rounded-lg shadow-md p-6">
            <FieldSection title={`Beneficiary ${index + 1}`}>
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
              {errors[`entitlement-${index}`] && (
                <p className="text-red-500 text-sm">{errors[`entitlement-${index}`]}</p>
              )}

              <InputWithIcon
                icon={<FaLink />}
                placeholder="Enter relationship"
                name="relationship"
                value={beneficiary.relationship}
                onChange={(e) => handleChange(e, index)}
              />
              {errors[`relationship-${index}`] && (
                <p className="text-red-500 text-sm">{errors[`relationship-${index}`]}</p>
              )}

              <div className="mt-4">
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  className="block w-full text-sm text-gray-600"
                />

                {beneficiary.photo && (
                  <div className="mt-4">
                    <a
                      href={URL.createObjectURL(beneficiary.photo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-500 underline hover:text-blue-700"
                    >
                      <FaEye className="inline-block mr-2" />
                      View Uploaded File
                    </a>
                  </div>
                )}

                {beneficiary.document_path && !beneficiary.photo && (
                  <div className="mt-4">
                    <a
                      href={beneficiary.document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-green-500 underline hover:text-green-700"
                    >
                      <FaEye className="inline-block mr-2" />
                      View Existing Document
                    </a>
                  </div>
                )}
              </div>
            </FieldSection>
          </div>
        ))}

        <div className="text-right">
          <button
            type="button"
            onClick={addNewBeneficiary}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mr-4"
          >
            Add Beneficiary
          </button>
          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-6 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Beneficiaries"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Beneficiary;
