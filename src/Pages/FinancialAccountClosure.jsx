import React, { useState } from 'react';
import { FaTrash, FaPlus, FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const FinancialAccountClosure = () => {
  const [accounts, setAccounts] = useState([{ type: '', number: '', closureDate: '', notes: '' }]);

  const handleAccountChange = (index, field, value) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
  };

  const addAccount = () => {
    setAccounts([...accounts, { type: '', number: '', closureDate: '', notes: '' }]);
  };

  const removeAccount = (index) => {
    const newAccounts = accounts.filter((_, i) => i !== index);
    setAccounts(newAccounts);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Financial Account Closure</h1>
        <p className="text-gray-600">
          Keep track of your financial accounts that need to be closed.
        </p>
      </header>

      {/* Accounts Section */}
        {accounts.map((account, index) => (
          <FieldSection title="Accounts to Close">
          <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Account Type"
              value={account.type}
              onChange={(e) => handleAccountChange(index, 'type', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Account Number"
              value={account.number}
              onChange={(e) => handleAccountChange(index, 'number', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="date"
              placeholder="Closure Date"
              value={account.closureDate}
              onChange={(e) => handleAccountChange(index, 'closureDate', e.target.value)}
            />
            <InputWithIcon
              icon={<FaTrash className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Notes (if any)"
              value={account.notes}
              onChange={(e) => handleAccountChange(index, 'notes', e.target.value)}
            />
            <button
              onClick={() => removeAccount(index)}
              className="text-red-600 mt-2"
            >
              Remove Account
            </button>
          </FieldSection>
        ))}
        <button
          onClick={addAccount}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Account to Close
        </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Account Closure Details
      </button>
    </div>
  );
};

export default FinancialAccountClosure;
