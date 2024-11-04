import React, { useState } from 'react';
import { FaPlus, FaCheckCircle, FaTrash } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const MiscellaneousAssetTransfer = () => {
  const [transfers, setTransfers] = useState([{ type: '', description: '', date: '', beneficiary: '' }]);

  const handleTransferChange = (index, field, value) => {
    const newTransfers = [...transfers];
    newTransfers[index][field] = value;
    setTransfers(newTransfers);
  };

  const addTransfer = () => {
    setTransfers([...transfers, { type: '', description: '', date: '', beneficiary: '' }]);
  };

  const removeTransfer = (index) => {
    const newTransfers = transfers.filter((_, i) => i !== index);
    setTransfers(newTransfers);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Miscellaneous Asset Transfers</h1>
        <p className="text-gray-600">
          Track and manage the transfer of various miscellaneous assets.
        </p>
      </header>

      {/* Transfers Section */}
        {transfers.map((transfer, index) => (
      <FieldSection title="Assets to Transfer">
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Asset Type"
              value={transfer.type}
              onChange={(e) => handleTransferChange(index, 'type', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Description"
              value={transfer.description}
              onChange={(e) => handleTransferChange(index, 'description', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="date"
              placeholder="Transfer Date"
              value={transfer.date}
              onChange={(e) => handleTransferChange(index, 'date', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Beneficiary Details"
              value={transfer.beneficiary}
              onChange={(e) => handleTransferChange(index, 'beneficiary', e.target.value)}
            />
            <button
              onClick={() => removeTransfer(index)}
              className="text-red-600 mt-2"
            >
              Remove Asset
            </button>
        </FieldSection>
        ))}
        <button
          onClick={addTransfer}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Asset to Transfer
        </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Transfer Details
      </button>
    </div>
  );
};

export default MiscellaneousAssetTransfer;
