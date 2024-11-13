// File path: /src/pages/RealEstateManagement.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { FaEnvelope } from "react-icons/fa";

import {
  FaHome,
  FaMapMarkerAlt,
  FaExpandArrowsAlt,
  FaDollarSign,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaPercent,
  FaLink,
  FaPlus,
} from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RealEstateManagement() {
  const { API, token } = useContext(AuthContext);
  const [properties, setProperties] = useState([
    {
      propertyName: "",
      propertyType: "",
      location: "",
      areaInSqft: "",
      purchaseDate: "",
      purchasePrice: "",
      currentValue: "",
      ownershipStatus: "",
      rentalIncome: "",
      tenantName: "",
      tenantContact: "",
      status: "",
    },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/real_estate`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProperties(
          response.data.properties || [
            {
              propertyName: "",
              propertyType: "",
              location: "",
              areaInSqft: "",
              purchaseDate: "",
              purchasePrice: "",
              currentValue: "",
              ownershipStatus: "",
              rentalIncome: "",
              tenantName: "",
              tenantContact: "",
              status: "",
            },
          ]
        );
        setBeneficiaries(
          response.data.beneficiaries || [
            {
              name: "",
              contact: "",
              email: "",
              entitlement: "",
              relationship: "",
              notify: false,
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again.");
      }
    };

    fetchData();
  }, [API, token]);

  const addProperty = () => {
    setProperties([
      ...properties,
      {
        propertyName: "",
        propertyType: "",
        location: "",
        areaInSqft: "",
        purchaseDate: "",
        purchasePrice: "",
        currentValue: "",
        ownershipStatus: "",
        rentalIncome: "",
        tenantName: "",
        tenantContact: "",
        status: "",
      },
    ]);
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

  const handlePropertyChange = (index, field, value) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = value;
    setProperties(updatedProperties);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  const validateForm = () => {
    for (let property of properties) {
      if (
        !property.propertyName ||
        !property.propertyType ||
        !property.location ||
        !property.areaInSqft ||
        !property.purchaseDate ||
        !property.purchasePrice ||
        !property.ownershipStatus
      ) {
        toast.error("All property fields are required.", {
          position: "bottom-right",
        });
        return false;
      }
      if (isNaN(property.areaInSqft) || property.areaInSqft <= 0) {
        toast.error("Area (sq ft) should be a positive number.");
        return false;
      }
      if (isNaN(property.purchasePrice) || property.purchasePrice <= 0) {
        toast.error("Purchase Price should be a positive number.");
        return false;
      }
      if (
        property.currentValue &&
        (isNaN(property.currentValue) || property.currentValue < 0)
      ) {
        toast.error("Current Value should be a non-negative number.");
        return false;
      }
    }

    for (let beneficiary of beneficiaries) {
      if (
        !beneficiary.name ||
        !beneficiary.contact ||
        !beneficiary.email ||
        !beneficiary.entitlement ||
        !beneficiary.relationship
      ) {
        toast.error("All beneficiary fields are required.");
        return false;
      }
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(beneficiary.email)) {
        toast.error("Invalid email address.", {
          position: "bottom-right",
        });
        return false;
      }
      if (
        isNaN(beneficiary.entitlement) ||
        beneficiary.entitlement <= 0 ||
        beneficiary.entitlement > 100
      ) {
        toast.error(
          "Entitlement percentage should be a number between 0 and 100."
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = {
      properties,
      beneficiaries,
    };

    try {
      const response = await axios.post(`${API}/real_estate`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);

      toast.success("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Real Estate
        </h1>
        <p className="text-gray-600">
          Effortlessly manage your real estate properties and beneficiaries with
          a user-friendly interface.
        </p>
      </header>

      {properties.map((property, index) => (
        <div key={index} className="mb-4 border-b pb-4">
          <FieldSection title="Property Details">
            <InputWithIcon
              icon={<FaHome />}
              type="text"
              placeholder="Property Name"
              value={property.propertyName}
              onChange={(e) =>
                handlePropertyChange(index, "propertyName", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaHome />}
              type="text"
              placeholder="Property Type"
              value={property.propertyType}
              onChange={(e) =>
                handlePropertyChange(index, "propertyType", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaMapMarkerAlt />}
              type="text"
              placeholder="Location"
              value={property.location}
              onChange={(e) =>
                handlePropertyChange(index, "location", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaExpandArrowsAlt />}
              type="number"
              placeholder="Area (sq ft)"
              value={property.areaInSqft}
              onChange={(e) =>
                handlePropertyChange(index, "areaInSqft", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaDollarSign />}
              type="date"
              placeholder="Purchase Date"
              value={property.purchaseDate}
              onChange={(e) =>
                handlePropertyChange(index, "purchaseDate", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaDollarSign />}
              type="number"
              placeholder="Purchase Price"
              value={property.purchasePrice}
              onChange={(e) =>
                handlePropertyChange(index, "purchasePrice", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaDollarSign />}
              type="number"
              placeholder="Current Value"
              value={property.currentValue}
              onChange={(e) =>
                handlePropertyChange(index, "currentValue", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaHome />}
              type="text"
              placeholder="Ownership Status"
              value={property.ownershipStatus}
              onChange={(e) =>
                handlePropertyChange(index, "ownershipStatus", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaDollarSign />}
              type="number"
              placeholder="Rental Income"
              value={property.rentalIncome}
              onChange={(e) =>
                handlePropertyChange(index, "rentalIncome", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaUser />}
              type="text"
              placeholder="Tenant Name"
              value={property.tenantName}
              onChange={(e) =>
                handlePropertyChange(index, "tenantName", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaPhone />}
              type="text"
              placeholder="Tenant Contact"
              value={property.tenantContact}
              onChange={(e) =>
                handlePropertyChange(index, "tenantContact", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaCheckCircle />}
              type="text"
              placeholder="Status"
              value={property.status}
              onChange={(e) =>
                handlePropertyChange(index, "status", e.target.value)
              }
            />
          </FieldSection>
        </div>
      ))}
      <button
        onClick={addProperty}
        className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md mt-4"
      >
        <FaPlus className="inline mx-2" /> Add Property
      </button>

      {beneficiaries.map((beneficiary, index) => (
        <div key={index} className="mb-4 border-b pb-4">
          <FieldSection title="Beneficiary Information">
            <InputWithIcon
              icon={<FaUser />}
              type="text"
              placeholder="Name"
              value={beneficiary.name}
              onChange={(e) =>
                handleBeneficiaryChange(index, "name", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaPhone />}
              type="text"
              placeholder="Contact"
              value={beneficiary.contact}
              onChange={(e) =>
                handleBeneficiaryChange(index, "contact", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaEnvelope />}
              type="email"
              placeholder="Email"
              value={beneficiary.email}
              onChange={(e) =>
                handleBeneficiaryChange(index, "email", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaPercent />}
              type="number"
              placeholder="Entitlement (%)"
              value={beneficiary.entitlement}
              onChange={(e) =>
                handleBeneficiaryChange(index, "entitlement", e.target.value)
              }
            />
            <InputWithIcon
              icon={<FaLink />}
              type="text"
              placeholder="Relationship"
              value={beneficiary.relationship}
              onChange={(e) =>
                handleBeneficiaryChange(index, "relationship", e.target.value)
              }
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={beneficiary.notify}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "notify", e.target.checked)
                }
                className="mr-2"
              />
              <span>Notify Beneficiary</span>
            </div>
          </FieldSection>
        </div>
      ))}
      <button
        onClick={addBeneficiary}
        className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded-md shadow-md mt-4"
      >
        <FaPlus className="inline mx-2" /> Add Beneficiary
      </button>

      <ToastContainer />
      <div className="text-end">
        <button
          onClick={handleSubmit}
          className="bg-[#538d2dfd] hover:bg-[#4c7033fd] text-white py-2 px-4 rounded-md shadow-md mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default RealEstateManagement;
