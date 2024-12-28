import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import {
  FaMoneyBillWave,
  FaStickyNote,
  FaEdit,
  FaTrash,
  FaFileAlt,
} from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InvestmentManagement() {
  const { API, token } = useContext(AuthContext);
  const [investments, setInvestments] = useState([]);
  const [formData, setFormData] = useState({
    investment_type: "",
    amount_invested: "",
    current_value: "",
    notes: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get(`${API}/other-investments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestments(response.data.investments || []);
      } catch (error) {
        console.error("Error fetching investments:", error);
        toast.error("Failed to fetch investments.");
      }
    };
    fetchInvestments();
  }, [API, token]);

  const addInvestment = () =>
    setInvestments([
      ...investments,
      {
        investment_type: "",
        amount_invested: "",
        current_value: "",
        notes: "",
      },
    ]);

  const handleInvestmentChange = (index, field, value) => {
    const updated = [...investments];
    updated[index][field] = value;
    setInvestments(updated);
  };

  const validateForm = () =>
    investments.every((investment) =>
      ["investment_type", "amount_invested", "current_value"].every(
        (key) => investment[key]
      )
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await axios.post(
        `${API}/other-investments`,
        { investments },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Investments submitted successfully!");
    } catch (error) {
      console.error("Error submitting investments:", error);
      toast.error("Failed to submit investments.");
    }
  };

  const handleDelete = async (index) => {
    const investmentId = investments[index]?.investment_id;
    try {
      if (investmentId) {
        await axios.delete(`${API}/other-investments/${investmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setInvestments((prev) => prev.filter((_, i) => i !== index));
      toast.success("Investment deleted successfully!");
    } catch (error) {
      console.error("Error deleting investment:", error);
      toast.error("Failed to delete investment.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Investments
        </h1>
        <p className="text-gray-600">
          Add, edit, and manage your investments easily.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        {investments.map((investment, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <FieldSection title={`Investment #${index + 1}`}>
              <InputWithIcon
                icon={<FaFileAlt />}
                type="text"
                placeholder="Investment Type"
                value={investment.investment_type}
                onChange={(e) =>
                  handleInvestmentChange(
                    index,
                    "investment_type",
                    e.target.value
                  )
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="number"
                placeholder="Amount Invested"
                value={investment.amount_invested}
                onChange={(e) =>
                  handleInvestmentChange(
                    index,
                    "amount_invested",
                    e.target.value
                  )
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="number"
                placeholder="Current Value"
                value={investment.current_value}
                onChange={(e) =>
                  handleInvestmentChange(index, "current_value", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaStickyNote />}
                type="text"
                placeholder="Notes"
                value={investment.notes}
                onChange={(e) =>
                  handleInvestmentChange(index, "notes", e.target.value)
                }
              />
            </FieldSection>
            <div className="flex justify-end mt-2 space-x-4">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={addInvestment}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New Investment
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Investments
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default InvestmentManagement;
