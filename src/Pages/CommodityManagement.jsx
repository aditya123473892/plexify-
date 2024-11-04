import React, { useState } from 'react';
import { FaSeedling, FaMoneyBillWave, FaInfoCircle, FaBuilding, FaPlus, FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const CommodityManagement = () => {
  const [commodities, setCommodities] = useState([
    { commodityType: '', quantity: '', purchasePrice: '', currentValue: '', notes: '' },
  ]);

  const handleCommodityChange = (index, field, value) => {
    const newCommodities = [...commodities];
    newCommodities[index][field] = value;
    setCommodities(newCommodities);
  };

  const addCommodity = () => {
    setCommodities([...commodities, { commodityType: '', quantity: '', purchasePrice: '', currentValue: '', notes: '' }]);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Commodities</h1>
        <p className="text-gray-600">
          Keep track of your commodity investments and monitor their performance.
        </p>
      </header>

      {/* Commodity Section */}
      {commodities.map((commodity, index) => (
        <FieldSection title={`Commodity ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaSeedling className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Commodity Type (e.g., Gold, Silver)"
            value={commodity.commodityType}
            onChange={(e) => handleCommodityChange(index, 'commodityType', e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Quantity"
            value={commodity.quantity}
            onChange={(e) => handleCommodityChange(index, 'quantity', e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Purchase Price"
            value={commodity.purchasePrice}
            onChange={(e) => handleCommodityChange(index, 'purchasePrice', e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Value"
            value={commodity.currentValue}
            onChange={(e) => handleCommodityChange(index, 'currentValue', e.target.value)}
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Additional Notes"
            value={commodity.notes}
            onChange={(e) => handleCommodityChange(index, 'notes', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addCommodity}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Commodity
      </button>

      {/* Educational Resources */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">Explore our educational resources on commodity investments.</p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaMoneyBillWave className="inline mr-2" /> Learn More
        </button>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Commodity Details
      </button>
    </div>
  );
};

export default CommodityManagement;
