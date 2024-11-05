import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaCar,
  FaGraduationCap,
  FaBusinessTime,
  FaFileUpload,
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";

const ManageLiabilities = () => {
  const [selectedType, setSelectedType] = useState("");

  const handleTypeChange = (e) => setSelectedType(e.target.value);

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Your Liabilities</h1>
        <p className="mt-2">
          Easily add, view, and manage your liabilities with helpful features.
        </p>
      </header>

      {/* Liability Types */}
      <section className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Select Liability Type</h2>
        <select
          className="border border-[#2f7004fd] p-2 text-white rounded-md w-full bg-[#3d5e27fd] outline-0"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="">Choose a Type</option>
          <option value="Home Loan">Home Loan</option>
          <option value="Personal Loan">Personal Loan</option>
          <option value="Vehicle Loan">Vehicle Loan</option>
          <option value="Education Loan">Education Loan</option>
          <option value="Business Loan">Business Loan</option>
          <option value="other">other</option>
        </select>
      </section>

      {/* Dynamic Form Sections */}
      {selectedType === "Home Loan" && (
        <FieldSection title="Assign Home Loan" icon={<FaHome />}>
          <InputWithIcon
            icon={<FaHome />}
            placeholder="Bank/Institution Name"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Loan Amount"
            type="number"
          />
          <InputWithIcon icon={<FaFileUpload />} placeholder="Account Number" />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Loan Tenure (Years)"
            type="number"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Interest Rate (%)"
            type="number"
          />
        </FieldSection>
      )}

      {selectedType === "Personal Loan" && (
        <FieldSection title="Assign Personal Loan" icon={<FaUser />}>
          <InputWithIcon
            icon={<FaUser />}
            placeholder="Bank/Institution Name"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Loan Amount"
            type="number"
          />
          <InputWithIcon icon={<FaFileUpload />} placeholder="Loan Purpose" />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Interest Rate (%)"
            type="number"
          />
        </FieldSection>
      )}

      {selectedType === "Vehicle Loan" && (
        <FieldSection title="Assign Vehicle Loan" icon={<FaCar />}>
          <InputWithIcon icon={<FaCar />} placeholder="Bank/Institution Name" />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Loan Amount"
            type="number"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Vehicle Type/Model"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Loan Tenure (Years)"
            type="number"
          />
        </FieldSection>
      )}

      {selectedType === "Education Loan" && (
        <FieldSection title="Assign Education Loan" icon={<FaGraduationCap />}>
          <InputWithIcon
            icon={<FaGraduationCap />}
            placeholder="Bank/Institution Name"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Loan Amount"
            type="number"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Course/Institution"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Interest Rate (%)"
            type="number"
          />
        </FieldSection>
      )}

      {selectedType === "Business Loan" && (
        <FieldSection title="Assign Business Loan" icon={<FaBusinessTime />}>
          <InputWithIcon
            icon={<FaBusinessTime />}
            placeholder="Bank/Financial Institution"
          />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Loan Amount"
            type="number"
          />
          <InputWithIcon icon={<FaFileUpload />} placeholder="Loan Details" />
          <InputWithIcon
            icon={<FaFileUpload />}
            placeholder="Interest Rate (%)"
            type="number"
          />
        </FieldSection>
      )}

      {/* Save Button */}
      <div className="mt-10">
        <button className="bg-[#457525fd] text-white p-2 rounded-md hover:bg-[#4c7033fd] transition duration-200">
          <FaFileUpload className="inline mr-2" /> Save Liabilities
        </button>
      </div>
    </div>
  );
};

export default ManageLiabilities;
