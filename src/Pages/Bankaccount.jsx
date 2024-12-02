import React, { useState, useEffect, useContext } from "react";
import {
  FaUser,
  FaMoneyBillWave,
  FaBuilding,
  FaInfoCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BankAccountManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountNumber: "",
    bankName: "",
    accountType: "",
    balance: "",
    notes: "",
  });
  const [editIndex, setEditIndex] = useState(null);
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
      toast.success("Bank accounts fetched successfully!");
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch bank accounts.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addOrUpdateAccount = async () => {
    if (
      !formData.accountHolder ||
      !formData.accountNumber ||
      !formData.bankName ||
      !formData.accountType ||
      !formData.balance
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      if (editIndex !== null) {
        // Update existing account
        const id = accounts[editIndex].id;
        await axios.put(
          `${API}/bank-accounts/${id}`,
          {
            ...formData,
            balance: parseFloat(formData.balance),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Bank account updated successfully!");
      } else {
        // Add new account
        await axios.post(
          `${API}/bank-accounts`,
          {
            ...formData,
            balance: parseFloat(formData.balance),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Bank account added successfully!");
      }

      setFormData({
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
      toast.error("An error occurred while saving the account.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(accounts[index]);
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
      toast.error("Failed to delete the bank account.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Bank Accounts</h1>
        <p className="mt-2">Add, view, and manage your bank accounts.</p>
      </header>

      {/* Bank Account Form */}
      <Section
        title={editIndex !== null ? "Edit Bank Account" : "New Bank Account"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <FaUser />,
              name: "accountHolder",
              placeholder: "Account Holder",
            },
            {
              icon: <FaMoneyBillWave />,
              name: "accountNumber",
              placeholder: "Account Number",
            },
            {
              icon: <FaBuilding />,
              name: "bankName",
              placeholder: "Bank Name",
            },
            {
              icon: <FaInfoCircle />,
              name: "accountType",
              placeholder: "Account Type (e.g., Savings, Checking)",
            },
            {
              icon: <FaMoneyBillWave />,
              name: "balance",
              placeholder: "Balance",
              type: "number",
            },
            {
              icon: <FaInfoCircle />,
              name: "notes",
              placeholder: "Notes (optional)",
            },
          ].map(({ icon, ...rest }) => (
            <InputWithIcon
              key={rest.name}
              icon={icon}
              value={formData[rest.name]}
              onChange={handleChange}
              {...rest}
            />
          ))}
        </div>

        <button
          onClick={addOrUpdateAccount}
          className="mt-4 bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Saving..." : editIndex !== null ? "Update" : "Add"}
        </button>
      </Section>

      {/* Bank Accounts Table */}
      <Section title="Bank Accounts List">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Holder</th>
              <th className="border border-gray-300 px-4 py-2">Number</th>
              <th className="border border-gray-300 px-4 py-2">Bank</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Balance</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={account.id} className="hover:bg-gray-100">
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
                  {account.accountType}
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
      </Section>
    </div>
  );
};

export default BankAccountManagement;
