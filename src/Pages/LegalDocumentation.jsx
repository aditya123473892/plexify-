import React, { useState } from 'react';
import { FaFileAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';

const LegalDocumentation = () => {
  const [documents, setDocuments] = useState([{ title: '', type: '', status: '' }]);

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...documents];
    newDocuments[index][field] = value;
    setDocuments(newDocuments);
  };

  const addDocument = () => {
    setDocuments([...documents, { title: '', type: '', status: '' }]);
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Legal Documentation</h1>
        <p className="text-gray-600">
          Keep track of your important legal documents and their statuses.
        </p>
      </header>

      {/* Documents Section */}
        {documents.map((document, index) => (
      <FieldSection title="Legal Documents">
         
            <InputWithIcon
              icon={<FaFileAlt className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Document Title"
              value={document.title}
              onChange={(e) => handleDocumentChange(index, 'title', e.target.value)}
            />
            <InputWithIcon
              icon={<FaFileAlt className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Document Type"
              value={document.type}
              onChange={(e) => handleDocumentChange(index, 'type', e.target.value)}
            />
            <InputWithIcon
              icon={<FaFileAlt className="text-[#538d2dfd] mx-2" />}
              type="text"
              placeholder="Status"
              value={document.status}
              onChange={(e) => handleDocumentChange(index, 'status', e.target.value)}
            />
      
        </FieldSection>
        ))}
        <button
          onClick={addDocument}
          className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] mt-4"
        >
          <FaPlus className="inline mr-2" /> Add Document
        </button>

      {/* Save Button */}
      <button
        type="submit"
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save Legal Documentation
      </button>
    </div>
  );
};

export default LegalDocumentation;
