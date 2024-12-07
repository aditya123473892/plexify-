import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaStickyNote,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvestmentManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [investments, setInvestments] = useState([]);
  const [formData, setFormData] = useState({
    investment_type: "",
    amount_invested: "",
    current_value: "",
    notes: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch investments on component mount
  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get(`${API}/other-investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvestments(response.data.investments);
      toast.success("Investments fetched successfully!");
    } catch (error) {
      console.error("Error fetching investments:", error);
      toast.error("Failed to fetch investments.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addOrUpdateInvestment = async () => {
    if (
      !formData.investment_type ||
      !formData.amount_invested ||
      !formData.current_value
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      if (editIndex !== null) {
        // Update existing investment
        const id = investments[editIndex].investment_id;
        await axios.put(
          `${API}/other-investments/${id}`,
          {
            investment_type: formData.investment_type,
            amount_invested: parseFloat(formData.amount_invested),
            current_value: parseFloat(formData.current_value),
            notes: formData.notes,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Investment updated successfully!");
      } else {
        // Add new investment
        await axios.post(
          `${API}/other-investments`,
          {
            investment_type: formData.investment_type,
            amount_invested: parseFloat(formData.amount_invested),
            current_value: parseFloat(formData.current_value),
            notes: formData.notes,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Investment added successfully!");
      }

      setFormData({
        investment_type: "",
        amount_invested: "",
        current_value: "",
        notes: "",
      });
      setEditIndex(null);
      fetchInvestments();
    } catch (error) {
      console.error("Error saving investment:", error);
      toast.error("An error occurred while saving the investment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(investments[index]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/other-investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Investment deleted successfully!");
      fetchInvestments();
    } catch (error) {
      console.error("Error deleting investment:", error);
      toast.error("Failed to delete investment.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Other Investments</h1>
        <p className="mt-2">Add, view, and manage your investments.</p>
      </header>

      {/* Investment Form */}
      <Section
        title={editIndex !== null ? "Edit Investment" : "New Investment"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <FaFileAlt />,
              name: "investment_type",
              placeholder: "Investment Type",
            },
            {
              icon: <FaMoneyBillWave />,
              name: "amount_invested",
              placeholder: "Amount Invested",
              type: "number",
            },
            {
              icon: <FaMoneyBillWave />,
              name: "current_value",
              placeholder: "Current Value",
              type: "number",
            },
            {
              icon: <FaStickyNote />,
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
          onClick={addOrUpdateInvestment}
          className="mt-4 bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Saving..." : editIndex !== null ? "Update" : "Add"}
        </button>
      </Section>

      {/* Investments Table */}
      <Section title="Investments List">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
              <th className="border border-gray-300 px-4 py-2">Notes</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment, index) => (
              <tr key={investment.investment_id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {investment.investment_type}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {investment.amount_invested}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {investment.current_value}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {investment.notes || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(investment.investment_id)}
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

export default InvestmentManagement;
