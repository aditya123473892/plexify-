import React, { useState, useContext } from "react";
import {
  FaSeedling,
  FaMoneyBillWave,
  FaInfoCircle,
  FaPlus,
  FaCheckCircle,
  FaCalendarAlt,
  FaBuilding,
  FaWeightHanging,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import { toast, ToastContainer } from "react-toastify";

const CommodityManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [commodities, setCommodities] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [commodityForm, setCommodityForm] = useState({
    commodityName: "",
    commodityType: "",
    unitOfMeasure: "",
    marketPrice: "",
    stockQuantity: "",
    provider: "",
    acquisitionDate: "",
    expiryDate: "",
    description: "",
    status: "Available",
  });

  const fetchCommodities = async () => {
    try {
      const response = await axios.get(`${API}/commodities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommodities(response.data.commodities);
    } catch (error) {
      console.error("Error fetching commodities:", error);
      toast.error("Error fetching commodity data.");
    }
  };

  const handleCommodityChange = (field, value) => {
    setCommodityForm({ ...commodityForm, [field]: value });
  };

  const addOrUpdateCommodity = async () => {
    try {
      if (editIndex !== null) {
        // Update commodity
        const id = commodities[editIndex].id;
        await axios.put(`${API}/commodities/${id}`, commodityForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Commodity updated successfully!");
      } else {
        // Add new commodity
        await axios.post(`${API}/commodities`, commodityForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Commodity added successfully!");
      }
      setCommodityForm({
        commodityName: "",
        commodityType: "",
        unitOfMeasure: "",
        marketPrice: "",
        stockQuantity: "",
        provider: "",
        acquisitionDate: "",
        expiryDate: "",
        description: "",
        status: "Available",
      });
      setEditIndex(null);
      fetchCommodities();
    } catch (error) {
      console.error("Error saving commodity:", error);
      toast.error("An error occurred while saving the commodity.");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setCommodityForm(commodities[index]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/commodities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Commodity deleted successfully!");
      fetchCommodities();
    } catch (error) {
      console.error("Error deleting commodity:", error);
      toast.error("An error occurred while deleting the commodity.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Your Commodities
        </h1>
      </header>

      <FieldSection
        title={editIndex !== null ? "Edit Commodity" : "New Commodity"}
      >
        <InputWithIcon
          icon={<FaSeedling className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Commodity Name"
          value={commodityForm.commodityName}
          onChange={(e) =>
            handleCommodityChange("commodityName", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaSeedling className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Commodity Type"
          value={commodityForm.commodityType}
          onChange={(e) =>
            handleCommodityChange("commodityType", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaWeightHanging className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Unit of Measure (e.g., kg, barrel)"
          value={commodityForm.unitOfMeasure}
          onChange={(e) =>
            handleCommodityChange("unitOfMeasure", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="number"
          placeholder="Market Price"
          value={commodityForm.marketPrice}
          onChange={(e) => handleCommodityChange("marketPrice", e.target.value)}
        />
        <InputWithIcon
          icon={<FaMoneyBillWave className="text-[#538d2dfd] mx-2" />}
          type="number"
          placeholder="Stock Quantity"
          value={commodityForm.stockQuantity}
          onChange={(e) =>
            handleCommodityChange("stockQuantity", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaBuilding className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Provider"
          value={commodityForm.provider}
          onChange={(e) => handleCommodityChange("provider", e.target.value)}
        />
        <InputWithIcon
          icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
          type="date"
          placeholder="Acquisition Date"
          value={commodityForm.acquisitionDate}
          onChange={(e) =>
            handleCommodityChange("acquisitionDate", e.target.value)
          }
        />
        <InputWithIcon
          icon={<FaCalendarAlt className="text-[#538d2dfd] mx-2" />}
          type="date"
          placeholder="Expiry Date"
          value={commodityForm.expiryDate}
          onChange={(e) => handleCommodityChange("expiryDate", e.target.value)}
        />
        <InputWithIcon
          icon={<FaInfoCircle className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Description"
          value={commodityForm.description}
          onChange={(e) => handleCommodityChange("description", e.target.value)}
        />
        <InputWithIcon
          icon={<FaCheckCircle className="text-[#538d2dfd] mx-2" />}
          type="text"
          placeholder="Status (e.g., Available, Out of Stock)"
          value={commodityForm.status}
          onChange={(e) => handleCommodityChange("status", e.target.value)}
        />
        <button
          onClick={addOrUpdateCommodity}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaCheckCircle className="inline mr-2" />
          {editIndex !== null ? "Update Commodity" : "Add Commodity"}
        </button>
      </FieldSection>

      {/* Commodities Table */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Commodities</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commodities.map((commodity, idx) => (
                <tr key={commodity.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {commodity.commodityName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commodity.commodityType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commodity.marketPrice}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commodity.stockQuantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(commodity.id)}
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

export default CommodityManagement;
