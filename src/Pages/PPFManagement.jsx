import React, { useState, useContext, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaPlus,
  FaFileUpload,
  FaCheckCircle,
  FaEye
} from "react-icons/fa";
import InputWithIcon from "../Components/InputWithIcon";
import FieldSection from "../Components/FieldSection";
import Section from "../Components/Section";
import axios from "axios";
import { AuthContext } from "../Contexts/Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Import Toast styles

const PPFManagement = () => {
  const { API, token } = useContext(AuthContext);
  const [ppfDetails, setPpfDetails] = useState([
    {
      name: "",
      phone: "",
      email: "",
      ppfAccountNumber: "",
      contribution: "",
      nominee: "",
    },
  ]);

  const [uploadedFile, setUploadedFile] = useState(null);

  // Fetch PPF details when the component mounts
  useEffect(() => {
    const fetchPpfData = async () => {
      try {
        const response = await axios.get(`${API}/ppf_data`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passing the token for authentication
            "Content-Type": "application/json",
          },
        });

        if (response.data.ppfDetails && response.data.ppfDetails.length > 0) {
          // If PPF details are fetched, format them properly
          const formattedPpfDetails = response.data.ppfDetails.map((ppf) => {
            const documentBlob = ppf.document
            ? new Blob([new Uint8Array(ppf.document.data)], { type: "application/pdf" })
            : null; 
            return{
            name: ppf.name || "",
            phone: ppf.phone || "",
            email: ppf.email || "",
            ppfAccountNumber: ppf.ppf_account_number || "",
            contribution: ppf.contribution || "",
            nominee: ppf.nominee || "",
            document: setUploadedFile(documentBlob),
            }
          });
          setPpfDetails(formattedPpfDetails);
        } else {
          // If no PPF details are found, initialize with empty data
          setPpfDetails([{
            name: "",
            phone: "",
            email: "",
            ppfAccountNumber: "",
            contribution: "",
            nominee: "",
            document:null
          }]);
        }
      } catch (error) {
        console.error("Error fetching PPF data:", error);
        toast.error("Error fetching PPF data. Please try again.");
      }
    };

    fetchPpfData();
  }, [API, token]); // Dependency array ensures effect runs when API or token changes

  // Handle changes in PPF details
  const handlePpfChange = (index, field, value) => {
    const newPpfDetails = [...ppfDetails];
    newPpfDetails[index][field] = value;
    setPpfDetails(newPpfDetails);
  };

  // Add a new PPF detail entry
  const addPpfDetail = () => {
    setPpfDetails([
      ...ppfDetails,
      {
        name: "",
        phone: "",
        email: "",
        ppfAccountNumber: "",
        contribution: "",
        nominee: "",
      },
    ]);
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setUploadedFile(files[0]); // Update the single document
      console.log("Uploaded document:", files[0]);
    }
  };

  // Submit form data
  const handleSubmit = async () => {
    const data = { ppfDetails };

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (uploadedFile) {
        formData.append("document", uploadedFile);
      }

      const response = await axios.post(`${API}/ppf_data`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,  // Make sure you send the token if necessary
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("PPF details saved successfully!");
      } else {
        toast.error("Failed to save PPF details. Please try again.");
      }
    } catch (error) {
      console.error("Error saving PPF details:", error);
      toast.error("An error occurred while saving PPF details.");
    }
  };

  return (
    <div className="min-h-screen shadow-2xl bg-white p-6 rounded-lg md:mt-10 mt-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Your PPF</h1>
        <p className="text-gray-600">
          Keep track of your Public Provident Fund (PPF) investments effortlessly.
        </p>
      </header>

      {ppfDetails.map((ppf, index) => (
        <FieldSection title={`PPF Detail ${index + 1}`} key={index}>
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Account Holder Name"
            value={ppf.name}
            onChange={(e) => handlePpfChange(index, "name", e.target.value)}
          />
          <InputWithIcon
            icon={<FaPhone className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Contact Number"
            value={ppf.phone}
            onChange={(e) => handlePpfChange(index, "phone", e.target.value)}
          />
          <InputWithIcon
            icon={<FaEnvelope className="text-[#538d2dfd] mx-2" />}
            type="email"
            placeholder="Email Address"
            value={ppf.email}
            onChange={(e) => handlePpfChange(index, "email", e.target.value)}
          />
          <InputWithIcon
            icon={<FaIdCard className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="PPF Account Number"
            value={ppf.ppfAccountNumber}
            onChange={(e) =>
              handlePpfChange(index, "ppfAccountNumber", e.target.value)
            }
          />
          <InputWithIcon
            icon={<span className="text-[#538d2dfd] mx-2 font-extrabold text-xl">₹ </span>}
            type="number"
            placeholder="Annual Contribution"
            value={ppf.contribution}
            onChange={(e) => handlePpfChange(index, "contribution", e.target.value)}
          />
          <InputWithIcon
            icon={<FaUser className="text-[#538d2dfd] mx-2" />}
            type="text"
            placeholder="Nominee Name"
            value={ppf.nominee}
            onChange={(e) => handlePpfChange(index, "nominee", e.target.value)}
          />
        </FieldSection>
      ))}

      <button
        onClick={addPpfDetail}
        className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]"
      >
        <FaPlus className="inline mr-2" /> Add PPF Detail
      </button>

      <Section title="Document Upload">
        <div className="flex items-center border-l-2 border-[#538d2dfd] rounded-md shadow-lg mb-4">
          <input
            type="file"
            className="border-0 rounded-md p-3 w-full bg-transparent"
            onChange={handleFileChange}
          />
        </div>
        {/* <button className="text-white py-2 px-4 rounded-md shadow-md bg-[#3a5e22fd] hover:bg-[#2f4b1dfd]">
          Upload Document
        </button> */}
        {uploadedFile ? (
    <div className="mt-4 flex items-center space-x-4">
      <a
        href={URL.createObjectURL(uploadedFile)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#538d2dfd] text-white p-2 rounded-md shadow-md hover:bg-[#4c7033fd] inline-flex items-center"
      >
        <FaEye className="mr-2" />
        View Uploaded File
      </a>
      <button
        onClick={() => setUploadedFile(null)} // Remove the document
        className="text-red-500 hover:text-red-700 underline"
      >
        Remove File
      </button>
    </div>
  ) : (
    <p className="text-gray-500 mt-2">No document uploaded. Please upload one.</p>
  )}

      </Section>

      <button
        onClick={handleSubmit}
        className="bg-[#3a5e22fd] hover:bg-[#2f4b1dfd] text-white py-2 px-4 rounded ms-auto flex items-center mt-6"
      >
        <FaCheckCircle className="mr-2" /> Save PPF Details
      </button>

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default PPFManagement;
