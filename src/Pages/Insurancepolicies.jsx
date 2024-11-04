import React from "react";
import { FaClipboard, FaTag, FaDollarSign, FaCheckCircle } from "react-icons/fa"; // Importing necessary icons
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from "../Components/Section";
function InsurancePage() {
  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold ">
          Manage Your Insurance Policies
        </h1>
        <p className="mt-2">
          Easily add, view, and manage your insurance policies with helpful
          features.
        </p>
      </header>


      <Section title="Select Policy Type" className="mb-10">
        <select className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]">
          <option>Life Insurance</option>
          <option>Health Insurance</option>
          <option>Car Insurance</option>
          <option>Home Insurance</option>
        </select>
      </Section>

      {/* Policy Details */}
      <Section title="Policy Details" className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon icon={<FaClipboard />} placeholder="Policy Name" />
          <InputWithIcon icon={<FaTag />} placeholder="Policy Number" />
          <InputWithIcon icon={<FaClipboard />} placeholder="Provider (e.g. LIC)" />
          <InputWithIcon icon={<FaClipboard />} placeholder="Policy Period" />
          <InputWithIcon icon={'₹'} placeholder="Premium Amount" />
          <InputWithIcon icon={'₹'} placeholder="Coverage Limit" />
          <InputWithIcon className='col-span-2' icon={<FaCheckCircle />} placeholder="Maturity Amount"/>
        </div>

      </Section>

      {/* Additional Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Renewal Reminders */}
        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Renewal Reminders</h3>
          <p className="mt-2">
            Set reminders for upcoming policy renewals.
          </p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Add Reminder
          </button>
        </div>

        {/* Nominee Information */}
        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Nominee Information</h3>
          <p className="mt-2">
            Enter details for policy beneficiaries.
          </p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Add Nominee
          </button>
        </div>
      </section>

      {/* Upload Documents */}
      <section className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <p className="mb-4">
          Upload scanned copies of policy documents for safekeeping.
        </p>
        <button className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
          Upload Documents
        </button>
      </section>

      {/* Educational Resources and Calculator */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Educational Resources</h3>
          <p className="mt-2">
            Learn more about insurance policies and coverage.
          </p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Explore Resources
          </button>
        </div>

        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Insurance Calculator</h3>
          <p className="mt-2">
            Calculate premium, maturity, and other insurance metrics.
          </p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Open Calculator
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="text-right">
        <button className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default InsurancePage;
