import React, { useState, useContext,useEffect } from "react";
import { FaPlus,FaEye, FaFileUpload, FaRupeeSign,FaUser,FaPhone,FaEnvelope,FaPercent,FaLink } from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import Section from "../Components/Section";
import InputWithIcon from "../Components/InputWithIcon"; // Importing the InputWithIcon component
import axios from "axios";
import FieldSection from "../Components/FieldSection";

function PreciousMetalsInheritanceManagement() {
  const { API, token,beneficiaryUser } = useContext(AuthContext);
  const [metals, setMetals] = useState([
    { metalType: "", weight: "", purchasePrice: "", currentValue: "", description: "" },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([
   
  ]);
  const [document, setDocument] = useState(null);
  const [addedBeneficiaries, setAddedBeneficiaries] = useState([]);
  const addMetal = () => {
    setMetals([
      ...metals,
      { metalType: "", weight: "", purchasePrice: "", currentValue: "", description: "" },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/precious-metals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.data.metals && response.data.metals.length > 0) {
          const formattedMetals = response.data.metals.map((metal) => {
            const documentBlob = metal.document
              ? new Blob([new Uint8Array(metal.document.data)], { type: "application/pdf" })
              : null;
  
            return {
              id: metal.id,
              metalType: metal.metal_type || "",
              weight: metal.weight || "",
              purchasePrice: metal.purchase_price || "",
              currentValue: metal.current_value || "",
              description: metal.description || "",
              beneficiaryUser: metal.beneficiarie_user || "",
              document: setDocument(documentBlob),
            };
          });
  
          setMetals(formattedMetals);
        } else {
          setMetals([{
            metalType: "",
            weight: "",
            purchasePrice: "",
            currentValue: "",
            description: "",
            document: null,
            beneficiaryUser: "",
          }]);
        }
  
        if (response.data.beneficiaries && response.data.beneficiaries.length > 0) {
          setBeneficiaries(response.data.beneficiaries);
        } else {
          setBeneficiaries([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again.");
      }
    };
  
    fetchData();
  }, [API, token]);
  

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
    formData.append("beneficiaries", JSON.stringify(beneficiaries.map((beneficiary) => beneficiary.beneficiary_id)));
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
        toast.success("Data saved successfully!");
   
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("An error occurred.");
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

  const getBeneficiaryById = (id) => {
    return beneficiaryUser.find(
      (user) => String(user.beneficiary_id) === String(id)
    ) || null;
  };
const uniqueBeneficiaryIds = Array.from(
  new Set(metals.flatMap((deposit) =>deposit.beneficiaryUser ? deposit.beneficiaryUser.split(",") : []))
);
console.log(metals)
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
                icon={<span className="text-[#538d2dfd] me-2 font-extrabold text-xl">₹ </span>}
                placeholder="Weight (grams)"
                value={metal.weight}
                onChange={(e) =>
                  handleMetalChange(index, "weight", e.target.value)
                }
              />

              <InputWithIcon
                icon={<span className="text-[#538d2dfd] me-2 font-extrabold text-xl">₹ </span>}
                placeholder="Purchase Price (₹)"
                value={metal.purchasePrice}
                onChange={(e) =>
                  handleMetalChange(index, "purchasePrice", e.target.value)
                }
              />

              <InputWithIcon
                icon={<span className="text-[#538d2dfd] me-2 font-extrabold text-xl">₹ </span>}
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

   
      <Section title="Upload Document" className="mb-10">
      

          <input
         type="file"
         name="document"
         accept="application/pdf"
            onChange={handleDocumentUpload}
            
            className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0"
          />
         {document ? (
    <div className="mt-4 flex items-center space-x-4">
      <a
        href={URL.createObjectURL(document)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#538d2dfd] text-white p-2 rounded-md shadow-md hover:bg-[#4c7033fd] inline-flex items-center"
      >
        <FaEye className="mr-2" />
        View Uploaded File
      </a>
      <button
        onClick={() => setDocument(null)} // Remove the document
        className="text-red-500 hover:text-red-700 underline"
      >
        Remove File
      </button>
    </div>
  ) : (
    <p className="text-gray-500 mt-2">No document uploaded. Please upload one.</p>
  )}
      </Section>

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
