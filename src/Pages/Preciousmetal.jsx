import React, { useState, useContext } from "react";
import { FaPlus, FaFileUpload, FaDollarSign } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import Section from "../Components/Section";
import InputWithIcon from "../Components/InputWithIcon"; // Importing the InputWithIcon component
import axios from "axios";

function PreciousMetalsInheritanceManagement() {
  const { API, token } = useContext(AuthContext);
  const [metals, setMetals] = useState([
    { metalType: "", weight: "", purchasePrice: "", currentValue: "", description: "" },
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
  const [document, setDocument] = useState(null);

  const addMetal = () => {
    setMetals([
      ...metals,
      { metalType: "", weight: "", purchasePrice: "", currentValue: "", description: "" },
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

  const handleMetalChange = (index, field, value) => {
    // For weight field, allow only up to two decimal places
    if (field === "weight") {
      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value)) {
        const updatedMetals = [...metals];
        updatedMetals[index][field] = value;
        setMetals(updatedMetals);
      }
    } else {
      const updatedMetals = [...metals];
      updatedMetals[index][field] = value;
      setMetals(updatedMetals);
    }
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index][field] = value;
    setBeneficiaries(updatedBeneficiaries);
  };

  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("metals", JSON.stringify(metals));
    formData.append("beneficiaries", JSON.stringify(beneficiaries));
    if (document) {
      formData.append("document", document);
    }

    try {
      const response = await axios.post(`${API}/precious-metal`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Precious Metals Inheritance
        </h1>
        <p className="text-gray-600 max-w-md">
          Organize and designate beneficiaries for your precious metal assets.
        </p>
      </header>

      <Section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Precious Metals
        </h2>
        {metals.map((metal, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                className="border-l-2 border-[#538d2dfd] p-3 rounded-md shadow-lg w-full"
                value={metal.metalType}
                onChange={(e) =>
                  handleMetalChange(index, "metalType", e.target.value)
                }
              >
                <option value="">Select Metal Type</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
                <option value="Palladium">Palladium</option>
              </select>

              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Weight (grams)"
                value={metal.weight}
                onChange={(e) =>
                  handleMetalChange(index, "weight", e.target.value)
                }
              />

              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Purchase Price (₹)"
                value={metal.purchasePrice}
                onChange={(e) =>
                  handleMetalChange(index, "purchasePrice", e.target.value)
                }
              />

              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Current Value (₹)"
                value={metal.currentValue}
                onChange={(e) =>
                  handleMetalChange(index, "currentValue", e.target.value)
                }
              />

              <InputWithIcon
                icon={<FaFileUpload />}
                placeholder="Description"
                value={metal.description}
                onChange={(e) =>
                  handleMetalChange(index, "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}
        <button
          onClick={addMetal}
          className="bg-[#3d5e27fd] text-white py-3 px-8 rounded-md shadow-md hover:bg-[#4c7033fd] transition-all"
        >
          <FaPlus className="inline mr-2" /> Add Metal
        </button>
      </Section>

      <Section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Beneficiary Information
        </h2>
        {beneficiaries.map((beneficiary, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Beneficiary Name"
                value={beneficiary.name}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "name", e.target.value)
                }
              />

              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Contact Number"
                value={beneficiary.contact}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "contact", e.target.value)
                }
              />

              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Email Address"
                value={beneficiary.email}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "email", e.target.value)
                }
              />

              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Percentage of Entitlement"
                type='number'
                value={beneficiary.entitlement}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "entitlement", e.target.value)
                }
              />

              <InputWithIcon
                icon={<FaDollarSign />}
                placeholder="Relationship"
                value={beneficiary.relationship}
                onChange={(e) =>
                  handleBeneficiaryChange(index, "relationship", e.target.value)
                }
              />
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={beneficiary.notify}
                  onChange={(e) =>
                    handleBeneficiaryChange(index, "notify", e.target.checked)
                  }
                />
                Notify by Email
              </label>
            </div>
          </div>
        ))}
        <button
          onClick={addBeneficiary}
          className="bg-[#3d5e27fd] text-white py-3 px-8 rounded-md shadow-md hover:bg-[#4c7033fd] transition-all"
        >
          <FaPlus className="inline mr-2" /> Add Beneficiary
        </button>
      </Section>

      <Section className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>

        <div className="relative flex items-center">
          <input
            type="file"
            accept="application/pdf, image/*"
            onChange={handleDocumentUpload}
            id="file-input"
            className="hidden"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd]"
          >
            Choose a file
          </label>

          {document && (
            <span className="ml-4 text-sm text-gray-600">{document.name}</span>
          )}
        </div>
      </Section>

      <div className="flex justify-center mb-4 mt-10">
        <button
          onClick={handleSubmit}
          className="bg-[#538d2dfd] text-white py-3 px-8 rounded-md shadow-md hover:bg-[#4c7033fd] transition-all"
        >
          Submit Data
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default PreciousMetalsInheritanceManagement;
