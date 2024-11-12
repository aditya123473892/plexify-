import React, { useState } from "react";
import {
  FaClipboard,
  FaTag,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

function InsurancePage() {
  const [formData, setFormData] = useState({
    policy_id: "",
    user_id: "",
    policy_number: "",
    policy_name: "",
    policy_type: "Life Insurance", // Default option
    provider: "",
    coverage_amount: "",
    premium_amount: "",
    start_date: "",
    end_date: "",
    nominee_name: "",
    nominee_relation: "",
    status: "Active", // Example default status
    created_at: new Date().toISOString().split("T")[0], // Default to current date
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Insurance Policies</h1>
        <p className="mt-2">
          Easily add, view, and manage your insurance policies with helpful
          features.
        </p>
      </header>

      <Section title="Select Policy Type" className="mb-10">
        <select
          name="policy_type"
          value={formData.policy_type}
          onChange={handleInputChange}
          className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]"
        >
          <option>Life Insurance</option>
          <option>Health Insurance</option>
          <option>Car Insurance</option>
          <option>Home Insurance</option>
          <option>Term Insurance</option>
          <option>Indentity Information</option>
          <option value="">Others</option>
        </select>
      </Section>

      {/* Policy Details */}
      <Section title="Policy Details" className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Policy Name"
            name="policy_name"
            value={formData.policy_name}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaTag />}
            placeholder="Policy Number"
            name="policy_number"
            value={formData.policy_number}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Provider (e.g. LIC)"
            name="provider"
            value={formData.provider}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Start Date"
            name="start_date"
            value={formData.start_date}
            type="date"
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="End Date"
            name="end_date"
            value={formData.end_date}
            type="date"
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Coverage Amount"
            name="coverage_amount"
            value={formData.coverage_amount}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaDollarSign />}
            placeholder="Premium Amount"
            name="premium_amount"
            value={formData.premium_amount}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Nominee Name"
            name="nominee_name"
            value={formData.nominee_name}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaClipboard />}
            placeholder="Nominee Relation"
            name="nominee_relation"
            value={formData.nominee_relation}
            onChange={handleInputChange}
          />
          <InputWithIcon
            icon={<FaCheckCircle />}
            placeholder="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          />
        </div>
      </Section>

      {/* Save Button */}
      <div className="text-right">
        <button
          onClick={() => console.log(formData)}
          className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default InsurancePage;
