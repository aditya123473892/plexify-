import React, { useState } from 'react';
import { FaBriefcase, FaMoneyBillWave, FaInfoCircle, FaPlus, FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const OtherInvestments = () => {
  const [investments, setInvestments] = useState([
    { investmentType: '', amountInvested: '', currentValue: '', notes: '' },
  ]);

  const handleInvestmentChange = (index, field, value) => {
    const newInvestments = [...investments];
    newInvestments[index][field] = value;
    setInvestments(newInvestments);
  };

  const addInvestment = () => {
    setInvestments([...investments, { investmentType: '', amountInvested: '', currentValue: '', notes: '' }]);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Other Investments</h1>
        <p className="text-gray-600">
          Keep track of your miscellaneous investments and monitor their performance.
        </p>
      </header>

      {/* Investment Section */}
      {investments.map((investment, index) => (
        <FieldSection title={`Investment ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaBriefcase className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Investment Type (e.g., Art, Real Estate)"
            value={investment.investmentType}
            onChange={(e) => handleInvestmentChange(index, 'investmentType', e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Amount Invested"
            value={investment.amountInvested}
            onChange={(e) => handleInvestmentChange(index, 'amountInvested', e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Value"
            value={investment.currentValue}
            onChange={(e) => handleInvestmentChange(index, 'currentValue', e.target.value)}
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Additional Notes"
            value={investment.notes}
            onChange={(e) => handleInvestmentChange(index, 'notes', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addInvestment}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Investment
      </button>

      {/* Educational Resources */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">Explore our educational resources on managing other investments.</p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaMoneyBillWave className="inline mr-2" /> Learn More
        </button>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Other Investment Details
      </button>
    </div>
  );
};

export default OtherInvestments;
