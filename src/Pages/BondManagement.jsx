import React, { useState } from 'react';
import {
  FaFileAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaChartLine,
  FaPercent,
  FaPlus,
  FaFileUpload,
  FaBook,
  FaCheckCircle,
  FaUser,
} from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const BondManagement = () => {
  const [bonds, setBonds] = useState([
    { issuer: '', type: '', maturityDate: '', faceValue: '', interestRate: '', marketValue: '' },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([
    { name: '', contact: '', email: '', entitlement: '', relationship: '', notify: false },
  ]);
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);

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

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Bonds</h1>
        <p className="text-gray-600">
          Track and manage bond investments efficiently.
        </p>
      </header>

      {/* Bond Section */}
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

      {/* Toggle Beneficiary Section */}
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

      {/* Beneficiary Information */}
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
              <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg">
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={beneficiary.notify}
                  onChange={(e) => handleBeneficiaryChange(index, 'notify', e.target.checked)}
                />
                <label className="text-gray-800">Notify Beneficiary</label>
              </div>
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

      {/* Document Upload */}
      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <input type="file" className="border-0 rounded-md p-3 w-full bg-transparent" />
        </div>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          Upload Document
        </button>
      </Section>

      {/* Educational Resources */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">Learn more about bond investments.</p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaBook className="inline mr-2" /> Learn More
        </button>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Bond Details
      </button>
    </div>
  );
};

export default BondManagement;
