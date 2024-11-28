import React, { useState, useContext } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { AuthContext } from "../Contexts/Context";

const BankAccountManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [accountForm, setAccountForm] = useState({
    accountHolder: "",
    accountNumber: "",
    bankName: "",
    accountType: "",
    balance: "",
    notes: "",
  });

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API}/bank-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Error fetching bank accounts data.");
    }
  };

  const handleAccountChange = (field, value) => {
    setAccountForm({ ...accountForm, [field]: value });
  };

  const saveAccount = async () => {
    try {
      if (editIndex !== null) {
        // Update existing account
        const id = accounts[editIndex].id;
        await axios.put(`${API}/bank-accounts/${id}`, accountForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Bank account updated successfully!");
      } else {
        // Add new account
        await axios.post(`${API}/bank-accounts`, accountForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Bank account added successfully!");
      }
      setAccountForm({
        accountHolder: "",
        accountNumber: "",
        bankName: "",
        accountType: "",
        balance: "",
        notes: "",
      });
      setEditIndex(null);
      fetchAccounts();
    } catch (error) {
      console.error("Error saving account:", error);
      toast.error("An error occurred while saving the bank account.");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setAccountForm(accounts[index]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/bank-accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bank account deleted successfully!");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting the bank account.");
    }
  };

  const resetForm = () => {
    setAccountForm({
      accountHolder: "",
      accountNumber: "",
      bankName: "",
      accountType: "",
      balance: "",
      notes: "",
    });
    setEditIndex(null);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Bank Accounts
        </h1>
        <p className="text-gray-600">
          Keep track of your bank accounts and monitor your balances.
        </p>
      </header>

      {/* Form Section */}
      <FieldSection
        title={editIndex !== null ? "Edit Bank Account" : "New Bank Account"}
      >
        <InputWithIcon
          icon={<FaUser className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Account Holder Name"
          value={accountForm.accountHolder}
          onChange={(e) => handleAccountChange("accountHolder", e.target.value)}
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Account Number"
          value={accountForm.accountNumber}
          onChange={(e) => handleAccountChange("accountNumber", e.target.value)}
        />
        <InputWithIcon
          icon={<FaBuilding className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Bank Name"
          value={accountForm.bankName}
          onChange={(e) => handleAccountChange("bankName", e.target.value)}
        />
        <InputWithIcon
          icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Account Type (e.g., Savings, Checking)"
          value={accountForm.accountType}
          onChange={(e) => handleAccountChange("accountType", e.target.value)}
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="number"
          placeholder="Balance"
          value={accountForm.balance}
          onChange={(e) => handleAccountChange("balance", e.target.value)}
        />
        <InputWithIcon
          icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Additional Notes"
          value={accountForm.notes}
          onChange={(e) => handleAccountChange("notes", e.target.value)}
        />
        <button
          onClick={saveAccount}
          className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 mt-4"
        >
          <FaCheckCircle className="inline mr-2" />
          {editIndex !== null ? "Update Account" : "Add Account"}
        </button>
        {editIndex !== null && (
          <button
            onClick={resetForm}
            className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 mt-4"
          >
            Cancel Edit
          </button>
        )}
      </FieldSection>

      {/* Accounts Table */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bank Accounts</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Holder</th>
                <th className="border border-gray-300 px-4 py-2">Number</th>
                <th className="border border-gray-300 px-4 py-2">Bank</th>
                <th className="border border-gray-300 px-4 py-2">Balance</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={account.id || index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {account.accountHolder}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.accountNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.bankName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.balance}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(index)}
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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default BankAccountManagement;
