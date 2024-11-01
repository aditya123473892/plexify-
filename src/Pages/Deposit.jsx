import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaUser, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

const Deposit = () => {
  const [selectedDeposit, setSelectedDeposit] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    duration: "",
  });

  const handleSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedDeposit(value);
    setShowForm(false);
    setFormData({ name: "", amount: "", duration: "" });
  };

  const acceptDescription = () => {
    setShowForm(true);
  };

  const rejectDescription = () => {
    alert("You disagreed with the terms.");
    setSelectedDeposit("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted: ${JSON.stringify(formData)}`);
    // Add form submission logic here
  };

  return (
    <main className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold ">
          Adding Fixed Deposit Management
        </h1>
        <p className=" mt-2">
          Easily add your Fixed Deposit Management details with helpful
          features.
        </p>
      </header>

      <div className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        <label htmlFor="depositSelect" className="block mb-2 font-semibold">
          Select a Fixed Deposit:
        </label>
        <select
          id="depositSelect"
          value={selectedDeposit}
          onChange={handleSelectionChange}
          className="border border-[#2f7004fd] p-2 rounded-md w-full bg-[#3d5e27fd] outline-0 text-white"
        >
          <option value="">--Select a deposit--</option>
          <option value="description1">Wealth Builder Deposit</option>
          <option value="description2">ProsperityPlus Deposit</option>
          <option value="description3">SafeGuarded Growth Fund</option>
          <option value="healthInsurance">
            Enhanced Health Insurance Coverage
          </option>
        </select>
      </div>

      <div className="mb-10 border-l-2 border-[#538d2dfd] p-6 rounded-lg shadow">
        {selectedDeposit === "description1" && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">Wealth Builder Deposit</h2>
            <p>
              This deposit helps you accumulate wealth with competitive interest
              rates and flexibility.
            </p>
            <div className="action-buttons mt-4 flex">
              <button
                onClick={acceptDescription}
                className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd] flex items-center"
              >
                <FaCheckCircle className="mr-2" />
                I Agree
              </button>
              <button
                onClick={rejectDescription}
                className="reject bg-[#3d5e27fd] text-white py-2 px-4 rounded shadow-lg ml-2 hover:bg-[#2f4b1dfd] flex items-center border-r border-[#2f7004fd]"
              >
                <FaTimesCircle className="mr-2" />
                I Disagree
              </button>
            </div>
          </div>
        )}

        {selectedDeposit === "description2" && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">ProsperityPlus Deposit</h2>
            <p>
              ProsperityPlus Deposit is designed to help you achieve your
              financial goals with high interest rates and flexible terms.
            </p>
            <div className="action-buttons mt-4 flex">
              <button
                onClick={acceptDescription}
                className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd] flex items-center"
              >
                <FaCheckCircle className="mr-2" />
                I Agree
              </button>
              <button
                onClick={rejectDescription}
                className="reject bg-[#3d5e27fd] text-white py-2 px-4 rounded shadow-lg ml-2 hover:bg-[#2f4b1dfd] flex items-center border-r border-[#2f7004fd]"
              >
                <FaTimesCircle className="mr-2" />
                I Disagree
              </button>
            </div>
          </div>
        )}

        {selectedDeposit === "description3" && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">SafeGuarded Growth Fund</h2>
            <p>
              SafeGuarded Growth Fund offers you the perfect balance of risk and
              return with a range of investment options.
            </p>
            <div className="action-buttons mt-4 flex">
              <button
                onClick={acceptDescription}
                className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd] flex items-center"
              >
                <FaCheckCircle className="mr-2" />
                I Agree
              </button>
              <button
                onClick={rejectDescription}
                className="reject bg-[#3d5e27fd] text-white py-2 px-4 rounded shadow-lg ml-2 hover:bg-[#2f4b1dfd] flex items-center border-r border-[#2f7004fd]"
              >
                <FaTimesCircle className="mr-2" />
                I Disagree
              </button>
            </div>
          </div>
        )}

        {selectedDeposit === "healthInsurance" && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">
              Enhanced Health Insurance Coverage
            </h2>
            <p>
              Our Enhanced Health Insurance Coverage policy offers comprehensive
              protection for you and your family's healthcare needs. With a
              focus on both preventative care and treatment, this policy
              provides peace of mind knowing that you are covered for a wide
              range of medical expenses.
            </p>
            <ul className="list-disc ml-5">
              <li>
                Access to a vast network of healthcare providers and hospitals
              </li>
              <li>
                Coverage for routine check-ups, vaccinations, and screenings
              </li>
              <li>
                Financial protection against unexpected medical emergencies and
                hospitalizations
              </li>
              <li>
                Options for additional benefits such as dental and vision care
              </li>
              <li>
                Flexible plans tailored to your specific healthcare needs and
                budget
              </li>
            </ul>
            <p>
              With our Enhanced Health Insurance Coverage, you can focus on your
              health and well-being without worrying about the financial burden
              of medical expenses. Take control of your healthcare journey
              today!
            </p>
            <h3 className="font-bold mt-4">Policy Details:</h3>
            <ul className="list-disc ml-5">
              <li>✔ Name of FD: SecureSave Fixed Deposit</li>
              <li>✔ FD Number: 512M339K22</li>
              <li>✔ Provider: HDFC</li>
              <li>✔ FD Period: 2 years</li>
              <li>✔ Premiums: 2,00,000/-</li>
              <li>✔ Maturity Amount: 5,00,000/-</li>
            </ul>
            <div className="action-buttons mt-4 flex">
              <button
                onClick={acceptDescription}
                className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd] flex items-center"
              >
                <FaCheckCircle className="mr-2" />
                I Agree
              </button>
              <button
                onClick={rejectDescription}
                className="reject bg-[#3d5e27fd] text-white py-2 px-4 rounded shadow-lg ml-2 hover:bg-[#2f4b1dfd] flex items-center border-r border-[#2f7004fd]"
              >
                <FaTimesCircle className="mr-2" />
                I Disagree
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Application Form</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 text-white">
                Name:
              </label>
              <div className="flex items-center border-l-2 border-[#538d2dfd] shadow-lg rounded p-2 w-full ">
                <FaUser className="text-[#2f7004fd] mx-2" />
                <input
                  type="text"
                  id="name"
                  placeholder="Applicante Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-transparent text-white outline-none flex-1"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block mb-1 text-white">
                Amount (in ₹):
              </label>
              <div className="flex items-center border-l-2 border-[#538d2dfd] shadow-lg rounded p-2 w-full ">
                <FaMoneyBillWave className="text-[#2f7004fd] mx-2" />
                <input
                  type="number"
                  id="amount"
                  name="amount"
                 placeholder="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="bg-transparent text-white outline-none flex-1"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="duration" className="block mb-1 text-white">
                Duration (in years):
              </label>
              <div className="flex items-center border-l-2 border-[#538d2dfd] shadow-lg rounded p-2 w-full ">
                <FaCalendarAlt className="text-[#2f7004fd] mx-2" />
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="bg-transparent text-white outline-none flex-1"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#3a5e22fd] text-white py-2 px-4 rounded hover:bg-[#2f4b1dfd] flex items-center"
            >
              <FaCheckCircle className="mr-2" />
              Submit
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Deposit;
