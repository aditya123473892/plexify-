import React, { useState } from 'react';
import { FaPlus, FaCheckCircle, FaTrash } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const InvestmentTransmission = () => {
  const [transmissions, setTransmissions] = useState([{ type: '', accountNumber: '', date: '', beneficiary: '' }]);

  const handleTransmissionChange = (index, field, value) => {
    const newTransmissions = [...transmissions];
    newTransmissions[index][field] = value;
    setTransmissions(newTransmissions);
  };

  const addTransmission = () => {
    setTransmissions([...transmissions, { type: '', accountNumber: '', date: '', beneficiary: '' }]);
  };

  const removeTransmission = (index) => {
    const newTransmissions = transmissions.filter((_, i) => i !== index);
    setTransmissions(newTransmissions);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Investment Transmission</h1>
        <p className="text-gray-600">
          Keep track of your investments that need to be transmitted to beneficiaries.
        </p>
      </header>

      {/* Transmission Section */}
        {transmissions.map((transmission, index) => (
          <FieldSection title="Investments to Transmit">
          <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Investment Type"
              value={transmission.type}
              onChange={(e) => handleTransmissionChange(index, 'type', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Account Number"
              value={transmission.accountNumber}
              onChange={(e) => handleTransmissionChange(index, 'accountNumber', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="date"
              placeholder="Transmission Date"
              value={transmission.date}
              onChange={(e) => handleTransmissionChange(index, 'date', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Beneficiary Details"
              value={transmission.beneficiary}
              onChange={(e) => handleTransmissionChange(index, 'beneficiary', e.target.value)}
            />
            <button
              onClick={() => removeTransmission(index)}
              className="text-red-600 mt-2"
            >
              Remove Investment
            </button>
          </FieldSection>
        ))}
        <button
          onClick={addTransmission}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Investment to Transmit
        </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Transmission Details
      </button>
    </div>
  );
};

export default InvestmentTransmission;
