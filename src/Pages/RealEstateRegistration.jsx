import React, { useState } from 'react';
import { FaPlus, FaCheckCircle, FaTrash } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const RealEstateRegistration = () => {
  const [properties, setProperties] = useState([{ type: '', address: '', date: '', owner: '' }]);

  const handlePropertyChange = (index, field, value) => {
    const newProperties = [...properties];
    newProperties[index][field] = value;
    setProperties(newProperties);
  };

  const addProperty = () => {
    setProperties([...properties, { type: '', address: '', date: '', owner: '' }]);
  };

  const removeProperty = (index) => {
    const newProperties = properties.filter((_, i) => i !== index);
    setProperties(newProperties);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Real Estate Registration</h1>
        <p className="text-gray-600">
          Register your properties and manage their details efficiently.
        </p>
      </header>

      {/* Properties Section */}
        {properties.map((property, index) => (
            <FieldSection title="Property Registration">
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Property Type"
              value={property.type}
              onChange={(e) => handlePropertyChange(index, 'type', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Address"
              value={property.address}
              onChange={(e) => handlePropertyChange(index, 'address', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="date"
              placeholder="Registration Date"
              value={property.date}
              onChange={(e) => handlePropertyChange(index, 'date', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Owner's Name"
              value={property.owner}
              onChange={(e) => handlePropertyChange(index, 'owner', e.target.value)}
            />
            <button
              onClick={() => removeProperty(index)}
              className="text-red-600 mt-2"
            >
              Remove Property
            </button>
          </FieldSection>
        ))}
        <button
          onClick={addProperty}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Property
        </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Registration Details
      </button>
    </div>
  );
};

export default RealEstateRegistration;
