import React, { useState, useContext } from 'react';
import {
  FaFileAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaChartLine,
  FaPercent,
  FaPlus,
  FaFileUpload,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
} from 'react-icons/fa';
import axios from 'axios';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BondManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [bonds, setBonds] = useState([
    { issuer: '', type: '', maturityDate: '', faceValue: '', interestRate: '', marketValue: '' },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([
    { name: '', contact: '', email: '', entitlement: '', relationship: '', notify: false },
  ]);
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);
  const [documentFile, setDocumentFile] = useState(null); // State to hold the uploaded file

  const handleBondChange = (index, field, value) => {
    const newBonds = [...bonds];
    newBonds[index][field] = value;
    setBonds(newBonds);
  };

  const addBond = () => {
    setBonds([...bonds, { issuer: '', type: '', maturityDate: '', faceValue: '', interestRate: '', marketValue: '' }]);
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index][field] = value;
    setBeneficiaries(newBeneficiaries);
  };

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { name: '', contact: '', email: '', entitlement: '', relationship: '', notify: false }]);
  };

  const handleFileChange = (event) => {
    setDocumentFile(event.target.files[0]); // Capture the selected file
  };

  const validateForm = () => {
    for (const bond of bonds) {
      if (!bond.issuer || !bond.type || !bond.maturityDate || !bond.faceValue || !bond.interestRate || !bond.marketValue) {
        toast.error('Please fill all bond details fields.');
        return false;
      }
    }
    for (const beneficiary of beneficiaries) {
      if (!beneficiary.name || !beneficiary.entitlement || !beneficiary.email || !beneficiary.relationship) {
        toast.error('Please fill all beneficiary details fields.');
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData(); // Use FormData to handle file upload
    formData.append('document', documentFile); // Attach the file
    formData.append('bonds', JSON.stringify(bonds)); // Attach bond data as a JSON string
    formData.append('beneficiaries', JSON.stringify(beneficiaries)); // Attach beneficiary data as a JSON string

    try {
      const response = await axios.post(`${API}/bonds`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Ensure multipart form data
        },
      });
      toast.success('Bond details saved successfully!');
    } catch (error) {
      console.error('Error saving bond details:', error);
      toast.error('Error saving bond details. Please try again later.');
    }
  };

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
            value={bond.type}
            onChange={(e) => handleBondChange(index, 'type', e.target.value)}
          />
          <InputWithIcon
            icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
            type="date"
            placeholder="Maturity Date"
            value={bond.maturityDate}
            onChange={(e) => handleBondChange(index, 'maturityDate', e.target.value)}
          />
          <InputWithIcon
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
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
            icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Market Value"
            value={bond.marketValue}
            onChange={(e) => handleBondChange(index, 'marketValue', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addBond}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add Bond
      </button>

      <div className="mt-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-[#538d2dfd]"
            checked={showBeneficiaries}
            onChange={(e) => setShowBeneficiaries(e.target.checked)}
          />
          <span className="ml-2 text-gray-700">Add Beneficiaries</span>
        </label>
      </div>

      {showBeneficiaries && (
        <div className="mt-4">
          {beneficiaries.map((beneficiary, index) => (
            <FieldSection key={`beneficiary-${index}`} title={`Beneficiary ${index + 1}`}>
              <InputWithIcon
                icon={<FaUser className="text-[#538d2dfd] mx-2" />}
                type="text"
                placeholder="Beneficiary Name"
                value={beneficiary.name}
                onChange={(e) => handleBeneficiaryChange(index, 'name', e.target.value)}
              />
              <InputWithIcon
                icon={<FaDollarSign className="text-[#538d2dfd] mx-2" />}
                type="number"
                placeholder="Entitlement Percentage"
                value={beneficiary.entitlement}
                onChange={(e) => handleBeneficiaryChange(index, 'entitlement', e.target.value)}
              />
              <InputWithIcon
                icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
                type="email"
                placeholder="Email"
                value={beneficiary.email}
                onChange={(e) => handleBeneficiaryChange(index, "email", e.target.value)}
              />
              <InputWithIcon
                icon={<FaUser className="text-[#538d2dfd] mx-2" />}
                type="text"
                placeholder="Relationship"
                value={beneficiary.relationship} 
                onChange={(e) => handleBeneficiaryChange(index, "relationship", e.target.value)}
              />
            </FieldSection>
          ))}

          <button
            onClick={addBeneficiary}
            className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
          >
            <FaPlus className="inline mr-2" /> Add Beneficiary
          </button>
        </div>
      )}

      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] py-2">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <label className="text-[#538d2dfd] cursor-pointer">
            <input type="file" onChange={handleFileChange} />
          </label>
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
