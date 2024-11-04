import React, { useState } from "react";
import {
  FaHome,
  FaMapMarkerAlt,
  FaExpandArrowsAlt,
  FaDollarSign,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaPercent,
  FaLink,
  FaPlus,
  FaFileUpload,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

const RealEstateManagement = () => {
  const [properties, setProperties] = useState([
    { type: "", location: "", size: "", purchaseValue: "", currentValue: "" },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([
    {
      name: "",
      contact: "",
      email: "",
      entitlement: "",
      relationship: "",
      notify: false,
    },
  ]);

  const handlePropertyChange = (index, field, value) => {
    const newProperties = [...properties];
    newProperties[index][field] = value;
    setProperties(newProperties);
  };

  const addProperty = () => {
    setProperties([
      ...properties,
      { type: "", location: "", size: "", purchaseValue: "", currentValue: "" },
    ]);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index][field] = value;
    setBeneficiaries(newBeneficiaries);
  };

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
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
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Real Estate
        </h1>
        <p className="text-gray-600">
          Effortlessly manage your real estate properties with a user-friendly
          interface.
        </p>
      </header>

      {properties.map((property, index) => (
        <FieldSection key={index} title={`${index + 1} Properties`}>
          <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
            <FaHome className="text-[#538d2dfd] mx-2" />
            <select
              className="border-0 rounded-md p-3 w-full bg-transparent"
              value={property.type}
              onChange={(e) =>
                handlePropertyChange(index, "type", e.target.value)
              }
            >
              <option value="">Select Property Type</option>
              <option value="Land">Land</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <InputWithIcon
            icon={<FaMapMarkerAlt className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Location"
            value={property.location}
            onChange={(e) =>
              handlePropertyChange(index, "location", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaExpandArrowsAlt className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Size (sq ft)"
            value={property.size}
            onChange={(e) =>
              handlePropertyChange(index, "size", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Purchase Value"
            value={property.purchaseValue}
            onChange={(e) =>
              handlePropertyChange(index, "purchaseValue", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Current Value"
            value={property.currentValue}
            onChange={(e) =>
              handlePropertyChange(index, "currentValue", e.target.value)
            }
          />
        </FieldSection>
      ))}

      <button
        onClick={addProperty}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add Property
      </button>

      {beneficiaries.map((beneficiary, index) => (
        <FieldSection key={index} title="Beneficiary Information">
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Full Name"
            value={beneficiary.name}
            onChange={(e) =>
              handleBeneficiaryChange(index, "name", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="tel"
            placeholder="Contact Number"
            value={beneficiary.contact}
            onChange={(e) =>
              handleBeneficiaryChange(index, "contact", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email"
            value={beneficiary.email}
            onChange={(e) =>
              handleBeneficiaryChange(index, "email", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPercent className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Entitlement (%)"
            value={beneficiary.entitlement}
            onChange={(e) =>
              handleBeneficiaryChange(index, "entitlement", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaLink className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Relationship"
            value={beneficiary.relationship}
            onChange={(e) =>
              handleBeneficiaryChange(index, "relationship", e.target.value)
            }
          />
        </FieldSection>
      ))}

      <button
        onClick={addBeneficiary}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Beneficiary
      </button>

      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <input
            type="file"
            className="border-0 rounded-md p-3 w-full bg-transparent"
            placeholder="Upload Aadhar"
            aria-label="Upload Aadhar"
          />
        </div>

        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <input
            type="file"
            className="border-0 rounded-md p-3 w-full bg-transparent"
            placeholder="Upload PAN"
            aria-label="Upload PAN"
          />
        </div>

        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          Upload Document
        </button>
      </Section>

      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">
          Explore our educational resources on real estate management.
        </p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaBook className="inline mr-2" /> Learn More
        </button>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Real Estate Details
      </button>
    </div>
  );
};

export default RealEstateManagement;
