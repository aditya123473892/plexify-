import React from 'react';
import { FaUser, FaIdCard, FaPhoneAlt, FaEnvelope, FaHome, FaLink, FaBirthdayCake, FaFileUpload } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';

function Beneficiary() {
  return (
    <div className="min-h-screen bg-white p-6 rounded-lg shadow-2xl md:mt-10 mt-20">
 <header>
 <h1 className="text-3xl font-bold mb-8 ">Beneficiary Information</h1>
      <p className="text-gray-600">
          Effortlessly manage your real estate properties with a user-friendly interface.
        </p>
 </header>
      <div className="">
        <FieldSection title="Beneficiary Details">
          <InputWithIcon icon={<FaUser />} placeholder="Enter beneficiary name" name="beneficiaryName" />
          <InputWithIcon icon={<FaIdCard />} placeholder="Enter Aadhaar number" name="aadhaarNumber" />
          <InputWithIcon icon={<FaPhoneAlt />} placeholder="Enter contact number" name="beneficiaryContact" />
          <InputWithIcon icon={<FaEnvelope />} placeholder="Enter email address" type="email" name="beneficiaryEmail" />
          <InputWithIcon icon={<FaHome />} placeholder="Enter full address" name="beneficiaryAddress" className="md:col-span-2" />
          <InputWithIcon icon={<FaLink />} placeholder="Enter relationship" name="relationship" />
          <InputWithIcon icon={<FaBirthdayCake />} placeholder="Select date of birth" type="date" name="beneficiaryDob" />
          <InputWithIcon icon={<FaIdCard />} placeholder="Enter ID or passport number" name="beneficiaryId" />
          <InputWithIcon icon={<FaLink />} placeholder="Enter percentage" name="entitlementPercentage" />
        </FieldSection>
      </div>
      <FieldSection title="Beneficiary Details">
      <h2 className="text-2xl font-bold mb-4 ">Document Upload</h2>
      <div className="mb-2">
        <input
          type="file"
          multiple
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      </FieldSection>
      
      <FieldSection title="Beneficiary Details">
      <h2 className="text-2xl font-bold mb-4 ">Premium Calculator</h2>
      <button className="bg-[#466d2c] text-white px-6 py-2 w-fit rounded-md hover:bg-[#233615] transition text shadow-xl">
        Calculate your Premium
      </button>
      <button className="bg-[#466d2b] text-white px-6 py-2 w-fit rounded-md hover:bg-[#233615] transition  shadow-xl">
        Submit Form
      </button>
      </FieldSection >
    </div>
  );
}

export default Beneficiary;
