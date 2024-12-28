import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { FaEnvelope } from "react-icons/fa";
import {
  FaHome,
  FaMapMarkerAlt,
  FaExpandArrowsAlt,
  FaRupeeSign,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaPercent,
  FaLink,
  FaPlus,
} from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import Section from "../Components/Section";

function RealEstateManagement() {
  const [addedBeneficiaries, setAddedBeneficiaries] = useState([]);
  const { API, token, beneficiaryUser } = useContext(AuthContext);
  const [properties, setProperties] = useState([ ]);

  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/properties`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.properties && response.data.properties.length > 0) {
          // Map properties to a format compatible with the form
          const formattedProperties = response.data.properties.map((property) => ({
            id: property.id,
            propertyName: property.property_name || "",
            propertyType: property.property_type || "",
            location: property.location || "",
            areaInSqft: property.area_in_sqft || "",
            purchaseDate: property.purchase_date?.split("T")[0] || "", // Format for <input type="date">
            purchasePrice: property.purchase_price || "",
            currentValue: property.current_value || "",
            ownershipStatus: property.ownership_status || "",
            rentalIncome: property.rental_income || "",
            tenantName: property.tenant_name || "",
            tenantContact: property.tenant_contact || "",
            beneficiaryUser: property.beneficiarie_user || "",
            status: property.status || "Active", // Default status
          }));
  
          setProperties(formattedProperties); 
        }else{
setProperties([{
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
  beneficiaryUser: "",
  status: "",
}
])
        }
        if (response.data.beneficiaries && response.data.beneficiaries.length > 0) {
          setBeneficiaries(response.data.beneficiaries);
        } else {
          // If no beneficiaries data exists, keep an empty array
          setBeneficiaries([]);
        }
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


  const handlePropertyChange = (index, field, value) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = value;
    setProperties(updatedProperties);
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



    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

   const beneficiaryIds = beneficiaries.map((beneficiary) => beneficiary.beneficiary_id); 
  
    const data = { properties, beneficiaries: beneficiaryIds };

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


  const handleAddBeneficiary = (userIndex) => {
    if (beneficiaryUser.length > 0 && !addedBeneficiaries.includes(userIndex)) {
      const user = beneficiaryUser[userIndex];
      const newBeneficiary = {
        beneficiary_id: user.beneficiary_id || "",
        name: user.name || "",
        contact: user.contact || "",
        email: user.email || "",
        entitlement: user.entitlement || "",
        relationship: user.relationship || "",
        notify: false,
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setAddedBeneficiaries([...addedBeneficiaries, userIndex]);
    } else {
      toast.error("This user has already been added or no users are available.");
    }
  };
  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  const getBeneficiaryById = (id) => {
    return beneficiaryUser.find(
      (user) => String(user.beneficiary_id) === String(id)
    ) || null;
  };
const uniqueBeneficiaryIds = Array.from(
  new Set(properties.flatMap((deposit) =>deposit.beneficiaryUser ? deposit.beneficiaryUser.split(",") : []))
);


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
              icon={<span className="text-[#538d2dfd] me-2 font-extrabold text-xl">₹ </span>}
              type="date"
              placeholder="Purchase Date"
              value={property.purchaseDate}
              onChange={(e) =>
                handlePropertyChange(index, "purchaseDate", e.target.value)
              }
            />
            <InputWithIcon
              icon={<span className="text-[#538d2dfd] me-2 font-extrabold text-xl">₹ </span>}
              type="number"
              placeholder="Purchase Price"
              value={property.purchasePrice}
              onChange={(e) =>
                handlePropertyChange(index, "purchasePrice", e.target.value)
              }
            />
            <InputWithIcon
              icon={<span className="text-[#538d2dfd] me-2 font-extrabold text-xl">₹ </span>}
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
              icon={<span className="text-[#538d2dfd] me-2 font-extrabold text-xl">₹ </span>}
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
        className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd] transition-colors"
        onClick={addProperty}
      >
        <FaPlus /> Add Property
      </button>

      <Section>
  <h3 className="font-semibold text-xl">Beneficiaries</h3>
  <div className="mb-6">
    <select
      onChange={(e) => handleAddBeneficiary(e.target.value)}
      className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
    >
      <option value="" disabled selected>Select a beneficiary</option>
      {beneficiaryUser &&
        beneficiaryUser
          .filter((user, index) => !addedBeneficiaries.includes(index))
          .map((user, index) => (
            <option key={index} value={index}>
              {user.name}
            </option>
          ))}
    </select>
  </div>
  
  <div className="grid mb-4">
    {beneficiaries.map((beneficiary, index) => (
      <FieldSection key={index}>
        <InputWithIcon
          icon={<FaUser />}
          type="text"
          placeholder="Beneficiary Name"
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
          placeholder="Entitlement %"
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
      </FieldSection>
    ))}
  </div>


<div className=" p-4 rounded-lg mt-4  bg-gray-50">
  
  <div className="flex flex-col space-y-4">
    {uniqueBeneficiaryIds.map((id) => {
      const beneficiary = getBeneficiaryById(id); // Use updated function
      return beneficiary ? (
        <FieldSection
          key={id}
          className="flex flex-col md:flex-row md:space-x-4"
        >
          <InputWithIcon
            icon={<FaUser />}
            type="text"
            placeholder="Beneficiary Name"
            value={beneficiary.name}
            onChange={(e) =>
              handleBeneficiaryChange("name", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPhone />}
            type="text"
            placeholder="Contact"
            value={beneficiary.contact}
            onChange={(e) =>
              handleBeneficiaryChange("contact", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaEnvelope />}
            type="email"
            placeholder="Email"
            value={beneficiary.email}
            onChange={(e) =>
              handleBeneficiaryChange("email", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaPercent />}
            type="number"
            placeholder="Entitlement %"
            value={beneficiary.entitlement}
            onChange={(e) =>
              handleBeneficiaryChange("entitlement", id, e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaLink />}
            type="text"
            placeholder="Relationship"
            value={beneficiary.relationship}
            onChange={(e) =>
              handleBeneficiaryChange("relationship", id, e.target.value)
            }
          />
        </FieldSection>
      ) : (
        ''
      );
    })}
  </div>
</div>


</Section>




      <div className="mt-10">
        <button
          className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd] transition-colors"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RealEstateManagement;
