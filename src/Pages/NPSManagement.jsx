import React, { useState } from 'react';
import {
  FaUser,
  FaDollarSign,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaPlus,
  FaFileUpload,
  FaCheckCircle,
} from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const NPSManagement = () => {
  const [npsDetails, setNpsDetails] = useState([
    { name: '', phone: '', email: '', npsNumber: '', contribution: '', nominee: '' },
  ]);

  const handleNpsChange = (index, field, value) => {
    const newNpsDetails = [...npsDetails];
    newNpsDetails[index][field] = value;
    setNpsDetails(newNpsDetails);
  };

  const addNpsDetail = () => {
    setNpsDetails([...npsDetails, { name: '', phone: '', email: '', npsNumber: '', contribution: '', nominee: '' }]);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your NPS</h1>
        <p className="text-gray-600">
          Keep track of your National Pension System (NPS) investments effortlessly.
        </p>
      </header>

      {npsDetails.map((nps, index) => (
        <FieldSection title={`NPS Detail ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Holder Name"
            value={nps.name}
            onChange={(e) => handleNpsChange(index, 'name', e.target.value)}
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Contact Number"
            value={nps.phone}
            onChange={(e) => handleNpsChange(index, 'phone', e.target.value)}
          />
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email Address"
            value={nps.email}
            onChange={(e) => handleNpsChange(index, 'email', e.target.value)}
          />
          <InputWithIcon
            icon={<FaIdCard className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="NPS Account Number"
            value={nps.npsNumber}
            onChange={(e) => handleNpsChange(index, 'npsNumber', e.target.value)}
          />
          <InputWithIcon
            icon={<span className="text-[#538d2dfd] mx-2 font-extrabold" >₹ </span>}
            type="number"
            placeholder="Annual Contribution"
            value={nps.contribution}
            onChange={(e) => handleNpsChange(index, 'contribution', e.target.value)}
          />
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Nominee Name"
            value={nps.nominee}
            onChange={(e) => handleNpsChange(index, 'nominee', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addNpsDetail}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add NPS Detail
      </button>

      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <input type="file" className="border-0 rounded-md p-3 w-full bg-transparent" />
        </div>
        <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          Upload Document
        </button>
      </Section>

      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save NPS Details
      </button>
    </div>
  );
};

export default NPSManagement;
