import React, { useState, useContext } from "react";
import axios from "axios";
import {
  FaUser,
  FaMoneyBillWave,
  FaBuilding,
  FaInfoCircle,
  FaPlus,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Contexts/Context";

const RetirementAccountManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [accountForm, setAccountForm] = useState({
    accountHolder: "",
    accountType: "",
    institutionName: "",
    currentBalance: "",
    contributions: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch accounts on component mount
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API}/retirement-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Error fetching retirement account data.");
    }
  };

  // Update or add a new account
  const addOrUpdateAccount = async () => {
    if (!validateAccounts()) return;

    setLoading(true);
    try {
      if (editIndex !== null) {
        // Update existing account
        const id = accounts[editIndex].id;
        await axios.put(`${API}/retirement-accounts/${id}`, accountForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Retirement account updated successfully!");
      } else {
        // Add a new account
        await axios.post(`${API}/retirement-accounts`, accountForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Retirement account added successfully!");
      }

      setAccountForm({
        accountHolder: "",
        accountType: "",
        institutionName: "",
        currentBalance: "",
        contributions: "",
        notes: "",
      });
      setEditIndex(null);
      fetchAccounts();
    } catch (error) {
      console.error("Error saving retirement account:", error);
      toast.error("An error occurred while saving the account.");
    } finally {
      setLoading(false);
    }
  };

  const validateAccounts = () => {
    const {
      accountHolder,
      accountType,
      institutionName,
      currentBalance,
      contributions,
    } = accountForm;
    if (
      !accountHolder ||
      !accountType ||
      !institutionName ||
      !currentBalance ||
      !contributions
    ) {
      toast.error("All fields except 'Notes' are required.");
      return false;
    }
    if (isNaN(currentBalance) || currentBalance <= 0) {
      toast.error("Current Balance must be a positive number.");
      return false;
    }
    if (isNaN(contributions) || contributions < 0) {
      toast.error("Contributions must be a non-negative number.");
      return false;
    }
    return true;
  };

  const handleAccountChange = (field, value) => {
    setAccountForm({ ...accountForm, [field]: value });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setAccountForm(accounts[index]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/retirement-accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Retirement account deleted successfully!");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting the account.");
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

      {/* Account Form Section */}
      <FieldSection
        title={
          editIndex !== null
            ? "Edit Retirement Account"
            : "New Retirement Account"
        }
      >
        <InputWithIcon
          icon={<FaUser className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Account Holder Name"
          value={accountForm.accountHolder}
          onChange={(e) => handleAccountChange("accountHolder", e.target.value)}
        />
        <InputWithIcon
          icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Account Type (e.g., 401k, IRA)"
          value={accountForm.accountType}
          onChange={(e) => handleAccountChange("accountType", e.target.value)}
        />
        <InputWithIcon
          icon={<FaBuilding className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Institution Name"
          value={accountForm.institutionName}
          onChange={(e) =>
            handleAccountChange("institutionName", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="number"
          placeholder="Current Balance"
          value={accountForm.currentBalance}
          onChange={(e) =>
            handleAccountChange("currentBalance", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="number"
          placeholder="Total Contributions"
          value={accountForm.contributions}
          onChange={(e) => handleAccountChange("contributions", e.target.value)}
        />
        <InputWithIcon
          icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Additional Notes"
          value={accountForm.notes}
          onChange={(e) => handleAccountChange("notes", e.target.value)}
        />
        <button
          onClick={addOrUpdateAccount}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaCheckCircle className="inline mr-2" />
          {editIndex !== null ? "Update Account" : "Add Account"}
        </button>
      </FieldSection>

      {/* Accounts Table Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Retirement Accounts
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">
                  Account Holder
                </th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">
                  Institution
                </th>
                <th className="border border-gray-300 px-4 py-2">Balance</th>
                <th className="border border-gray-300 px-4 py-2">
                  Contributions
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, idx) => (
                <tr key={account.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {account.accountHolder}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.accountType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.institutionName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.currentBalance}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.contributions}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-red-500 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default RetirementAccountManagement;
