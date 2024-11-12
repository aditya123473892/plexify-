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
    {
      property_name: "",
      property_type: "",
      location: "",
      area_in_sqft: "",
      purchase_date: "",
      purchase_price: "",
      current_value: "",
      ownership_status: "",
      rental_income: "",
      tenant_name: "",
      tenant_contact: "",
      status: "",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
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
      {
        property_name: "",
        property_type: "",
        location: "",
        area_in_sqft: "",
        purchase_date: "",
        purchase_price: "",
        current_value: "",
        ownership_status: "",
        rental_income: "",
        tenant_name: "",
        tenant_contact: "",
        status: "",
        created_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
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

      {/* Property Section */}
      {properties.map((property, index) => (
        <FieldSection key={index} title={`Property ${index + 1}`}>
          <InputWithIcon
            icon={<FaHome className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Property Name"
            value={property.property_name}
            onChange={(e) =>
              handlePropertyChange(index, "property_name", e.target.value)
            }
          />
          <select
            className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
            value={property.property_type}
            onChange={(e) =>
              handlePropertyChange(index, "property_type", e.target.value)
            }
          >
            <option value="">Select Property Type</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Agriculture">Agriculture</option>
          </select>
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
            type="number"
            placeholder="Area (sq ft)"
            value={property.area_in_sqft}
            onChange={(e) =>
              handlePropertyChange(index, "area_in_sqft", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Purchase Date"
            value={property.purchase_date}
            onChange={(e) =>
              handlePropertyChange(index, "purchase_date", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Purchase Price"
            value={property.purchase_price}
            onChange={(e) =>
              handlePropertyChange(index, "purchase_price", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Value"
            value={property.current_value}
            onChange={(e) =>
              handlePropertyChange(index, "current_value", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaHome className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Ownership Status"
            value={property.ownership_status}
            onChange={(e) =>
              handlePropertyChange(index, "ownership_status", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Rental Income"
            value={property.rental_income}
            onChange={(e) =>
              handlePropertyChange(index, "rental_income", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Tenant Name"
            value={property.tenant_name}
            onChange={(e) =>
              handlePropertyChange(index, "tenant_name", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Tenant Contact"
            value={property.tenant_contact}
            onChange={(e) =>
              handlePropertyChange(index, "tenant_contact", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaCheckCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Status"
            value={property.status}
            onChange={(e) =>
              handlePropertyChange(index, "status", e.target.value)
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

      <Section title="Document Upload">
        {/* Add any document upload fields here */}
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
