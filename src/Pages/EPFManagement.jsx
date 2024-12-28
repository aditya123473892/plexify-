import React, { useState, useEffect, useContext } from 'react';
import {
  FaUser,
  FaRupeeSign,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaPlus,
  FaFileUpload,
  FaCheckCircle,
  FaEye
} from 'react-icons/fa';
import axios from 'axios';
import InputWithIcon from '../Components/InputWithIcon';
import FieldSection from '../Components/FieldSection';
import Section from '../Components/Section';
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";

const EPFManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [epfDetails, setEpfDetails] = useState([
    { name: '', phone: '', email: '', epfAccountNumber: '', contribution: '', nominee: '' },
  ]);
  const [file, setFile] = useState(null); // To store the selected file
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch EPF data when the component mounts
  useEffect(() => {
    const fetchEpfData = async () => {
      try {
        const response = await axios.get(`${API}/epf_data`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passing the token for authentication
            "Content-Type": "application/json",
          },
        });

        if (response.data.epfDetails && response.data.epfDetails.length > 0) {
          // If EPF details are fetched, format them properly
          const formattedEpfDetails = response.data.epfDetails.map((epf) => {
            const documentBlob = epf.document
            ? new Blob([new Uint8Array(epf.document.data)], { type: "application/pdf" })
            : null;
console.log(documentBlob,'documentBlob');

            return{
             name: epf.name || "",
            phone: epf.phone || "",
            email: epf.email || "",
            epfAccountNumber: epf.epf_account_number || "",
            contribution: epf.contribution || "",
            nominee: epf.nominee || "",
            document: setFile(documentBlob),
            }
          });
          setEpfDetails(formattedEpfDetails);
        } else {
          // If no EPF details are found, initialize with empty data
          setEpfDetails([{
            name: "",
            phone: "",
            email: "",
            epfAccountNumber: "",
            contribution: "",
            nominee: "",
            document : null
          }]);
        }
      } catch (error) {
        console.error("Error fetching EPF data:", error);
        toast.error("Error fetching EPF data. Please try again.");
      }
    };

    fetchEpfData();
  }, [API, token]); // Dependency array ensures effect runs when API or token changes

  // Handle changes in EPF details fields
  const handleEpfChange = (index, field, value) => {
    const newEpfDetails = [...epfDetails];
    newEpfDetails[index][field] = value;
    setEpfDetails(newEpfDetails);
  };

  // Add a new EPF entry
  const addEpfDetail = () => {
    setEpfDetails([
      ...epfDetails,
      { name: '', phone: '', email: '', epfAccountNumber: '', contribution: '', nominee: '' },
    ]);
  };

  // Handle file selection for upload
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFile(files[0])
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    // Append EPF data
    formData.append('data', JSON.stringify({ epfDetails }));
    // Append the file if it exists
    if (file) {
      formData.append('document', file);
    }
  
    try {
      const response = await axios.post(`${API}/epf_data`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Include the token if necessary
        },
      });
  
      setSuccessMessage('EPF details saved successfully!');
      toast.success("EPF details saved successfully!");
    } catch (error) {
      console.error('Error saving EPF details:', error);
      setLoading(false);
      toast.error("Error saving EPF details!"); // Show error message
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your EPF</h1>
        <p className="text-gray-600">
          Keep track of your Employee Provident Fund (EPF) investments effortlessly.
        </p>
      </header>

      {/* EPF Details Section */}
      {epfDetails.map((epf, index) => (
        <FieldSection title={`EPF Detail ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Holder Name"
            value={epf.name}
            onChange={(e) => handleEpfChange(index, 'name', e.target.value)}
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Contact Number"
            value={epf.phone}
            onChange={(e) => handleEpfChange(index, 'phone', e.target.value)}
          />
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email Address"
            value={epf.email}
            onChange={(e) => handleEpfChange(index, 'email', e.target.value)}
          />
          <InputWithIcon
            icon={<FaIdCard className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="EPF Account Number"
            value={epf.epfAccountNumber}
            onChange={(e) => handleEpfChange(index, 'epfAccountNumber', e.target.value)}
          />
          <InputWithIcon
            icon={<span className="text-[#538d2dfd] mx-2 font-extrabold">₹</span>}
            type="number"
            placeholder="Monthly Contribution"
            value={epf.contribution}
            onChange={(e) => handleEpfChange(index, 'contribution', e.target.value)}
          />
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Nominee Name"
            value={epf.nominee}
            onChange={(e) => handleEpfChange(index, 'nominee', e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addEpfDetail}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add EPF Detail
      </button>

      {/* Document Upload Section */}
      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <FaFileUpload className="text-[#538d2dfd] mx-2" />
          <input
            type="file"
            className="border-0 rounded-md p-3 w-full bg-transparent"
            onChange={handleFileChange}
          />
        </div>
        {file ? (
    <div className="mt-4 flex items-center space-x-4">
      <a
        href={URL.createObjectURL(file)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#538d2dfd] text-white p-2 rounded-md shadow-md hover:bg-[#4c7033fd] inline-flex items-center"
      >
        <FaEye className="mr-2" />
        View Uploaded File
      </a>
      <button
        onClick={() => setFile(null)} // Remove the document
        className="text-red-500 hover:text-red-700 underline"
      >
        Remove File
      </button>
    </div>
  ) : (
    <p className="text-gray-500 mt-2">No document uploaded. Please upload one.</p>
  )}

      </Section>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
        disabled={loading}
      >
        {loading ? 'Saving...' : <><FaCheckCircle className="mr-2" /> Save EPF Details</>}
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 text-green-600">
          <FaCheckCircle className="mr-2" />
          {successMessage}
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default EPFManagement;
