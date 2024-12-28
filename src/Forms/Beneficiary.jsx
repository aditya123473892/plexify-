import React, { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaUser, FaPhoneAlt, FaEnvelope, FaPercentage, FaLink, FaEye } from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { AuthContext } from "../Contexts/Context";
import { Link } from "react-router-dom";

function Beneficiary() {
  const { API, token,beneficiaryUser } = useContext(AuthContext);
  
  // State for a single beneficiary
  const [beneficiary, setBeneficiary] = useState({
    name: "",
    contact: "",
    email: "",
    entitlement: "",
    relationship: "",
    document: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeneficiary({ ...beneficiary, [name]: value });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setBeneficiary({ ...beneficiary, document: files[0] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", beneficiary.name);
    formData.append("contact", beneficiary.contact);
    formData.append("email", beneficiary.email);
    formData.append("entitlement", beneficiary.entitlement);
    formData.append("relationship", beneficiary.relationship);
    formData.append("document", beneficiary.document);

    try {
      const response = await axios.post(`${API}/beneficiaries`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Beneficiary saved successfully!");
    } catch (error) {
      toast.error("Failed to save beneficiary.");
      console.error(error);
    }
    setLoading(false);
  };

  console.log(beneficiaryUser.beneficiaries)
  return (
    <div className="min-h-screen bg-white p-6 rounded-lg shadow-2xl mt-10 md:mt-20 overflow-y-auto">
      <header>
        <h1 className="text-3xl font-bold mb-8">Manage Beneficiary</h1>
        <p className="text-gray-600">
          Add and upload documents for your beneficiary.
        </p>
      </header>

      <div className="mb-6 border border-gray-300 rounded-lg shadow-md p-6">
        <FieldSection title="Beneficiary">
          <InputWithIcon
            icon={<FaUser />}
            placeholder="Enter beneficiary name"
            name="name"
            value={beneficiary.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <InputWithIcon
            icon={<FaPhoneAlt />}
            placeholder="Enter contact number (optional)"
            name="contact"
            value={beneficiary.contact}
            onChange={handleChange}
          />

          <InputWithIcon
            icon={<FaEnvelope />}
            placeholder="Enter email address (optional)"
            type="email"
            name="email"
            value={beneficiary.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <InputWithIcon
            icon={<FaPercentage />}
            placeholder="Enter entitlement percentage"
            name="entitlement"
            value={beneficiary.entitlement}
            onChange={handleChange}
          />
          {errors.entitlement && <p className="text-red-500 text-sm">{errors.entitlement}</p>}

          <InputWithIcon
            icon={<FaLink />}
            placeholder="Enter relationship"
            name="relationship"
            value={beneficiary.relationship}
            onChange={handleChange}
          />
          {errors.relationship && <p className="text-red-500 text-sm">{errors.relationship}</p>}

          <div className="mt-4">
            <input
              type="file"
              accept="image/jpeg, image/png, application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600"
            />
            {beneficiary.document && (
              <div className="mt-4">
                <a
                  href={URL.createObjectURL(beneficiary.document)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-500 underline hover:text-blue-700"
                >
                  <FaEye className="inline-block mr-2" />
                  View Uploaded File
                </a>
              </div>
            )}
          </div>
        </FieldSection>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={handleSubmit}
          className={`bg-[#3a5e22fd] text-white py-2 px-6 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2f4b1dfd]"}`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Beneficiary"}
        </button>
      </div>

      <ToastContainer />

      <div className="my-7 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow text-black">
  <h2 className="text-2xl font-semibold text-[#538d2dfd] mb-6">Beneficiaries</h2>
  {beneficiaryUser && beneficiaryUser.length > 0 ? (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-6">
      {beneficiaryUser.map((beneficiary, index) => {
        // Helper function to convert buffer to base64 string
        const bufferToBase64 = (buffer) => {
          const binary = String.fromCharCode.apply(null, new Uint8Array(buffer.data));
          return `data:${buffer.type};base64,${btoa(binary)}`;
        };

        return (
          <Link
            key={beneficiary.beneficiary_id}  // Make the entire card clickable
            to={`/beneficiary/${beneficiary.beneficiary_id}`} // URL to navigate to beneficiary details
            className="p-4 border-l-2 border-[#538d2dfd] rounded-lg shadow hover:shadow-md transition duration-200 ease-in-out flex flex-col items-center text-center"
          >
            {/* Profile Picture or Initials */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg">
              {beneficiary.document && beneficiary.document.data ? (
                <img
                  src={bufferToBase64(beneficiary.document)} // Convert buffer to base64 string
                  alt="Beneficiary"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                beneficiary.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              )}
            </div>

            {/* Beneficiary Name */}
            <p className="mt-4 text-lg font-semibold text-[#538d2dfd]">
              {beneficiary.name}
            </p>

            {/* Relationship */}
            <p className="text-black text-sm">
              <strong>Relationship:</strong> {beneficiary.relationship}
            </p>

            {/* Contact */}
            <p className="text-black text-sm font-sans">
              <strong>Contact:</strong>{" "}
              {beneficiary.contact ? beneficiary.contact : "Not provided"}
            </p>

            {/* Entitlement */}
            <p className="text-black text-sm font-sans">
              <strong>Entitlement:</strong> {beneficiary.entitlement}%
            </p>
          </Link>
        );
      })}
    </div>
  ) : (
    <p>No beneficiaries added yet.</p>
  )}
</div>

    </div>
  );
}

export default Beneficiary;
