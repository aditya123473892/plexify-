import React, { useState, useContext } from "react";
import axios from "axios";
import { FaClipboard, FaTag, FaDollarSign, FaCheckCircle } from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

function InsurancePage() {
  const { API, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    policyName: "",
    policyNumber: "",
    provider: "",
    policyType: "Life Insurance",
    policyPeriod: "",
    premiumAmount: "",
    coverageLimit: "",
    maturityAmount: "",
    nomineeName: "",
    nomineeRelation: "",
    document: null, // Add a state for the document
  });
  const [loading, setLoading] = useState(false);

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
        document: files[0], // Store the file in the state
      }));
    }
  };

  const handleSave = async () => {
    console.log("Form data before saving:", formData);

    if (!formData.policyName || !formData.policyNumber || !formData.premiumAmount) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formData.document) {
      toast.error("Please upload a policy document.");
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
      const response = await axios.post(`${API}/insurance`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      });
      console.log("Response:", response.data);
      toast.success("Insurance policy saved successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error saving insurance policy:", error);
      toast.error("Failed to save insurance policy.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Insurance Policies</h1>
        <p className="mt-2">
          Easily add, view, and manage your insurance policies with helpful features.
        </p>
      </header>

      <Section title="Select Policy Type" className="mb-10">
        <select
          name="policyType"
          value={formData.policyType}
          onChange={handleChange}
          className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
        >
          <option>Life Insurance</option>
          <option>Health Insurance</option>
          <option>Car Insurance</option>
          <option>Home Insurance</option>
          <option>Term Insurance</option>
          <option>Indemnity Information</option>
          <option>Others</option>
        </select>
      </Section>

      <Section title="Policy Details" className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Policy Name"
            name="policyName"
            value={formData.policyName}
            type="text"
            onChange={handleChange}
          />
          <InputWithIcon
            icon={<FaTag />}
            placeholder="Policy Number"
            name="policyNumber"
            type="number"
            value={formData.policyNumber}
            onChange={handleChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Provider"
            name="provider"
            type="text"
            value={formData.provider}
            onChange={handleChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Policy Period"
            name="policyPeriod"
            type="text"
            value={formData.policyPeriod}
            onChange={handleChange}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Premium Amount"
            name="premiumAmount"
            type="number"
            value={formData.premiumAmount}
            onChange={handleChange}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Coverage Limit"
            name="coverageLimit"
            type="number"
            value={formData.coverageLimit}
            onChange={handleChange}
          />
          <InputWithIcon
            className="col-span-2"
            icon={<FaCheckCircle />}
            placeholder="Maturity Amount"
            name="maturityAmount"
            type="number"
            value={formData.maturityAmount}
            onChange={handleChange}
          />
        </div>
      </Section>

      <Section title="Upload Document" className="mb-10">
        <input
          type="file"
          name="document"
          onChange={handleFileChange}
          className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0"
        />
      </Section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Educational Resources</h3>
          <p className="mt-2">Learn more about insurance policies and coverage.</p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Explore Resources
          </button>
        </div>

        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Insurance Calculator</h3>
          <p className="mt-2">Calculate premium, maturity, and other insurance metrics.</p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Open Calculator
          </button>
        </div>
      </section>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default InsurancePage;
