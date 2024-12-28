import React, { useState, useContext,useEffect } from 'react';
import {
  FaFileAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaChartLine,
  FaPercent,
  FaPlus,
  FaFileUpload,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLink,
  FaEye
} from 'react-icons/fa';
import axios from 'axios';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';

const BondManagement = () => {
  const [addedBeneficiaries, setAddedBeneficiaries] = useState([]);
  const { API, token, beneficiaryUser } = useContext(AuthContext);
  const [bonds, setBonds] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [errors, setErrors] = useState({
    stocks: [],
    beneficiaries: [],
  });
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/bonds`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        console.log('✌️response.data --->', response.data);
  
        if (response.data.bonds && response.data.bonds.length > 0) {

          const updatedBonds = response.data.bonds.map((bond) => {
            const documentBlob = bond.document
              ? new Blob([new Uint8Array(bond.document.data)], { type: "application/pdf" })
              : null;
  
            return {
              issuer: bond.issuer || "",
              bondType: bond.bond_type || "",
              maturityDate: bond.maturity_date ? bond.maturity_date.split("T")[0] : "",
              faceValue: bond.face_value || "",
              interestRate: bond.interest_rate || "",
              marketValue: bond.market_value || "",
              description: bond.description || "",
              beneficiaryUser: bond.beneficiarie_user || "",
              document: setDocument(documentBlob),
            };
          });
  
          setBonds(updatedBonds);
        } else {
          setBonds([{
            issuer: "",
            bondType: "",
            maturityDate: "",
            faceValue: "",
            interestRate: "",
            marketValue: "",
            description: "",
            beneficiaryUser: "",
            document: null,
          }]); 
        }
  
        if (response.data.beneficiaries && response.data.beneficiaries.length > 0) {
          setBeneficiaries(response.data.beneficiaries);
        } else {
          setBeneficiaries([]); // No beneficiaries found, set an empty array
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again.");
      }
    };
  
    fetchData();
  }, [API, token]);
  
  

  const handleBondChange = (index, field, value) => {
    const newBonds = [...bonds];
    newBonds[index][field] = value;
    setBonds(newBonds);
  };

  const addBond = () => {
    setBonds([...bonds, { issuer: '', bondType: '', maturityDate: '', faceValue: '', interestRate: '', marketValue: '', description: '' }]);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index][field] = value;
    setBeneficiaries(newBeneficiaries);
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setDocument(files[0]); // Update the single document
      console.log("Uploaded document:", files[0]);
    }
  };
  
  

  const validateForm = () => {
    for (const bond of bonds) {
      if (!bond.issuer || !bond.bondType || !bond.maturityDate || !bond.faceValue || !bond.interestRate || !bond.marketValue) {
        toast.error('Please fill all bond details fields.');
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    const formData = new FormData();
    formData.append('bonds', JSON.stringify(bonds));
    formData.append('beneficiaries', JSON.stringify(beneficiaries.map(b => b.beneficiary_id)));
  
    if (document) {
      formData.append('document', document); // Add the single document
    }
  
    try {
      const response = await axios.post(`${API}/bonds`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Bond details saved successfully!');
    } catch (error) {
      console.error('Error saving bond details:', error);
      toast.error('Error saving bond details. Please try again later.');
    }
  };
  
  const handleAddBeneficiary = (userIndex) => {
    if (beneficiaryUser.length > 0 && !addedBeneficiaries.includes(userIndex)) {
      const user = beneficiaryUser[userIndex];
      console.log('✌️beneficiaryUser --->', beneficiaryUser);
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
    new Set(bonds.flatMap ((deposit) => deposit.beneficiaryUser ? deposit.beneficiaryUser.split(",") : []))
  );
  console.log(beneficiaryUser,'beneficiaryUserbeneficiaryUser')

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Bonds</h1>
        <p className="text-gray-600">Track and manage bond investments efficiently.</p>
      </header>

      {bonds.map((bond, index) => (
        <FieldSection key={`bond-${index}`} title={`Bond ${index + 1}`}>
          <InputWithIcon
            icon={<FaFileAlt className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Issuer Name"
            value={bond.issuer}
            onChange={(e) => handleBondChange(index, 'issuer', e.target.value)}
          />
   <InputWithIcon
  icon={<FaChartLine className="text-[#538d2dfd] mx-2" />}
  type="select"
  placeholder="Bond Type"
  options={["Select Bond Type", "Corporate", "Government", "Municipal", "Convertible"]}
  value={bond.bondType} // Correct value
  onChange={(e) => handleBondChange(index, 'bondType', e.target.value)} // Correct field
/>

          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Maturity Date"
            value={bond.maturityDate}
            onChange={(e) => handleBondChange(index, 'maturityDate', e.target.value)}
          />
          <InputWithIcon
            icon={<FaRupeeSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Face Value"
            value={bond.faceValue}
            onChange={(e) => handleBondChange(index, 'faceValue', e.target.value)}
          />
          <InputWithIcon
            icon={<FaPercent className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Interest Rate (%)"
            value={bond.interestRate}
            onChange={(e) => handleBondChange(index, 'interestRate', e.target.value)}
          />
          <InputWithIcon
            icon={<FaRupeeSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Market Value"
            value={bond.marketValue}
            onChange={(e) => handleBondChange(index, 'marketValue', e.target.value)}
          />
          <InputWithIcon
            icon={<FaRupeeSign className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Description"
            value={bond.description}
            onChange={(e) => handleBondChange(index, 'description', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addBond}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add Bond
      </button>


   

      <Section title="Upload Document" className="mb-10">
  <input
    type="file"
    name="document"
    accept="application/pdf"
    onChange={handleFileChange}
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

  

      <div className="mt-8">
        <button
          onClick={handleSave}
          className="text-white py-3 px-6 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
        >
          <FaCheckCircle className="inline mr-2" /> Save
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default BondManagement;
