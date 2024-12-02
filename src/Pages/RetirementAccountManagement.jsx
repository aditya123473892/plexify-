import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaClipboard,
  FaDollarSign,
  FaCheckCircle,
  FaBuilding,
  FaInfoCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

const RetirementAccountManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountType: "",
    institutionName: "",
    currentBalance: "",
    contributions: "",
    notes: "",
    document: null, // Support for document upload
  });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode

  // Fetch retirement accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${API}/retirement-accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.accounts.length > 0) {
          const account = response.data.accounts[0]; // Assume single account for simplicity
          setFormData({
            accountHolder: account.accountHolder,
            accountType: account.accountType,
            institutionName: account.institutionName,
            currentBalance: account.currentBalance,
            contributions: account.contributions,
            notes: account.notes || "",
            document: null, // Assume document is not fetched
          });
          setIsEditMode(false); // Set to view mode if data exists
        }
      } catch (error) {
        console.error("Error fetching retirement accounts:", error);
        toast.error("Failed to fetch retirement accounts.");
      }
    };

    fetchAccounts();
  }, [API, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        document: files[0], // Store the file in state
      }));
    }
  };

  const handleSave = async () => {
    if (
      !formData.accountHolder ||
      !formData.accountType ||
      !formData.currentBalance
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formData.document) {
      toast.error("Please upload a document.");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "document") {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append("document", formData.document);

    try {
      await axios.post(`${API}/retirement-accounts`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Retirement account saved successfully!");
      setIsEditMode(false); // Set to view mode after saving
    } catch (error) {
      console.error("Error saving retirement account:", error);
      toast.error("Failed to save retirement account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Retirement Accounts</h1>
        <p className="mt-2">
          Add, view, and manage your retirement accounts effortlessly.
        </p>
      </header>

      <Section title="Account Details" className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Account Holder"
            name="accountHolder"
            value={formData.accountHolder}
            type="text"
            onChange={handleChange}
            readOnly={!isEditMode}
          />
          <InputWithIcon
            icon={<FaInfoCircle />}
            placeholder="Account Type"
            name="accountType"
            value={formData.accountType}
            type="text"
            onChange={handleChange}
            readOnly={!isEditMode}
          />
          <InputWithIcon
            icon={<FaBuilding />}
            placeholder="Institution Name"
            name="institutionName"
            value={formData.institutionName}
            type="text"
            onChange={handleChange}
            readOnly={!isEditMode}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Current Balance"
            name="currentBalance"
            value={formData.currentBalance}
            type="number"
            onChange={handleChange}
            readOnly={!isEditMode}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Total Contributions"
            name="contributions"
            value={formData.contributions}
            type="number"
            onChange={handleChange}
            readOnly={!isEditMode}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Additional Notes"
            name="notes"
            value={formData.notes}
            type="text"
            onChange={handleChange}
            readOnly={!isEditMode}
          />
        </div>
      </Section>

      <Section title="Upload Document" className="mb-10">
        <input
          type="file"
          name="document"
          onChange={handleFileChange}
          className="border-l-2 border-[#538d2dfd] shadow-lg p-2 rounded-md w-full outline-0"
          disabled={!isEditMode}
        />
      </Section>

      <div className="text-right">
        <button
          onClick={isEditMode ? handleSave : () => setIsEditMode(true)}
          className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]"
          disabled={loading}
        >
          {loading ? "Saving..." : isEditMode ? "Save Changes" : "Edit Account"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RetirementAccountManagement;
