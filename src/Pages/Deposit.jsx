import React from "react";
import { FaClipboard, FaTag, FaDollarSign, FaCalendar } from "react-icons/fa"; // Importing necessary icons
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";

function DepositsPage() {
  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold ">Manage Your Deposits</h1>
        <p className="mt-2">
          Easily add, view, and manage your deposits with helpful features.
        </p>
      </header>

      <Section title="Deposit Type" className="mb-10">
        <select className="border-l-2 border-[#538d2dfd] shadow-lg p-2 text-white rounded-md w-full outline-0 bg-[#538d2dfd]">
          <option>Fixed Deposit</option>
          <option>Recurring Deposit</option>
          <option>Term Deposit</option>
          <option>Savings Deposit</option>
          <option>Others</option>
        </select>
      </Section>

      {/* Deposit Details */}
      <Section title="Deposit Details" className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithIcon icon={<FaClipboard />} placeholder="Deposit Name" />
          <InputWithIcon icon={<FaTag />} placeholder="Account Number" />
          <InputWithIcon icon={<FaClipboard />} placeholder="Bank Name" />
          <InputWithIcon icon={<FaCalendar />} placeholder="Deposit Term" />
          <InputWithIcon icon={<FaDollarSign />} placeholder="Deposit Amount" />
          <InputWithIcon icon={<FaDollarSign />} placeholder="Interest Rate" />
          <InputWithIcon
            className="col-span-2"
            icon={<FaDollarSign />}
            placeholder="Maturity Amount"
          />
        </div>
      </Section>

      {/* Additional Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Renewal Reminders */}
        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Renewal Reminders</h3>
          <p className="mt-2">Set reminders for deposit renewals.</p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Add Reminder
          </button>
        </div>

        {/* Beneficiary Information */}
      </section>

      {/* Document Upload */}
      <section className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <p className="mb-4">
          Upload scanned copies of deposit certificates or receipts for
          safekeeping.
        </p>
        <button className="bg-[#538d2dfd] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
          Upload Documents
        </button>
      </section>

      {/* Educational Resources */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Educational Resources</h3>
          <p className="mt-2">
            Learn more about different types of deposits and interest
            calculations.
          </p>
          <button className="bg-[#538d2dfd] text-white py-2 px-4 mt-4 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Explore Resources
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

export default DepositsPage;
