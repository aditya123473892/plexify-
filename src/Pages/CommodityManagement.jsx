import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaSeedling,
  FaWeightHanging,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBuilding,
  FaInfoCircle,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommodityManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [commodities, setCommodities] = useState([]);
  const [formData, setFormData] = useState({
    commodity_name: "",
    commodity_type: "",
    unit_of_measure: "",
    market_price: "",
    stock_quantity: "",
    provider: "",
    acquisition_date: "",
    expiry_date: "",
    description: "",
    status: "Available",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch commodities on component mount
  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const response = await axios.get(`${API}/commodities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommodities(response.data.commodities);
    } catch (error) {
      console.error("Error fetching commodities:", error);
      toast.error("Failed to fetch commodities.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addOrUpdateCommodity = async () => {
    // Validate required fields
    if (
      !formData.commodity_name ||
      !formData.commodity_type ||
      !formData.unit_of_measure ||
      !formData.market_price ||
      !formData.stock_quantity ||
      !formData.provider ||
      !formData.acquisition_date
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      if (editIndex !== null) {
        // Update existing commodity
        const id = commodities[editIndex].id;
        await axios.put(`${API}/commodities/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Commodity updated successfully!");
      } else {
        // Add new commodity
        await axios.post(`${API}/commodities`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Commodity added successfully!");
      }

      // Reset form and refresh commodities
      setFormData({
        commodity_name: "",
        commodity_type: "",
        unit_of_measure: "",
        market_price: "",
        stock_quantity: "",
        provider: "",
        acquisition_date: "",
        expiry_date: "",
        description: "",
        status: "Available",
      });
      setEditIndex(null);
      fetchCommodities();
    } catch (error) {
      console.error("Error saving commodity:", error);
      toast.error("An error occurred while saving the commodity.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(commodities[index]);
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
      toast.error("Failed to delete commodity.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Commodities</h1>
        <p className="mt-2">Add, view, and manage your commodities.</p>
      </header>

      {/* Commodity Form */}
      <Section title={editIndex !== null ? "Edit Commodity" : "New Commodity"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* All Input fields */}
          {[
            {
              icon: <FaSeedling />,
              name: "commodity_name",
              placeholder: "Commodity Name",
            },
            {
              icon: <FaSeedling />,
              name: "commodity_type",
              placeholder: "Commodity Type",
            },
            {
              icon: <FaWeightHanging />,
              name: "unit_of_measure",
              placeholder: "Unit of Measure",
            },
            {
              icon: <FaMoneyBillWave />,
              name: "market_price",
              placeholder: "Market Price",
              type: "number",
            },
            {
              icon: <FaMoneyBillWave />,
              name: "stock_quantity",
              placeholder: "Stock Quantity",
              type: "number",
            },
            { icon: <FaBuilding />, name: "provider", placeholder: "Provider" },
            {
              icon: <FaCalendarAlt />,
              name: "acquisition_date",
              placeholder: "Acquisition Date",
              type: "date",
            },
            {
              icon: <FaCalendarAlt />,
              name: "expiry_date",
              placeholder: "Expiry Date (optional)",
              type: "date",
            },
            {
              icon: <FaInfoCircle />,
              name: "description",
              placeholder: "Description (optional)",
            },
            { icon: <FaCheckCircle />, name: "status", placeholder: "Status" },
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
          onClick={addOrUpdateCommodity}
          className="mt-4 bg-green-600 text-white py-2 px-6 rounded-md shadow hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Saving..." : editIndex !== null ? "Update" : "Add"}
        </button>
      </Section>

      {/* Commodities Table */}
      <Section title="Commodities List">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Provider</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commodities.map((commodity, index) => (
              <tr key={commodity.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {commodity.commodity_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {commodity.commodity_type}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {commodity.unit_of_measure}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {commodity.market_price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {commodity.stock_quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {commodity.provider}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(index)}
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
      </Section>
    </div>
  );
};

export default CommodityManagement;
