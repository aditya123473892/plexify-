import React, { useState } from 'react';
import { FaPlus, FaCheckCircle, FaTrash } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const DigitalIdentityManagement = () => {
  const [identities, setIdentities] = useState([{ accountName: '', username: '', password: '', notes: '' }]);

  const handleIdentityChange = (index, field, value) => {
    const newIdentities = [...identities];
    newIdentities[index][field] = value;
    setIdentities(newIdentities);
  };

  const addIdentity = () => {
    setIdentities([...identities, { accountName: '', username: '', password: '', notes: '' }]);
  };

  const removeIdentity = (index) => {
    const newIdentities = identities.filter((_, i) => i !== index);
    setIdentities(newIdentities);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Digital Identity Management</h1>
        <p className="text-gray-600">
          Manage your digital identities securely and efficiently.
        </p>
      </header>

      {/* Identities Section */}
        {identities.map((identity, index) => (
          <FieldSection title="Identity Details">
          <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Account Name"
              value={identity.accountName}
              onChange={(e) => handleIdentityChange(index, 'accountName', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Username"
              value={identity.username}
              onChange={(e) => handleIdentityChange(index, 'username', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="password"
              placeholder="Password"
              value={identity.password}
              onChange={(e) => handleIdentityChange(index, 'password', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Notes"
              value={identity.notes}
              onChange={(e) => handleIdentityChange(index, 'notes', e.target.value)}
            />
            <button
              onClick={() => removeIdentity(index)}
              className="text-red-600 mt-2"
            >
              Remove Identity
            </button>
          </FieldSection>
        ))}
        <button
          onClick={addIdentity}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Identity
        </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Identities
      </button>
    </div>
  );
};

export default DigitalIdentityManagement;
