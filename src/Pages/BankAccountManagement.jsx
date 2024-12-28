import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import {
  FaUser,
  FaMoneyBillWave,
  FaBuilding,
  FaInfoCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BankAccountManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API}/bank-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch bank accounts.");
    }
  };

  const addAccount = () =>
    setAccounts([
      ...accounts,
      {
        id: "",
        account_holder: "",
        account_number: "",
        bank_name: "",
        account_type: "",
        balance: "",
        notes: "",
      },
    ]);

  const handleChange = (index, field, value) => {
    const updated = [...accounts];
    updated[index][field] = value;
    setAccounts(updated);
  };

  const validateForm = () =>
    accounts.every((account) =>
      [
        "account_holder",
        "account_number",
        "bank_name",
        "account_type",
        "balance",
      ].every((key) => account[key])
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API}/bank-accounts`,
        { accounts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bank accounts saved successfully!");
      fetchAccounts();
    } catch (error) {
      console.error("Error saving accounts:", error);
      toast.error("Failed to save bank accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const accountId = accounts[index]?.id;
    if (!accountId) {
      setAccounts((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await axios.delete(`${API}/bank-accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bank account deleted successfully!");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete the bank account.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Bank Accounts</h1>
        <p className="mt-2">Add, edit, and manage your bank accounts.</p>
      </header>

      <form onSubmit={handleSubmit}>
        {accounts.map((account, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <FieldSection title={`Bank Account #${index + 1}`}>
              <InputWithIcon
                icon={<FaUser />}
                type="text"
                placeholder="Account Holder"
                value={account.account_holder}
                onChange={(e) =>
                  handleChange(index, "account_holder", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="text"
                placeholder="Account Number"
                value={account.account_number}
                onChange={(e) =>
                  handleChange(index, "account_number", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaBuilding />}
                type="text"
                placeholder="Bank Name"
                value={account.bank_name}
                onChange={(e) =>
                  handleChange(index, "bank_name", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaInfoCircle />}
                type="text"
                placeholder="Account Type (e.g., Savings, Checking)"
                value={account.account_type}
                onChange={(e) =>
                  handleChange(index, "account_type", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="number"
                placeholder="Balance"
                value={account.balance}
                onChange={(e) => handleChange(index, "balance", e.target.value)}
              />
              <InputWithIcon
                icon={<FaInfoCircle />}
                type="text"
                placeholder="Notes (optional)"
                value={account.notes}
                onChange={(e) => handleChange(index, "notes", e.target.value)}
              />
            </FieldSection>
            <div className="flex justify-end mt-2 space-x-4">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={addAccount}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New Account
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Accounts"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankAccountManagement;
