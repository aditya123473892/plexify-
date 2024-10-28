import React, { useState } from 'react';

const Deposit = () => {
  const [selectedDeposit, setSelectedDeposit] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    duration: '',
  });

  const handleSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedDeposit(value);
    setShowForm(false);
    setFormData({ name: '', amount: '', duration: '' });
  };

  const acceptDescription = () => {
    setShowForm(true);
  };

  const rejectDescription = () => {
    alert("You disagreed with the terms.");
    setSelectedDeposit('');
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
    <main className="bg-[#3d5e27fd] p-8 rounded shadow-md">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Adding Fixed Deposit Management
        </h1>
        <p className="text-white mt-2">
          Easily add your Fixed Deposit Management details with helpful features.
        </p>
      </header>

      <div className='mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md text-white'>
        <label htmlFor="depositSelect" className="block mb-2 font-semibold ">Select a Fixed Deposit:</label>
        <select
          id="depositSelect"
          value={selectedDeposit}
          onChange={handleSelectionChange}
          className="border border-[#2f7004fd] p-2 rounded-md w-full bg-[#3d5e27fd] outline-0"
        >
          <option value="">--Select a deposit--</option>
          <option value="description1">Wealth Builder Deposit</option>
          <option value="description2">ProsperityPlus Deposit</option>
          <option value="description3">SafeGuarded Growth Fund</option>
          <option value="healthInsurance">Enhanced Health Insurance Coverage</option>
        </select>
      </div>

      <div className='mb-10 bg-[#4e7a30fd] p-6 rounded-lg shadow-md text-white'>
        {/* Description for Wealth Builder Deposit */}
        {selectedDeposit === 'description1' && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">Wealth Builder Deposit</h2>
            <p>This deposit helps you accumulate wealth with competitive interest rates and flexibility.</p>
            <div className="action-buttons mt-4">
              <button onClick={acceptDescription} className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd]">I Agree</button>
              <button onClick={rejectDescription} className="reject bg-[#3d5e27fd] text-white py-2 px-4 rounded shadow-lg ml-2 hover:bg-[#2f4b1dfd]">I Disagree</button>
            </div>
          </div>
        )}

        {/* Description for ProsperityPlus Deposit */}
        {selectedDeposit === 'description2' && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">ProsperityPlus Deposit</h2>
            <p>ProsperityPlus Deposit is designed to help you achieve your financial goals with high interest rates and flexible terms.</p>
            <div className="action-buttons mt-4">
              <button onClick={acceptDescription} className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd]">I Agree</button>
              <button onClick={rejectDescription} className="reject bg-[#3d5e27fd] text-white py-2 px-4 rounded shadow-lg ml-2 hover:bg-[#2f4b1dfd]">I Disagree</button>
            </div>
          </div>
        )}

        {/* Description for SafeGuarded Growth Fund */}
        {selectedDeposit === 'description3' && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">SafeGuarded Growth Fund</h2>
            <p>SafeGuarded Growth Fund offers you the perfect balance of risk and return with a range of investment options.</p>
            <div className="action-buttons mt-4">
              <button onClick={acceptDescription} className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd]">I Agree</button>
              <button onClick={rejectDescription} className="reject bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded shadow-lg ml-2 ">I Disagree</button>
            </div>
          </div>
        )}

        {/* Description for Enhanced Health Insurance Coverage */}
        {selectedDeposit === 'healthInsurance' && (
          <div className="description mb-4">
            <h2 className="text-2xl font-bold">Enhanced Health Insurance Coverage</h2>
            <p>Our Enhanced Health Insurance Coverage policy offers comprehensive protection for you and your family's healthcare needs. With a focus on both preventative care and treatment, this policy provides peace of mind knowing that you are covered for a wide range of medical expenses.</p>
            <ul className="list-disc ml-5">
              <li>Access to a vast network of healthcare providers and hospitals</li>
              <li>Coverage for routine check-ups, vaccinations, and screenings</li>
              <li>Financial protection against unexpected medical emergencies and hospitalizations</li>
              <li>Options for additional benefits such as dental and vision care</li>
              <li>Flexible plans tailored to your specific healthcare needs and budget</li>
            </ul>
            <p>With our Enhanced Health Insurance Coverage, you can focus on your health and well-being without worrying about the financial burden of medical expenses. Take control of your healthcare journey today!</p>
            <h3 className="font-bold mt-4">Policy Details:</h3>
            <ul className="list-disc ml-5">
              <li>✔ Name of FD: SecureSave Fixed Deposit</li>
              <li>✔ FD Number: 512M339K22</li>
              <li>✔ Provider: HDFC</li>
              <li>✔ FD Period: 2 years</li>
              <li>✔ Premiums: 2,00,000/-</li>
              <li>✔ Maturity Amount: 5,00,000/-</li>
            </ul>
            <div className="action-buttons mt-4">
              <button onClick={acceptDescription} className="accept bg-[#3a5e22fd] text-white py-2 px-4 shadow-lg rounded hover:bg-[#2f4b1dfd]">I Agree</button>
              <button onClick={rejectDescription} className="reject bg-[#3d5e27fd] text-white py-2 px-4 rounded shadow-lg ml-2 hover:bg-[#2f4b1dfd]">I Disagree</button>
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Application Form</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block mb-1">Deposit Amount:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="duration" className="block mb-1">Duration (in years):</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <button type="submit" className="bg-[#3d5e27fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ">Submit</button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Deposit;
