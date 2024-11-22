import React, { useState,useContext } from "react";
import axios from "axios";
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
import { toast, ToastContainer } from "react-toastify"; 
import { AuthContext } from "../Contexts/Context";
const RetirementAccountManagement = () => {
  const { API, token, beneficiaryUser } = useContext(AuthContext);
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const validateAccounts = () => {
    for (const account of accounts) {
      if (
        !account.accountHolder ||
        !account.accountType ||
        !account.institutionName ||
        !account.currentBalance ||
        !account.contributions
      ) {
        setMessage("Account Holder, Type, Institution, Balance, and Contributions are required.");
        return false;
      }
      if (isNaN(account.currentBalance) || account.currentBalance <= 0) {
        setMessage("Current Balance must be a positive number.");
        return false;
      }
      if (isNaN(account.contributions) || account.contributions < 0) {
        setMessage("Contributions must be a non-negative number.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAccounts()) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${API}/retirement-accounts`, // API endpoint for retirement accounts
        { accounts },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (response.status === 200) {
        setMessage("Retirement account details saved successfully!");
        setAccounts([
          {
            accountHolder: "",
            accountType: "",
            institutionName: "",
            currentBalance: "",
            contributions: "",
            notes: "",
          },
        ]); // Reset the form
        toast.success("Retirement account details saved successfully!"); // Success toast
      }
    } catch (error) {
      console.error("Error saving retirement account details:", error);
      setMessage("An error occurred while saving retirement account details.");
      toast.error("An error occurred while saving retirement account details."); // Error toast
    } finally {
      setLoading(false);
    }
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
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className={`bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span>Saving...</span>
        ) : (
          <>
            <FaCheckCircle className="mr-2" /> Save Retirement Account Details
          </>
        )}
      </button>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default RetirementAccountManagement;
