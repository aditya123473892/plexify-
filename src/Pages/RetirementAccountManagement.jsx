import React, { useState } from "react";
import {
  FaUser,
  FaMoneyBillWave,
  FaBuilding,
  FaInfoCircle,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

const RetirementAccountManagement = () => {
  const [accounts, setAccounts] = useState([
    {
      accountHolder: "",
      accountType: "",
      institutionName: "",
      currentBalance: "",
      contributions: "",
      notes: "",
    },
  ]);

  const handleAccountChange = (index, field, value) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
  };

  const addAccount = () => {
    setAccounts([
      ...accounts,
      {
        accountHolder: "",
        accountType: "",
        institutionName: "",
        currentBalance: "",
        contributions: "",
        notes: "",
      },
    ]);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Retirement Accounts
        </h1>
        <p className="text-gray-600">
          Keep track of your retirement accounts and monitor your savings for
          the future.
        </p>
      </header>

      {/* Retirement Account Section */}
      {accounts.map((account, index) => (
        <FieldSection title={`Retirement Account ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Holder Name"
            value={account.accountHolder}
            onChange={(e) =>
              handleAccountChange(index, "accountHolder", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Type (e.g., 401k, IRA)"
            value={account.accountType}
            onChange={(e) =>
              handleAccountChange(index, "accountType", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaBuilding className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Institution Name"
            value={account.institutionName}
            onChange={(e) =>
              handleAccountChange(index, "institutionName", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Current Balance"
            value={account.currentBalance}
            onChange={(e) =>
              handleAccountChange(index, "currentBalance", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
            type="number"
            placeholder="Total Contributions"
            value={account.contributions}
            onChange={(e) =>
              handleAccountChange(index, "contributions", e.target.value)
            }
          />
          <InputWithIcon
            icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Additional Notes"
            value={account.notes}
            onChange={(e) =>
              handleAccountChange(index, "notes", e.target.value)
            }
          />
        </FieldSection>
      ))}

      <button
        onClick={addAccount}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
      >
        <FaPlus className="inline mr-2" /> Add Retirement Account
      </button>

      {/* Educational Resources */}
      <Section title="Educational Resources">
        <p className="text-gray-600 mb-4">
          Explore our educational resources on retirement account management.
        </p>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          <FaMoneyBillWave className="inline mr-2" /> Learn More
        </button>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Retirement Account Details
      </button>
    </div>
  );
};

export default RetirementAccountManagement;
