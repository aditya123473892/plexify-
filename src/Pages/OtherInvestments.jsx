import React, { useState, useEffect, useContext } from "react";
import {
  FaBriefcase,
  FaMoneyBillWave,
  FaInfoCircle,
  FaPlus,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { toast, ToastContainer } from "react-toastify";

const OtherInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [investmentForm, setInvestmentForm] = useState({
    investmentType: "",
    amountInvested: "",
    currentValue: "",
    notes: "",
  });
  const { API, token } = useContext(AuthContext);

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
    } catch (error) {
      console.error("Error fetching investments:", error);
      toast.error("Error fetching investment data.");
    }
  };

  const handleInvestmentChange = (field, value) => {
    setInvestmentForm({ ...investmentForm, [field]: value });
  };

  const addOrUpdateInvestment = async () => {
    try {
      if (editIndex !== null) {
        // Update investment
        const id = investments[editIndex].id;
        await axios.put(`${API}/other-investments/${id}`, investmentForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Investment updated successfully!");
      } else {
        // Add new investment
        await axios.post(`${API}/other-investments`, investmentForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Investment added successfully!");
      }
      setInvestmentForm({
        investmentType: "",
        amountInvested: "",
        currentValue: "",
        notes: "",
      });
      setEditIndex(null);
      fetchInvestments();
    } catch (error) {
      console.error("Error saving investment:", error);
      toast.error("An error occurred while saving the investment.");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setInvestmentForm(investments[index]);
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
      toast.error("An error occurred while deleting the investment.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Other Investments
        </h1>
      </header>

      <FieldSection
        title={editIndex !== null ? "Edit Investment" : "New Investment"}
      >
        <InputWithIcon
          icon={<FaBriefcase className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Investment Type"
          value={investmentForm.investmentType}
          onChange={(e) =>
            handleInvestmentChange("investmentType", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="number"
          placeholder="Amount Invested"
          value={investmentForm.amountInvested}
          onChange={(e) =>
            handleInvestmentChange("amountInvested", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="number"
          placeholder="Current Value"
          value={investmentForm.currentValue}
          onChange={(e) =>
            handleInvestmentChange("currentValue", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Notes"
          value={investmentForm.notes}
          onChange={(e) => handleInvestmentChange("notes", e.target.value)}
        />
        <button
          onClick={addOrUpdateInvestment}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaCheckCircle className="inline mr-2" />
          {editIndex !== null ? "Update Investment" : "Add Investment"}
        </button>
      </FieldSection>

      {/* Investments Table */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Investments</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Invested</th>
                <th className="border border-gray-300 px-4 py-2">Value</th>
                <th className="border border-gray-300 px-4 py-2">Notes</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, idx) => (
                <tr key={inv.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.investmentType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.amountInvested}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.currentValue}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {inv.notes}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
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

export default OtherInvestments;
