import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import {
  FaSeedling,
  FaWeightHanging,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBuilding,
  FaInfoCircle,
} from "react-icons/fa";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommodityManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const response = await axios.get(`${API}/commodities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommodities(response.data.commodities || []);
    } catch (error) {
      console.error("Error fetching commodities:", error);
      toast.error("Failed to fetch commodities. Please try again.");
    }
  };

  const addCommodity = () => {
    setCommodities([
      ...commodities,
      {
        id: "",
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
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...commodities];
    updated[index][field] = value;
    setCommodities(updated);
  };

  const validateForm = () =>
    commodities.every((commodity) =>
      [
        "commodity_name",
        "commodity_type",
        "unit_of_measure",
        "market_price",
        "stock_quantity",
        "provider",
        "acquisition_date",
      ].every((key) => commodity[key])
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
        `${API}/commodities`,
        { commodities },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Commodities saved successfully!");
      fetchCommodities();
    } catch (error) {
      console.error("Error saving commodities:", error);
      toast.error("Failed to save commodities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const commodityId = commodities[index]?.id;
    if (!commodityId) {
      setCommodities((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await axios.delete(`${API}/commodities/${commodityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Commodity deleted successfully!");
      fetchCommodities();
    } catch (error) {
      console.error("Error deleting commodity:", error);
      toast.error("Failed to delete commodity. Please try again.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <ToastContainer />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Commodities</h1>
        <p className="mt-2">Add, edit, and manage your commodities.</p>
      </header>

      <form onSubmit={handleSubmit}>
        {commodities.map((commodity, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <FieldSection title={`Commodity #${index + 1}`}>
              <InputWithIcon
                icon={<FaSeedling />}
                type="text"
                placeholder="Commodity Name"
                value={commodity.commodity_name}
                onChange={(e) =>
                  handleChange(index, "commodity_name", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaSeedling />}
                type="text"
                placeholder="Commodity Type"
                value={commodity.commodity_type}
                onChange={(e) =>
                  handleChange(index, "commodity_type", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaWeightHanging />}
                type="text"
                placeholder="Unit of Measure"
                value={commodity.unit_of_measure}
                onChange={(e) =>
                  handleChange(index, "unit_of_measure", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="number"
                placeholder="Market Price"
                value={commodity.market_price}
                onChange={(e) =>
                  handleChange(index, "market_price", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaMoneyBillWave />}
                type="number"
                placeholder="Stock Quantity"
                value={commodity.stock_quantity}
                onChange={(e) =>
                  handleChange(index, "stock_quantity", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaBuilding />}
                type="text"
                placeholder="Provider"
                value={commodity.provider}
                onChange={(e) =>
                  handleChange(index, "provider", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaCalendarAlt />}
                type="date"
                placeholder="Acquisition Date"
                value={commodity.acquisition_date}
                onChange={(e) =>
                  handleChange(index, "acquisition_date", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaCalendarAlt />}
                type="date"
                placeholder="Expiry Date (optional)"
                value={commodity.expiry_date}
                onChange={(e) =>
                  handleChange(index, "expiry_date", e.target.value)
                }
              />
              <InputWithIcon
                icon={<FaInfoCircle />}
                type="text"
                placeholder="Description (optional)"
                value={commodity.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
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
            onClick={addCommodity}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New Commodity
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Commodities"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommodityManagement;
