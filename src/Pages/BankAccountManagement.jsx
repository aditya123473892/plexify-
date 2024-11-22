import React, { useState } from 'react';
import { FaUser, FaMoneyBillWave, FaBuilding, FaInfoCircle, FaPlus, FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';
import { toast, ToastContainer } from "react-toastify"; // Importing toast components
import "react-toastify/dist/ReactToastify.css"; // Importing toast styles
import axios from 'axios'; // Import Axios for API requests
import { useContext } from "react";
import { AuthContext } from "../Contexts/Context"; // Your context for global state like API and token

const BankAccountManagement = () => {
  const [accounts, setAccounts] = useState([
    { accountHolder: '', accountNumber: '', bankName: '', accountType: '', balance: '', notes: '' },
  ]);
  
  // Extract API and token from context
  const { API, token } = useContext(AuthContext);

  const handleAccountChange = (index, field, value) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
  };

  const addAccount = () => {
    setAccounts([...accounts, { accountHolder: '', accountNumber: '', bankName: '', accountType: '', balance: '', notes: '' }]);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${API}/bank-accounts`, // API endpoint
        { accounts }, // Data you are sending in the request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization token from context
            'Content-Type': 'application/json', // Content-Type header
          }
        }
      );

      if (response.status === 200) {
        toast.success("Bank account details saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data", error);
      toast.error("There was an error saving your bank account details. Please try again.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your Bank Accounts</h1>
        <p className="text-gray-600">
          Keep track of your bank accounts and monitor your balances.
        </p>
      </header>

      {/* Bank Account Section */}
      {accounts.map((account, index) => (
        <FieldSection title={`Bank Account ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Holder Name"
            value={account.accountHolder}
            onChange={(e) => handleAccountChange(index, 'accountHolder', e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Number"
            value={account.accountNumber}
            onChange={(e) => handleAccountChange(index, 'accountNumber', e.target.value)}
          />
          <InputWithIcon
            icon={<FaBuilding className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Bank Name"
            value={account.bankName}
            onChange={(e) => handleAccountChange(index, 'bankName', e.target.value)}
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Type (e.g., Savings, Checking)"
            value={account.accountType}
            onChange={(e) => handleAccountChange(index, 'accountType', e.target.value)}
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Balance"
            value={account.balance}
            onChange={(e) => handleAccountChange(index, 'balance', e.target.value)}
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Additional Notes"
            value={account.notes}
            onChange={(e) => handleAccountChange(index, 'notes', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addAccount}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Bank Account
      </button>

      {/* Educational Resources */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">Explore our educational resources on bank account management.</p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaMoneyBillWave className="inline mr-2" /> Learn More
        </button>
      </Section>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Bank Account Details
      </button>

      {/* ToastContainer - required to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default BankAccountManagement;
