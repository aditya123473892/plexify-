import React, { useState } from 'react';
import { FaPlus, FaCheckCircle, FaTrash } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const InsurancePensionClaims = () => {
  const [claims, setClaims] = useState([{ policyNumber: '', claimantName: '', claimAmount: '', documentation: '' }]);

  const handleClaimChange = (index, field, value) => {
    const newClaims = [...claims];
    newClaims[index][field] = value;
    setClaims(newClaims);
  };

  const addClaim = () => {
    setClaims([...claims, { policyNumber: '', claimantName: '', claimAmount: '', documentation: '' }]);
  };

  const removeClaim = (index) => {
    const newClaims = claims.filter((_, i) => i !== index);
    setClaims(newClaims);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Insurance Pension Claims</h1>
        <p className="text-gray-600">
          Submit your claims for insurance pensions and manage their details.
        </p>
      </header>

      {/* Claims Section */}
        {claims.map((claim, index) => (
          <FieldSection title="Pension Claims">
          <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Policy Number"
              value={claim.policyNumber}
              onChange={(e) => handleClaimChange(index, 'policyNumber', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Claimant Name"
              value={claim.claimantName}
              onChange={(e) => handleClaimChange(index, 'claimantName', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="number"
              placeholder="Claim Amount"
              value={claim.claimAmount}
              onChange={(e) => handleClaimChange(index, 'claimAmount', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Supporting Documentation"
              value={claim.documentation}
              onChange={(e) => handleClaimChange(index, 'documentation', e.target.value)}
            />
            <button
              onClick={() => removeClaim(index)}
              className="text-red-600 mt-2"
            >
              Remove Claim
            </button>
        </FieldSection>
        ))}
        <button
          onClick={addClaim}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Claim
        </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Submit Claims
      </button>
    </div>
  );
};

export default InsurancePensionClaims;
