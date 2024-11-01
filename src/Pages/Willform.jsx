import React, { useState } from 'react';
import InputWithIcon from '../Components/InputWithIcon'; // Adjust the import path as needed
import FieldSection from '../Components/FieldSection'; // Adjust the import path as needed
import { FaUser, FaHome, FaCar, FaFileAlt, FaMoneyBill } from 'react-icons/fa'; // Example icons

const WillForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    fatherName: '',
    motherName: '',
    insurancePolicies: '',
    fixedDeposit: '',
    homeLoan: '',
    carLoan: '',
    signatureName: '',
    signatureDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    setFormData({
      fullName: '',
      address: '',
      fatherName: '',
      motherName: '',
      insurancePolicies: '',
      fixedDeposit: '',
      homeLoan: '',
      carLoan: '',
      signatureName: '',
      signatureDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-white  p-6 rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6">Last Will and Testament</h1>

        {/* Personal Information Section */}
        <section>
          <h2 className="text-2xl font-semibold ">Personal Information</h2>
            <FieldSection label="Full Name">
              <InputWithIcon
                icon={<FaUser />}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
              />
         
              <InputWithIcon
                icon={<FaHome />}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your Address"
                required
              />
     
              <InputWithIcon
                icon={<FaUser />}
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Father's Full Name"
                required
              />
         
              <InputWithIcon
                icon={<FaUser />}
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="Mother's Full Name"
                required
              />
            </FieldSection>
        </section>

        {/* Assets Section */}
        <section>
          <h2 className="text-2xl font-semibold ">Assets</h2>
          <div className="grid grid-cols-1 gap-4">
            <FieldSection label="Insurance Policies">
              <InputWithIcon
                icon={<FaFileAlt />}
                name="insurancePolicies"
                value={formData.insurancePolicies}
                onChange={handleChange}
                placeholder="Details like Account No."
                required
              />
        
              <InputWithIcon
                icon={<FaMoneyBill />}
                name="fixedDeposit"
                value={formData.fixedDeposit}
                onChange={handleChange}
                placeholder="Details like Account No."
                required
              />
            </FieldSection>
            {/* Add more fields as necessary */}
          </div>
        </section>

        {/* Liabilities Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Liabilities</h2>
          <div className="grid grid-cols-1 gap-4">
            <FieldSection label="Home Loan">
              <InputWithIcon
                icon={<FaHome />}
                name="homeLoan"
                value={formData.homeLoan}
                onChange={handleChange}
                placeholder="Details like Account No."
                required
              />
   
              <InputWithIcon
                icon={<FaCar />}
                name="carLoan"
                value={formData.carLoan}
                onChange={handleChange}
                placeholder="Details like Account No."
                required
              />
            </FieldSection>
            {/* Add more fields as necessary */}
          </div>
        </section>

        {/* Signature Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Signature and Witnesses</h2>
          <div className="grid grid-cols-1 gap-4">
            <FieldSection label="Your Full Name">
              <InputWithIcon
                icon={<FaUser />}
                name="signatureName"
                value={formData.signatureName}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
              />
     
              <InputWithIcon
                icon={<FaFileAlt />} // Use appropriate icon
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleChange}
                type="date"
                required
              />
            </FieldSection>
          </div>
        </section>

        {/* Submit Button */}
        <div className="text-center">
          <button className="bg-[#538d2dfd] text-white py-2 px-6 rounded-md shadow-md hover:bg-[#4c7033fd]">
            Save Changes
          </button>
        </div>
    </form>
  );
};

export default WillForm;
